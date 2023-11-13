import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const redirect_uri = process.env.REACT_APP_AUTH0_REDIRECT_URI;

export const Auth0ProviderNavigate = ({ children }) => {
  const navigate = useNavigate();

  // Fail fast if the environment variables aren't set
  if (!domain || !clientId)
    throw new Error(
      "Please set REACT_APP_AUTH0_DOMAIN and REACT_APP_AUTH0_CLIENT_ID env. variables"
    );

  // Runs after successful login redirects back to app, send user to dashboard
  const onRedirectCallback = (appState) => {
    navigate("/Dashboard");
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirect_uri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export const Auth0ProviderComponent = ({ children }) => {
  // Fail fast if the environment variables aren't set
  if (!domain || !clientId)
    throw new Error(
      "Please set REACT_APP_AUTH0_DOMAIN and REACT_APP_AUTH0_CLIENT_ID env. variables"
    );

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirect_uri,
      }}
    >
      {children}
    </Auth0Provider>
  );
};
