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

const colors = [
  "hsl(281, 70%, 50%)", 
  "hsl(55, 70%, 50%)", 
  "hsl(147, 70%, 50%)", 
  "hsl(9, 70%, 50%)"
];

const ArticleCountsNeighborhoods = (articleData, articleKeys) => {
  return(
    <>
        <h3 className="card_title">Category Data</h3>
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
          // console.log("The topics:", topics)
          setArticleKeys(topics);

        //   Check for Article Data
          if (currentState.hasOwnProperty('CensusTract') && currentState.CensusTract !== null && currentState.CensusTract.articleData.length !== 0) {
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

export default TrendBoard;