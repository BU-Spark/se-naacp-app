import React, { useState } from "react";
import { Button, Typography, Input, TextField, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { DataGrid } from "@mui/x-data-grid";
import "./UploadArticles.css";

const FileUpload = () => {
  const [option, setOption] = useState("");
  const [file, setFile] = useState(null);
  const [rssLink, setRssLink] = useState("");
  const [fileData, setFileData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleOptionChange = (event) => {
    setOption(event.target.value);
    setFile(null);
    setRssLink("");
  };

  const submitFile = async (event) => {
    event.preventDefault();

    if (option === "rss" && rssLink) {
      try {
        const response = await fetch("http://localhost:4000/uploadRSS", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rssLink }),
        })
          .then((response) => response.json())
          .then((data) => {
           alert(data.message);
          });
      } catch (err) {
        console.error(err);
      }
    } else if (option === "csv" && file) {
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
          const requiredKeys = [
            "title",
            "link",
            "description",
            "content",
            "category",
            "pubDate",
            "UID",
          ];

          if (!requiredKeys.every((key) => keys.includes(key))) {
            alert(
              "The CSV file or RSS feed must contain the following columns: " +
                requiredKeys.join(", ")
            );
            return;
          }

          setColumns(
            keys.map((key) => ({ field: key, headerName: key, width: 150 }))
          );
        }

        setFileData(response.map((row, index) => ({ id: index, ...row })));
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Please choose either CSV file upload or RSS link upload and provide the corresponding information.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension !== "csv") {
      alert("Please upload a CSV file.");
      return;
    }

    setFile(file);
  };

  const handleLinkChange = (event) => {
    setRssLink(event.target.value);
  };

  return (
    <div className="container">
      <Typography variant="h4" className="title">
        CSV File or RSS Feed Upload
      </Typography>
      <form onSubmit={submitFile} className="form">
        <RadioGroup row onChange={handleOptionChange} value={option}>
          <FormControlLabel value="csv" control={<Radio />} label="Upload CSV File" />
          <FormControlLabel value="rss" control={<Radio />} label="Provide RSS Link" />
        </RadioGroup>
        {option === "csv" && (
          <Input type="file" onChange={handleFileChange} className="file-input" />
        )}
        {option === "rss" && (
          <TextField
            label="Enter RSS link"
            variant="outlined"
            value={rssLink}
            onChange={handleLinkChange}
            className="rss-input"
          />
        )}
        <Button
          style={{ marginTop: "20px" }}
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
