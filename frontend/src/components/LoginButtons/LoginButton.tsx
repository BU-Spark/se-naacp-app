import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import React from "react";

export const LoginButton = () => {
	const { loginWithRedirect, isLoading } = useAuth0();

	const handleLogin = async () => {
		await loginWithRedirect({
			appState: {
				returnTo: "/Dashboard",
			},
		});
	};

	return (
		<Button
			className='button__login Button
		'
			onClick={handleLogin}
			style={{
				backgroundColor: "#6a0dad",
				color: "white",
				padding: ".5rem",
				margin: " 0 1rem",
			}}
		>
			Log In
		</Button>
	);
};