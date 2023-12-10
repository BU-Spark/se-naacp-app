import { Layout, Button, Anchor } from "antd"; // Ant Design
import { useNavigate, NavigateFunction, Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logos/logo.svg";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
// CSS
import "./TopNavBar.css";
import { useState } from "react";

const { Header } = Layout;

const TopNavBar = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const { user } = useUser();

	return (
		<nav>
			<Link to='/' className='title'>
				{user ? (
					<img
						style={{ width: "6vw" }}
						src={
							user?.organizationMemberships[0].organization
								.imageUrl
						}
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
					<NavLink to='/'>Explore Topics</NavLink>
				</li>
				<li>
					<NavLink to='/Neighborhoods'>Neighborhoods</NavLink>
				</li>
				{/* <li>
          <NavLink to="/Comparison">Comparison</NavLink>
        </li> */}
				<li>
					<NavLink to='/Upload'>Upload</NavLink>
				</li>
				<li>
					<NavLink to='/Dashboard'>Dashboard</NavLink>
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
