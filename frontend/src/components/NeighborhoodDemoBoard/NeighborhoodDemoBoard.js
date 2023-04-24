import React from "react";

// import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import Lottie from 'react-lottie-player'

import './NeighborhoodDemoBoard.css'

// Assets
import emptyAstro from '../../assets/lottieFiles/astro_empty.json';

// Contexts
import { StateContext, stateMethods } from '../../contexts/stateContext';
import { DateContext, DateMethods } from "../../contexts/dateContext";

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


export default function NeighborhoodDemoBoard() {
    const [demographicData, setDemogaphicData] = React.useState([]);
    const [demographicKeys, setDemographicKeys] = React.useState([]);

    const { dates } = React.useContext(DateContext);  // Global Context of Dates
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

    // use data from: 12/20/2018 up to: 01/20/2019 in roxbury
    React.useEffect(() => {
        // If we have any Census Tract data
        // console.log("Demographics Board CURRENT STATE:", currentState);

        if (currentState !== undefined) {
            if (currentState.hasOwnProperty('CensusTract')) {
                if (currentState.CensusTract.censusData !== 'None') {
                    // Set Demographic Data & Demographic Keys
                    let data = currentState.CensusTract.demographics;
                    let demoCounts = [];
                    let demoKeys = [];
                    let demoData = [];
                    let demoSum = 0;

                    for (const [key, value] of Object.entries(data)) {
                        if (`${key}` !== 'counties') {
                            demoKeys.push(`${key}`);
                            demoCounts.push(`${value}`);
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

                    console.log("Demographic Keys:", demographicKeys);
                    console.log("Demographic Data:", demographicData);
                } 
            } else {
                setDemogaphicData([]);
                setDemographicKeys([]);
            }
        }

    },[currentState]);

    return(
        <>
            <h3 className="card_title">Overall Demographic Data</h3>
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
                    // fill={[
                    //     {
                    //         match: {
                    //             id: "Total_Population"
                    //         },
                    //         id: 'dots'
                    //     },
                    //     {
                    //         match: {
                    //             id: 'c'
                    //         },
                    //         id: 'dots'
                    //     },
                    //     {
                    //         match: {
                    //             id: 'go'
                    //         },
                    //         id: 'dots'
                    //     },
                    //     {
                    //         match: {
                    //             id: 'python'
                    //         },
                    //         id: 'dots'
                    //     },
                    //     {
                    //         match: {
                    //             id: 'scala'
                    //         },
                    //         id: 'lines'
                    //     },
                    //     {
                    //         match: {
                    //             id: 'lisp'
                    //         },
                    //         id: 'lines'
                    //     },
                    //     {
                    //         match: {
                    //             id: 'elixir'
                    //         },
                    //         id: 'lines'
                    //     },
                    //     {
                    //         match: {
                    //             id: 'javascript'
                    //         },
                    //         id: 'lines'
                    //     }
                    // ]}
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
    );
}


// NOTE:
// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

// <ResponsiveBar
//     id="DemographicChart"
//     data={demographicData}
//     keys={demographicKeys}
//     indexBy="population"
//     margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
//     padding={0.3}
//     valueScale={{ type: 'linear' }}
//     indexScale={{ type: 'band', round: true }}
//     colors={{ scheme: 'nivo' }}
//     axisTop={null}
//     axisRight={null}
//     axisBottom={{
//         tickSize: 5,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: 'Race',
//         legendPosition: 'middle',
//         legendOffset: 32
//     }}
//     axisLeft={{
//         tickSize: 5,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: 'Population',
//         legendPosition: 'middle',
//         legendOffset: -40
//     }}
//     labelSkipWidth={12}
//     labelSkipHeight={12}
//     labelTextColor={{
//         from: 'color',
//         modifiers: [
//             [
//                 'darker',
//                 1.6
//             ]
//         ]
//     }}
//     legends={[
//         {
//             dataFrom: 'keys',
//             anchor: 'bottom-right',
//             direction: 'column',
//             justify: false,
//             translateX: 120,
//             translateY: 0,
//             itemsSpacing: 2,
//             itemWidth: 100,
//             itemHeight: 20,
//             itemDirection: 'left-to-right',
//             itemOpacity: 0.85,
//             symbolSize: 20,
//             effects: [
//                 {
//                     on: 'hover',
//                     style: {
//                         itemOpacity: 1
//                     }
//                 }
//             ]
//         }
//     ]}
//     role="application"
//     ariaLabel="Demographics based on Census data"
//     barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
// />