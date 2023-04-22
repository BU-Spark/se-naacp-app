import React from 'react';

// CSS
import "./TrendBoard.css";

// Nivo Graphs
// import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'

// Other
import Lottie from 'react-lottie-player'

// Assets
import emptyAstro from '../../assets/lottieFiles/astro_empty.json';

// Contexts
import { StateContext, stateMethods } from '../../contexts/stateContext';

const colors = ["hsl(281, 70%, 50%)", "hsl(55, 70%, 50%)", "hsl(147, 70%, 50%)", "hsl(9, 70%, 50%)"];

const ArticleCountsNeighborhoods = (articleData, articleKeys) => {
  return(
    <>
        <h3 className="card_title">Article Data</h3>
        {articleData.length === 0 || articleKeys.length === 0 ? 
            <React.Fragment>
            <div className="empty-container">
                <Lottie loop animationData={emptyAstro} play style={{ width: "100%", height: "auto" }}/> 
                <p className="empty-text">{"No Data out there :("}</p>
            </div>
            </React.Fragment>
        :
            <ResponsiveBar
                id="ArticleChart"
                data={articleData}
                keys={articleKeys}
                indexBy="topic"
                margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
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
                    legend: 'Genre',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Article Count',
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
                ariaLabel="Topics based on topics data"
                barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
            />
            }
        </>
  )
};

export const TrendBoard = () => {
  const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

  const [articleData, setArticleData] = React.useState([]);
  const [articleKeys, setArticleKeys] = React.useState([]);

  React.useEffect(() => {
    // If we have any Census Tract data
    // console.log("Trend Board Current State:", currentState);

    if (currentState !== undefined) {
        if (currentState.hasOwnProperty('Topics')) {
          let topics = currentState.Topics
          console.log("The topics:", topics)
          setArticleKeys(topics);

        //   Check for Article Data
          if (currentState.hasOwnProperty('CensusTract')) {
            if (currentState.CensusTract.topicsData !== 'None') {
              let data = [];
              let counts = currentState.CensusTract.topicsData;

              for (let i = 0; i < counts.length; i++) {
                let histogram = {
                  "topic": `${topics[i]}`,
                  "color": colors[i]
                }
                histogram[`${topics[i]}`] = counts[i];
                data.push(histogram); 
              }

              setArticleData(data);
            }
          } else {
            setArticleKeys([]);
            setArticleData([]);
          }
        }
    }
  }, [currentState]);

return(
<>
  { ArticleCountsNeighborhoods(articleData, articleKeys) }
</>
)};

export default TrendBoard


// Lines
// export const TrendBoard = () => {

