import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

// Pages
import Home from "../pages/HomePage/Home";
import DevMode from "../pages/DevelopmentMode/DevMode";
import IntroPage from "../pages/LandingPage/IntroPage";
import SearchByKeyWord from "../pages/SearchByKeyWord/SearchByKeyWord";
import FileUpload from "../pages/UploadArticles/UploadArticles";
import Profile from "../pages/Profile/Profile";
import Login from "../pages/LoginPage/Login";
// Context
import { ArticleContext } from "../contexts/article_context";
import { Auth0ProviderNavigate } from "../config/Auth0Provider";

export default function MainNavigator() {
	const { neighborhoodMasterList, queryArticleDataType } =
		React.useContext(ArticleContext);

	React.useEffect(() => {
		// Neighborhood list should be bootstrapped here...
	}, [neighborhoodMasterList]);

	return (
		<>
			<BrowserRouter>
				<Auth0ProviderNavigate>
					<Routes>
						<Route path='/IntroPage' element={<Home />} />
						<Route path='/dev-mode' element={<DevMode />} />
						<Route path='/' element={<IntroPage />} />
						<Route
							path='/SearchByKeyWord'
							element={<SearchByKeyWord />}
						/>
						<Route
							path='/UploadArticles'
							element={<FileUpload />}
						/>
						<Route path='/Profile' element={<Profile />} />
						<Route path='Login' element={<Login />} />
					</Routes>
				</Auth0ProviderNavigate>
			</BrowserRouter>
		</>
	);
}
