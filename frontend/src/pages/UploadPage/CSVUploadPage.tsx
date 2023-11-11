import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
// import CsvUploadComponent from '../../components/Upload/CSVUpload';
import "./CSVUploadPage.css";

// Define a type for the file with progress information
type UploadedFile = {
  name: string;
  size: number;
  progress: number;
  status: string;
  error?: string; // fail to pass test
  file: File; // store a reference to the File object
};

const CSVUploadBox = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [validatedFiles, setUpValidatedFiles] = useState<UploadedFile[]>([]);
  // This file list is mapped from validated Files' reference to file object.
  const [submittedFiles, setUpsubmittedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const files = validatedFiles.map(f => f.file);
    setUpsubmittedFiles(files);
  }, [validatedFiles]);
  
  // set up cors proxy for POST csv to api
  const corsProxy = 'https://corsproxy.io/?';
  const url = 'https://dummy-server-toswle5frq-uc.a.run.app/upload_csv';
  const proxy_Url = corsProxy + url;

  // click RSS button -> RSS page
  let navigate = useNavigate();
  const gotoRSS = () => {
    navigate('/Upload/:RSS');
  }

  // only check missing headers, not extra headers or duplicate headers
  const validateCsvHeaders = (file: File, callback: (missingHeaders?: string[]) => void) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      // handle \r return carriage character
      const headers = text.slice(0, text.search(/\r?\n/)).split(",").map(header => header.trim());
      // expected header list
      const expectedHeaders = ["Headline", "Byline", "Section", "Tagging", "Paths", "Publish Date", "Body"];
      const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));

      callback(missingHeaders);
    };
    reader.readAsText(file);
  }

  // Drag and drop event handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true); // Update the state to change the appearance of the box
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // handle styling changes here
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false); // Revert the drag over state
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false); // Revert the drag over state
    const files = event.dataTransfer.files;
    let isCSV = true;
    // Process all the dropped files.
    for (let i = 0; i < files.length; i++) {
      // Check file MIME type to see if it's csv
      if (files[i].type === "text/csv" || files[i].name.endsWith('.csv')) {
        uploadFile(files[i]);
      } else {
        isCSV = false;
        break; // Break the loop if non-CSV file
      }
    }

    if (!isCSV) {
      setAlertMessage('Only CSV files are accepted.');
      setTimeout(() => setAlertMessage(''), 3000);
    }
  };

  // After upload successful, user can submit file to server.
  const submitFile = () => {
    for (let i = 0; i < submittedFiles.length; i++) {
      const formData = new FormData();
      formData.append('file', submittedFiles[i]); 
      axios.post(proxy_Url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        console.log(response);
        // update the uploaded file status
        setUploadedFiles(currentFiles => currentFiles.map(f => {
          if (f.name === submittedFiles[i].name) {
            return { ...f, status: 'Submit Successful' };
          }
          return f;
        }));
      })
      .catch(error => {
        console.error(error);
        setUploadedFiles(currentFiles => currentFiles.map(f => {
          if (f.name === submittedFiles[i].name) {
            return { ...f, status: 'Submit Failed', error: error.toString() };
          }
          return f;
        }));
      });
    };
  };

  // Function that simulates file upload and updates progress
  // Need to change this to real func converting csv into json as input to backend
  const uploadFile = (file: File) => {
    // Initialize a new uploaded file object
    const newFile: UploadedFile = {
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'Uploading...',
      file: file,
    };
    // Add the new file to the uploaded files state
    setUploadedFiles(prevFiles => [...prevFiles, newFile]);

    validateCsvHeaders(file, (missingHeaders) => {
      // if not validated
      if (missingHeaders && missingHeaders.length > 0) {
        setUploadedFiles(prevFiles => prevFiles.map(f => {
          if (f.name === newFile.name) {
            return {
              ...f,
              status: `Failed`,
              error: `Error: Missing headers ${missingHeaders.join(", ")}.`
            };
          }
          return f;
        }));
      } else {
        // if validated, add files to validatedFiles
        // return test passed status
        const newValidatedFile: UploadedFile = {
          name: file.name,
          size: file.size,
          progress: 100,
          status: 'Passed',
          file: file,
        };
        setUpValidatedFiles(prevFiles => [...prevFiles, newValidatedFile]);

        const interval = setInterval(() => {
          setUploadedFiles(prevFiles => prevFiles.map(f => {
            if (f.name === newFile.name) {
              let newProgress = f.progress + 20;
              if (newProgress > 100) {
                clearInterval(interval);
                return { ...f, progress: 100, status: 'Passed' };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          }));
        }, 1000);
      };
    });
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      Array.from(event.target.files).forEach(uploadFile);
    }
  };

  // Handle file removal
  const handleFileRemoval = (fileName: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.name != fileName))
  };

  // Handle file submit
  const handleFileSubmit = (files: File[]) => {
    submitFile();
    setSuccessMessage('Successfully submitted!');
    setTimeout(() => setSuccessMessage(''), 3000);
    // clear out uploaded Files, validated files (submitted files listen onto validated files)
    for (let i = 0; i < files.length; i++) {
      setUploadedFiles(prevFiles => prevFiles.filter(f => f.name != files[i].name));
      setUpValidatedFiles(prevFiles => prevFiles.filter(f => f.name != files[i].name));
    };
    // need some logic to handle file history
  }

  return (
    <div>
      <div className="RSS-link">
        <Button 
          variant="outlined" onClick={gotoRSS}>
          Upload an RSS Link
        </Button>
      </div>
      {successMessage && (
        <div className="success-msg">
          {successMessage}
        </div>
      )}
      {alertMessage && (
        <div className="alert-message">
          {alertMessage}
        </div>
      )}
      <h4 className="csv-title">Upload a CSV File</h4>
      <div className="upload-box"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}>
        <input
          type="file"
          id="file-upload"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />
        <label htmlFor="file-upload" className="upload-area">
          <div className="upload-icon">
            <img src="/upload-icon.svg" alt="Upload" />
          </div>
          <p className="drag-and-drop-files">
            <span className="text-wrapper">Drag and drop files, or </span>
            <span className="span">Browse</span>
          </p>
          <div className="text-wrapper">Only support CSV files</div>
        </label>
      </div>
      <h4 className="file-list-title">Uploaded Files</h4>
      <div className="uploaded-files-wrapper">
        <div className="uploaded-files-list">
          <div className="uploaded-files-box">
            <div className="files-list-header">
              <span>FILE NAME</span>
              <span>SIZE</span>
              <span>UPLOAD STATUS</span>
              <span>ACTIONS</span>
            </div>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="file-upload-status">
                {/* File Name Column */}
                <div className="file-name">
                  <span>{file.name}</span>
                </div>

                {/* File Size Column */}
                <div className="file-size">
                  <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                </div>

                {/* Upload Status Column */}
                <div className="file-upload-progress-wrapper">
                  <div className="file-upload-progress">
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${file.progress}%` }}></div>
                    </div>
                    <span className="progress-percentage">{file.progress}%</span>
                  </div>
                  {/* Error Message */}
                  {file.error && (
                    <div className="error-message">
                      {file.error}
                    </div>
                  )}
                </div>

                {/* Action Column */}
                <div className="file-actions">
                  <span className="file-status">{file.status}</span>
                  {(file.status === 'Passed' || file.error) && (
                    <button onClick={() => handleFileRemoval(file.name)}>
                      X
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="submit-button">
        <Button 
          variant="contained"
          color="primary"
          onClick={() => handleFileSubmit(submittedFiles)}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CSVUploadBox;
