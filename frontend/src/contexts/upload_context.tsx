import React, { useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Uploads } from "../__generated__/graphql";

type UploadContextType = {
  uploadData: Uploads[] | null;
  queryUploadDataType: (queryType: any, options?: any) => void;
  addRssFeed: (url: string, userID: string) => void;
  uploadCSV: (file: File, userID: string) => void;
};

const UPLOAD_DATA_QUERY = gql`
  query GetUploadByUserId($userId: String!) {
    getUploadByUserId(user_id: $userId) {
      uploadID
      status
      timestamp
      userID
    }
  }
`;

export const GET_UPLOAD_PROGRESS = gql`
    query GetUploadProgress($userId: String!) {
        uploadProgress(userId: $userId) {
            progress
            status
        }
    }
`;

export const UPLOAD_CSV_MUTATION = gql`
mutation UploadCSV($file: Upload!, $userId: String!) {
  uploadCSV(file: $file, userId: $userId) {
    filename
    status
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

  const [uploadCSVMutation, { loading: uploadingCSV, error: uploadCSVError }] = useMutation(UPLOAD_CSV_MUTATION);

  const { data: uploadData, loading: uploadDataLoading, error: uploadDataError } = useQuery(UPLOAD_DATA_QUERY, {
    variables: { userId: "user-id-placeholder" }, // Replace with dynamic user ID as needed
    fetchPolicy: "network-only", // Ensures data is fresh on each load
  });

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

  const uploadCSV = (file: File, userID: string) => {
    uploadCSVMutation({ variables: { file, userID } })
      .then((response) => {
        console.log("CSV file uploaded successfully");
      })
      .catch((err) => {
        console.error("CSV upload failed", err);
      });
  };

  const queryUploadDataType = (queryType: "UPLOAD_DATA", options?: any) => {
    // No longer needed as useQuery will handle loading on component mount
  };

  return (
    <UploadContext.Provider
      value={{ uploadData: uploads, queryUploadDataType, addRssFeed, uploadCSV }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export default UploadProvider;
