import React from "react";

// import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import Lottie from 'react-lottie-player'

import './NeighborhoodDemoBoard.css'

// Assets
import emptyAstro from '../../assets/lottieFiles/astro_empty.json';

// MUI Loading
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

// Contexts
import { StateContext, stateMethods } from '../../contexts/stateContext';
import { DateContext, DateMethods } from "../../contexts/dateContext";

// Redux
import { useSelector } from 'react-redux'

const colors = [
"hsl(281, 70%, 50%)", 
"hsl(55, 70%, 50%)", 
"hsl(147, 70%, 50%)", 
"hsl(9, 70%, 50%)",
"hsl(10, 70%, 50%)", 
"hsl(150, 70%, 50%)", 
"hsl(211, 70%, 50%)", 
"hsl(100, 70%, 50%)", 
"hsl(78, 70%, 50%)", 
"hsl(39, 70%, 50%)", 
];

// Truncate Numbers
function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

const loadingState = (fetching) => {
    if (fetching) {
        return (
            <Stack sx={{ 
                width: '100%',
                color: 'grey.500',
                marginTop: "10px" 
                 }} spacing={2}>
                <LinearProgress color="secondary" />
                {/* <CircularProgress size={50} color="secondary" /> */}
            </Stack>
        );
    } 
}


export default function NeighborhoodDemoBoard() {
    const data_fetching = useSelector((state) => state.masterState.universal_loading_state.payload) // Redux Neighborhood Master List

    const [demographicData, setDemogaphicData] = React.useState([]);
    const [demographicKeys, setDemographicKeys] = React.useState([]);

    const { dates } = React.useContext(DateContext);  // Global Context of Dates
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

    // use data from: 12/20/2018 up to: 01/20/2019 in roxbury
    React.useEffect(() => {
        // If we have any Census Tract data
        console.log("Demographics Board CURRENT STATE:", currentState);

        if (currentState !== undefined) {
            if (currentState.hasOwnProperty('CensusTract')) {
                console.log("Current Data in Neighborhood Demo Board:", currentState);

                if (currentState.CensusTract.demographics !== 'None') {
                    // Set Demographic Data & Demographic Keys
                    let data = currentState.CensusTract.demographics;
                    
                    //Remove datapoints from data obj
                    delete data["Total_Population"]
                    delete data["Other_Pop"]
                    delete data["Total_not_H_and_L"]

                    let demoCounts = [];
                    let demoKeys = [];
                    let demoData = [];
                    let demoSum = 0;

                    for (const [key, value] of Object.entries(data)) {
                        if (`${key}` !== 'counties') {
                            let k = `${key}`
                            let v = `${value}`
                            if (k === "Total_H_and_L"){
                                k = "Hispanic/Latine"
                            }
                            demoKeys.push((k).replace('_', ' '));
                            demoCounts.push(v);
                            demoSum += value;
                        }
                    }

                    for (let i = 0; i < demoKeys.length; i++) {
                        let piechart = {
                            "id": `${demoKeys[i]}`,
                            "label": `${demoKeys[i]}`,
                            "color": colors[i]
                        }
                        let val = (demoCounts[i] / demoSum) * 100;
                        piechart["value"] = parseFloat(toFixed(val, 2));
                        demoData.push(piechart); 
                    }
                    setDemographicKeys(demoKeys);
                    setDemogaphicData(demoData);
                } 
            } else {
                setDemogaphicData([]);
                setDemographicKeys([]);
            }
        }
        console.log("DATA FETCHING:", data_fetching);
    },[currentState, data_fetching]);

    return(
        <>
            <>
            <h3 className="card_title">Demographic Data</h3>
            {/* {loadingState(data_fetching)} */}
            {demographicData.length === 0 || demographicKeys.length === 0 ? 
                <React.Fragment>
                    <div className="empty-container">
                        <Lottie loop animationData={emptyAstro} play style={{ width: "100%", height: "auto" }}/> 
                        <p className="empty-text">{"No Data out there :("}</p>
                    </div>
                </React.Fragment>
            :
                <ResponsivePie
                    data={demographicData}
                    margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    valueFormat={function (e) {
                        return e + '%'
                    }}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                0.2
                            ]
                        ]
                    }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                2
                            ]
                        ]
                    }}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    legends={[
                        {
                            anchor: 'left',
                            direction: 'column',
                            justify: false,
                            translateX: 360,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 15,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 10,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                />
            }
            </>
        </>
    );
}