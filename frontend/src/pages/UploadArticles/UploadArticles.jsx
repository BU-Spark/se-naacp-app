
import React, { useState } from "react";
import { Button, Typography, Input } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { DataGrid } from "@mui/x-data-grid";
import "./UploadArticles.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [columns, setColumns] = useState([]);

  const submitFile = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      const response = await res.json();

      if (response[0]) {
        const keys = Object.keys(response[0]);
        setColumns(
          keys.map((key) => ({ field: key, headerName: key, width: 150 }))
        );
      }

      setFileData(response.map((row, index) => ({ id: index, ...row })));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="container">
      <Typography variant="h4" className="title">
        CSV File Upload
      </Typography>
      <form onSubmit={submitFile} className="form">
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".csv"
          className="file-input"
        />
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          startIcon={<CloudUploadIcon />}
        >
          Upload
        </Button>
      </form>
      {fileData.length > 0 && (
        <div style={{ height: "50vh", width: "80%" }}>
          <DataGrid columns={columns} rows={fileData} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;










