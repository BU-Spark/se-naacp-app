import { Auth0Provider } from "@auth0/auth0-react";
const Auth0ProviderComponent = ({ children, ...props }) => {
	const domain = process.env.REACT_APP_AUTH0_DOMAIN;
	const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
	const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

	// Fail fast if the environment variables aren't set
	if (!domain || !clientId)
		throw new Error(
			"Please set REACT_APP_AUTH0_DOMAIN and REACT_APP_AUTH0_CLIENT_ID env. variables",
		);

	/**
	 * Callback triggered when a successful login occurs.
	 *
	 * Here you could redirect your users to a protected route.
	 *
	 * This is not needed if you're not using a custom router, like `react-router`
	 */

	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			redirectUri={window.location.origin}
			audience={audience}
			useRefreshTokens
			// Token storage option, `localstorage` gives the feature
			// to not log out your users when they close your application
			cacheLocation='localstorage'
			{...props}
		>
			{children}
		</Auth0Provider>
	);
};

export default Auth0ProviderComponent;
