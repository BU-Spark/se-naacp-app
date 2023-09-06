
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

// Apollo Client Object
const queryURI = 'http://localhost:4000/queryAI' // Will be automated

const clientQuery = new ApolloClient({
	uri: queryURI,
	cache: new InMemoryCache(),
});

const getArticleBodyData = async(articleData) => {
	const QUERY = gql`query queryBodyAnalysis($articleData: [String]) {
		queryBodyAnalysis(articleData: $articleData)
	}`;

	let article_data = await clientQuery.query({
		query: QUERY,
		variables: { articleData }
	}).then( (_res)=> {
		return _res;
	});

	if (article_data.data.queryBodyAnalysis == null) {
		console.log("Returned null")
		return;
	}

	article_data = JSON.parse(article_data.data.queryBodyAnalysis); // Need to change this...

	console.log("Article Data:", article_data)

	return article_data;
};

// ========================================================================

const AIMethods = {
	getArticleBodyData: getArticleBodyData
}

export default AIMethods