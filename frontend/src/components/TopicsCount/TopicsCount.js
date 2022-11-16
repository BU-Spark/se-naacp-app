import {Card, CardTitle, CardBody, CardFooter} from '@patternfly/react-core';
import { Chart, ChartBar, ChartVoronoiContainer } from '@patternfly/react-charts';
import "./TopicsCount.css";
import React, { useState, useEffect, useContext } from "react";

import db from '../firebase/config';


export function TopicsCount() {
    const s_date = "03172015";
    const e_date = "09182016";
    const n_name = "back_bay";
    const [topics_freq, setTopics_freq] = useState([]);
    const [topics, setTopics] = useState([]);

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

    async function filterNH() {
        await filterDate();
        db.collection("filter_neighborhood").where("name", "==", n_name)
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

    async function getTopicFreq() {
        await filterNH();
        let aids = localStorage.getItem("n_aids").split(",");

        console.log(aids);
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
        
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        }

    useEffect(() => {
        setTopics_freq([]);
        setTopics([]);
        getTopicFreq();
    }, []);

    return(
    <div>
    <Card className="demo-board-card">
        <CardTitle className='demo-board-title'>Topics Frequency Data</CardTitle>
        <CardBody>
            <Chart
            ariaDesc="Average number of pets"
            ariaTitle="Bar chart example"
            containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
            domain={{y: [0,100]}}
            domainPadding={{ x: [10, 10] }}
            legendData={topics}
            legendOrientation="vertical"
            legendPosition="right"
            height={200}
            name="chart4"
            padding={{
                bottom: 70,
                left: 58,
                right: 250, // Adjusted to accommodate legend
                top: 50
            }}
            width={700}
            >
                <ChartBar data={topics_freq} />
            </Chart>
        </CardBody>
    </Card>
    </div>
    )
        }