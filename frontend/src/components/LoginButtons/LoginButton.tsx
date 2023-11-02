import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "@mui/material";

export const LoginButton = () => {
	const { loginWithRedirect } = useAuth0();

	const handleLogin = async () => {
		await loginWithRedirect({
			appState: {
				returnTo: "/",
			},
		});
	};

	return (
		<Button
			className='button__login Button
		'
			onClick={handleLogin}
			style={{ backgroundColor: "#6a0dad", color: "white" }}
		>
			Log In
		</Button>
	);
};
