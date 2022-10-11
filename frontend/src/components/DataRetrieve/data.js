// Import Firestore database
import db from './firbase';
import { useState } from 'react';

const Read = () => {
    // article component
    const [articles, setArticles] = useState([ArticleInput]);
    let ArticleInput = {articleTitle: "", authorName: "", publishingDate: Date};

    // topics component
    const [topics, setTopics] = useState([TopicInput]);
    let TopicInput = {topicLabel: "", NumberofArticles: 0, totalScore: 0};

    // most covered component
    const [mostcovered, setMostcovered] = useState([MostCoveredInput]);
    let MostCoveredInput = {Neighborhood: "", articleCount: 0}

    // neighborhood component
    const [neighborhoods, setNeighborhoods] = useState([""]);
    const [subneighborhoods, setSubNeighborhoods] = useState([""]);
    const [minDate, setMindate] = useState(Date);
    const [maxDate, setMaxdate] = useState(Date);

	// fetch the data
	window.addEventListener('load', () => {
		FetchArticles();
        FetchTopics();
        FetchNeighborhoods();
        FetchSubNeighborhoods();
	});

	// Fetch the required datas using the get() method
	const FetchArticles = ()=>{
		db.collection("data").get().then((querySnapshot) => {
			querySnapshot.forEach(element => {
				let data = element.data();
				setArticles(arr => [...arr , data]);
			});
		})
	}
	
    const FetchTopics = ()=>{
		db.collection("data").get().then((querySnapshot) => {
			querySnapshot.forEach(element => {
				let data = element.data();
				setTopics(arr => [...arr , data]);
			});
		})
	}

    const FetchNeighborhoods = ()=>{
		db.collection("data").get().then((querySnapshot) => {
			querySnapshot.forEach(element => {
				let data = element.data();
				setNeighborhoods(arr => [...arr , data]);
			});
		})
	}

    const FetchSubNeighborhoods = ()=>{
		db.collection("data").get().then((querySnapshot) => {
			querySnapshot.forEach(element => {
				let data = element.data();
				setSubNeighborhoods(arr => [...arr , data]);
			});
		})
	}


	// Display the result on the page
	return (
		<div>
		</div>

	);
}
export default Read;
