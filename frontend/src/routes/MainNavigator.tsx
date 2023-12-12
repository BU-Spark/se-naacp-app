import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import IntroPage from "../pages/LandingPage/IntroPage";
import FileUpload from "../pages/UploadArticles/UploadArticles";
import TopNavBar from "../components/TopNavBar/TopNavBar";
import Dashboard from "../pages/DashboardPage/Dashboard";
import NeighborhoodPage from "../pages/NeighborhoodsPage/NeighborhoodPage"; // Replace with actual path

import { TopicsContext } from "../contexts/topics_context";
import { NeighborhoodContext } from "../contexts/neighborhood_context";
import TopicsPage from "../pages/TopicsPage/TopicsPage/TopicsPage";
import TopicsSearchPage from "../pages/TopicsPage/TopicsSearchPage/TopicsSearchPage";
import Callback from "../pages/Callback/Callback";
import { Topics } from "../__generated__/graphql";
import CSVUploadBox from "../pages/UploadPage/CSVUploadPage";
import RSSUploadBox from "../pages/UploadPage/RSSUploadPage";
import {
	SignIn,
	SignUp,
	SignedIn,
	SignedOut,
	RedirectToSignIn,
} from "@clerk/clerk-react";
import { ClerkProviderNavigate } from "../config/ClerkProvider";

const ProtectedRoute = ({ child }: { child: React.ReactNode }) => {
	return (
		<>
			<SignedIn>{child}</SignedIn>
			<SignedOut>
				<RedirectToSignIn redirectUrl={"/Dashboard"} />
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
								<ProtectedRoute child={<TopicsSearchPage />} />
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
						{/* <Route
              path="/TopicsSearchPage"
              element={<ProtectedRoute child={TopicsSearchPage} />}
            /> */}

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
