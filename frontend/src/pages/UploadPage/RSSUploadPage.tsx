import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./RSSUploadPage.css"

const RSSUploadBox = () => {
    // click CSV button -> CSV page
    let navigate = useNavigate();
    const gotoCSV = () => {
        navigate('/Upload');
    };

    const [inputValue, setInputValue] = useState(''); 

    // handle rss input box
    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    }

    const uploadFile = () => {
        
    }

    return (
        <div>
            <div className="CSV-link">
                <button onClick={gotoCSV}>
                    Upload a CSV File
                </button>
            </div>
            <h4 className="RSS-title">Upload your RSS link here</h4>
            <div className="Input-box">
                <input type="text" value={inputValue} onChange={handleInputChange}></input>
                <button onClick={uploadFile}>
                    Submit
                </button>
            </div>
        </div>
    )
};

export default RSSUploadBox;