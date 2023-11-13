import { gql } from "apollo-server-express";
export const typeDefs = gql `
  type Uploads {
    userID: String!
    uploadID: String!
    timestamp: String!
    article_cnt: Int!
    status: String!
    message: String!
  }

  type Article {
    neighborhoods: [String!]!
    position_section: String!
    tracts: [String!]!
    author: String!
    body: String!
    content_id: String!
    hl1: String!
    hl2: String!
    pub_date: String!
    pub_name: String!
    link: String!
    openai_labels: [String!]!
    dateSum: Int!
    userID: String!
  }

  type Topics {
    articles: [String!]!
    value: String!
  }

  type Neighborhoods {
    articles: [String!]!
    value: String!
    tracts: [String!]!
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
    getUploadByUserId(user_id: String!): [Uploads]
    articleByDate(dateFrom: Int!, dateTo: Int!, area: String!, userID: String!): [Article]
    articleByTopicsOrLabels(dateFrom: Int!, dateTo: Int!, area: String!, labelOrTopic: String!, userID: String!): [Article]
    tractsByNeighborhood(neighborhood: String!): [Neighborhoods]
    demographicsByTracts(tract: String!): [Tracts]
    getAllNeighborhoods: [Neighborhoods!]!
    getAllArticles: [Article!]!
    getAllTopics(userID: String!): [String!]!
    getAllLabels(userID: String!): [String!]!
  }
`;
