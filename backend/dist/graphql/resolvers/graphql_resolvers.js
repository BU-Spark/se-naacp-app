//helper function to check if a string is a numebr
function isNumber(str) {
    return !isNaN(str);
}
export const resolvers = {
    Mutation: {
        addRssFeed: async (_, { url, userID }, context) => {
            const { db } = context;
            const rss_data = db.collection("rss_links");
            // const newRssFeed = {
            //   url: url,
            //   userID: userID,
            // };
            // Create or update the RSS feed for the given userID
            const filter = { userID: userID };
            const update = {
                $set: { url: url, userID: userID }
            };
            const options = {
                upsert: true,
                returnDocument: 'after' // This option is used to return the modified document
            };
            const result = await rss_data.findOneAndUpdate(filter, update, options);
            console.log(result);
            // const query = { userID: newRssFeed.userID, url: newRssFeed.url };
            // const doc = rss_data.findOne(query);
            // if (!doc) {
            //   rss_data.insertOne(
            //       { userID: newRssFeed.userID,
            //         url: { $ne: newRssFeed.url } 
            //       },
            //       {
            //         $set: { url: newRssFeed.url }
            //       }
            //   );
            // }
            // const result = await rss_data.insertOne(newRssFeed);
            // console.log(result);
        },
    },
    Query: {
        // RSS Resolver
        getRssLinkByUserId: async (_, args, context) => {
            const { db } = context;
            const rss_data = db.collection("rss_links");
            const queryResult = rss_data.find({ userID: args.user_id }).toArray();
            return queryResult;
        },
        // CSV Upload Resolver
        getUploadByUserId: async (_, args, context) => {
            const { db } = context;
            const upload_data = db.collection("uploads");
            const queryResult = upload_data.find({ userID: args.user_id }).toArray();
            return queryResult;
        },
        // Topic Resolvers
        getAllTopics: async (_, args, context) => {
            const { db } = context;
            const articles_data = db.collection("articles_data");
            const topics = await articles_data.distinct("position_section", { userID: args.userID });
            return topics;
        },
        getAllLabels: async (_, args, context) => {
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
                        _id: null,
                        unique_labels: { $addToSet: "$openai_labels" }, // Creates a set of unique labels
                    },
                },
            ])
                .toArray();
            return topics[0].unique_labels;
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
                    userID: args.userID,
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
                    userID: args.userID,
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
                    userID: args.userID,
                })
                    .toArray();
                return queryResult;
            }
        },
        articleByTopicsOrLabels: async (_, args, context) => {
            const { db } = context;
            const articles_data = db.collection("articles_data");
            if (isNumber(args.area)) {
                const queryResult = articles_data
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
                            position_section: { $regex: args.labelOrTopic, $options: "i" },
                        },
                    ],
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
            }
            else {
                const queryResult = articles_data
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
                            position_section: { $regex: args.labelOrTopic, $options: "i" },
                        },
                    ],
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
