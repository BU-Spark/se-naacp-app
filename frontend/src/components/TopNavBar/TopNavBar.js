import React from 'react';
import {Nav, NavItem, NavList} from '@patternfly/react-core';
import './TopNavBar.css';

export const TopNavBar = () => {
  const [activeItem, setActiveItem] = React.useState(0);
  const onSelect = result => {
    setActiveItem(result.itemId);
  };
  return <Nav onSelect={onSelect} variant="horizontal" aria-label="Horizontal subnav global nav" className='navbar'>
      <NavList>
        {/* {Array.apply(0, Array(4)).map(function (_item, index) {
    const num = index + 1;
    return <NavItem preventDefault key={num} itemId={num} isActive={activeItem === num} id={`horizontal-subnav-${num}`} to={`#horizontal-subnav-${num}`}>
              Horizontal subnav item {num}
            </NavItem>;
  })} */}
        <NavItem className='navitem'>Dashboard</NavItem>
        <NavItem className='navitem'>Browse</NavItem>
        <NavItem className='navitem'>Upload</NavItem>
        <NavItem className='navitem'>Profile</NavItem>
      </NavList>
    </Nav>;
};