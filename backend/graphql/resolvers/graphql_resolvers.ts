import {
	INeighborhoods,
	TractsByNeighborhoodArgs,
	ITracts,
	IArticles,
  ILocations,
	DemographicsByTractsArgs,
} from "../types/types";
import { Collection } from "mongodb";
import { authMiddleware } from "../../authMiddleware.js";
import axios from "axios";
import { error } from "console";
const proxy_Url = process.env.REACT_APP_ML_PIP_URL || "";
import FormData from 'form-data';
import {createWriteStream} from 'fs';
import { GraphQLUpload } from "graphql-upload-minimal";
import { GraphQLScalarType, GraphQLError} from 'graphql';
import { FileUpload } from 'graphql-upload-minimal';
import path from 'path';
import { gql } from "@apollo/client";
import { Readable } from 'stream';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
const UPLOAD_STATUS_UPDATED = 'UPLOAD_STATUS_UPDATED';




// helper function to check if a string is a number
function isNumber(str: any) {
	return !isNaN(str);
}

// Define the type for the arguments object
interface UploadCSVArgs {
  file: Promise<FileUpload>; // `file` should be a promise that resolves to a FileUpload type
  userId: string;
}
// Helper function to simulate delayed progress
const simulateProgressUpdate = (userId, filename, progress) => {
  pubsub.publish("UPLOAD_PROGRESS", {
    uploadProgress: { userId, filename, progress, status: "Uploading" },
  });
};

// const getLastTenUploads = async (userId, db) => {
//   const uploadData = db.collection("uploads");
//   return await uploadData
//     .find({ userId })
//     .sort({ timestamp: -1 })
//     .limit(10)
//     .map(upload => ({ ...upload, article_cnt: upload.article_cnt || 0 })) // Set default value to 0 if null
//     .toArray();

    
// };

