import React from 'react';
import CsvUploadComponent from '../../components/Upload/CSVUpload';
import RssUploadComponent from '../../components/Upload/RSSUpload';
import "./UploadPage.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

const UploadPage: React.FC = () => {
  return (
    <div className="upload-container">
      <div className="upload-section">
        <h1>
          <FontAwesomeIcon icon={faFileCsv} /> Upload CSV File
        </h1>
        <CsvUploadComponent />
      </div>
      <div className="upload-section">
        <h2>
          <i className="material-icons">rss_feed</i> Upload RSS Feed Link
        </h2>
        <RssUploadComponent />
      </div>
    </div>
  );
}

export default UploadPage;
