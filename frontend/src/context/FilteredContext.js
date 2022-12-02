import { createContext, useState, useEffect, useContext, useReducer } from "react";
import { ArticlesContext, ArticlesProvider } from "./ArticlesContext";
import { NeighborhoodsContext, NeighborhoodsProvider } from "./NeighborhoodsContext";
import { SubneighborhoodsContext ,SubneighborhoodsProvider } from "./SubneighborhoodsContext";
import db from '../components/firebase/config';
import { collection, query, where, getDocs } from "firebase/firestore";

export const FilteredContext = createContext({})

export function FilteredProvider({children}){
    const [demoData, setDemoData] = useState({})
    const [neighName, setNeighName] = useState("dorchester")

    const [topics_freq, setTopics_freq] = useState([]);
    const [topics, setTopics] = useState([]);
    
    let demographic_dic = {'B': 111583, 'A': 60012, 'W': 260296, 'N': 4189};
    

    useEffect(() => {
        getTopicFreq(neighName)
    }, [neighName]);

    const s_date = "03172015";
    const e_date = "09182016";
    let n_name = "dorchester";
    // query for article
    async function filterDate() {
        let aids = []
        db.collection("filter_date")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (s_date <= doc.data()['date'] <= e_date){
                    aids += doc.data()['article_keys'];
                    }
                });
                localStorage.setItem("aid", aids);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    async function filterNH(nameVal) {
        await filterDate();
        let n_articles = []
        db.collection("filter_neighborhood").where("name", "==", nameVal)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                n_articles += doc.data()['article_keys'];
            });
            localStorage.setItem("n_aids", n_articles);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
      }

    async function getTopicFreq(nameVal) {
        console.log("Fetch is executed")
        await filterNH(nameVal);
        setTopics_freq([]);
        setTopics([]);
        console.log("INside fetchL: ", nameVal)
        let aids = localStorage.getItem("n_aids").split(",");

        db.collection("filter_topics")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                    let filteredArray = doc.data()['article_keys'].filter(value => aids.includes(value));
                    let frqdic = { name: doc.id, x: doc.id, y: filteredArray.length }
                    let topicdic = { name: doc.id }

                    setTopics_freq(prevState =>
                        [...prevState, frqdic]   
                    );
                    setTopics(prevState =>
                        [...prevState, topicdic]
                    );        
                    console.log("Topics: ",topics)
                    console.log("Topics Freq: ",topics_freq)
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        }

    return (
        <FilteredContext.Provider value={{neighName, setNeighName, demoData, setDemoData, demographic_dic, topics, topics_freq}}>
            {children}
        </FilteredContext.Provider>
    )


    // //query for topics

    
}