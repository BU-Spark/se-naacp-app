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
import TopicsSearchPage from "../pages/TopicsPage/TopicsSearchPage/TopicsSearchPage";
import { Auth0ProviderNavigate } from "../config/Auth0Provider";
import Callback from "../pages/Callback/Callback";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { Topics } from "../__generated__/graphql";
import CSVUploadBox from "../pages/UploadPage/CSVUploadPage";
import RSSUploadBox from "../pages/UploadPage/RSSUploadPage";

export default function MainNavigator() {
 
  return (
    <>
      <BrowserRouter>
        <Auth0ProviderNavigate>
          <TopNavBar></TopNavBar>
          <Routes>
            <Route path="/" element={<ProtectedRoute child={IntroPage} />} />

            <Route
              path="/TopicsSearchPage"
              element={<ProtectedRoute child={TopicsSearchPage} />}
            />

            <Route
              path="/Topics"
              element={<ProtectedRoute child={TopicsPage} />}
            />
            <Route
              path="/Upload"
              element={<ProtectedRoute child={CSVUploadBox} />}
            />
            <Route
              path="/Upload/:RSS"
              element={<ProtectedRoute child={RSSUploadBox} />}
            />
            <Route
              path="/Dashboard"
              element={<ProtectedRoute child={Dashboard} />}
            ></Route>
            <Route
              path="/Neighborhoods"
              element={<ProtectedRoute child={NeighborhoodPage} />}
            />
            {/*
							/Callback basically a loading screen to show while auth context is
							delivered, before being redirected back to home page
						 */}
            <Route path="/Callback" element={<Callback />} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </Auth0ProviderNavigate>
      </BrowserRouter>
    </>
  );
}

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// // Pages
// import IntroPage from "../pages/LandingPage/IntroPage";
// import FileUpload from "../pages/UploadArticles/UploadArticles";
// import TopNavBar from "../components/TopNavBar/TopNavBar";
// import Dashboard from "../pages/DashboardPage/Dashboard";
// import NeighborhoodPage from "../pages/NeighborhoodsPage/NeighborhoodPage"; // Replace with actual path

// import { TopicsContext } from "../contexts/topics_context";
// import { NeighborhoodContext } from "../contexts/neighborhood_context";
// import TopicsPage from "../pages/TopicsPage/TopicsPage";
// import TopicsSearchPage from "../pages/TopicsPage/TopicsSearchPage/TopicsSearchPage";
// import { Auth0ProviderNavigate } from "../config/Auth0Provider";
// import Callback from "../pages/Callback/Callback";

// export default function MainNavigator() {
//   const { topicsMasterList, queryTopicsDataType } =
//     React.useContext(TopicsContext);
//   const { neighborhoodMasterList, queryNeighborhoodDataType } =
//     React.useContext(NeighborhoodContext);

//   React.useEffect(() => {
//     // Bootstrap Master list data
//     queryTopicsDataType("TOPICS_DATA", {
//       userId: "2",
//     });
//     queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
//   }, [topicsMasterList, neighborhoodMasterList]);

//   return (
//     <>
//       <BrowserRouter>
//         <Auth0ProviderNavigate>
//           <TopNavBar></TopNavBar>

//           <Routes>
//             <Route path="/" element={<IntroPage />} />
//             <Route path="/Topics" element={<TopicsPage />} />
//             <Route path="/UploadArticles" element={<FileUpload />} />
//             <Route path="/Dashboard" element={<Dashboard />}></Route>
//             <Route path="/Neighborhoods" element={<NeighborhoodPage />} />
//             <Route path="/TopicsSearchPage" element={<TopicsSearchPage />} />
//             <Route path="/Callback" element={<Callback />} />
//             <Route path="*" element={<div>404</div>} />
//           </Routes>
//         </Auth0ProviderNavigate>
//       </BrowserRouter>
//     </>
//   );
// }
