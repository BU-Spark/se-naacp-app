import React, { useContext } from "react";
import "./DateBar.css";

import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { ArticleContext } from "../../../contexts/article_context";
import { TractContext } from "../../../contexts/tract_context";
import { NeighborhoodContext } from "../../../contexts/neighborhood_context";
import { minDate, maxDate } from "../../../App";
import { TopicsContext } from "../../../contexts/topics_context";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
interface DateFieldProps {
	title: string;
	isTopicsPage: boolean;
}

const DateField: React.FC<DateFieldProps> = ({ isTopicsPage }) => {
	const [dateFrom, setdateFrom] = React.useState(minDate);
	const [dateTo, setDateTo] = React.useState(maxDate);
	const location = useLocation();
	const navigate = useNavigate();

	const { topicsMasterList, topic, setTopic } =
		React.useContext(TopicsContext)!;
	const { articleData, queryArticleDataType, setShouldRefresh } =
		React.useContext(ArticleContext)!;
	const { tractData, queryTractDataType } = React.useContext(TractContext)!;
	const { neighborhood } = React.useContext(NeighborhoodContext)!;
	const { user } = useUser();
	const { organization } = useOrganization();

	const handleChangeFrom = (d: any) => {
		setdateFrom(d);
	};

	const handleChangeTo = (d: any) => {

		setDateTo(d);

	};



	React.useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const urlFrom = queryParams.get("from");
		const urlTo = queryParams.get("to");

		
		if (urlFrom && urlTo) {

			if (urlTo !== dateTo.format("MM/DD/YYYY")) {
				handleChangeTo(dayjs(urlTo));
			}

			if (urlFrom !== dateFrom.format("MM/DD/YYYY")) {
				handleChangeFrom(dayjs(urlFrom));
			}


		} else {
			queryParams.set("from", dateFrom.format("MM/DD/YYYY"));
			queryParams.set("to", dateTo.format("MM/DD/YYYY"));
			navigate(`?${queryParams.toString()}`);
		}
	}, []);

	React.useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const urlFrom = queryParams.get("from");
		const urlTo = queryParams.get("to");

		if (urlFrom && urlTo) {
			if (urlFrom !== dateFrom.format("MM/DD/YYYY")) {
				queryParams.set("from", dateFrom.format("MM/DD/YYYY"));
				navigate(`?${queryParams.toString()}`);
			}
			if (urlTo !== dateTo.format("MM/DD/YYYY")) {
				queryParams.set("to", dateTo.format("MM/DD/YYYY"));
				navigate(`?${queryParams.toString()}`);
			}
		} else {
			queryParams.set("from", dateFrom.format("MM/DD/YYYY"));
			queryParams.set("to", dateTo.format("MM/DD/YYYY"));
			navigate(`?${queryParams.toString()}`);
		}
	}, [dateFrom, dateTo]);


	React.useEffect(() => {
		setShouldRefresh(false);
		if (organization) {
			isTopicsPage
				? queryArticleDataType("ARTICLE_BY_LABEL_OR_TOPIC", {
						dateFrom: parseInt(dateFrom.format("YYYYMMDD")),
						dateTo: parseInt(dateTo.format("YYYYMMDD")),
						area: tractData?.tract,
						labelOrTopic: topic,
						userId: organization.id,
				  })
				: queryArticleDataType("ARTICLE_DATA", {
						dateFrom: parseInt(dateFrom.format("YYYYMMDD")),
						dateTo: parseInt(dateTo.format("YYYYMMDD")),
						area: tractData?.tract,
						userId: organization.id,
				  });
		} else if (user) {
			isTopicsPage
				? queryArticleDataType("ARTICLE_BY_LABEL_OR_TOPIC", {
						dateFrom: parseInt(dateFrom.format("YYYYMMDD")),
						dateTo: parseInt(dateTo.format("YYYYMMDD")),
						area: tractData?.tract,
						labelOrTopic: topic,
						userId: user?.id,
				  })
				: queryArticleDataType("ARTICLE_DATA", {
						dateFrom: parseInt(dateFrom.format("YYYYMMDD")),
						dateTo: parseInt(dateTo.format("YYYYMMDD")),
						area: tractData?.tract,
						userId: user?.id,
				  });
		}
	}, [tractData]);

	React.useEffect(() => {
		if (organization) {
			isTopicsPage
				? queryArticleDataType("ARTICLE_BY_LABEL_OR_TOPIC", {
						dateFrom: parseInt(dateFrom.format("YYYYMMDD")),
						dateTo: parseInt(dateTo.format("YYYYMMDD")),
						area: "all",
						labelOrTopic: topic,
						userId: organization.id,
				  })
				: queryArticleDataType("ARTICLE_DATA", {
						dateFrom: parseInt(dateFrom.format("YYYYMMDD")),
						dateTo: parseInt(dateTo.format("YYYYMMDD")),
						area: tractData?.tract,
						userId: organization.id,
				  });
		} else if (user) {
			isTopicsPage
				? queryArticleDataType("ARTICLE_BY_LABEL_OR_TOPIC", {
						dateFrom: parseInt(dateFrom.format("YYYYMMDD")),
						dateTo: parseInt(dateTo.format("YYYYMMDD")),
						area: "all",
						labelOrTopic: topic,
						userId: user?.id,
				  })
				: queryArticleDataType("ARTICLE_DATA", {
						dateFrom: parseInt(dateFrom.format("YYYYMMDD")),
						dateTo: parseInt(dateTo.format("YYYYMMDD")),
						area: tractData?.tract,
						userId: user?.id,
				  });
		}
		setShouldRefresh(true);
	}, [dateFrom, dateTo]);

	return (
		<>
			<div style={{ display: "flex" }}>
				<div>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DesktopDatePicker
							inputFormat='MM/DD/YYYY'
							value={dateFrom}
							onChange={handleChangeFrom}
							minDate={minDate}
							maxDate={maxDate}
							renderInput={(params) => (
								<TextField
									sx={{
										width: "97%",
										"& .MuiInputBase-root": {
											borderRadius: 0.5,
											height: 34,
										},
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderWidth: 2,
												borderColor: "#ccc",
											},
											"&:hover fieldset": {
												borderColor: "#ccc",
											},
										},
										"& .MuiInput-underline:after": {
											borderBottomColor: "#ccc",
										},
									}}
									{...params}
								/>
							)}
						/>
					</LocalizationProvider>
				</div>

				<div>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DesktopDatePicker
							inputFormat='MM/DD/YYYY'
							value={dateTo}
							onChange={handleChangeTo}
							minDate={minDate}
							maxDate={maxDate}
							renderInput={(params) => (
								<TextField
									sx={{
										width: "97%",
										"& .MuiInputBase-root": {
											borderRadius: 0.5,
											height: 34,
										},
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderWidth: 2,
												borderColor: "#ccc",
											},
											"&:hover fieldset": {
												borderColor: "#ccc",
											},
										},
										"& .MuiInput-underline:after": {
											borderBottomColor: "#ccc",
										},
									}}
									{...params}
								/>
							)}
						/>
					</LocalizationProvider>
				</div>
			</div>
		</>
	);
};

export default DateField;
