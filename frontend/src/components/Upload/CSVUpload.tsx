import React, { useState } from 'react';

const CsvUploadComponent: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      // Handle the file upload logic here
      console.log(file.name);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files.length) {
      // Handle the file here
      console.log(files[0].name);
    }
  };

  return (
    <div>
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          border: isDragging ? '3px dashed #000' : '3px solid #eee',
          height: '150px',
          width: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        {isDragging ? <p>Drop your file here</p> : <p>Drag & Drop your CSV file here</p>}
      </div>
      <br />
      <label>Or select a file: </label>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}

export default CsvUploadComponent;
