import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import TopNavBar from "../components/TopNavBar/TopNavBar";
import Dashboard from "../pages/DashboardPage/Dashboard";
import NeighborhoodPage from "../pages/NeighborhoodsPage/NeighborhoodPage"; 

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

//if the user is not a part of an org he cannot have access to the app's pages
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
	const { user } = useUser();
	const { organization } = useOrganization();
	const { getToken } = useAuth(); // useAuth hook to get the getToken function

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
			} catch (error) {
				console.error("Error fetching token:", error);
			}
		};

		if (user) {
			fetchToken();
		}
	}, [user, getToken]);

  if (!currentUserOrg) {
    return <NoAccessPage />;
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
		<>
			<BrowserRouter>
				<ClerkProviderNavigate>
					<TopNavBar></TopNavBar>
					<Routes>
						<Route
							path='/'
							element={
								<ProtectedRoute child={<NeighborhoodPage />} />
							}
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
							element={
								<ProtectedRoute child={<CSVUploadBox />} />
							}
						/>
						<Route
							path='/Upload/:RSS'
							element={
								<ProtectedRoute child={<RSSUploadBox />} />
							}
						/>
						<Route
							path='/Dashboard'
							element={<ProtectedRoute child={<Dashboard />} />}
						></Route>
						<Route
							path='/Neighborhoods'
							element={
								<ProtectedRoute child={<NeighborhoodPage />} />
							}
						/>
						{/*
							/Callback basically a loading screen to show while auth context is
							delivered, before being redirected back to home page
						 */}
						{/* <Route path="/Callback" element={<Callback />} /> */}
						<Route path='*' element={<div>404</div>} />
					</Routes>
				</ClerkProviderNavigate>
			</BrowserRouter>
		</>
	);
}
