import React from 'react';
import { Chart, ChartAxis, ChartGroup, ChartLine, ChartVoronoiContainer } from '@patternfly/react-charts';
import {Card, CardTitle, CardBody, CardFooter, ContextSelectorFooter} from '@patternfly/react-core';
import { useState, useEffect } from 'react';
import "./TrendBoard.css";
import db from '../firebase/config';

export function TrendBoard() {
    const s_date = "0317015";
    const e_date = "09182016";
    const [terms_freq, setTerm_freq] = useState([]);
    const [terms, setTerms] = useState([]);

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

    async function getTermsFreq() {
        await filterDate();
        setTerm_freq([]);
        setTerms([]);
        // let aids = localStorage.getItem("aid").split(",");
        db.collection("test_collection")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                    // let filteredArray = doc.data()['article_ids'].filter(value => aids.includes(value));
                    let filteredArray = doc.data()['article_ids'];
                    let topicdic = { name: doc.id }
                    let termarr = [];

                    filteredArray.forEach((article) => {
                        let frqdic = { name: doc.id, x: article['date'], y: article['count'] }
                        termarr.push(frqdic);
                    })

                    setTerm_freq(prevState =>
                        [...prevState, termarr]   
                    );
                    setTerms(prevState =>
                        [...prevState, topicdic]
                    );
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        }

    useEffect(() => {
        getTermsFreq();
    }, []);

    return(
        <div>
        <Card className="trend-card">
            <CardTitle className='trend-title'>Trending Topics</CardTitle>
            <Chart
            ariaDesc="Average number of pets"
            ariaTitle="Line chart example"
            containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
            legendData={terms}
            legendOrientation="horizontal"
            legendPosition="bottom"
            height={600}
            maxDomain={{y: 100}}
            minDomain={{y: 0}}
            name="chart1"
            padding={{
                bottom: 70,
                left: 50,
                right: 60, // Adjusted to accommodate legend
                top: 50
            }}
            width={1000}
            >
                <ChartGroup>
                    {terms_freq.map((term) =>
                        <ChartLine
                        key={term}
                        data={term}
                        />
                    )}
                    {/* <ChartLine
                    data={[
                            { name: 'Weather', x: '2015', y: 80 },
                            { name: 'Weather', x: '2016', y: 70 },
                            { name: 'Weather', x: '2017', y: 40 },
                            { name: 'Weather', x: '2018', y: 60 }
                        ]}
                    />
                    <ChartLine
                        data={[
                            { name: 'Technology', x: '2015', y: 30 },
                            { name: 'Technology', x: '2016', y: 60 },
                            { name: 'Technology', x: '2017', y: 40 },
                            { name: 'Technology', x: '2018', y: 50 }
                        ]}
                    />
                    <ChartLine
                        data={[
                            { name: 'Dining', x: '2015', y: 25 },
                            { name: 'Dining', x: '2016', y: 50 },
                            { name: 'Dining', x: '2017', y: 35 },
                            { name: 'Dining', x: '2018', y: 40 }
                        ]}
                    /> */}
                </ChartGroup>
            </Chart>
        </Card>
        </div>
        )
}