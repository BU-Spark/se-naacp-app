import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
	const { user, isAuthenticated, isLoading } = useAuth0();
	user ? console.log(user) : console.log("no user");

	if (isLoading) {
		return <div>Loading ...</div>;
	}

	return isAuthenticated ? (
		<>
			<div>Hello, {user?.name}</div>
		</>
	) : (
		<>
			<div>Not logged in</div>
		</>
	);
};
export default Profile;
