import { Layout, Button, Anchor } from "antd"; // Ant Design
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { OrganizationSwitcher, SignedIn, UserButton, useUser, useOrganization, useAuth } from '@clerk/clerk-react';
import Logo from '../../assets/logos/logo.svg';
import './TopNavBar.css';
const { Header } = Layout;

const TopNavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useUser();
    const { organization } = useOrganization();
    const { has } = useAuth();  
    const currentUserOrg = user?.organizationMemberships.find(
        (ele) => ele.organization.id === organization?.id,
    );

    // Permission check for demo
    const noAccess = has ? !has({ permission: "org:test:demo" }) : true;

	return (
		<nav>
			<Link to='/' className='title'>
				{currentUserOrg ? (
					<img
						style={{ width: "6vw" }}
						src={currentUserOrg.organization.imageUrl}
						alt='user org logo'
					/>
				) : (
					<img style={{ width: "6vw" }} src={Logo} alt='gbh-logo' />
				)}
			</Link>
			<div className='menu' onClick={() => setMenuOpen(!menuOpen)}>
				<span></span>
				<span></span>
				<span></span>
			</div>
            {/* check if they are a member of an organization to have access to the dashboard and upload page */}
			<ul className={menuOpen ? "open" : ""}>
                {/* {currentUserOrg && (
				<li>
					<NavLink to='/TopicsSearchPage'>Explore Topics</NavLink>
				</li>
                )} */}
                {/* {currentUserOrg && (
				<li>
					<NavLink to='/'>Neighborhoods</NavLink>
				</li>
                )} */}
                {currentUserOrg && (
				<li>
					<NavLink to='/'>Explore Stories</NavLink>
				</li>
                )}
                {currentUserOrg && (
                <li>
                    <NavLink to='/Locations'>Locations</NavLink>
                </li>
                )}
                {noAccess && currentUserOrg && (
                    <li>
                        <NavLink to='/Upload'>Upload</NavLink>
                    </li>
                )}
				{noAccess && currentUserOrg && (
                    <li>
                        <NavLink to='/Dashboard'>Dashboard</NavLink>
                    </li>
                )}
                <li>
                    <OrganizationSwitcher hidePersonal={true} />
                </li>
                <li>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </li>
            </ul>
        </nav>
    );
};

export default TopNavBar;
