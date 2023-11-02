import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "../../components/LoginButtons/LoginButton";
import { LogoutButton } from "../../components/LoginButtons/LogoutButton";
import { SignupButton } from "../../components/LoginButtons/SignUpButton";
export default function Profile() {
	const { user, isAuthenticated, isLoading } = useAuth0();
	user ? console.log(user) : console.log("no user");

	if (isLoading) {
		return <div>Loading ...</div>;
	}

	return isAuthenticated ? (
		<>
			<div>Hello, {user.name}</div> <LogoutButton />
		</>
	) : (
		<>
			<div>Not logged in</div>
			<LoginButton />
			<SignupButton />
		</>
	);
}
