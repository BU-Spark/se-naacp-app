import { gql } from "apollo-server-express";


export const typeDefs = gql`
	scalar Upload
	
	type Rss_links {
		url: String!
		userID: String!
	}

	type Subscription {
  	uploadProgress(userId: String!): UploadProgress
	}

	type UploadProgress {
  		userId: String!
  		filename: String!
  		progress: Int!
  		status: String
	}

	type Rss_data {
		userID: String!
		title: String!
		link: String!
		description: String!
		pubDates: String!
		contents: String!
		rssLink: String!
	}
	

	type Uploads {
		userID: String!
		uploadID: String!
		filename: String
		timestamp: String!
		article_cnt: Int!
		status: String!
		message: String!
	}

	type Subscription {
  uploadStatusUpdated: Uploads
}

	type Mutation {
  		# Define a new mutation for uploading a CSV file
  		uploadCSV(file: Upload!, userId: String!): UploadStatus!
		addRssFeed(url: String!, user_id: String!): Rss_links
	}
	

	type UploadResponse {
  		success: Boolean!
  		message: String!
  		uploadID: ID
	}

	type UploadStatus {
		filename: String!
  		status: String!
	}
	
	type Query {
    lastTenUploads(userId: String!): [UploadHistory!]!
}

type UploadHistory {
    uploadID: String!
	filename: String
	article_cnt: Int!
	message: String!
	status: String!
    timestamp: String!
    userID: String!
	
}



	type Article {
		neighborhoods: [String!]!
		tracts: [String!]!
		author: String!
		body: String!
		content_id: String!
		hl1: String!
		pub_date: String!
		pub_name: String!
		link: String!
		openai_labels: String!
		dateSum: Int!
		userID: String!
		coordinates: [[Float]]
		locations: [String]
	}

	type Topics {
		articles: [String!]!
		value: String!
	}

	type Neighborhoods {
		articles: [String]
		value: String!
		tracts: [String!]!
	}

	type Locations {
		coordinates: [Float]
		articles: [String]
		value: String!
		city: String
		tract: String
		neighborhood: String
	}

	type Demographics {
		p2_001n: String
		p2_002n: String
		p2_003n: String
		p2_004n: String
		p2_005n: String
		p2_006n: String
		p2_007n: String
		p2_008n: String
		p2_009n: String
		p2_010n: String
	}

	type Tracts {
		county_name: String!
		tract: String!
		geoid_tract: String!
		neighborhood: String!
		demographics: Demographics
		articles: [String!]
	}

	type Query {
		getRssLinkByUserId(user_id: String!): [Rss_links]
		getUploadByUserId(user_id: String!): [Uploads]
		articleByDate(
			dateFrom: Int!
			dateTo: Int!
			area: String!
			userID: String!
		): [Article]
		articleByTopicsOrLabels(
			dateFrom: Int!
			dateTo: Int!
			area: String!
			labelOrTopic: String!
			userID: String!
		): [Article]
		orgArticlesPastWeek(userID: String!): [Article]
    	getArticlesByOrg(userID: String!): [Article]
		tractsByNeighborhood(neighborhood: String!): [Neighborhoods]
		demographicsByTracts(tract: String!): [Tracts]
		getAllNeighborhoods: [Neighborhoods!]!
		getAllArticles: [Article!]!
		getAllTopics(userID: String!): [String!]!
		getAllLabels(userID: String!): [String!]!
		getAllLocations: [Locations!]!
	}


`;