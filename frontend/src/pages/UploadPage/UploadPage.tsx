import React, { useState } from 'react';
// import CsvUploadComponent from '../../components/Upload/CSVUpload';
import "./UploadPage.css";

// Define a type for the file with progress information
type UploadedFile = {
  name: string;
  size: number;
  progress: number;
  status: string;
};

const CSVUploadBox = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // only check missing headers, not extra headers or duplicate headers
  const validateCsvHeaders = (file: File, callback: (missingHeaders?: string[]) => void) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      // handle \r return carriage character
      const headers = text.slice(0, text.search(/\r?\n/)).split(",").map(header => header.trim());
      // expected header list
      const expectedHeaders = ["h1", "h2", "h3"];
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

  // Function that simulates file upload and updates progress
  // Need to change this to real func converting csv into json as input to backend
  const uploadFile = (file: File) => {
    // Initialize a new uploaded file object
    const newFile: UploadedFile = {
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'Uploading...',
    };
    // Add the new file to the uploaded files state
    setUploadedFiles(prevFiles => [...prevFiles, newFile]);

    validateCsvHeaders(file, (missingHeaders) => {  
      // if not validated
      if (missingHeaders && missingHeaders.length > 0) {
        setUploadedFiles(prevFiles => prevFiles.map(f => {
          if (f.name === newFile.name) {
            return { ...f, status: `Missing headers: ${missingHeaders.join(", ")}`};
          }
          return f;
        }));
      } else {
        // if validated, simulate file upload progress
        const interval = setInterval(() => {
          setUploadedFiles(prevFiles => prevFiles.map(f => {
            if (f.name === newFile.name) {
              let newProgress = f.progress + 20;
              if (newProgress > 100) {
                clearInterval(interval);
                return { ...f, progress: 100, status: 'Complete' };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          }));
        }, 1000);
      }
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

  return (
    <div>
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
                <div className="file-upload-progress">
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${file.progress}%` }}></div>
                  </div>
                  <span className="progress-percentage">{file.progress}%</span>
                </div>

                {/* Action Column */}
                <div className="file-actions">
                  <span className="file-status">{file.status}</span>
                  {file.status === 'Complete' && (
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
    </div>
  );
};

export default CSVUploadBox;
