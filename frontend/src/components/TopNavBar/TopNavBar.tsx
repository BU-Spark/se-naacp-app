import { Layout, Button, Anchor } from "antd"; // Ant Design
import { useNavigate, NavigateFunction, Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logos/logo.svg";
import {
	OrganizationSwitcher,
	SignedIn,
	SignedOut,
	UserButton,
	useOrganization,
	useUser,
} from "@clerk/clerk-react";
// CSS
import "./TopNavBar.css";
import { useState } from "react";

const { Header } = Layout;

const TopNavBar = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const { user } = useUser();
	const { organization } = useOrganization();
	const currentUserOrg = user?.organizationMemberships.find(
		(ele) => ele.organization.id === organization?.id,
	);

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
