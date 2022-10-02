import React from 'react';
import { Chart, ChartAxis, ChartGroup, ChartLine, ChartVoronoiContainer } from '@patternfly/react-charts';
import {Card, CardTitle, CardBody, CardFooter} from '@patternfly/react-core';
import "./TrendBoard.css";

export const TrendBoard = () => (
    <Card className="trend-card">
        <CardTitle className='trend-title'>Trending Topics</CardTitle>
        <Chart
        ariaDesc="Average number of pets"
        ariaTitle="Line chart example"
        containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
        legendData={[{ name: 'Sports' }, { name: 'Crime'}, { name: 'Weather' }, { name: 'Technology' }, { name: 'Dining' }]}
        legendOrientation="horizontal"
        legendPosition="bottom"
        height={250}
        maxDomain={{y: 100}}
        minDomain={{y: 0}}
        name="chart1"
        padding={{
            bottom: 70,
            left: 50,
            right: 200, // Adjusted to accommodate legend
            top: 50
        }}
        width={600}
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
    
    
)