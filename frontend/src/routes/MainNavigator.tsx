import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Pages
import TopNavBar from "../components/TopNavBar/TopNavBar";
import Dashboard from "../pages/DashboardPage/Dashboard";
import NeighborhoodPage from "../pages/NeighborhoodsPage/NeighborhoodPage"; 
import StoriesPage from "../pages/StoriesPage/StoriesPage";
import LocationsPage from "../pages/LocationsPage/LocationsPage";
import TopicsPage from "../pages/TopicsPage/TopicsPage/TopicsPage";
import TopicsSearchPage from "../pages/TopicsPage/TopicsSearchPage/TopicsSearchPage";
import CSVUploadBox from "../pages/UploadPage/CSVUploadPage";
import RSSUploadBox from "../pages/UploadPage/RSSUploadPage";
import {
	SignIn,
	SignUp,
	SignedIn,
	SignedOut,
	RedirectToSignIn,
	useUser,
	useOrganization,
	useAuth
} from "@clerk/clerk-react";
import { ClerkProviderNavigate } from "../config/ClerkProvider";

// If the user is not part of an org, they cannot have access to the app's pages
export const NoAccessPage = () => (
	<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
			<div style={{ textAlign: 'center' }}>
			  <div>You do not have permission to access this page.</div>
			</div>
			<div style={{ textAlign: 'center' }}>
			  <div>Please contact the administrator.</div>
			</div>
		</div>
  );
  
//check if the user is part of an org
const ProtectedRoute = ({ child }: { child: React.ReactNode }) => {
	const { user, isLoaded: isUserLoaded } = useUser();
	const { organization, isLoaded: isOrgLoaded } = useOrganization();
	const { getToken } = useAuth();// useAuth hook to get the getToken function
	const [isTokenLoaded, setTokenLoaded] = useState(false);
	const location = useLocation();

	const currentUserOrg = user?.organizationMemberships.find(
		(ele) => ele.organization.id === organization?.id
	);

	// Fetch token and store in local storage
	useEffect(() => {
		const fetchToken = async () => {
			try {
				const token = await getToken({ template: 'GraphQLAuth' }); // Use the getToken function from useAuth
				if (token) {
					localStorage.setItem('token', token);
				}
		setTokenLoaded(true);
			} catch (error) {
				console.error("Error fetching token:", error);
			}
		};

	if (user) {
	  fetchToken();
	}
  }, [user, getToken]);

  // redirect to sign-in if user is not authenticated
  if (!isUserLoaded) {
	return <div>Loading...</div>;
  }
  // if user is not authenticated, redirect to the sign-in page
  if (!user) {
	return <Navigate to="/sign-in" state={{ from: location }} />;
  }

  // ensure the token and organization are loaded before rendering the protected route
  if (!isTokenLoaded || !isOrgLoaded) {
	return <div>Loading...</div>;
  }

  if (!currentUserOrg) {
	return <Navigate to="/no-access" />;
  }

	return (
		<>
			<SignedIn>{child}</SignedIn>
			<SignedOut>
				<RedirectToSignIn redirectUrl={"/sign-in"} />
			</SignedOut>
		</>
	);
};

export default function MainNavigator() {
  return (
	<BrowserRouter>
	  <ClerkProviderNavigate>
		<TopNavBar />
		<Routes>
		  <Route
			path='/'
			element={<ProtectedRoute child={<NeighborhoodPage />} />}
		  />
		  <Route
			path='/sign-in/*'
			element={<SignIn routing='path' path='/sign-in' />}
		  />
		  <Route
			path='/sign-up/*'
			element={<SignUp routing='path' path='/sign-up' />}
		  />
		  <Route
			path="/TopicsSearchPage"
			element={<ProtectedRoute child={<TopicsSearchPage />} />}
		  />
		  <Route
			path='/Topics'
			element={<ProtectedRoute child={<TopicsPage />} />}
		  />
		  <Route
			path='/Upload'
			element={<ProtectedRoute child={<CSVUploadBox />} />}
		  />
		  <Route
			path='/Upload/:RSS'
			element={<ProtectedRoute child={<RSSUploadBox />} />}
		  />
		  <Route
			path='/Dashboard'
			element={<ProtectedRoute child={<Dashboard />} />}
		  />
		  <Route
			path='/Neighborhoods'
			element={<ProtectedRoute child={<NeighborhoodPage />} />}
		  />
		  <Route
			path='/Stories'
			element={<ProtectedRoute child={<StoriesPage />} />}
		  />
		  <Route
			path='/Locations'
			element={<ProtectedRoute child={<LocationsPage />} />}
		  />
		  <Route
			path='/no-access'
			element={<NoAccessPage />}
		  />
		  <Route path='*' element={<div>404</div>} />
		</Routes>
	  </ClerkProviderNavigate>
	</BrowserRouter>
  );
}
