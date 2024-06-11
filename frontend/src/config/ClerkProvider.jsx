import { useEffect } from "react";
import {
  ClerkProvider,
  useClerk,
  useAuth
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

// Check if the Clerk publishable key is available in the environment variables
if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Retrieve the Clerk publishable key from environment variables
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Custom hook for fetching data with authentication
const useFetch = () => {
  const { getToken } = useAuth();

  const authenticatedFetch = async (...args) => {
    const authToken = await getToken({ template: 'GraphQLAuth' });
    const orgToken = localStorage.getItem('token');
    
    if (authToken) {
      localStorage.setItem('clerk-db-jwt', authToken);
      console.log("Fetched and stored clerk-db-jwt token:", authToken);
    }
    
    return fetch(...args, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'x-org-token': orgToken // Send org token in a custom header
      }
    }).then(res => res.json());
  };

  return authenticatedFetch;
};

// ClerkProvider component for managing Clerk authentication
export const ClerkProviderComponent = ({ children }) => {
  const { session } = useClerk();
  const authenticatedFetch = useFetch();

  useEffect(() => {
    const fetchToken = async () => {
      if (session) {
        try {
          await authenticatedFetch(); // This will fetch and store the token
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }
    };

    fetchToken();
  }, [session, authenticatedFetch]);

  return (
    <ClerkProvider publishableKey={clerkPubKey}>{children}</ClerkProvider>
  );
};

// ClerkProvider component with navigation support
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
