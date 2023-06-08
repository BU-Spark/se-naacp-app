import { useState, useEffect } from "react";
import React from "react";
import "./DevMode.css";
import MasterPipeline from "../Pipelines/masterDataPipeline";
import { useNavigate } from "react-router-dom";

export default function DevMode(Props) {
  console.log("Hey", Props.first);
  const [jsonData, setJsonData] = useState([]);

  const CallMasterPip = () => {
    MasterPipeline.getInitData().then(async (v) => {
      setJsonData([v[2], v[3]]);
    });
  };

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <div className="element">
       

        <button
          onClick={CallMasterPip}
          type="button"
          className="btn btn-outline-primary"
        >
          Click to run Master pipeline
        </button>

        <button
          onClick={handleButtonClick}
          type="button"
          id="dev-button"
          class="btn btn-outline-warning"
        >
          Exit Devolper Mode
        </button>
      </div>
      <div className="element">
        <div>
          {jsonData.length > 0 ? (
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
}
