import React from 'react';
import {Nav, NavList} from '@patternfly/react-core';

// CSS
import './TopNavBar.css';

export const TopNavBar = () => {
  return(
  <Nav variant="horizontal" aria-label="Horizontal subnav global nav" className='navbar'>
      <NavList>
        {/* <NavItem className='navitem'>Dashboard</NavItem>
        <NavItem className='navitem'>Browse</NavItem>
        <NavItem className='navitem'>Upload</NavItem>
        <NavItem className='navitem'>Profile</NavItem> */}
      </NavList>
    </Nav>);
};