import { createContext, useState, useEffect, useContext } from "react";
import { ArticlesContext, ArticlesProvider } from "./ArticlesContext";
import { NeighborhoodsContext, NeighborhoodsProvider } from "./NeighborhoodsContext";
import { SubneighborhoodsContext ,SubneighborhoodsProvider } from "./SubneighborhoodsContext";
import db from '../components/firebase/config';
import { collection, query, where, getDocs } from "firebase/firestore";

export const FilteredContext = createContext({})

export function FilteredProvider({children}){
    const [demoData, setDemoData] = useState({})
    const [neighName, setNeighName] = useState("")


    // const {articles} = useContext(ArticlesContext)
    // const {neighborhoods} = useContext(NeighborhoodsContext)
    // const {subneighborhoods} = useContext(SubneighborhoodsContext)

    // // params: s_date, e_date, n_name, sn_name
    // // query for articlesxw
    // const id_query = query(collection(db, "date"), where("date", ">=", s_date), where(where("date", "<=", e_date)));
    // const aids = await getDocs(id_query);
    // const n_query = query(collection(db, "neighborhoods2"), where("name", "==", n_name));
    // const n_articles = await getDocs(n_query);
    // const sn_query = query(collection(db, "subneighborhood"), where("name", "==", sn_name));
    // const sn_articles = await getDocs(sn_query);

    // const art_ids = aids.filter(value => n_articles.includes(value) && sn_articles(value));
    // // get a the list of articles and the data
    // const query = query(collection(db, "articles"), where("id", "in", art_ids));
    // articles = await getDocs(query);
    // // log articles
    // articles.forEach((article) => {xw
    //     console.log(article.title);
    // });


    // // get neighborhoods count data
    // neighborhoods = {}
    // articles.forEach((article) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     if (article.neighborhood in neighborhoods){
    //         neighborhoods[article.neighborhood] = 0;
    //     }
    //     else{
    //         neighborhoods[article.neighborhood] += 1;
    //     }
    // });
    // console.log(neighborhoods)


    // // query for demographic
    // const collection = db.collection("neighorhoods");
    // const Snapshot  = await collection.get();
    // const demographic = {'B': 0, 'A': 0, 'W': 0};
    // Snapshot.forEach(doc => {
    //     results['B'] += doc.data.demographic_data.black;
    //     results['A'] += doc.data.demographic_data.asian;
    //     results['W'] += doc.data.demographic_data.white;
    // });
    // console.log(demographic); 
    let demographic_dic = {'B': 111583, 'A': 60012, 'W': 260296, 'N': 4189};

    return (
        <FilteredContext.Provider value={{neighName, setNeighName, demoData, setDemoData, demographic_dic}}>
            {children}
        </FilteredContext.Provider>
    )


    // //query for topics

    
}