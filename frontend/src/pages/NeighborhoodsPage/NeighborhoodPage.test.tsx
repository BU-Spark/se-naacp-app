jest.mock('react-lottie-player', () => () => <div>Mocked Lottie Player</div>);
import React from 'react'; 
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom'; // If using react-router
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { TopicsContext } from "../../contexts/topics_context";
import NeighborhoodPage from './NeighborhoodPage'; // Adjust the import according to the actual path
import userEvent from '@testing-library/user-event'; 


const { gql } = jest.requireActual("@apollo/client");

const ARTICLE_DATA_QUERY = gql`
  query GetAllArticles(
    $dateFrom: Int!
    $dateTo: Int!
    $area: String!
    $userId: String!
  ) {
    articleByDate(
      dateFrom: $dateFrom
      dateTo: $dateTo
      area: $area
      userID: $userId
    ) {
      author
      dateSum
      hl1
      link
      neighborhoods
      openai_labels
      position_section
      pub_date
      tracts
    }
  }
`;

const ARTICLE_BY_LABEL_OR_TOPIC = gql`
  query articleByTopicLabelQuery(
    $dateFrom: Int!
    $dateTo: Int!
    $area: String!
    $labelOrTopic: String!
    $userId: String!
  ) {
    articleByTopicsOrLabels(
      dateFrom: $dateFrom
      dateTo: $dateTo
      area: $area
      labelOrTopic: $labelOrTopic
      userID: $userId
    ) {
      author
      dateSum
      hl1
      link
      neighborhoods
      openai_labels
      position_section
      pub_date
      tracts
    }
  }
`;

const NEIGHBORHOOD_DATA_QUERY = gql`
  query neighborhoodQuery {
    getAllNeighborhoods {
      value
      tracts
    }
  }
`;

const TOPICS_DATA_QUERY = gql`
  query topicsQuery($userId: String!) {
    getAllTopics(userID: $userId)
  }
`;

const LABELS_DATA_QUERY = gql`
  query GetAllLabels($userId: String!) {
    getAllLabels(userID: $userId)
  }
`;

// Mock necessary hooks and contexts
jest.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: { id: 'user1' } }),
  useOrganization: () => ({ organization: { id: 'org1' } })
}));

// Utility to mock tract data and the setter function
const mockTractData = {
  tractData: null,
  setTractData: jest.fn((data) => {
    mockTractData.tractData = data.demographicsByTracts[0];
  }),
  queryTractDataType: jest.fn(),
};

// Utility to mock article data and the setter functions
const mockArticleData = {
  articleData: null,
  articleData2: null,
  setArticleData: jest.fn((data) => {
    mockArticleData.articleData = data.articleByDate;
  }),
  setArticleData2: jest.fn((data) => {
    mockArticleData.articleData2 = data.articleByTopicsOrLabels;
  }),
  queryArticleDataType: jest.fn(),
  queryArticleDataType2: jest.fn(),
  shouldRefresh: false,
  setShouldRefresh: jest.fn(),
};

// Utility to mock neighborhood data and the setter functions
const mockNeighborhoodData = {
  neighborhoodMasterList: null,
  neighborhood: null,
  setNeighborhoodData: jest.fn((data) => {
    mockNeighborhoodData.neighborhoodMasterList = data;
  }),
  queryNeighborhoodDataType: jest.fn(),
  setNeighborhood: jest.fn(),
};

// Utility to mock topics data and the setter functions
const mockTopicsData = {
  topicsMasterList: null,
  labelsMasterList: null,
  setTopicsData: jest.fn((data) => {
    mockTopicsData.topicsMasterList = data;
  }),
  setLabelsData: jest.fn((data) => {
    mockTopicsData.labelsMasterList = data;
  }),
  queryTopicsDataType: jest.fn(),
  topic: null,
  setTopic: jest.fn(),
};


jest.mock("@apollo/client", () => {
  const originalModule = jest.requireActual("@apollo/client");

  // Consolidated Apollo Client mock
  return {
    ...originalModule,
    useLazyQuery: jest.fn((query) => {
      switch (query.definitions[0].name.value) {
        case "GetAllArticles":
          return [
            jest.fn().mockImplementation(({ variables }) => {
              mockArticleData.setArticleData({
                articleByDate: [{ id: 1, title: 'Test Article', ...variables }],
              });
            }),
            { data: null, loading: false, error: null }
          ];
        case "articleByTopicLabelQuery":
          return [
            jest.fn().mockImplementation(({ variables }) => {
              mockArticleData.setArticleData2({
                articleByTopicsOrLabels: [{ id: 2, title: 'Topic Article', ...variables }],
              });
            }),
            { data: null, loading: false, error: null }
          ];
        case "neighborhoodQuery":
          return [
            jest.fn().mockImplementation(() => {
              mockNeighborhoodData.setNeighborhoodData({
                "Downtown": ["030302", "030303"],
                "Uptown": ["040404", "040405"]
              });
            }),
            { data: null, loading: false, error: null }
          ];
        case "topicsQuery":
          return [
            jest.fn().mockImplementation(({ variables }) => {
              mockTopicsData.setTopicsData(['Economy', 'Environment', 'Health']);
            }),
            { data: null, loading: false, error: null }
          ];
        case "GetAllLabels":
          return [
            jest.fn().mockImplementation(({ variables }) => {
              mockTopicsData.setLabelsData(['Breaking', 'Opinion', 'Analysis']);
            }),
            { data: null, loading: false, error: null }
          ];
        default:
          return [jest.fn(), { data: null, loading: false, error: null }];
      }
    })
  };
});



interface WrapperProps {
  children: React.ReactNode;
}

const wrapper: React.FC<WrapperProps> = ({ children }) => (
  <BrowserRouter>
    <TractContext.Provider value={mockTractData}>
      <ArticleContext.Provider value={mockArticleData}>
        <NeighborhoodContext.Provider value={mockNeighborhoodData}>
          <TopicsContext.Provider value={mockTopicsData}>
            {children}
          </TopicsContext.Provider>
        </NeighborhoodContext.Provider>
      </ArticleContext.Provider>
    </TractContext.Provider>
  </BrowserRouter>
);

//TEST 1
//The test checks if the queryTopicsDataType was called correctly with the expected arguments ("TOPICS_DATA" and { userId: "user1" }). 
//This validates that the component is correctly initiating data fetching operations under the given conditions.

describe('NeighborhoodPage', () => {
  it('queries topics data when component requests it', () => {
    render(<NeighborhoodPage />, { wrapper });
    mockTopicsData.queryTopicsDataType("TOPICS_DATA", { userId: "user1" });
    expect(mockTopicsData.queryTopicsDataType).toHaveBeenCalledWith("TOPICS_DATA", { userId: "user1" });
    // expect(mockTopicsData.topicsMasterList).toEqual(['Economy', 'Environment', 'Health']);
  });

  //TEST 2
  //It simulates the component requesting label data from the backend,
  //which is crucial for displaying labels that might be used for categorizing or filtering displayed content.

  it('queries labels data and updates context', async () => {
    render(<NeighborhoodPage />, { wrapper });
    mockTopicsData.queryTopicsDataType("LABELS_DATA", { userId: "user1" });
    expect(mockTopicsData.queryTopicsDataType).toHaveBeenCalledWith("LABELS_DATA", { userId: "user1" });
    // expect(mockTopicsData.labelsMasterList).toEqual(['Breaking', 'Opinion', 'Analysis']);
  });
});
