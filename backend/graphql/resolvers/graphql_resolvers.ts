import { INeighborhoods, TractsByNeighborhoodArgs, ITracts, IArticles, DemographicsByTractsArgs } from "../types/types";
import { Collection } from "mongodb";


//helper function to check if a string is a numebr
function isNumber(str: any) {
  return !isNaN(str);
}

export const resolvers = {
  Query: {
    articleByDate: async (_, args, context) => {
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
          })
          .toArray();

        return queryResult;
      }
    },
    tractsByNeighborhood: async (_, args: TractsByNeighborhoodArgs, context): Promise<INeighborhoods[]> => {
      const { db } = context;
      const neighborhood_data: Collection<INeighborhoods> = db.collection("neighborhood_data");

      const queryResult: INeighborhoods[] = await neighborhood_data
        .find({
          value: args.neighborhood
        }).toArray();

      return queryResult;
    },
    demographicsByTracts: async (_, args: DemographicsByTractsArgs, context): Promise<ITracts[]> => {
      const { db } = context;
      const tracts_data: Collection<ITracts> = db.collection("tracts_data");

      const queryResult: ITracts[] = await tracts_data
        .find({
          tract: args.tract
        }).toArray();

      return queryResult;
    },
    getAllNeighborhoods: async (_, __, context): Promise<string[]> => {
      const { db } = context;
      const neighborhood_data: Collection<INeighborhoods> = db.collection("neighborhood_data");
      // Fetch all documents and project only the 'value' field
      const neighborhoods: INeighborhoods[] = await neighborhood_data.find({}, { projection: { value: 1, _id: 0 } }).toArray();
      // Map the documents to get only the 'value' (neighborhood name)
      const names: string[] = neighborhoods.map(doc => doc.value);
      return names;
    },
    getAllArticles: async (_, __, context): Promise<IArticles[]> => {
      const { db } = context;
      const article_data: Collection<IArticles> = db.collection("articles_data");
      const articles: IArticles[] = await article_data.find({}).toArray();
      return articles;
    },
    getAllTopics: async (_, __, context): Promise<string[]> => {
      const { db } = context;
      const article_data: Collection<IArticles> = db.collection("articles_data");
      const articles: IArticles[] = await article_data.find({}).toArray();
      const topics: string[] = [...new Set(articles.map(article => article.position_section))];
      return topics;
    }
  }
};