import { MongoClient } from "mongodb";
const url = "mongodb://localhost:27017"; // Local development
const dbName = "se_naacp_gbh";
const client = new MongoClient(url);
export const resolvers = {
    Query: {
        articleByDate: async (parent, args, contex) => {
            await client.connect();
            let db = client.db(dbName);
            const articles_data = db.collection("articles_data");
            const getArticles = articles_data.find({
                dateSum: {
                    $gte: args.dateFrom,
                    $lte: args.dateTo,
                },
                neighborhoods: args.neighborhood,
            }).toArray();
            // let queryResult = await Promise.resolve(
            //   getArticles.toArray()
            // ).then((res) => {
            //   return res;
            // });
            console.log(getArticles);
            return getArticles;
        },
    },
};
