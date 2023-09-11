import { Layout, Button } from 'antd'; // Ant Design
import { useNavigate, NavigateFunction } from 'react-router-dom';

// CSS
import './TopNavBar.css';

const { Header } = Layout;

const TopNavBar = () => {
  const navigate: NavigateFunction = useNavigate();

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
        {/* This is to enable Developer mode */}
        {/* <Button type="primary" id="dev-button" onClick={navigateDeveloperMode} danger>Developer Mode</Button> */}
      </Header>
    </Layout>
    );
};

export default TopNavBar;