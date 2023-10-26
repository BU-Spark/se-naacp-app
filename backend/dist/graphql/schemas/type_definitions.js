import { gql } from "apollo-server-express";
export const typeDefs = gql `
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
    demographics: Demographics!
    articles: [String!]!
  }

  type Query {
    articleByDate(dateFrom: Int!, dateTo: Int!, area: String!): [Article]
    tractsByNeighborhood(neighborhood: String!): [Neighborhoods]
    demographicsByTracts(tract: String!): [Tracts]
    getAllNeighborhoods: [Neighborhoods!]!
    getAllArticles: [Article!]!
    getAllTopics: [Topics!]!
  }
`;
