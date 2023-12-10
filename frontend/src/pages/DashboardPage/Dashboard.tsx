import "./Dashboard.css";
import React, { useContext } from "react";

import ArticleCard from "../../components/ArticleCard/ArticleCard";
import FrequencyBarChart from "../../components/FrequencyBarChart/FrequencyBarChart";
import AtGlance from "../../components/AtGlance/atGlance";
import TopNeighborhoods from "../../components/TopNeighborhoods/TopNeighborhoods";
import { Outlet } from "react-router-dom";

import { ArticleContext } from "../../contexts/article_context";
import { useOrganization, useUser } from "@clerk/clerk-react";
import dayjs from "dayjs";
import BasicAccordion from "../../components/Accordion/Accordion";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import DashboardTabs from "../../components/DashboardTabs/dashboardTabs";

const convertDateToInt = (dateString: string) => {
	return parseInt(dateString.replace(/\//g, ""), 10);
};
export default function Dashboard() {
	const today = dayjs().format("YYYY/MM/DD"); // Formats today's date as YYYY-MM-DD
	const oneMonthAgo = dayjs().subtract(1, "month").format("YYYY/MM/DD"); // Gets the date one month ago and formats it

	const todayInt = convertDateToInt(today); // Converts today's date
	const oneMonthAgoInt = convertDateToInt(oneMonthAgo); // Converts the date from one month ago
	// User objects holds all a user's organization memberships, not just the current one
	const { user, isSignedIn } = useUser();
	// useOrganization() returns the current organization in the session
	const { organization } = useOrganization();

	const currentUserOrg = user?.organizationMemberships.find(
		(ele) => ele.organization.id === organization?.id,
	);

	var { articleData, queryArticleDataType } =
		React.useContext(ArticleContext)!;
	const { neighborhoodMasterList, queryNeighborhoodDataType } =
		React.useContext(NeighborhoodContext)!;

	React.useEffect(() => {
		queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
	}, []);

	React.useEffect(() => {
		queryArticleDataType("ARTICLE_DATA", {
			dateFrom: oneMonthAgoInt,
			dateTo: todayInt,
			area: "all",
			userId: user?.id,
		});
	}, [articleData]);

	if (!articleData) {
		articleData = [];
	}

	return (
		<>
			<div className='big-container'>
				<div className='row'>
					<div className='col'>
						<div className='align-self-start your-org'>
							{currentUserOrg?.organization.name}
						</div>
						<div className='align-self-start your-org'>
							{user?.fullName} | {user?.id}
						</div>

						<div className='align-self-start org-name'>
							WGBH Educational Foundation
						</div>

						<p className='week'>
							{/* <span className="text-wrapper">Week </span> */}
							<span className='span'>
								Month: {oneMonthAgo} - {today}
							</span>
						</p>
					</div>
				</div>

				<div className='row justify-content-evenly'>
					<div className='col-md-4 col-sm-12'>
						<AtGlance
							articles={articleData!}
							height='20vh'
						></AtGlance>
					</div>
					<div className='col-md-8 col-sm-12'>
						<TopNeighborhoods
							articles={articleData!}
							height='20vh'
						></TopNeighborhoods>
					</div>
				</div>

				<div className='row justify-content-evenly'>
					<div className='col-md-12 col-sm-12'>
						<DashboardTabs articles={articleData!}></DashboardTabs>
					</div>
				</div>

				<div className='row justify-content-evenly'>
					<div className='col-md-12 col-sm-12'>
						<h1 className='titles'>Top 5 Topics</h1>
						<FrequencyBarChart
							num={5}
							openAI={false}
						></FrequencyBarChart>
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
