import React from "react";
import { useNavigate } from "react-router-dom";

// MUI
import TextField from '@mui/material/TextField';
import { Layout, Button } from 'antd'; // Ant Design

import APIQueryBlock from "../components/Development/apiQueryBlock.jsx";
import MasterPipeline from "../Pipelines/masterDataPipeline";
import DataMethods from "../Pipelines/data.js";

import "./DevMode.css";

const { Header } = Layout;

export default function DevMode() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  const callMasterPip = (reactSetterFunction) => {
    MasterPipeline.rootPathInitData().then( async(v) => {
      reactSetterFunction(JSON.stringify([v[0], v[1]]));
    });
  };

  const presetQueryProp = (reactSetterFunction) => {
    DataMethods.getgetNeighborhoodAndDateData(20200607, 20210607, "Roxbury").then( async(v) => {
      reactSetterFunction(JSON.stringify(v));
    });
  }

  return (
    <>
      <Layout>
          <Header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <button
            onClick={handleButtonClick}
            type="button"
            id="dev-button"
            class="btn btn-outline-warning"
            >
              Exit Developer Mode
            </button>
            
          </Header>
      </Layout>
      <div className="dev-container">

        <APIQueryBlock queryFunction={callMasterPip} />
        <APIQueryBlock queryFunction={presetQueryProp} />

      </div>
    </>
  );
}
