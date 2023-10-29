import React from "react";
import "./FrequencyBarChart.css";
import { ResponsiveBar } from "@nivo/bar";
import { Article } from "../../__generated__/graphql";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
interface FrequencyBarChartProps {
  articles: Article[] | null;
  num: number;
  openAI: boolean;
}

// This function counts the occurrences of each string in an array and returns an object with the strings as keys and counts as values.
const countStrings = (arr: string[]) => {
  return arr.reduce((prev, curr) => {
    prev[curr] = (prev[curr] || 0) + 1;
    return prev;
  }, {} as Record<string, number>);
};

const FrequencyBarChart: React.FC<FrequencyBarChartProps> = ({
  articles,
  num,
  openAI,
}) => {
  // Mapping over the articles to create an array of labels, filtering out articles with empty labels.

  if(!articles){
    articles = [];
  }
  const listOfLabels = articles
    .map((article) =>
      openAI ? article.openai_labels[0] : article.position_section
    )
    .filter((label) => label); // This filter step ensures that empty labels are disregarded.

  // Counting the occurrences of each label using the countStrings function.
  const counts = countStrings(listOfLabels);

  // Creating an array of entries from the counts object and sorting them in descending order based on the count.
  const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  // Slicing the sorted entries to get the top 5.
  const top5Data = sortedEntries.slice(0, num);

  // Mapping over the top 5 data to create an array of objects suitable for the bar chart.
  const data = top5Data.map(([topic_label, frequency]) => ({
    id: topic_label,
    topic_label,
    [topic_label]: frequency,
  }));

  // Extracting the keys (labels) from the top 5 data for use in the bar chart.
  const top5Keys = top5Data.map(([key]) => key);

  return (
    <Card className="body" sx={{ width: "100%", height: "62vh" }}>
      <CardContent>
        <div style={{ height: "50vh", width: "100%" }}>
          <div className="graph-wrapper">
            <ResponsiveBar
              data={data}
              keys={top5Keys}
              enableGridX={false}
              enableGridY={true}
              indexBy="topic_label"
              margin={{ top: 10, right: 30, bottom: 60, left: 80 }}
              padding={0.7}
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Topics",
                legendPosition: "middle",
                legendOffset: 50,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Article Count",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              layout="vertical"
              role="application"
              ariaLabel="Topics based on topics data"
              barAriaLabel={function (e) {
                return (
                  e.id + ": " + e.formattedValue + " in topic: " + e.indexValue
                );
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequencyBarChart;
