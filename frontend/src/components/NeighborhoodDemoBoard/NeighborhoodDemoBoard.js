import React from "react";

import { ResponsiveBar } from '@nivo/bar'
import Lottie from 'react-lottie-player'

import './NeighborhoodDemoBoard.css'

// Assets
import emptyAstro from '../../assets/lottieFiles/astro_empty.json';

// Contexts
import { StateContext, stateMethods } from '../../contexts/stateContext';
import { DateContext, DateMethods } from "../../contexts/dateContext";

const data = [
    {
      "race": "white",
      "white": 21,
      "whiteColor": "hsl(281, 70%, 50%)"
    },
    {
      "race": "black",
      "black": 172,
      "blackColor": "hsl(55, 70%, 50%)"
    },
    {
      "race": "asian",
      "asian": 128,
      "asianColor": "hsl(147, 70%, 50%)"
    },
    {
      "race": "hispanic",
      "hispanic": 126,
      "hispanicColor": "hsl(9, 70%, 50%)"
    }
  ];

export default function NeighborhoodDemoBoard() {
    const [demographicData, setDemogaphicData] = React.useState([]);
    const [demographicKeys, setDemographicKeys] = React.useState([]);

    const { dates } = React.useContext(DateContext);  // Global Context of Dates
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

    // use data from: 12/20/2018 up to: 01/20/2019 in roxbury
    React.useEffect(() => {
        // If we have any Census Tract data
        console.log("Demo Board:", currentState);

        if (currentState.CensusTract !== undefined) {
            setDemographicKeys(Object.keys(currentState.CensusTract.censusData.shift));
            console.log("The Keys for census:", demographicKeys);
        }

    },[currentState]);

    return(
        <>
            <h3 className="card_title">Demographic Data</h3>
            {demographicData.length == 0 || demographicKeys.length == 0 ? 
                <React.Fragment>
                <div className="empty-container">
                    <Lottie loop animationData={emptyAstro} play style={{ width: "100%", height: "auto" }}/> 
                    <p className="empty-text">{"No Data out there :("}</p>
                </div>
                </React.Fragment>
            :
                <ResponsiveBar
                    id="DemographicChart"
                    data={data}
                    keys={[
                        'white',
                        'black',
                        'asian',
                        'hispanic'
                    ]}
                    indexBy="race"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ scheme: 'nivo' }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Race',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Population',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                1.6
                            ]
                        ]
                    }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    role="application"
                    ariaLabel="Demographics based on Census data"
                    barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
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