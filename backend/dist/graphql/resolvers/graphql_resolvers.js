//helper function to check if a string is a numebr
function isNumber(str) {
    return !isNaN(str);
}
export const resolvers = {
    Query: {
        // Topic Resolvers
        getAllTopics: async (_, __, context) => {
            const { db } = context;
            const topic_data = db.collection("topics_data");
            const topics = await topic_data.find({}).toArray();
            return topics;
        },
        // Tract Resolvers
        demographicsByTracts: async (_, args, context) => {
            const { db } = context;
            const tracts_data = db.collection("tracts_data");
            const queryResult = await tracts_data
                .find({
                tract: args.tract,
            })
                .toArray();
            if (queryResult.length === 0) {
                const noDataTract = {
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
        tractsByNeighborhood: async (_, args, context) => {
            const { db } = context;
            const neighborhood_data = db.collection("neighborhood_data");
            const queryResult = await neighborhood_data
                .find({
                value: args.neighborhood,
            })
                .toArray();
            return queryResult;
        },
        getAllNeighborhoods: async (_, __, context) => {
            const { db } = context;
            const neighborhood_data = db.collection("neighborhood_data");
            const neighborhoods = await neighborhood_data
                .find({})
                .toArray();
            return neighborhoods;
        },
        // Article Resolvers
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
            }
            else if (args.area === "all") {
                const queryResult = articles_data
                    .find({
                    dateSum: {
                        $gte: args.dateFrom,
                        $lte: args.dateTo,
                    },
                })
                    .toArray();
                return queryResult;
            }
            else {
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
        getAllArticles: async (_, __, context) => {
            const { db } = context;
            const article_data = db.collection("articles_data");
            const articles = await article_data.find({}).toArray();
            return articles;
        },
    },
};
