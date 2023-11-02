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
import TopicsPage from "../pages/TopicsPage/TopicsPage";
import { Auth0ProviderNavigate } from "../config/Auth0Provider";
import Callback from "../pages/Callback/Callback";
import Profile from "../pages/Profile/Profile";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";

export default function MainNavigator() {
	return (
		<>
			<BrowserRouter>
				<Auth0ProviderNavigate>
					<TopNavBar></TopNavBar>
					<Routes>
						<Route path='/' element={<IntroPage />} />
						<Route path='/Topics' element={<TopicsPage />} />
						<Route
							path='/UploadArticles'
							element={<FileUpload />}
						/>
						<Route
							path='/Dashboard'
							element={<Dashboard />}
						></Route>
						<Route
							path='/Neighborhoods'
							element={<NeighborhoodPage />}
						/>
						{/* 
							/Callback basically a loading screen to show while auth context is 
							delivered, before being redirected back to home page
						 */}
						<Route path='/Callback' element={<Callback />} />
						<Route
							path='/Profile'
							element={<ProtectedRoute child={Profile} />}
						/>
					</Routes>
				</Auth0ProviderNavigate>
			</BrowserRouter>
		</>
	);
}