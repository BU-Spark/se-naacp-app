import React from "react";
import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	UserButton,
	useUser,
	RedirectToSignIn,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

export const ClerkProviderComponent = ({ children }) => {
	return (
		<ClerkProvider publishableKey={clerkPubKey}>{children}</ClerkProvider>
	);
};

export const ClerkProviderNavigate = ({ children }) => {
	const navigate = useNavigate();

	return (
		<ClerkProvider
			publishableKey={clerkPubKey}
			navigate={(to) => navigate(to)}
		>
			{children}
		</ClerkProvider>
	);
};
