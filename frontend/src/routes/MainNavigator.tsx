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
import Auth0ProviderComponent from "../config/Auth0Provider";

export default function MainNavigator() {
	const Auth0ProviderRedirectCallback = ({
		children,
	}: {
		children: React.ReactNode;
	}) => {
		const navigate = useNavigate();
		const onRedirectCallback = (appState: any) => {
			navigate(
				(appState && appState.returnTo) || window.location.pathname,
			);
		};
		return (
			<Auth0ProviderComponent onRedirectCallback={onRedirectCallback}>
				{children}
			</Auth0ProviderComponent>
		);
	};

	return (
		<>
			<BrowserRouter>
				<Auth0ProviderRedirectCallback>
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
				</Auth0ProviderRedirectCallback>
			</BrowserRouter>
		</>
	);
}
