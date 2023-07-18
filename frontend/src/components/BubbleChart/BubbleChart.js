import "./BubbleChart.css";

import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";
import { useState } from "react";

import { ResponsivePie } from '@nivo/pie'


import queryMethods from "../../Pipelines/data";

import * as React from "react";

import { Link } from "@mui/material";

import uniqid from "uniqid";

import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const columns = [
  {
    field: "title",
    headerName: "Title",
    width: 580,
    renderCell: (params) => (
      <Link href={`${params.row.title.link}`} target="_blank">
        {params.row.title.title}
      </Link>
    ),
  },
  { field: "author", headerName: "Author", width: 130 },
  { field: "publishingDate", headerName: "Publishing Date", width: 120 },
  // { field: "neighborhood", headerName: "Neighborhood", width: 110 },
  // { field: "censusTract", headerName: "Census Tract", width: 110 },
  // { field: "category", headerName: "Category", width: 90 },
];

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

function toFixed(num, fixed) {
  // console.log(num,fixed);
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num?.toString().match(re)[0];
}

function extractNumbers(string) {
  const pattern = /\d{6}/; // Matches six consecutive digits
  const match = string.match(pattern);
  if (match) {
    return match[0];
  } else {
    return null;
  }
}

export default function BubbleChart(Props) {
  const minDate = dayjs("2020-11-01"); // November 2020
  const maxDate = dayjs("2023-01-09"); // February 2021

  const [demographicData, setDemogaphicData] = React.useState([]);
  const [demographicKeys, setDemographicKeys] = React.useState([]);

  const [zoomedId, setZoomedId] = useState(null);

  const [articleData, setArticleData] = React.useState([]);

  const data = {
    name: "root",
    children: Props.data,
  };

  const handleNodeClick = async (node) => {
    console.log();
    if (zoomedId === node.id) {
      // If the clicked node is already zoomed, reset the zoom
      setZoomedId(null);
    } else {
      // Zoom in on the clicked node

      setZoomedId(node.id);
      let articles = await queryMethods.getArticleData(node.data.articles);

      let articleRow = [];
      console.log("Articles:", articles[0]);
      for (const article_arr of articles[0]) {
        let article = article_arr[0];
        articleRow.push({
          id: uniqid(),
          title: { link: article.link, title: article.hl1 },
          author: `${article.author}`,
          publishingDate: `${dayjs(article.pub_date).format("MMM D, YYYY")}`,
          neighborhood: `${node.data.neighborhood}`,
          censusTract: `${article.tracts[0]}`,
          category: `${article.position_section}`,
        });
      }
      setArticleData(articleRow);

      // console.log(node.id);

      let data = await queryMethods.getCensusDateData(
        minDate,
        maxDate,
        extractNumbers(node.id)
      );

      data = data.demographics;

      //Remove datapoints from data obj
      delete data["Total_Population"];
      delete data["Other_Pop"];
      delete data["Total_not_H_and_L"];

      let demoCounts = [];
      let demoKeys = [];
      let demoData = [];
      let demoSum = 0;

      for (const [key, value] of Object.entries(data)) {
        if (`${key}` !== "counties") {
          let k = `${key}`;
          let v = `${value}`;
          if (k === "Total_H_and_L") {
            k = "Hispanic/Latine";
          }
          demoKeys.push(k.replace("_", " "));
          demoCounts.push(v);
          demoSum += value;
        }
      }

      for (let i = 0; i < demoKeys.length; i++) {
        let piechart = {
          id: `${demoKeys[i]}`,
          label: `${demoKeys[i]}`,
          color: colors[i],
        };
        let val = (demoCounts[i] / demoSum) * 100;
        piechart["value"] = parseFloat(toFixed(val, 2));
        demoData.push(piechart);
      }
      setDemographicKeys(demoKeys);
      setDemogaphicData(demoData);
    }
  };

  return (
    <>
      <div className="data-cards">
        <div className="graph_card">
          <ResponsiveCirclePackingCanvas
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            id="name"
            colors={{ scheme: "nivo" }}
            colorBy="id"
            childColor={{
              from: "color",
              modifiers: [["brighter", 0.4]],
            }}
            padding={0}
            leavesOnly={true}
            enableLabels={true}
            labelsSkipRadius={64}
            zoomedId={zoomedId}
            onClick={handleNodeClick}
            label={(e) => e.id}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 2.4]],
            }}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.3]],
            }}
            animate={false}
          />
        </div>

        <div className="master_content_container">
          {zoomedId && (
            <div className="graph_card">
              <Card className="body">
                <CardContent>
                  {/* <h3 className="card">Articles From Neighborhood/Tract</h3> */}
                  <div style={{ height: 350, width: "100%" }}>
                    <DataGrid
                      rows={articleData}
                      columns={columns}
                      pageSize={100} // DataGrid is capped at 100 entries needs premium to go over, I will set the length to 100 to to avoid frontend crashing
                      rowsPerPageOptions={[5]}
                      hideFooter={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {zoomedId && (
            <div className="graph_card">
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
                            translateX: 270,
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
