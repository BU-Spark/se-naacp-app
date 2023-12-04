import "./Dashboard.css";
import React, { useContext } from "react";

import ArticleCard from "../../components/ArticleCard/ArticleCard";
import FrequencyBarChart from "../../components/FrequencyBarChart/FrequencyBarChart";
import AtGlance from "../../components/AtGlance/atGlance";
import TopNeighborhoods from "../../components/TopNeighborhoods/TopNeighborhoods";
import { Outlet } from "react-router-dom";

import { ArticleContext } from "../../contexts/article_context";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";
import BasicAccordion from "../../components/Accordion/Accordion";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import DashboardTabs from "../../components/DashboardTabs/dashboardTabs";
export default function Dashboard() {
  const { user, isAuthenticated } = useAuth0();

  var { articleData, queryArticleDataType } = React.useContext(ArticleContext)!;
  const { neighborhoodMasterList, queryNeighborhoodDataType } =
    React.useContext(NeighborhoodContext)!;

  console.log(user?.sub);
  React.useEffect(() => {
    queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
  }, []);

  React.useEffect(() => {
    queryArticleDataType("ARTICLE_DATA", {
      dateFrom: 20200101,
      dateTo: 20240101,
      area: "all",
      userId: user?.sub,
    });
  }, [articleData]);

  if (!articleData) {
    articleData = [];
  }

  return (
    <>
      <div className="big-container">
        <div className="row">
          <div className="col">
            {/* {isAuthenticated && (
              <div className="align-self-start">Hello, {user?.given_name}</div>
            )} */}
            <div className="align-self-start your-org">YOUR ORGANIZATION</div>
            <div className="align-self-start org-name">
              WGBH Educational Foundation
            </div>

            <p className="week">
              {/* <span className="text-wrapper">Week </span> */}
              <span className="span">Week: 01/01/22 - 02/01/22</span>
            </p>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-4 col-sm-12">
            <AtGlance articles={articleData!} height="20vh"></AtGlance>
          </div>
          <div className="col-md-8 col-sm-12">
            <TopNeighborhoods
              articles={articleData!}
              height="20vh"
            ></TopNeighborhoods>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-12 col-sm-12">
            <DashboardTabs articles={articleData!}></DashboardTabs>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-12 col-sm-12">
            <h1 className="titles">Top 5 Topics</h1>
            <FrequencyBarChart num={5} openAI={false}></FrequencyBarChart>
          </div>
          {/* <div className="col-md-8 col-sm-12">
            <h1 className="titles">Articles</h1>

            <ArticleCard></ArticleCard>
            <Outlet></Outlet>
          </div> */}
        </div>

        {/* <div className="row justify-content-evenly">
          <div className="col-md-6 col-sm-12">
            <h1 className="titles">Active Labels</h1>
            <BasicAccordion isLabels={true}></BasicAccordion>
          </div>
          <div className="col-md-6 col-sm-12">
            <h1 className="titles">Latest Tracts</h1>

            <BasicAccordion isLabels={false}></BasicAccordion>
          </div>
        </div> */}
      </div>
    </>
  );
}
