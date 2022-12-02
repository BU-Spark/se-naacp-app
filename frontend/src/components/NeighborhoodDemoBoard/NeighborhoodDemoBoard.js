import React, { useContext, useEffect, useState } from 'react';
import {Card, CardTitle, CardBody, CardFooter} from '@patternfly/react-core';
import { Chart, ChartBar, ChartVoronoiContainer } from '@patternfly/react-charts';
import "./NeighborhoodDemoBoard.css";
import { FilteredContext, FilteredProvider } from "../../context/FilteredContext";
import { set } from 'date-fns';

import db from '../firebase/config';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase, ref } from "firebase/database";
import { collection, query, where, getDocs } from "firebase/firestore";


export default function NeighborhoodDemoBoard() {
    const [data, setData] = useState({})
    const {neighName, demographic_dic, demoData, setDemoData} = useContext(FilteredContext)
    

    if (neighName.length !== 0) {
        let name = neighName.toLowerCase().replace(" ", "_")
        let response = async function() {
            await getDemographic(name)
        };
        response()
    }
    useEffect(() => {
        setData(demographic_dic)
    }, []);


    async function getDemographic(n_name){
        let demographic_dic = {"B": 0, "A": 0, "W": 0, "N": 0};
        // this query u can use for searching demographic for certain neighborhood: pass in n_name
        db.collection("neighborhoods_meta").where("name", "==", n_name)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    demographic_dic["A"] += doc.data()["demographic_data"]["asian"];
                    demographic_dic["B"] += doc.data()["demographic_data"]["black"];
                    demographic_dic["W"] += doc.data()["demographic_data"]["white"];
                    demographic_dic["N"] += doc.data()["demographic_data"]["american_indian_alaskan_native"];
                });
                // localStorage.setItem("demographic_dic", demographic_dic);
                setData(demographic_dic)
                // console.log("setData: ", demographic_dic)
                return demographic_dic;
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
      }

    
    
  return (
    <div>
        <Card className="demo-board-card">
            <CardTitle className='demo-board-title'>Demographic Data</CardTitle>
            <CardBody>
                <Chart
                ariaDesc="Average number of pets"
                ariaTitle="Bar chart example"
                containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
                domain={{y: [0,data["W"]]}}
                domainPadding={{ x: [30, 30] }}
                legendData={[{ name: 'White'}, { name: 'Black'}, { name: 'Asian'}, { name: 'American/Alaskan Native'}]}
                legendOrientation="vertical"
                legendPosition="right"
                height={250}
                name="chart4"
                padding={{
                    bottom: 50,
                    left: 70,
                    right: 250, // Adjusted to accommodate legend
                    top: 50
                }}
                width={500}
                >
                    <ChartBar barWidth={30} data={[{ name: 'White', x: 'Q1', y: data["W"] }, { name: 'Black', x: 'Q2', y: data["B"] }, { name: 'Asian', x: 'Q3', y: data["A"] }, { name: 'American/Alaskan Native', x: 'Q4', y:  data["N"]}]} />
                </Chart>
            </CardBody>
        </Card>
    </div>
  )
}
