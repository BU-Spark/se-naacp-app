import React from "react";
import { useLazyQuery, gql, useMutation } from "@apollo/client";
import { Uploads } from "../__generated__/graphql";

type UploadContextType = {
  uploadData: Uploads[] | null;
  queryUploadDataType: (queryType: any, options?: any) => void;
  addRssFeed: (url: string, userID: string) => void;
};

/* Upload Queries */
// We will pass what we need in here
const UPLOAD_DATA_QUERY = gql`
  query GetUploadByUserId($userId: String!) {
    getUploadByUserId(user_id: $userId) {
      article_cnt
      message
      status
      timestamp
      uploadID
      userID
    }
  }
`;

const ADD_RSS_FEED_MUTATION = gql`
  mutation addRssFeed($url: String!, $userID: String!) {
    addRssFeed(url: $url, userID: $userID) {
      url
      userID
    }
  }
`;

export const UploadContext = React.createContext<UploadContextType | null>(
  null
);

const UploadProvider: React.FC = ({ children }: any) => {
  const [
    addRssFeedMutation,
    { loading: addingRssFeed, error: addRssFeedError },
  ] = useMutation(ADD_RSS_FEED_MUTATION);

  const [
    queryUploadData,
    { data: uploadData, loading: uploadDataLoading, error: uploadDataError },
  ] = useLazyQuery(UPLOAD_DATA_QUERY);
  const [uploads, setUploadData] = React.useState<Uploads[] | null>(null);

  React.useEffect(() => {
    if (uploadData && !uploadDataLoading && !uploadDataError) {
      setUploadData(uploadData.getUploadByUserId);
    }
  }, [uploadData, uploadDataLoading, uploadDataError]);

  const addRssFeed = (url: string, userID: string) => {
    addRssFeedMutation({ variables: { url, userID } })
      .then((response) => {
        console.log("Upload RSS Link success");
      })
      .catch((err) => {
        console.log("ERROR: Upload RSS Link failed");
      });
  };

  const queryUploadDataType = (queryType: "UPLOAD_DATA", options?: any) => {
    switch (queryType) {
      case "UPLOAD_DATA":
        queryUploadData({
          variables: options,
        });
        break;
      default:
        console.log("ERROR: Fetch Upload Data does not have this query Type!");
        break;
    }
  };

  return (
    <UploadContext.Provider
      value={{ uploadData: uploads, queryUploadDataType, addRssFeed }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export default UploadProvider;
