import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

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
					</Routes>
				</Auth0ProviderNavigate>
			</BrowserRouter>
		</>
	);
}
