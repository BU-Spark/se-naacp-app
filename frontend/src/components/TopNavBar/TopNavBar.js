import React from 'react';

import { Layout, Button } from 'antd'; // Ant Design
import { useNavigate } from 'react-router-dom';

// CSS
import './TopNavBar.css';

const { Header } = Layout;

export const TopNavBar = () => {

  const navigate = useNavigate();

  const navigateDeveloperMode = () => {
    navigate('/dev-mode');
  };

  return(
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
        {/* <Button type="primary" id="dev-button" onClick={navigateDeveloperMode} danger>Developer Mode</Button> */}
      </Header>
    </Layout>
    );
};