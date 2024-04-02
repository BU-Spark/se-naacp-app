import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
// import CsvUploadComponent from '../../components/Upload/CSVUpload';
import "./CSVUploadPage.css";
import { UploadContext } from "../../contexts/upload_context";
import { Uploads } from "../../__generated__/graphql";
import { useOrganization, useUser, useAuth } from "@clerk/clerk-react";

// Define a type for the file with progress information
type UploadedFile = {
	name: string;
	size: number;
	progress: number;
	status: string;
	error?: string; // fail to pass test
	file: File; // store a reference to the File object
};

const CSVUploadBox = () => {
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
	const {has} = useAuth();
	const canManageSettings = has ? has({ permission: "org:test:limit" }) : false;

	useEffect(() => {
		if (isSignedIn && user) {
			if (organization) {
				queryUploadDataType("UPLOAD_DATA", {
					userId: organization.id,
				});
			} else {
				queryUploadDataType("UPLOAD_DATA", {
					userId: user.id,
				});
			}
		}

		if (submittedFiles.length > 0) {
			// Warning to users before closing tab or refreshing
			const handleBeforeUnload = (e: any) => {
				e.preventDefault();
				// The message becomes the chrome/firefox default. Do not support safari.
				e.returnValue = 'Are you sure you want to leave? The request is still processing.';
				return 'Are you sure you want to leave? The request is still processing.';
			};
		
			// Add event listener for beforeunload
			window.addEventListener('beforeunload', handleBeforeUnload);
		
			// Clean up
			return () => {
				window.removeEventListener('beforeunload', handleBeforeUnload);
			};
		};
		
	}, []);

	useEffect(() => {
		if (uploadData) {
			setUpload(uploadData);
			console.log(uploadData);
		}
	}, [uploadData]);

	useEffect(() => {
		const files = validatedFiles.map((f) => f.file);
		setUpsubmittedFiles(files);
	}, [validatedFiles]);

	// set up cors proxy for POST csv to api
	const corsProxy = "https://corsproxy.io/?";
	const url = "https://dummy-server-toswle5frq-uc.a.run.app/upload_csv";
	// const proxy_Url = corsProxy + url;
	const proxy_Url = process.env.REACT_APP_ML_PIP_URL || "";

	// click RSS button -> RSS page
	let navigate = useNavigate();
	const gotoRSS = () => {
		navigate("/Upload/:RSS");
	};

	// only check missing headers and data, not extra headers or duplicate headers
	const validateCsvHeaders = (
		file: File,
		callback: (missingHeaders: string[], missingDataWarnings: string[]) => void,
	) => {
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			const text = e.target?.result as string;
			//for lines we want this regex for the HTLM data on 'content' header
			const lines = text.split(/\r?\n/).map(line => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
			const expectedHeaders = [
				"Title",
				"Author",
				"Category",
				"Article ID",
				"URL Link",
				"Publication Date",
				"Content",
			];
	
			const headers = lines[0];
			const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
	
			let missingDataWarnings: string[] = [];
	
			lines.slice(1).forEach((row, rowIndex) => {
				expectedHeaders.forEach((header, headerIndex) => {
					// check for missing data if the column exists in the row
					if (headerIndex < row.length) {
						const cell = row[headerIndex];
						if (cell.trim() === '') {
							missingDataWarnings.push(`Article ${rowIndex + 1} is missing data in "${header}" column.`);
						}
					} else {
						// if the row has fewer columns than expected show the missing columns
						missingDataWarnings.push(`Article ${rowIndex + 1} is missing data in "${header}" column.`);
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
			if (
				files[i].type === "text/csv" ||
				files[i].name.endsWith(".csv")
			) {
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

	// After upload successful, user can submit file to server.
	const submitFile = () => {
		for (let i = 0; i < submittedFiles.length; i++) {
			const formData = new FormData();
			formData.append("file", submittedFiles[i]);
			if (user && isSignedIn) {
				if (organization) {
					formData.append("user_id", organization.id);
				} else {
					formData.append("user_id", user.id);
				}
			} else {
				console.error("User is not signed in");
			}
			axios
				.post(proxy_Url, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					console.log(response);
					// update the uploaded file status
					setUploadedFiles((currentFiles) =>
						currentFiles.map((f) => {
							if (f.name === submittedFiles[i].name) {
								return { ...f, status: "Submit Successful" };
							}
							return f;
						}),
					);
					setSuccessMessage("Successfully submitted!");
					setTimeout(() => setSuccessMessage(""), 3000);
				})
				.catch((error) => {
					console.error(error);
					setUploadedFiles((currentFiles) =>
						currentFiles.map((f) => {
							if (f.name === submittedFiles[i].name) {
								return {
									...f,
									status: "Submit Failed",
									error: error.toString(),
								};
							}
							return f;
						}),
					);
				});
		}
	};

	// Function that simulates file upload and updates progress
	// Need to change this to real func converting csv into json as input to backend
	const uploadFile = (file: File) => {
		const newFile: UploadedFile = {
			name: file.name,
			size: file.size,
			progress: 0,
			status: "Uploading...",
			file: file,
		};
	
		setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
	
		validateCsvHeaders(file, (missingHeaders, missingDataWarnings) => {
			setUploadedFiles((prevFiles) =>
				prevFiles.map((f) => {
					if (f.name === newFile.name) {
						let updatedFile = { ...f };
	
						if (missingHeaders && missingHeaders.length > 0) {
							updatedFile.status = 'Failed';
							updatedFile.error = `Error: Missing headers ${missingHeaders.join(", ")}.`;
						} else {
							updatedFile.status = 'Passed';
							updatedFile.progress = 100;
	
							if (missingDataWarnings && missingDataWarnings.length > 0) {
								updatedFile.error = `Warning: ${missingDataWarnings.join(", ")}`;
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
					status: missingDataWarnings.length > 0 ? 'Warning' : 'Passed',
					error: missingDataWarnings.length > 0 ? `Warning: ${missingDataWarnings.join(", ")}` : undefined,
				};
				setUpValidatedFiles((prevFiles) => [...prevFiles, newValidatedFile]);
			}
		});
	};

	// Handle file selection
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			Array.from(event.target.files).forEach(uploadFile);
		}
	};

	// Handle file removal
	const handleFileRemoval = (fileName: string) => {
		setUploadedFiles((prevFiles) =>
			prevFiles.filter((file) => file.name != fileName),
		);
		// update the validatedFiles so that X the file will update the submit list.
		setUpValidatedFiles((prevFiles) =>
			prevFiles.filter((file) => file.name != fileName)
		);
	};

	// Handle file submit
	const handleFileSubmit = (files: File[]) => {
		submitFile();
		// clear out uploaded Files, validated files (submitted files listen onto validated files)
		for (let i = 0; i < files.length; i++) {
			setUploadedFiles((prevFiles) =>
				prevFiles.filter((f) => f.name != files[i].name),
			);
			setUpValidatedFiles((prevFiles) =>
				prevFiles.filter((f) => f.name != files[i].name),
			);
		}
		// need some logic to handle file history
	};
	//If the user is does not have access to the upload page
	if (!canManageSettings) { 
		return (
		<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
			<div style={{ textAlign: 'center' }}>
			  <div>You do not have permission to access this page.</div>
			</div>
			<div style={{ textAlign: 'center' }}>
			  <div>Please contact the administrator.</div>
			</div>
		</div>
		);
	}

	return (
		<div>
			<div className='RSS-link'>
				<Button variant='outlined' onClick={gotoRSS}>
					Upload an RSS Link
				</Button>
			</div>
			{successMessage && (
				<div className='success-msg'>{successMessage}</div>
			)}
			{alertMessage && (
				<div className='alert-message'>{alertMessage}</div>
			)}
			<h4 className='csv-title'>Upload a CSV File</h4>
			<div
				className='upload-box'
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
			>
				<input
					type='file'
					id='file-upload'
					accept='.csv'
					style={{ display: "none" }}
					onChange={handleFileChange}
					multiple
				/>
				<label htmlFor='file-upload' className='upload-area'>
					<div className='upload-icon'>
						<img src='/upload-icon.svg' alt='Upload' />
					</div>
					<p className='drag-and-drop-files'>
						<span className='drag-drop-text-wrapper'>
							Drag and drop files, or{" "}
						</span>
						<span className='drag-drop-text-wrapper'>
							Browse files
						</span>
					</p>
					<div className='drag-drop-text-wrapper'>
						Only support CSV files
					</div>
				</label>
			</div>
			<h4 className='file-list-title'>Uploaded Files</h4>
			<div className='uploaded-files-wrapper'>
				<div className='uploaded-files-list'>
					<div className='uploaded-files-box'>
						<div className='files-list-header'>
							<span>FILE NAME</span>
							<span>SIZE</span>
							<span>VALIDATION STATUS</span>
							<span>ACTIONS</span>
						</div>
						{uploadedFiles.map((file, index) => (
							<div key={index} className='file-upload-status'>
								{/* File Name Column */}
								<div className='file-name'>
									<span>{file.name}</span>
								</div>

								{/* File Size Column */}
								<div className='file-size'>
									<span>
										{(file.size / (1024 * 1024)).toFixed(1)}{" "}
										MB
									</span>
								</div>

								{/* Upload Status Column */}
								<div className='file-upload-progress-wrapper'>
									<div className='file-status'>
										{file.status}
									</div>
								{file.error && (
									<div className='error-message'>
										{file.error}
									</div>
								)}
								</div>
								{/* Action Column */}
								<div className='file-actions'>
									{(file.status === "Passed" ||
										file.error) && (
										<Button
										variant="outlined"
										color="error"
										size="small"
										onClick={() =>
											handleFileRemoval(file.name)
										}
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
			<div className='submit-button'>
				<Button
					variant='contained'
					color='primary'
					onClick={() => handleFileSubmit(submittedFiles)}
				>
					Submit
				</Button>
			</div>
			<h4 className='file-list-title'>Latest Upload History</h4>
			<div className='uploaded-files-wrapper'>
				<div className='uploaded-files-list'>
					<div className='uploaded-files-box'>
						<div className='files-list-header'>
							<span>UPLOAD ID</span>
							<span>TIME STAMP</span>
							<span>ARTICLE COUNT</span>
							<span>HTTP STATUS</span>
						</div>
						{uploads.map((file, index) => (
							<div key={index} className='file-upload-status'>
								{/* Upload ID Column */}
								<div className='file-uploadId'>
									<span>{file.uploadID}</span>
								</div>

								{/* Time Stamp Column */}
								<div className='file-timeStamp'>
									<span>
										{new Date(
											file.timestamp,
										).toLocaleString()}
									</span>
								</div>

								{/* Article cnt Column */}
								<div className='file-articleCnt'>
									<span>
										{file.article_cnt === -1
											? 0
											: file.article_cnt}
									</span>
								</div>

								{/* http status Column */}
								<div className='file-httpStatus'>
									<span>{file.status}</span>
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
