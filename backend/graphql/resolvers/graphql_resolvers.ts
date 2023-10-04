import { INeighborhoods, TractsByNeighborhoodArgs, ITracts, IDemographics, DemographicsByTractsArgs } from "../types/types";
import { Collection } from "mongodb";


//helper function to check if a string is a numebr
function isNumber(str: any) {
  return !isNaN(str);
}

export const resolvers = {
  Query: {
    articleByDate: async (parent, args, context) => {
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
    }
  }
};