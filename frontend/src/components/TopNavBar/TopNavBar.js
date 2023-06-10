import React from 'react';
import {Nav, NavList} from '@patternfly/react-core';
import 'bootstrap/dist/css/bootstrap.css'
import { useNavigate } from 'react-router-dom';
// CSS
import './TopNavBar.css';

export const TopNavBar = () => {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/dev-mode');
  };

  return(
  <Nav variant="horizontal" aria-label="Horizontal subnav global nav" className='navbar'>
      <NavList>
      <button onClick={handleButtonClick} type="button" id="dev-button" class="btn btn-outline-warning">Devolper Mode</button>

        {/* <NavItem className='navitem'>Dashboard</NavItem>
        <NavItem className='navitem'>Browse</NavItem>
        <NavItem className='navitem'>Upload</NavItem>
        <NavItem className='navitem'>Profile</NavItem> */}
      </NavList>
    </Nav>);
};