import {
  INeighborhoods,
  TractsByNeighborhoodArgs,
  ITracts,
  IArticles,
  ITopics,
  DemographicsByTractsArgs,
} from "../types/types";
import { Collection } from "mongodb";

//helper function to check if a string is a numebr
function isNumber(str: any) {
  return !isNaN(str);
}

export const resolvers = {
  Query: {
    getUploadByUserId: async(_, args, context) => {
      const { db } = context;
      const upload_data = db.collection("uploads");
      const queryResult = upload_data.find({ userID: args.user_id }).toArray();
      return queryResult;
    },
    // Topic Resolvers
    getAllTopics: async (_, args, context): Promise<String[]> => {
      const { db } = context;
      const articles_data = db.collection("articles_data");
      const topics: string[] = await articles_data.distinct('position_section', {'userID': args.userID });
      return topics;
    },

    getAllLabels: async (_, args, context): Promise<String[]> => {
      const { db } = context;
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
    demographicsByTracts: async (
      _,
      args: DemographicsByTractsArgs,
      context
    ): Promise<ITracts[]> => {
      const { db } = context;
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
    tractsByNeighborhood: async (
      _,
      args: TractsByNeighborhoodArgs,
      context
    ): Promise<INeighborhoods[]> => {
      const { db } = context;
      const neighborhood_data: Collection<INeighborhoods> =
        db.collection("neighborhood_data");

      const queryResult: INeighborhoods[] = await neighborhood_data
        .find({
          value: args.neighborhood,
        })
        .toArray();

      return queryResult;
    },
    getAllNeighborhoods: async (_, __, context): Promise<INeighborhoods[]> => {
      const { db } = context;
      const neighborhood_data: Collection<INeighborhoods> =
        db.collection("neighborhood_data");
      const neighborhoods: INeighborhoods[] = await neighborhood_data
        .find({})
        .toArray();
      return neighborhoods;
    },
    // Article Resolvers
    articleByDate: async (_, args, context): Promise<IArticles[]> => {
      const { db } = context;
      const articles_data = db.collection("articles_data");

      if (isNumber(args.area)) {
        const queryResult = articles_data
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
        const queryResult = articles_data
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
        const queryResult = articles_data
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

    articleByTopicsOrLabels: async (_, args, context): Promise<IArticles[]> => {
      const { db } = context;
      const articles_data = db.collection("articles_data");

      if (isNumber(args.area)) {
        const queryResult = articles_data
          .find({
            userID: args.userID,
            tracts: args.area,
            $or: [
              { openai_labels: { $in: [args.labelOrTopic] } },
              {
                position_section: { $regex: args.labelOrTopic, $options: "i" },
              },
            ],
          })
          .toArray();

        return queryResult;
      } else if (args.area === "all") {
        const queryResult = articles_data
          .find({
            userID: args.userID,
            $or: [
              { openai_labels: { $in: [args.labelOrTopic] } },
              {
                position_section: { $regex: args.labelOrTopic, $options: "i" },
              },
            ],
          })
          .toArray();

        return queryResult;
      } else {
        const queryResult = articles_data
          .find({
            userID: args.userID,
            neighborhoods: args.area,
            $or: [
              { openai_labels: { $in: [args.labelOrTopic] } },
              {
                position_section: { $regex: args.labelOrTopic, $options: "i" },
              },
            ],
          })
          .toArray();

        return queryResult;
      }
    },
    getAllArticles: async (_, __, context): Promise<IArticles[]> => {
      const { db } = context;
      const article_data: Collection<IArticles> =
        db.collection("articles_data");
      const articles: IArticles[] = await article_data.find({}).toArray();
      return articles;
    },
  },
};
