import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const LogoutButton = () => {
	const { logout } = useAuth0();

	const handleLogout = () => {
		logout();
	};

	return (
		<button className='button__logout' onClick={handleLogout}>
			Log Out
		</button>
	);
};
