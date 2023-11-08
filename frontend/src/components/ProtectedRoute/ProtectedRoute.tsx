import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import Callback from "../../pages/Callback/Callback";

interface ProtectedRouteProps {
	child: React.ComponentType<any>;
}

export const ProtectedRoute = ({ child }: ProtectedRouteProps) => {
	const Component = withAuthenticationRequired(child, {
		onRedirecting: () => <Callback />,
	});
	return <Component />;
};
