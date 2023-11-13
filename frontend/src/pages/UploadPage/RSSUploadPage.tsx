import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import fetch from 'node-fetch';
import { DOMParser } from 'xmldom';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import "./RSSUploadPage.css"

const RSSUploadBox = () => {
    // click CSV button -> CSV page
    let navigate = useNavigate();
    const gotoCSV = () => {
        navigate('/Upload');
    };

    const [inputValue, setInputValue] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState<string[]>([]);
    const [httpMessage, sethttpMessage] = useState('');
    // if test passed, send rss to backend
    let isPassed = true;

    // set up cors proxy
    const corsProxy = 'https://corsproxy.io/?';

    // handle rss input box
    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    }

    async function validateURL(url: string): Promise<void> {
        try {
            const proxy_Url = corsProxy + url;
            const response = await fetch(proxy_Url);
            // console.log(response);
            const contentType = response.headers.get("content-Type") || '';
            // console.log("contentType: ", contentType);
            
            // initialize message list
            setSuccessMessage('');
            sethttpMessage('');
            setErrorMessage(prevErrors => [...prevErrors, 'Error: ']);

            if (!contentType.includes("xml") || !url.endsWith('.rss')) {
                setAlertMessage('Only RSS URL is accepted.');
                setTimeout(() => setAlertMessage(''), 3000);
                setErrorMessage(prevErrors => [...prevErrors, 'URL does not seem to be an RSS feed. ']);
                isPassed = false;
                return;
            }

            let isValid = true;
            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            const channelTag = xmlDoc.getElementsByTagName('channel');
            // console.log(channelTag);
            if (channelTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors, 'RSS feed does not contain a channel tag. ']);
                isValid = false;
                isPassed = false;
            }
            const itemTag = xmlDoc.getElementsByTagName('item');
            if (itemTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors,'channel Tag contains no item elements. ']);
                isValid = false;
                isPassed = false;
            }
            
            const titleTag = xmlDoc.getElementsByTagName('title');
            const linkTag = xmlDoc.getElementsByTagName('link');
            const descTag = xmlDoc.getElementsByTagName('description');
            const contentTag = xmlDoc.getElementsByTagName('content:encoded');
            const pubTag = xmlDoc.getElementsByTagName('pubDate');
            const guidTag = xmlDoc.getElementsByTagName('guid');

            // Testing
            // const testTag = xmlDoc.getElementsByTagName('test');
            // const test1Tag = xmlDoc.getElementsByTagName('test1');
            // const test2Tag = xmlDoc.getElementsByTagName('test2');
            // if (testTag.length === 0) {
            //     setErrorMessage(prevErrors => [...prevErrors,'Missing test tag. ']);
            //     isValid = false;
            //     isPassed = false;
            // }
            // if (test1Tag.length === 0) {
            //     setErrorMessage(prevErrors => [...prevErrors,'Missing test1 tag. ']);
            //     isValid = false;
            //     isPassed = false;
            // }
            // if (test2Tag.length === 0) {
            //     setErrorMessage(prevErrors => [...prevErrors,'Missing test2 tag. ']);
            //     isValid = false;
            //     isPassed = false;
            // }

            if (titleTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors,'Missing title tag. ']);
                isValid = false;
                isPassed = false;
            }

            if (linkTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors,'Missing link tag. ']);
                isValid = false;
                isPassed = false;
            }

            if (descTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors, 'Missing description tag. ']);
                isValid = false;
                isPassed = false;
            }

            if (contentTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors, 'Missing content:encoded tag. ']);
                isValid = false;
                isPassed = false;
            }
            
            if (pubTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors, 'Missing pubDate tag. ']);
                isValid = false;
                isPassed = false;
            }

            if (guidTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors, 'Missing guid tag. ']);
                isValid = false;
                isPassed = false;
            }
            
            // if valid, pass success msg
            if (isValid) {
                setErrorMessage([]);
                setSuccessMessage('Test passed!');
            }
        } catch (error) {
            isPassed = false;
        }
    }

    async function uploadInput(url: string) {
        setErrorMessage([]);
        setSuccessMessage('');
        sethttpMessage('');
        await validateURL(url);
        if (isPassed) {
            const proxy_Url = corsProxy + url;
            const linkData = `RSS_Link=\"${proxy_Url}\"`;
            axios.post(proxy_Url, linkData, {
                headers: {
                'Content-Type': 'x-www-form-urlencoded'
                }
            })
            .then((response) => {
                console.log(response); 
                if (response.status === 200) {
                    sethttpMessage("Success! Fetching result...");           
                }
            })
            .catch(error => {
                console.error(error);
                sethttpMessage(`${error}`);
            });
        }
    }

    return (
        <div>
            {alertMessage && (
                <div className="alert-message">
                    {alertMessage}
                </div>
            )}
            <div className="CSV-link">
                <Button 
                    variant="outlined"
                    color="primary" onClick={gotoCSV}>
                    Upload a CSV File
                </Button>
            </div>
            <h4 className="RSS-title">Upload your RSS link </h4>
            <div className="Input-box">
                <TextField 
                    fullWidth
                    id="standard-basic" 
                    label="Enter your link here" 
                    variant="standard" value={inputValue} onChange={handleInputChange}>
                </TextField>
                <Button 
                    variant="contained"
                    color="primary"
                    onClick={() => {uploadInput(inputValue)}}>
                    Submit
                </Button>
            </div>
            <div className="error-message">
                {errorMessage && (
                    <div>
                        {errorMessage}
                    </div>
                )}
            </div>
            <div className="success-message">
                {successMessage && (
                    <div>
                        {successMessage}
                    </div>
                )}
            </div>
            <div className="http-message">
                {httpMessage && (
                    <div>
                        {httpMessage}
                    </div>
                )}
            </div>
        </div>
    )
};

export default RSSUploadBox;