export const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    uploadCSV: async (_, { file, userId }, { db }) => {
      try {
        const upload = await file; // Resolve the file promise to get the Upload object
        if (!upload) {
          throw new Error("No file uploaded");
        }

        const { createReadStream, filename, mimetype } = upload;
        if (!createReadStream) {
          throw new Error("Invalid file upload. `createReadStream` is not defined.");
        }

        console.log(`Uploading file: ${filename} (Type: ${mimetype}) for user: ${userId}`);

        // Step 1: Buffer the file to calculate size
        const stream = createReadStream();
        const chunks = [];
        let fileSize = 0;

        for await (const chunk of stream) {
          chunks.push(chunk);
          fileSize += chunk.length;
        }

        const fileBuffer = Buffer.concat(chunks); // File is now fully buffered
        const fileSizeKB = (fileSize / 1024).toFixed(1);
        console.log(`File size: ${fileSizeKB} KB`);

        // Step 2: Create a new stream from the buffer for uploading
        const uploadStream = Readable.from(fileBuffer);
        const formData = new FormData();
        formData.append("file", uploadStream, { filename });
        formData.append("user_id", userId);

        // Step 3: Upload with progress updates
        const response = await axios.post(proxy_Url, formData, {
          headers: {
            ...formData.getHeaders(),
            "X-API-KEY": "beri-stronk-key",
          },
          onUploadProgress: function (progressEvent) {
            const progress = Math.min(
              Math.round((progressEvent.loaded / fileSize) * 100),
              100
            );

            // Emit progress update for the client
            simulateProgressUpdate(userId, filename, progress);

            console.log(`Upload Progress: ${progress}%`);
          },
        });

        // Handle API response
        if (response.status === 200) {
          console.log("File uploaded successfully to external API.");

          // Publish completion message
          pubsub.publish("UPLOAD_PROGRESS", {
            uploadProgress: {
              userId,
              filename,
              progress: 100,
              status: "Upload complete!",
            },
          });

          const uploadData = db.collection("uploads");
          // const result = await uploadData.insertOne({
          //   userId,
          //   filename,
          //   timestamp: new Date(),
          //   status: "Success",
          //   size: fileSizeKB, 
          // });

          await db.collection("uploads").watch().on('change', (change) => {
            const updatedUpload = change.fullDocument;
            pubsub.publish(UPLOAD_STATUS_UPDATED, {
              uploadStatusUpdated: updatedUpload,
            });
          });

          return { filename, status: "Success" };
        } else {
          throw new GraphQLError("Failed to upload CSV.");
        }
      } catch (error) {
        console.error("Error uploading CSV:", error);
        throw new GraphQLError("Error uploading CSV.");
      }
    },

    addRssFeed: async (_, { url, userID }, { db, req, res }) => {
      await authMiddleware(req, res, () => {});
    
      const decodedToken = JSON.parse(req.headers.user as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }
    
      if (decodedToken.sub !== userID) {
        throw new Error('Forbidden');
      }
    
      const rss_data = db.collection("rss_links");
    
      // Create or update the RSS feed for the given userID
      const filter = { userID: userID };
      const update = {
        $set: { url: url, userID: userID },
      };
      const options = {
        upsert: true, // create a new document if no document matches the filter
        returnDocument: "after", // return the modified document
      };
    
      const result = await rss_data.findOneAndUpdate(filter, update, options);
  
      return result.value;
      },
    },

  Subscription: {
    uploadProgress: {
      subscribe: (_, { userId }) => pubsub.asyncIterator("UPLOAD_PROGRESS"),
    },
    uploadStatusUpdated: {
      subscribe: () => pubsub.asyncIterator([UPLOAD_STATUS_UPDATED]),
    },
  },

  Query: {
    // RSS Resolver
    getRssLinkByUserId: async (_, args, { db, req, res }) => {
      await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const rss_data = db.collection("rss_links");
      const queryResult = await rss_data.find({ userID: args.userID }).toArray();
      return queryResult;
    },
      lastTenUploads: async (_, { userId }, { db }) => {
        const uploads = await db.collection("uploads")
          .find({ userID: userId })
          .sort({ timestamp: -1 })
          .limit(10)
          .toArray();
  
        return uploads.map(upload => ({
          ...upload,
          uploadID: upload.uploadID  
        }));
    },
    // CSV Upload Resolver
    getUploadByUserId: async (_, args, { db, req, res }) => {
      await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const upload_data = db.collection("uploads");
      const queryResult = await upload_data.find({ userID: args.userID }).toArray();
      return queryResult;
    },
    // Topic Resolvers
    getAllTopics: async (_, args, { db, req, res }): Promise<String[]> => {
      await authMiddleware(req, res, () => {});
      

      const userHeader = req.headers.user;
    
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const articles_data = db.collection("articles_data");
      const topics: string[] = await articles_data.distinct("position_section", { userID: args.userID });
      return topics;
    },
    getAllLabels: async (_, args, { db, req, res }): Promise<String[]> => {
       await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const topic_data = db.collection("articles_data");

      const topics = await topic_data
        .aggregate([
          {
            $match: { userID: args.userID }, // Filters documents based on userID
          },
          {
            $unwind: "$openai_labels", // Deconstructs the `openai_labels` array
          },
          {
            $group: {
              _id: null, // Groups all documents together (null means no grouping)
              unique_labels: { $addToSet: "$openai_labels" }, // Creates a set of unique labels
            },
          },
        ])
        .toArray();

      return topics[0].unique_labels;
    },
    // Tract Resolvers
    demographicsByTracts: async (_, args: DemographicsByTractsArgs, { db, req, res }): Promise<ITracts[]> => {
       await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const tracts_data: Collection<ITracts> = db.collection("tracts_data");

      const queryResult: ITracts[] = await tracts_data
        .find({
          tract: args.tract,
        })
        .toArray();
      if (queryResult.length === 0) {
        const noDataTract: ITracts = {
          county_name: "",
          tract: args.tract,
          geoid_tract: "",
          neighborhood: "",
          demographics: null,
          articles: null,
        };
        return [noDataTract];
      }

      return queryResult;
    },
    // Neighborhood Resolvers
    tractsByNeighborhood: async (_, args: TractsByNeighborhoodArgs, { db, req, res }): Promise<INeighborhoods[]> => {
       await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const neighborhood_data: Collection<INeighborhoods> = db.collection("neighborhood_data");

      const queryResult: INeighborhoods[] = await neighborhood_data
        .find({
          value: args.neighborhood,
        })
        .toArray();

      return queryResult;
    },
    getAllNeighborhoods: async (_, __, { db, req, res }): Promise<INeighborhoods[]> => {
       await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const neighborhood_data: Collection<INeighborhoods> = db.collection("neighborhood_data");
      const neighborhoods: INeighborhoods[] = await neighborhood_data.find({}).toArray();
      return neighborhoods;
    },
    // Article Resolvers
    articleByDate: async (_, args, { db, req, res }): Promise<IArticles[]> => {
       await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const articles_data = db.collection("articles_data");

      if (isNumber(args.area)) {
        const queryResult = await articles_data
          .find({
            dateSum: {
              $gte: args.dateFrom,
              $lte: args.dateTo,
            },
            tracts: args.area,
            userID: args.userID,
          })
          .toArray();

        return queryResult;
      } else if (args.area === "all") {
        const queryResult = await articles_data
          .find({
            dateSum: {
              $gte: args.dateFrom,
              $lte: args.dateTo,
            },
            userID: args.userID,
          })
          .toArray();

        return queryResult;
      } else {
        const queryResult = await articles_data
          .find({
            dateSum: {
              $gte: args.dateFrom,
              $lte: args.dateTo,
            },
            neighborhoods: args.area,
            userID: args.userID,
          })
          .toArray();

        return queryResult;
      }
    },

    orgArticlesPastWeek: async (_, args, { db, req, res }): Promise<IArticles[]> => {
      await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const articles_data = db.collection("articles_data");
      const today = new Date();
      var querydate = new Date(today);
      querydate.setDate(today.getDate() - 7);

      const todaydate = Number(today.toISOString().split("T")[0].split("-").join(""));
      const sevendays = Number(querydate.toISOString().split("T")[0].split("-").join(""));
      const queryResult = await articles_data
        .find({
          dateSum: {
            $gte: sevendays,
            $lte: todaydate,
          },
          userID: args.userID,
        })
        .toArray();

      return queryResult;
    },

    articleByTopicsOrLabels: async (_, args, { db, req, res }): Promise<IArticles[]> => {
      await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const articles_data = db.collection("articles_data");

      if (isNumber(args.area)) {
        const queryResult = await articles_data
          .find({
            dateSum: {
              $gte: args.dateFrom,
              $lte: args.dateTo,
            },
            userID: args.userID,
            tracts: args.area,
            $or: [
              { openai_labels: { $in: [args.labelOrTopic] } },
              {
                position_section: {
                  $regex: args.labelOrTopic,
                  $options: "i",
                },
              },
            ],
          })
          .toArray();

        return queryResult;
      } else if (args.area === "all") {
        const queryResult = await articles_data
          .find({
            dateSum: {
              $gte: args.dateFrom,
              $lte: args.dateTo,
            },
            userID: args.userID,
            $or: [
              { openai_labels: { $in: [args.labelOrTopic] } },
              {
                position_section: {
                  $regex: args.labelOrTopic,
                  $options: "i",
                },
              },
            ],
          })
          .toArray();

        return queryResult;
      } else {
        const queryResult = await articles_data
          .find({
            dateSum: {
              $gte: args.dateFrom,
              $lte: args.dateTo,
            },
            userID: args.userID,
            neighborhoods: args.area,
            $or: [
              { openai_labels: { $in: [args.labelOrTopic] } },
              {
                position_section: {
                  $regex: args.labelOrTopic,
                  $options: "i",
                },
              },
            ],
          })
          .toArray();

        return queryResult;
      }
    },
    getAllArticles: async (_, __, { db, req, res }): Promise<IArticles[]> => {
       await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const article_data: Collection<IArticles> = db.collection("articles_data");
      const articles: IArticles[] = await article_data.find({}).toArray();
      return articles;
    },
    getArticlesByOrg: async (_, args, { db, req, res }): Promise<IArticles[]> => {
      await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }

      const article_data: Collection<IArticles> = db.collection("articles_data");
      const articles: IArticles[] = await article_data.find({ userID: args.userID }).toArray();
      return articles;
    },
    // Location Resolvers
    getAllLocations: async (_, __, { db, req, res }): Promise<ILocations[]> => {
       await authMiddleware(req, res, () => {});

      const userHeader = req.headers.user;
      if (!userHeader) {
        throw new Error('Unauthorized');
      }

      const decodedToken = JSON.parse(userHeader as string);
      if (!decodedToken) {
        throw new Error('Unauthorized');
      }
      try {
        const location_data: Collection<ILocations> = db.collection("locations_data");
        const locations: ILocations[] = await location_data.find({}).toArray();
        return locations;
      } catch (error) {
        console.log(error);
      } 
    }
  },
};