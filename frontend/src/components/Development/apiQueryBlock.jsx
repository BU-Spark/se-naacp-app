import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import TextField from '@mui/material/TextField';

import "./apiQueryBlock.css"
import { Button } from "antd";


export default function APIQueryBlock({queryFunction}) {
  const [JSONData, setJSONData] = useState(JSON.stringify({data: "No Data."}));
  const [HTTPHeader, setHTTPHEader] = useState(JSON.stringify({data: "No Data."}));

  const queryHandler = () => {
    queryFunction(setJSONData);
  };

  return(
    <div className="api-container">
            <div className="api-block">
                <div className="api-parameters">
                    <Button className="api-btn" type="primary" size={"large"} onClick={queryHandler}>
                        Query
                    </Button>
                </div>
                <TextField
                    className="api-textbox"
                    label="JSON Data"
                    multiline
                    rows={10}
                    defaultValue="No Data."
                    value={JSONData}
                />

                <TextField
                    className="api-textbox"
                    label="HTTP Parameters & Data"
                    multiline
                    rows={10}
                    defaultValue="No Data."
                />
            </div>
        <hr className="api-break" />
    </div>
  );
};





