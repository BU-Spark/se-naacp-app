import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import "./CSVUploadPage.css";
import {
  UploadContext,
  UPLOAD_CSV_MUTATION,
} from "../../contexts/upload_context";
import { Uploads } from "../../__generated__/graphql";
import { useOrganization, useUser, useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery } from "@apollo/client";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { gql, useSubscription } from "@apollo/client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LinearProgress from "@mui/material/LinearProgress";

const UPLOAD_PROGRESS_SUBSCRIPTION = gql`
  subscription uploadProgress($userId: String!) {
    uploadProgress(userId: $userId) {
      filename
      progress
      status
    }
  }
`;

const LAST_TEN_UPLOADS_QUERY = gql`
  query lastTenUploads($userId: String!) {
    lastTenUploads(userId: $userId) {
      uploadID
      article_cnt
      filename
      message
      status
      timestamp
      userID
    }
  }
`;


// Define a type for the file with progress information
type UploadedFile = {
  name: string;
  size: number;
  progress: number;
  status: string;
  error?: string; // fail to pass test
  file: File; // store a reference to the File object
};

export const CSVUploadBox = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [validatedFiles, setUpValidatedFiles] = useState<UploadedFile[]>([]);
  // This file list is mapped from validated Files' reference to file object.
  const [submittedFiles, setUpsubmittedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { queryUploadDataType, uploadData } = useContext(UploadContext)!;
  const [uploads, setUpload] = useState<Uploads[]>([]);
  const { user, isSignedIn } = useUser();
  const { organization } = useOrganization();

  //permission check for uploading CSVs
  const { has } = useAuth();
  const canManageSettings = has ? has({ permission: "org:test:limit" }) : false;

  //new pop up window for the guide
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // GraphQL Hooks
  const {
    data,
    loading,
    error,
    refetch: refetchLastTenUploads,
  } = useQuery(LAST_TEN_UPLOADS_QUERY, {
    variables: { userId: organization?.id || user?.id },
    skip: !isSignedIn,
    onCompleted: (data) => {
      setUpload(data?.lastTenUploads || []);
    },
  });

  useSubscription(UPLOAD_PROGRESS_SUBSCRIPTION, {
    variables: { userId: organization?.id || user?.id },
    skip: !isSignedIn,
    onSubscriptionData: ({ subscriptionData }) => {
      const uploadProgress = subscriptionData.data?.uploadProgress;

      if (uploadProgress) {
        const { filename, progress, status } = uploadProgress;
        setUploadedFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.name === filename
              ? { ...file, progress, status: status || file.status }
              : file
          )
        );
      } else {
        console.warn("No data received in uploadProgress subscription.");
      }
    },
  });

  const [uploadCSV] = useMutation(UPLOAD_CSV_MUTATION, {
    onError: (error) =>
      console.error("Error during CSV upload mutation:", error),
  });

  // Effects
  useEffect(() => {
    if (uploadData) {
      setUpload(uploadData);
    }
  }, [uploadData]);

  useEffect(() => {
    if (validatedFiles.length > 0) {
      setUpsubmittedFiles(validatedFiles.map((f) => f.file));
    }
  }, [validatedFiles]);

  useEffect(() => {
    if (isSignedIn && user) {
      const userId = organization?.id || user.id;
      queryUploadDataType("UPLOAD_DATA", { userId });
    }
  }, [isSignedIn, user, organization, queryUploadDataType]);

  useEffect(() => {
    if (submittedFiles.length > 0) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? The request is still processing.";
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [submittedFiles]);

  const extractProgress = (message: any) => {
    const match = message?.match(/\[(\d+\/\d+)\]/);
    return match ? match[0] : "[0/0]";
  };

  // click RSS button -> RSS page
  let navigate = useNavigate();
  const gotoRSS = () => {
    navigate("/Upload/:RSS");
  };

  // only check missing headers and data, not extra headers or duplicate headers
  const validateCsvHeaders = (
    file: File,
    callback: (missingHeaders: string[], missingDataWarnings: string[]) => void
  ) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      //for lines we want this regex for the HTLM data on 'content' header
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
      const expectedHeaders = [
        "Headline",
        "Publisher",
        "Byline",
        "Paths",
        "Publish Date",
        "Body",
      ];

      const headers = lines[0];
      const missingHeaders = expectedHeaders.filter(
        (header) => !headers.includes(header)
      );

      let missingDataWarnings: string[] = [];

      lines.slice(1).forEach((row, rowIndex) => {
        expectedHeaders.forEach((header, headerIndex) => {
          // check for missing data if the column exists in the row
          if (headerIndex < row.length) {
            const cell = row[headerIndex];
            if (cell.trim() === "") {
              missingDataWarnings.push(
                `Article ${rowIndex + 1} is missing data in "${header}" column.`
              );
            }
          }
        });
      });

      callback(missingHeaders, missingDataWarnings);
    };
    reader.readAsText(file);
  };

  // Drag and drop event handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true); // Update the state to change the appearance of the box
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // handle styling changes here
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false); // Revert the drag over state
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false); // Revert the drag over state
    const files = event.dataTransfer.files;
    let isCSV = true;
    // Process all the dropped files.
    for (let i = 0; i < files.length; i++) {
      // Check file MIME type to see if it's csv
      if (files[i].type === "text/csv" || files[i].name.endsWith(".csv")) {
        uploadFile(files[i]);
      } else {
        isCSV = false;
        break; // Break the loop if non-CSV file
      }
    }

    if (!isCSV) {
      setAlertMessage("Only CSV files are accepted.");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };
  console.log("about to submit a file");

  // const [uploadCSV] = useMutation(UPLOAD_CSV_MUTATION, {
  // 	onError: (error) => {
  // 	  console.error("Error during CSV upload mutation:", error);
  // 	},
  //   });

  const submitFile = () => {
    for (let i = 0; i < submittedFiles.length; i++) {
      const file = submittedFiles[i];

      if (user && isSignedIn) {
        const variables = {
          file,
          userId: organization ? organization.id : user.id,
        };

        setUploadedFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.name === file.name
              ? { ...f, progress: 10, status: "Uploading..." }
              : f
          )
        );

        const reader = new FileReader();
        reader.onload = () => {
          uploadCSV({ variables })
            .then((response) => {
              if (response.data?.uploadCSV?.status === "Success") {
                let progress = 10;
                const interval = setInterval(() => {
                  progress += 15;
                  setUploadedFiles((prevFiles) =>
                    prevFiles.map((f) =>
                      f.name === file.name
                        ? { ...f, progress: Math.min(progress, 100) }
                        : f
                    )
                  );

                  if (progress >= 100) {
                    clearInterval(interval);
                    setUploadedFiles((prevFiles) =>
                      prevFiles.map((f) =>
                        f.name === file.name
                          ? { ...f, progress: 100, status: "Upload complete!" }
                          : f
                      )
                    );

                    setSuccessMessage("File uploaded successfully!");
                    setTimeout(() => {
                      setSuccessMessage("");
                      setUploadedFiles((prevFiles) =>
                        prevFiles.filter((f) => f.name !== file.name)
                      );

                      // Refetch the latest uploads from MongoDB after each successful upload
                      refetchLastTenUploads();
                    }, 3000);
                  }
                }, 500);
              } else {
                throw new Error("Unexpected response");
              }
            })
            .catch((error) => {
              console.error("Error during CSV upload:", error);
              setUploadedFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.name === file.name
                    ? { ...f, progress: 0, status: "Upload failed!" }
                    : f
                )
              );
              setAlertMessage("Failed to upload CSV.");
              setTimeout(() => setAlertMessage(""), 3000);
            });
        };

        reader.readAsText(file);
      } else {
        console.error("User is not signed in");
      }
    }
  };

  // Function that simulates file upload and updates progress
  // Need to change this to real func converting csv into json as input to backend

  const uploadFile = (file: File) => {
    const sizeKB = (file.size / 1024).toFixed(1); // Convert size to KB

    const newFile: UploadedFile = {
      name: file.name,
      size: Number(sizeKB), // Store size in KB directly for easier rendering
      progress: 0,
      status: "Uploading...",
      file: file,
    };

    console.log(`File name: ${file.name}, File size in KB: ${sizeKB}`); // Confirm formatted size here

    setUploadedFiles((prevFiles) => [...prevFiles, newFile]);

    validateCsvHeaders(file, (missingHeaders, missingDataWarnings) => {
      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) => {
          if (f.name === newFile.name) {
            let updatedFile = { ...f };

            if (missingHeaders && missingHeaders.length > 0) {
              updatedFile.status = "Failed";
              updatedFile.error = `Error: Missing headers ${missingHeaders.join(
                ", "
              )}.`;
            } else {
              updatedFile.status = "Passed";
              //updatedFile.progress = 100;

              if (missingDataWarnings && missingDataWarnings.length > 0) {
                updatedFile.error = `Warning: ${missingDataWarnings.join(
                  ", "
                )}`;
              }
            }

            return updatedFile;
          }
          return f;
        })
      );
      // Also update validatedFiles state if needed
      if (!missingHeaders || missingHeaders.length === 0) {
        const newValidatedFile: UploadedFile = {
          ...newFile,
          status: missingDataWarnings.length > 0 ? "Warning" : "Passed",
          error:
            missingDataWarnings.length > 0
              ? `Warning: ${missingDataWarnings.join(", ")}`
              : undefined,
        };
        setUpValidatedFiles((prevFiles) => [...prevFiles, newValidatedFile]);
      }
    });
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileSize = file.size; // Get the file size directly
      console.log(`File size: ${fileSize} bytes`);

      // Call your upload function with the file and its size
      uploadFile(file);
    }
  };

  // Handle file removal
  const handleFileRemoval = (fileName: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name != fileName)
    );
    // update the validatedFiles so that X the file will update the submit list.
    setUpValidatedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name != fileName)
    );
  };

  // Handle file submit
  const handleFileSubmit = (files: File[]) => {
    submitFile();
  };
  //If the user is does not have access to the upload page
  if (!canManageSettings) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div>You do not have permission to access this page.</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div>Please contact the administrator.</div>
        </div>
      </div>
    );
  }

  function parseTimestamp(timestamp: any) {
    // Insert "T" between date and time to make it ISO-compliant
    const isoTimestamp = timestamp.replace(" ", "T");
    return new Date(isoTimestamp + "Z");
  }

  return (
    <div>
      <div className="RSS-link">
        <Button variant="outlined" onClick={gotoRSS}>
          Upload an RSS Link
        </Button>
      </div>
      {successMessage && <div className="success-msg">{successMessage}</div>}
      {alertMessage && <div className="alert-message">{alertMessage}</div>}
      <h4 className="csv-title">
        Upload a CSV File
        <Tooltip title="Click to see uploading guide">
          <HelpIcon
            onClick={handleOpen}
            style={{
              color: "#6495ED",
              position: "relative",
              top: "-2px",
              marginLeft: "5px",
              cursor: "pointer",
            }}
          />
        </Tooltip>
      </h4>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1100,
            height: 700,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 2,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50px", // Adjust based on desired hover area
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "10px",
            }}
            onMouseOver={() => {
              /* Show the back arrow */
            }}
            onMouseOut={() => {
              /* Hide the back arrow */
            }}
          >
            <button
              onClick={handleClose}
              style={{ margin: "20px 0", display: "block" }}
            >
              &#8592; Go Back
            </button>
          </div>
          <div>
            <h2>
              {" "}
              <br /> Required CSV Structure
            </h2>
            <p style={{ color: "black", fontSize: "16px", textAlign: "left" }}>
              Your CSV file must include the following headers in the specified
              order:
            </p>
            <ul>
              <li>
                <strong>Title</strong>
                <ul>
                  <li>Description: The title of the article.</li>
                  <li>
                    Example: 'Miss Scarlet & The Duke' Episode 4 Recap: You
                    Oughta Know
                  </li>
                </ul>
              </li>
              <li>
                <strong>Author</strong>
                <ul>
                  <li>Description: The name of the author.</li>
                  <li>Example: Joshua Eaton</li>
                </ul>
              </li>
              <li>
                <strong>Category</strong>
                <ul>
                  <li>Description: The category of the article.</li>
                  <li>Example: ‘News’, ‘Politics’, ‘Lifestyle’</li>
                </ul>
              </li>
              <li>
                <strong>Article ID</strong>
                <ul>
                  <li>Description: A unique identifier for the article.</li>
                  <li>Example: 00000176-fd72-d4ee-a5fe-fd7747b80001</li>
                </ul>
              </li>
              <li>
                <strong>URL Link (Permalink)</strong>
                <ul>
                  <li>
                    Description: The stable URL where the article can be
                    accessed at any time.
                  </li>
                  <li>
                    Example:
                    /news/national/2021-01-13/rep-ayanna-pressleys-husband-tests-positive-for-covid-19
                  </li>
                </ul>
              </li>
              <li>
                <strong>Publication Date</strong>
                <ul>
                  <li>
                    Description: The date and time when the article was
                    published.
                  </li>
                  <li>Example: Tue Oct 05 15:06:37 EDT 2021</li>
                  <li>
                    Format: Day (Abbreviated), Month (Abbreviated), Day of
                    Month, Time (HH:MM:SS in 24-hour format), Time Zone, Year
                  </li>
                </ul>
              </li>
              <li>
                <strong>Content</strong>
                <ul>
                  <li>
                    Description: The full content of the article, including HTML
                    formatting.
                  </li>
                  <li>
                    Example: If there are two things you can’t spit without
                    hitting in this town <br /> it’s a Dunkin' Donuts and a
                    historic statue.
                    <br />
                    ...
                  </li>
                </ul>
              </li>
            </ul>

            <h2>Example of a Corrected CSV File</h2>
            <br />
            <img
              src="/example.png"
              alt="Example of a Corrected CSV File"
              style={{ width: "800px", height: "auto" }}
            />
            <br />
            <br />
            <h2>FAQ</h2>
            <ol>
              <li>
                <strong>What is Permalink?</strong>
                <p
                  style={{
                    color: "black",
                    fontSize: "16px",
                    textAlign: "left",
                  }}
                >
                  The permalink would be the stable URL where the article can be
                  accessed at any time. This ensures that even if the website
                  updates its content or layout, the article can still be found
                  using the same permalink.
                </p>
              </li>
              <li>
                <strong>What happens when there is a problem?</strong>
                <ol>
                  <li>
                    <strong>Error: If a header is missing</strong>
                    <p
                      style={{
                        color: "black",
                        fontSize: "16px",
                        textAlign: "left",
                      }}
                    >
                      When trying to upload, if a header is missing you will get
                      a clear message about what needs to be fixed. You won’t be
                      able to finish the upload until these issues are fixed.
                    </p>
                    <p
                      style={{
                        color: "black",
                        fontSize: "16px",
                        textAlign: "left",
                      }}
                    >
                      For example, if there is no 'Article ID' header in your
                      CSV file, you’ll see a message like "Error: Missing
                      headers Article ID." and the validation status will be
                      ‘Failed’.
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src="/nohead.png"
                        alt="Description"
                        style={{ width: "300px", height: "auto" }}
                      />
                    </div>
                    <h5>Steps to fix errors:</h5>
                    <ul>
                      <li>
                        <strong>Delete this file:</strong> First, click the
                        ‘Delete’ button next to the file with errors to remove
                        it from the upload queue.
                      </li>
                      <li>
                        <strong>Make the necessary corrections:</strong> Open
                        your CSV file and add the missing ‘Article ID’ header,
                        or correct any other issues mentioned in the error
                        message.
                      </li>
                      <li>
                        <strong>Upload Again:</strong> Save your corrected CSV
                        file and try uploading it once more.
                      </li>
                    </ul>
                    <p
                      style={{
                        color: "black",
                        fontSize: "16px",
                        textAlign: "left",
                      }}
                    >
                      {" "}
                      <br /> If there are no other issues, your file’s status
                      will change to ‘Passed’. This means your file is correctly
                      formatted and has been successfully uploaded.
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src="/passed.png"
                        alt="Description"
                        style={{ width: "250px", height: "auto" }}
                      />
                    </div>
                    <strong>2.2 Warning: If data is missing</strong>
                    <p
                      style={{
                        color: "black",
                        fontSize: "16px",
                        textAlign: "left",
                      }}
                    >
                      {" "}
                      When trying to upload if data in a column is missing, you
                      will get a clear message about what is missing.
                      <br /> <br /> For example, if there is no data in
                      article’s 204 ‘Author’ header in your CSV file, you’ll see
                      a message like "Warning: Article 204 is missing data in
                      the 'Author' column." This message is just a warning,
                      meaning your file can still be uploaded. The validation
                      status will show as ‘Passed’. This means that you have the
                      choice to fix these issues or to proceed with the upload.
                      If the missing data is not critical, you may decide to
                      continue without making changes. Otherwise, you can add
                      the missing information to your CSV file and upload it
                      again.
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src="/nodata.png"
                        alt="Description"
                        style={{ width: "300px", height: "auto" }}
                      />
                    </div>
                    <div>
                      <strong>
                        {" "}
                        <br /> If you face more issues or have questions about
                        the CSV upload process, please contact the
                        administrator.
                      </strong>
                    </div>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </Box>
      </Modal>

      <div
        className="upload-box"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="file-upload"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleFileChange}
          multiple
        />
        <label htmlFor="file-upload" className="upload-area">
          <div className="upload-icon">
            <img src="/upload-icon.svg" alt="Upload" />
          </div>
          <p className="drag-and-drop-files">
            <span
              className="drag-drop-text-wrapper"
              style={{ color: "#6495ED" }}
            >
              Click to upload
            </span>
            <span className="drag-drop-text-wrapper">
              , or Drag and drop files
            </span>
          </p>
          <div className="drag-drop-text-wrapper">Only support CSV files</div>
        </label>
      </div>
      <h4 className="file-list-title">Uploaded Files</h4>
      <div className="uploaded-files-wrapper">
        <div className="uploaded-files-list">
          <div className="uploaded-files-box">
            <div className="files-list-header">
              <span>FILE NAME</span>
              <span>SIZE</span>
              <span>VALIDATION STATUS</span>
              <span>ACTIONS</span>
            </div>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="file-upload-status">
                {/* File Name Column */}
                <div className="file-name">
                  <span>{file.name}</span>
                </div>

                {/* File Size Column */}
                <div className="file-size">
                  <span>{file.size} KB</span>
                </div>

                {/* Validation Status Column */}
                <div className="file-status">{file.status}</div>

                {/* Progress Column */}
                <div className="file-progress">
                  <LinearProgress variant="determinate" value={file.progress} />
                </div>

                {/* Action Column */}
                <div className="file-actions">
                  {(file.status === "Passed" || file.error) && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleFileRemoval(file.name)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="submit-button">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleFileSubmit(submittedFiles)}
        >
          Submit
        </Button>
      </div>
      <h4 className="file-list-title">Latest Upload History</h4>
      <div className="uploaded-files-wrapper">
        <div className="uploaded-files-list">
          <div className="uploaded-files-box">
            <div className="files-list-header">
              <span>FILE NAME</span>
              <span>UPLOAD ID</span>
              <span>TIME STAMP</span>
              <span>ARTICLE COUNT</span>
              <span>HTTP STATUS</span>
            </div>
            {uploads.map((file, index) => (
              <div
                key={index}
                className="file-upload-status"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 20px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {/* File Name Column */}
                <div
                  className="file-name"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <span>{file.filename || "no file name"}</span>
                </div>

                {/* Upload ID Column with Tooltip */}
                <div
                  className="file-uploadId"
                  style={{ flex: 1, position: "relative" }}
                >
                  <span
                    style={{ cursor: "pointer", position: "relative" }}
                    title={file.uploadID}
                  >
                    {file.uploadID.slice(0, 13)}...
                  </span>
                </div>

                {/* Time Stamp Column */}
                <div
                  className="file-timeStamp"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <span>
                    {file.timestamp
                      ? parseTimestamp(file.timestamp).toLocaleString()
                      : "No Timestamp Available"}
                  </span>
                </div>

                {/* Article Count Column */}
                <div
                  className="file-articleCnt"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <span>{file.article_cnt === -1 ? 0 : file.article_cnt}</span>
                </div>

                {/* HTTP Status Column */}
                <div
                  className="file-httpStatus"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <span>
                    {file.status === "PROCESSING"
                      ? `PROCESSING ${extractProgress(file.message)} ARTICLES`
                      : file.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUploadBox;
