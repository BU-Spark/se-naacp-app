import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetch from 'node-fetch';
import { DOMParser } from 'xmldom';
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

    // handle rss input box
    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    }

    async function validateURL(url: string): Promise<void> {
        try {
            const corsProxy = 'https://cors-anywhere.herokuapp.com/';
            const proxy_Url = corsProxy + url;
            const response = await fetch(proxy_Url);
            // console.log(response);
            const contentType = response.headers.get("content-Type") || '';
            // console.log("contentType: ", contentType);
            setErrorMessage(prevErrors => [...prevErrors, 'Error: ']);

            if (!contentType.includes("xml") || !url.endsWith('.rss')) {
                setAlertMessage('Only RSS URL is accepted.');
                setTimeout(() => setAlertMessage(''), 3000);
                setErrorMessage(prevErrors => [...prevErrors, 'URL does not seem to be an RSS feed. ']);
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
            }
            const itemTag = xmlDoc.getElementsByTagName('item');
            if (itemTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors,'channel Tag contains no item elements. ']);
                isValid = false;
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
            // }
            // if (test1Tag.length === 0) {
            //     setErrorMessage(prevErrors => [...prevErrors,'Missing test1 tag. ']);
            //     isValid = false;
            // }
            // if (test2Tag.length === 0) {
            //     setErrorMessage(prevErrors => [...prevErrors,'Missing test2 tag. ']);
            //     isValid = false;
            // }

            if (titleTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors,'Missing title tag. ']);
                isValid = false;
            }

            if (linkTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors,'Missing link tag. ']);
                isValid = false;
            }

            if (descTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors, 'Missing description tag. ']);
                isValid = false;
            }

            if (contentTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors, 'Missing content:encoded tag. ']);
                isValid = false;
            }
            
            if (pubTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors, 'Missing pubDate tag. ']);
                isValid = false;
            }

            if (guidTag.length === 0) {
                setErrorMessage(prevErrors => [...prevErrors, 'Missing guid tag. ']);
                isValid = false;
            }
            
            // if valid, pass success msg
            if (isValid) {
                setErrorMessage([]);
                setSuccessMessage('Test passed! Fetching result...');
            }
        } catch (error) {}
    }

    const uploadInput = (url: string) => {
        setErrorMessage([]);
        validateURL(url);
        // upload link to backend function

    }

    return (
        <div>
            {alertMessage && (
                <div className="alert-message">
                    {alertMessage}
                </div>
            )}
            <div className="CSV-link">
                <button onClick={gotoCSV}>
                    Upload a CSV File
                </button>
            </div>
            <h4 className="RSS-title">Upload your RSS link here</h4>
            <div className="Input-box">
                <input type="text" value={inputValue} onChange={handleInputChange}></input>
                <button onClick={() => uploadInput(inputValue)}>
                    Submit
                </button>
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
        </div>
    )
};

export default RSSUploadBox;