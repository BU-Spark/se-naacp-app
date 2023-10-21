import { Layout, Button, Anchor } from "antd"; // Ant Design
import { useNavigate, NavigateFunction, Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logos/logo.svg";
// CSS
import "./TopNavBar.css";
import { useState } from "react";

const { Header } = Layout;

const TopNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <Link to="/" className="title">
        <img style={{ width: "6vw" }} src={Logo} alt="gbh-logo" />
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="Explore Topics">Explore Topics</NavLink>
        </li>
        <li>
          <NavLink to="/Neighborhoods">Neighborhoods</NavLink>
        </li>
        <li>
          <NavLink to="/Comparison">Comparison</NavLink>
        </li>
        <li>
          <NavLink to="/Upload">Upload</NavLink>
        </li>
        <li>
          <NavLink to="/Dashboard">Dashboard</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default TopNavBar;
