import React from 'react';
import { Chart, ChartAxis, ChartGroup, ChartLine, ChartVoronoiContainer } from '@patternfly/react-charts';
import {Card, CardTitle, CardBody, CardFooter} from '@patternfly/react-core';
import "./TrendBoard.css";
import db from '../firebase/config';

export function TrendBoard() {
    const s_date = "0317015";
    const e_date = "09182016";
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

    async function getTopicFreq() {
        await filterDate();
        let aids = localStorage.getItem("aid").split(",");

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


    return(
        <div>
        <Card className="trend-card">
            <CardTitle className='trend-title'>Trending Topics</CardTitle>
            <Chart
            ariaDesc="Average number of pets"
            ariaTitle="Line chart example"
            containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
            legendData={[{ name: 'Sports' }, { name: 'Crime'}, { name: 'Weather' }, { name: 'Technology' }, { name: 'Dining' }]}
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
                    <ChartLine
                        data={[
                            { name: 'Sports', x: '2015', y: 20 },
                            { name: 'Sports', x: '2016', y: 23 },
                            { name: 'Sports', x: '2017', y: 26 },
                            { name: 'Sports', x: '2018', y: 30 }
                        ]}
                        />
                    <ChartLine
                    data={[
                            { name: 'Crime', x: '2015', y: 60 },
                            { name: 'Crime', x: '2016', y: 35 },
                            { name: 'Crime', x: '2017', y: 70 },
                            { name: 'Crime', x: '2018', y: 50 }
                        ]}
                        />
                    <ChartLine
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
                    />
                </ChartGroup>
            </Chart>
        </Card>
        </div>
        )
}