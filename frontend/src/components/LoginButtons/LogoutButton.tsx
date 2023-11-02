import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./Button.css";
import { Button } from "@mui/material";

export const LogoutButton = () => {
	const { logout } = useAuth0();

	const handleLogout = () => {
		logout();
	};

	return (
		<Button
			variant='contained'
			className='button__logout Button'
			onClick={handleLogout}
			style={{ backgroundColor: "#6a0dad", color: "white" }}
		>
			Log Out
		</Button>
	);
};
