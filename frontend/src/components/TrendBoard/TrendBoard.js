import React from 'react';

// CSS
import "./TrendBoard.css";

// Nivo Graphs
// import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'

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

const ArticleCountsNeighborhoods = (data) => {
  return(
    <ResponsiveBar
        id="something"
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
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
    />
  )
};

export const TrendBoard = () => {
return(
<>
  <h3 className="card_title">Demographic Data</h3>
  { ArticleCountsNeighborhoods(data) }
</>
)};

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

export default TrendBoard