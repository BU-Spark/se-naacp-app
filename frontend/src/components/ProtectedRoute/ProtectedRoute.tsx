import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";

interface ProtectedRouteProps {
	child: React.ComponentType<any>;
}

export const ProtectedRoute = ({ child }: ProtectedRouteProps) => {
	const Component = withAuthenticationRequired(child, {
		onRedirecting: () => <div>Redirecting to auth...</div>,
	});
	return <Component />;
};
