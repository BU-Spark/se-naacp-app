import { Layout, Button, Anchor } from "antd"; // Ant Design
import { useNavigate, NavigateFunction, Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logos/logo.svg";
import PersonIcon from "@mui/icons-material/Person";
// CSS
import "./TopNavBar.css";
import { useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../LoginButtons/LogoutButton";
import { LoginButton } from "../LoginButtons/LoginButton";

const { Header } = Layout;

const TopNavBar = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	const { user, isAuthenticated } = useAuth0();

	return (
		<nav>
			<Link to='/' className='title'>
				<img style={{ width: "6vw" }} src={Logo} alt='gbh-logo' />
			</Link>
			<div className='menu' onClick={() => setMenuOpen(!menuOpen)}>
				<span></span>
				<span></span>
				<span></span>
			</div>
			<ul className={menuOpen ? "open" : ""}>
				<li>
					<NavLink to='Topics'>Explore Topics</NavLink>
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
				<li>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</li>
			</ul>
		</nav>
	);
};

export default TopNavBar;
