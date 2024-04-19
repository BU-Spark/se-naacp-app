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
    const canUpload = has ? !has({ permission: "org:test:demo" }) : true;

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
			<ul className={menuOpen ? "open" : ""}>
				<li>
					<NavLink to='/TopicsSearchPage'>Explore Topics</NavLink>
				</li>
				<li>
					<NavLink to='/'>Neighborhoods</NavLink>
				</li>
                {canUpload && (
                    <li>
                        <NavLink to='/Upload'>Upload</NavLink>
                    </li>
                )}
				{canUpload && (
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
