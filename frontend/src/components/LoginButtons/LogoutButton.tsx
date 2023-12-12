import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "@mui/material";

export const LogoutButton = () => {
	const { logout } = useAuth0();

	const handleLogout = () => {
		logout({
			logoutParams: {
				returnTo: window.location.origin,
			},
		});
	};

	return (
		<Button
			variant='contained'
			className='button__logout Button'
			onClick={handleLogout}
			style={{
				backgroundColor: "#6a0dad",
				color: "white",
				padding: ".5rem",
				margin: " 0 1rem",
			}}
		>
			Log Out
		</Button>
	);
};