import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";

export const ProtectedRoute = ({ child }) => {
	const Component = withAuthenticationRequired(child, {
		onRedirecting: () => <div>Redirecting to auth...</div>,
	});
	return <Component />;
};
