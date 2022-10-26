import db from '../components/firebase/config';
import { ref, onValue} from "firebase/database";
import { createContext, useState, useEffect } from "react";

export const ArticlesContext = createContext({})

export function ArticlesProvider({children}){
    //let ArticleInput = {articleTitle: "", authorName: "", publishingDate: Date};
    const [articles, setArticles] = useState([]);

    // fetch the data
	useEffect(() => {
		//FetchArticlesFromFB();
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

    // gets date as a string and turns it into a js object
	function recreateDate(date) {
		let d = [date[9], date[10]].join("")
		let m = [date[24], date[25]].join("")
		let y = [date[38], date[39], date[40], date[41]].join("")
		return {day: d, month: m, year: y}
	}

    let articlesTestVal = "ArticlesContext Works!"
    return (
        <ArticlesContext.Provider value={{articles, articlesTestVal}}>
            {children}
        </ArticlesContext.Provider>
    )
}