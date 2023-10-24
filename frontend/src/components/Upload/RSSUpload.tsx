import React, { useState } from 'react';

const RssFeedUploadComponent: React.FC = () => {
  const [rssLink, setRssLink] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRssLink(event.target.value);
  };

  const handleSubmit = () => {
    // Handle the RSS link submission logic here
    console.log(rssLink);
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter RSS feed link..." 
        value={rssLink}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default RssFeedUploadComponent;
