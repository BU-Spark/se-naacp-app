import "./Dashboard.css";
import React, { useContext } from "react";

import ArticleCard from "../../components/ArticleCard/ArticleCard";
import FrequencyBarChart from "../../components/FrequencyBarChart/FrequencyBarChart";
import AtGlance from "../../components/AtGlance/atGlance";
import TopNeighborhoods from "../../components/TopNeighborhoods/TopNeighborhoods";
import { Outlet } from "react-router-dom";

import { ArticleContext } from "../../contexts/article_context";
import { useAuth0 } from "@auth0/auth0-react";
import type { IdToken } from "@auth0/auth0-react";
import dayjs from "dayjs";
import BasicAccordion from "../../components/Accordion/Accordion";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { resolve } from "path";

export default function Dashboard() {
	const minDate = dayjs("2020-11-01");
	const maxDate = dayjs("2023-01-09");
	let orgData: IdToken | undefined;
	let setOrgData: any;
	[orgData, setOrgData] = React.useState();

	const { isAuthenticated, user } = useAuth0();
	//console.log(user);
	const org = useAuth0().getIdTokenClaims();

	var { articleData, queryArticleDataType } =
		React.useContext(ArticleContext)!;
	const { neighborhoodMasterList, queryNeighborhoodDataType } =
		React.useContext(NeighborhoodContext)!;

	React.useEffect(() => {
		queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
		const getOrg = async () => {
			return await org;
		};
		getOrg().then((res) => {
			setOrgData(res);
		});
	}, []);

	React.useEffect(() => {
		queryArticleDataType("ARTICLE_DATA", {
			dateFrom: 20220101,
			dateTo: 20220201,
			area: "all",
			userId: "1",
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
						{isAuthenticated && user && (
							<div className='align-self-start your-org'>
								{orgData?.org_id && <div>hello org</div>}
							</div>
						)}

						<div className='align-self-start org-name'>
							WGBH Educational Foundation
						</div>

						<p className='week'>
							{/* <span className="text-wrapper">Week </span> */}
							<span className='span'>
								Week: 01/01/22 - 02/01/22
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
					<div className='col-md-4 col-sm-12'>
						<h1 className='titles'>Top 5 Topics</h1>
						<FrequencyBarChart
							num={5}
							openAI={false}
						></FrequencyBarChart>
					</div>
					<div className='col-md-8 col-sm-12'>
						<h1 className='titles'>Articles</h1>

						<ArticleCard></ArticleCard>
						<Outlet></Outlet>
					</div>
				</div>

				<div className='row justify-content-evenly'>
					<div className='col-md-6 col-sm-12'>
						<h1 className='titles'>Active Labels</h1>
						<BasicAccordion isLabels={true}></BasicAccordion>
					</div>
					<div className='col-md-6 col-sm-12'>
						<h1 className='titles'>Latest Tracts</h1>

						<BasicAccordion isLabels={false}></BasicAccordion>
					</div>
				</div>
			</div>
		</>
	);
}
