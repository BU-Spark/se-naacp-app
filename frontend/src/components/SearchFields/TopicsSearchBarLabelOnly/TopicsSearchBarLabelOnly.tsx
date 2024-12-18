import React from "react";
import "./TopicsSearchBarLabelOnly.css";

import { Input, Switch, AutoComplete } from "antd";
import { useContext, useState } from "react";
import { TopicsContext } from "../../../contexts/topics_context";
import { SearchOutlined } from "@ant-design/icons";
import { LinearProgress, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArticleContext } from "../../../contexts/article_context";
import { useOrganization, useUser } from "@clerk/clerk-react";

const { Search } = Input;

interface SearchBarDropDownProps {
	listOfWords: string[];
}

const TopicsSearchBar: React.FC<SearchBarDropDownProps> = ({ listOfWords }) => {
	const navigate = useNavigate(); // Enforce typing here
	const { user } = useUser();
	const { organization } = useOrganization();

	const {
		topic,
		setTopic,
		topicsMasterList,
		labelsMasterList,
		queryTopicsDataType,
	} = useContext(TopicsContext)!;

	const { articleData, queryArticleDataType } =
		React.useContext(ArticleContext)!;
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [options, setOptions] = useState<string[]>([]);
	const [isOpenAI, setIsOpenAI] = useState<boolean>(false);

	React.useEffect(() => {
		if (topicsMasterList && labelsMasterList) {
			setIsLoading(false);
			setOptions(labelsMasterList);
		} else {
			if (organization) {
				queryTopicsDataType("TOPICS_DATA", {
					userId: organization.id,
				});
				queryTopicsDataType("LABELS_DATA", {
					userId: organization.id,
				});
			} else {
				queryTopicsDataType("TOPICS_DATA", {
					userId: user?.id,
				});
				queryTopicsDataType("LABELS_DATA", {
					userId: user?.id,
				});
			}
		}
	}, [topicsMasterList, labelsMasterList]);

	const handleSearch = (value: string) => {
		if (value.trim() === "") {
			return; // Ignore empty search queries
		}
		setTopic(value);
		navigate("/Topics");
	};

	const handleInputChange = (value: string) => {
		if (value) {
			const matchedOptions = options.filter((word) =>
				word.toLowerCase().includes(value.toLowerCase()),
			);
			setOptions(matchedOptions);
		} else {
			if (isOpenAI) {
				setOptions(labelsMasterList!);
			} else {
				setOptions(topicsMasterList!);
			}
		}
	};

	const onSwitchChange = (checked: boolean) => {
		setIsOpenAI(checked);

		if (checked) {
			setOptions(labelsMasterList!);
		} else {
			setOptions(topicsMasterList!);
		}
	};

	return isLoading ? (
		<Stack
			sx={{
				width: "100%",
				color: "grey.500",
				marginTop: "10px",
			}}
			spacing={2}
		>
			<LinearProgress color='secondary' />
		</Stack>
	) : (
		<>
			<AutoComplete
				options={options.map((option) => ({ value: option }))}
				onSearch={handleInputChange}
			>
				<Search
					placeholder='Search a Topic'
					enterButton
					onSearch={handleSearch}
					// suffix={
					// 	<Switch
					// 		checkedChildren='Labels'
					// 		unCheckedChildren='Topics'
					// 		checked={isOpenAI}
					// 		onChange={onSwitchChange}
					// 		className='search-switch'
					// 	/>
					// }
				/>
			</AutoComplete>
		</>
	);
};

export default TopicsSearchBar;