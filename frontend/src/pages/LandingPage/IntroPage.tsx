import React from "react";
import "./IntroPage.css";

import { useNavigate, NavigateFunction } from "react-router-dom";

import Logo from "../../assets/logos/wgbh-logo.svg";

const IntroPage = () => {
	//const { neighborhood, setNeigh } = React.useContext(NeighborhoodContext2);
	const [showError, setshowerror] = React.useState<boolean>(false); // Enforce typing here
	const navigate: NavigateFunction = useNavigate(); // Enforce typing here

	// const navigateDeveloperMode = () => {
	//   if (neighborhood === "boston_city") {
	//     setshowerror(true);
	//   } else {
	//     setNeigh("boston_city");
	//     navigate("/IntroPage");
	//   }
	// };

	const navigateSearchByKeyWord = () => {
		navigate("/SearchByKeyWord");
	};

	const navigateUploadPage = () => {
		navigate("/UploadArticles");
	};
	return (
		<div className='App'>
			<header className='App-header'>
				<img
					style={{
						marginLeft: 0,
						marginTop: 10,
						marginRight: 0,
						width: 150,
					}}
					src={Logo}
					alt={"Logo"}
				></img>

				<h1 className='App-title' style={{ marginTop: "20px" }}>
					Welcome To GBH Statistics
				</h1>
			</header>
		</div>
	);
};

export default IntroPage;
