import React from 'react';
import {Card, CardTitle, CardBody, CardFooter} from '@patternfly/react-core';
import { Chart, ChartBar, ChartVoronoiContainer } from '@patternfly/react-charts';
import "./NeighborhoodDemoBoard.css";

export const NeighborhoodDemoBoard = () => (
    <Card className="demo-board-card">
        <CardTitle className='demo-board-title'>Demographic Data</CardTitle>
        <CardBody>
            <Chart
            ariaDesc="Average number of pets"
            ariaTitle="Bar chart example"
            containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
            domain={{y: [0,400]}}
            domainPadding={{ x: [10, 20] }}
            legendData={[{ name: 'Cats' },{ name: 'White'}, { name: 'Black'}, { name: 'Asian'}, { name: 'American Indian or Alaskan Native'}, { name: 'Native Hawaiian or Pacific Islander'}]}
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
            width={500}
            >
                <ChartBar data={[{ name: 'White', x: 'Q1', y: 400 }, { name: 'Black', x: 'Q2', y: 350 }, { name: 'Asian', x: 'Q3', y: 325 }, { name: 'American Indian or Alaskan Native', x: 'Q4', y: 175 }, { name: 'Native Hawaiian or Pacific Islander', x: 'Q5', y: 360 }]} />
            </Chart>
        </CardBody>
    </Card>
)