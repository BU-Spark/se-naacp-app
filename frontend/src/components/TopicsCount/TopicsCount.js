import {Card, CardTitle, CardBody, CardFooter} from '@patternfly/react-core';
import { Chart, ChartBar, ChartVoronoiContainer } from '@patternfly/react-charts';
import "./TopicsCount.css";
import React, { useState, useEffect, useContext } from "react";
import { FilteredContext, FilterProvider } from '../../context/FilteredContext';

import db from '../firebase/config';
import { getFirestore } from 'firebase/firestore';


export function TopicsCount() {
    const {neighName, topics, topics_freq} = useContext(FilteredContext)

    

    useEffect(() => {

    }, [topics]);

    

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