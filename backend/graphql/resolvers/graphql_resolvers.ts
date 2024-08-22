import {
	INeighborhoods,
	TractsByNeighborhoodArgs,
	ITracts,
	IArticles,
	DemographicsByTractsArgs,
} from "../types/types";
import { Collection } from "mongodb";
import { authMiddleware } from "../../authMiddleware.js";

// helper function to check if a string is a number
function isNumber(str: any) {
	return !isNaN(str);
}

export const resolvers = {
	Mutation: {
	  addRssFeed: async (_, { url, userID }, { db, req, res }) => {
		// await authMiddleware(req, res, () => {});
  
		// const decodedToken = JSON.parse(req.headers.user as string);
		// if (!decodedToken) {
		//   throw new Error('Unauthorized');
		// }
  
		// if (decodedToken.sub !== userID) {
		//   throw new Error('Forbidden');
		// }
  
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
  Query: {
    // RSS Resolver
    getRssLinkByUserId: async (_, args, { db, req, res }) => {
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

      const rss_data = db.collection("rss_links");
      const queryResult = await rss_data.find({ userID: args.user_id }).toArray();
      return queryResult;
    },
    // CSV Upload Resolver
    getUploadByUserId: async (_, args, { db, req, res }) => {
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

      const upload_data = db.collection("uploads");
      const queryResult = await upload_data.find({ userID: args.user_id }).toArray();
      return queryResult;
    },
    // Topic Resolvers
    getAllTopics: async (_, args, { db, req, res }): Promise<String[]> => {
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

      const articles_data = db.collection("articles_data");
      const topics: string[] = await articles_data.distinct("position_section", { userID: args.userID });
      return topics;
    },
    getAllLabels: async (_, args, { db, req, res }): Promise<String[]> => {
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

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
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

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
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

      const neighborhood_data: Collection<INeighborhoods> = db.collection("neighborhood_data");

      const queryResult: INeighborhoods[] = await neighborhood_data
        .find({
          value: args.neighborhood,
        })
        .toArray();

      return queryResult;
    },
    getAllNeighborhoods: async (_, __, { db, req, res }): Promise<INeighborhoods[]> => {
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

      const neighborhood_data: Collection<INeighborhoods> = db.collection("neighborhood_data");
      const neighborhoods: INeighborhoods[] = await neighborhood_data.find({}).toArray();
      return neighborhoods;
    },
    // Article Resolvers
    articleByDate: async (_, args, { db, req, res }): Promise<IArticles[]> => {
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

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
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

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
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

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
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

      const article_data: Collection<IArticles> = db.collection("articles_data");
      const articles: IArticles[] = await article_data.find({}).toArray();
      return articles;
    },
    getArticlesByOrg: async (_, args, { db, req, res }): Promise<IArticles[]> => {
      // // await authMiddleware(req, res, () => {});

      // const userHeader = req.headers.user;
      // if (!userHeader) {
      //   throw new Error('Unauthorized');
      // }

      // const decodedToken = JSON.parse(userHeader as string);
      // if (!decodedToken) {
      //   throw new Error('Unauthorized');
      // }

      const article_data: Collection<IArticles> = db.collection("articles_data");
      const articles: IArticles[] = await article_data.find({ userID: args.userID }).toArray();
      return articles;
    },
  },
};
