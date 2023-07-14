import React from 'react';

// CSS
import "./FrequencyBarChart.css";

// Nivo Graphs
// import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'

// Other
import Lottie from 'react-lottie-player'

// Assets
import emptyAstro from '../../assets/lottieFiles/astro_empty.json';

// Contexts
import { StateContext, stateMethods } from '../../contexts/stateContext';

// Uniqid for unique keys
import uniqid from 'uniqid';

const colors = ["hsl(281, 70%, 50%)", "hsl(55, 70%, 50%)", "hsl(147, 70%, 50%)", "hsl(9, 70%, 50%)"];

const ArticleCountsNeighborhoods = (articleData, articleKeys) => {
  return(
    <>
        <h3 className="card_title">Top 10 Topics</h3>
        {articleData.length === 0 || articleKeys.length === 0 ? 
            <React.Fragment>
            <div className="empty-container">
                <Lottie loop animationData={emptyAstro} play style={{ width: "100%", height: "auto" }}/> 
                <p className="empty-text">{"No Data out there :("}</p>
            </div>
            </React.Fragment>
        :
            <ResponsiveBar
                id="OpenAITagsChart"
                data={articleData}
                keys={articleKeys}
                enableGridX={true}
                enableGridY={false}
                indexBy="topic_label"
                margin={{ top: 0, right: 30, bottom: 60, left: 80 }}
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
                layout="horizontal"
                role="application"
                ariaLabel="Topics based on topics data"
                barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
            />
            }
        </>
  )
};

export const FrequencyBarChart = () => {
  const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

  const [articleData, setArticleData] = React.useState([]);
  const [articleKeys, setArticleKeys] = React.useState([]);

  React.useEffect(() => {
    // If we have any Census Tract data
    console.log("FrequencyBarChart Current State:", currentState);

    if (currentState !== undefined) {

      if (currentState.hasOwnProperty('CensusTract') && currentState.CensusTract !== null) {
        if (currentState.CensusTract.hasOwnProperty('openAIData')) {
          let data = [];
          let index_count = 1;
          let openAIObj = currentState.CensusTract.openAIData;
          let keys = Object.keys(openAIObj);
          keys.sort((a, b) => openAIObj[b] - openAIObj[a]);

          if (keys.length > 10) {
            keys = keys.slice(0, 10); // Top 10 Open AI labels
          }

          for (let i = (keys.length - 1); i >= 0; i--) {
            let id = uniqid();
            
            let count = openAIObj[keys[i]];
            let initials = JSON.parse(keys[i]).split(" ").map((n)=>n[0]).join("").toUpperCase();

            let histogram = {
              "id": `${id}`,
              "topic_label": `${initials}_${index_count}`,
            }
            histogram[`${keys[i]}`] = count;
            index_count += 1;
            data.push(histogram); 
          }
          setArticleKeys(keys);
          setArticleData(data);

          console.log(articleData);
          console.log(articleKeys);
        }
      } else {
        setArticleKeys([]);
        setArticleData([]);
      }
    }
    
  }, [currentState]);

return(
<>
  { ArticleCountsNeighborhoods(articleData, articleKeys) }
</>
)};

export default FrequencyBarChart