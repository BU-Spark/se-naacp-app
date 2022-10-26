// Import Firestore database
import db from '../firebase/config';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue} from "firebase/database";
import React, { createContext } from "react";

const Read = () => {
    // article component
	let ArticleInput = {articleTitle: "", authorName: "", publishingDate: Date};
    const [articles, setArticles] = useState([]);

    // topics component
	let TopicInput = {topicLabel: "", NumberofArticles: 0, totalScore: 0};
    const [topics, setTopics] = useState([TopicInput]);

    // most covered component
	let MostCoveredInput = {Neighborhood: "", articleCount: 0}
    const [mostcovered, setMostcovered] = useState([MostCoveredInput]);

    // neighborhood component
    const [neighborhoods, setNeighborhoods] = useState([""]);
    const [subneighborhoods, setSubNeighborhoods] = useState([""]);
    const [minDate, setMindate] = useState(Date);
    const [maxDate, setMaxdate] = useState(Date);

	// fetch the data
	useEffect(() => {
		// FetchArticlesFromFB();
        // FetchTopics();
        FetchNeighborhoods();
        // FetchSubNeighborhoods();
	  }, []);

	// Fetch the required datas using the get() method
	const FetchArticlesFromFB = ()=>{
		const starCountRef = ref(db, '/articles');
		onValue(starCountRef, (snapshot) => {
			const data = snapshot.val();
			setArticles(data)
		  });
	}
	// for (let i in articles){
	// 	console.log(i)
	// } 

	function recreateDate(date) {
		let d = [date[9], date[10]].join("")
		let m = [date[24], date[25]].join("")
		let y = [date[38], date[39], date[40], date[41]].join("")
		return {day: d, month: m, year: y}
	  }
	
    // const FetchNeighborhoods = ()=>{
	// 	const starCountRef = ref(db, '/neighborhoods');
	// 	onValue(starCountRef, (snapshot) => {
	// 		const data = snapshot.val();
	// 	  });
	// }

    // const FetchSubNeighborhoods = ()=>{
	// 	const starCountRef = ref(db, '/subneighborhoods');
	// 	onValue(starCountRef, (snapshot) => {
	// 		const data = snapshot.val();
	// 	  });
	// }

	// const FetchTopics = ()=>{
	// 	db.collection("topics").get().then((querySnapshot) => {
	// 		querySnapshot.forEach(element => {
	// 			let data = element.data();
	// 			setTopics(arr => [...arr , data]);
	// 		});
	// 	})
	// }


	// Display the result on the page
	return (
		<div>
		</div>

	);
}
export default Read;