//     const data = [
//         {
//           "id": "japan",
//           "color": "hsl(245, 70%, 50%)",
//           "data": [
//             {
//               "x": "plane",
//               "y": 143
//             },
//             {
//               "x": "helicopter",
//               "y": 84
//             },
//             {
//               "x": "boat",
//               "y": 162
//             },
//             {
//               "x": "train",
//               "y": 145
//             },
//             {
//               "x": "subway",
//               "y": 75
//             },
//             {
//               "x": "bus",
//               "y": 6
//             },
//             {
//               "x": "car",
//               "y": 179
//             },
//             {
//               "x": "moto",
//               "y": 292
//             },
//             {
//               "x": "bicycle",
//               "y": 74
//             },
//             {
//               "x": "horse",
//               "y": 239
//             },
//             {
//               "x": "skateboard",
//               "y": 222
//             },
//             {
//               "x": "others",
//               "y": 238
//             }
//           ]
//         },
//         {
//           "id": "france",
//           "color": "hsl(222, 70%, 50%)",
//           "data": [
//             {
//               "x": "plane",
//               "y": 81
//             },
//             {
//               "x": "helicopter",
//               "y": 198
//             },
//             {
//               "x": "boat",
//               "y": 120
//             },
//             {
//               "x": "train",
//               "y": 117
//             },
//             {
//               "x": "subway",
//               "y": 35
//             },
//             {
//               "x": "bus",
//               "y": 11
//             },
//             {
//               "x": "car",
//               "y": 202
//             },
//             {
//               "x": "moto",
//               "y": 32
//             },
//             {
//               "x": "bicycle",
//               "y": 109
//             },
//             {
//               "x": "horse",
//               "y": 183
//             },
//             {
//               "x": "skateboard",
//               "y": 192
//             },
//             {
//               "x": "others",
//               "y": 234
//             }
//           ]
//         },
//         {
//           "id": "us",
//           "color": "hsl(271, 70%, 50%)",
//           "data": [
//             {
//               "x": "plane",
//               "y": 221
//             },
//             {
//               "x": "helicopter",
//               "y": 94
//             },
//             {
//               "x": "boat",
//               "y": 240
//             },
//             {
//               "x": "train",
//               "y": 126
//             },
//             {
//               "x": "subway",
//               "y": 94
//             },
//             {
//               "x": "bus",
//               "y": 202
//             },
//             {
//               "x": "car",
//               "y": 232
//             },
//             {
//               "x": "moto",
//               "y": 145
//             },
//             {
//               "x": "bicycle",
//               "y": 261
//             },
//             {
//               "x": "horse",
//               "y": 253
//             },
//             {
//               "x": "skateboard",
//               "y": 156
//             },
//             {
//               "x": "others",
//               "y": 50
//             }
//           ]
//         },
//         {
//           "id": "germany",
//           "color": "hsl(151, 70%, 50%)",
//           "data": [
//             {
//               "x": "plane",
//               "y": 140
//             },
//             {
//               "x": "helicopter",
//               "y": 41
//             },
//             {
//               "x": "boat",
//               "y": 86
//             },
//             {
//               "x": "train",
//               "y": 143
//             },
//             {
//               "x": "subway",
//               "y": 264
//             },
//             {
//               "x": "bus",
//               "y": 151
//             },
//             {
//               "x": "car",
//               "y": 274
//             },
//             {
//               "x": "moto",
//               "y": 200
//             },
//             {
//               "x": "bicycle",
//               "y": 192
//             },
//             {
//               "x": "horse",
//               "y": 39
//             },
//             {
//               "x": "skateboard",
//               "y": 83
//             },
//             {
//               "x": "others",
//               "y": 14
//             }
//           ]
//         },
//         {
//           "id": "norway",
//           "color": "hsl(148, 70%, 50%)",
//           "data": [
//             {
//               "x": "plane",
//               "y": 180
//             },
//             {
//               "x": "helicopter",
//               "y": 228
//             },
//             {
//               "x": "boat",
//               "y": 4
//             },
//             {
//               "x": "train",
//               "y": 16
//             },
//             {
//               "x": "subway",
//               "y": 273
//             },
//             {
//               "x": "bus",
//               "y": 297
//             },
//             {
//               "x": "car",
//               "y": 281
//             },
//             {
//               "x": "moto",
//               "y": 270
//             },
//             {
//               "x": "bicycle",
//               "y": 237
//             },
//             {
//               "x": "horse",
//               "y": 41
//             },
//             {
//               "x": "skateboard",
//               "y": 107
//             },
//             {
//               "x": "others",
//               "y": 63
//             }
//           ]
//         }
//       ];

//     const MyResponsiveLine = (data) => {
//         return(
//         <ResponsiveLine
//             data={data}
//             margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//             xScale={{ type: 'point' }}
//             yScale={{
//                 type: 'linear',
//                 min: 'auto',
//                 max: 'auto',
//                 stacked: true,
//                 reverse: false
//             }}
//             yFormat=" >-.2f"
//             axisTop={null}
//             axisRight={null}
//             axisBottom={{
//                 orient: 'bottom',
//                 tickSize: 5,
//                 tickPadding: 5,
//                 tickRotation: 0,
//                 legend: 'transportation',
//                 legendOffset: 36,
//                 legendPosition: 'middle'
//             }}
//             axisLeft={{
//                 orient: 'left',
//                 tickSize: 5,
//                 tickPadding: 5,
//                 tickRotation: 0,
//                 legend: 'count',
//                 legendOffset: -40,
//                 legendPosition: 'middle'
//             }}
//             pointSize={10}
//             pointColor={{ theme: 'background' }}
//             pointBorderWidth={2}
//             pointBorderColor={{ from: 'serieColor' }}
//             pointLabelYOffset={-12}
//             useMesh={true}
//             legends={[
//                 {
//                     anchor: 'bottom-right',
//                     direction: 'column',
//                     justify: false,
//                     translateX: 100,
//                     translateY: 0,
//                     itemsSpacing: 0,
//                     itemDirection: 'left-to-right',
//                     itemWidth: 80,
//                     itemHeight: 20,
//                     itemOpacity: 0.75,
//                     symbolSize: 12,
//                     symbolShape: 'circle',
//                     symbolBorderColor: 'rgba(0, 0, 0, .5)',
//                     effects: [
//                         {
//                             on: 'hover',
//                             style: {
//                                 itemBackground: 'rgba(0, 0, 0, .03)',
//                                 itemOpacity: 1
//                             }
//                         }
//                     ]
//                 }
//             ]}
//         />)
//     };

//     return(
//     <>
//       { MyResponsiveLine(data) }
//     </>
// )};