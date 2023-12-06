import "./BubbleChart.css";

import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";
import { useState } from "react";

import { ResponsivePie } from "@nivo/pie";

import queryMethods from "../../Pipelines/data";

import * as React from "react";

import { Link } from "@mui/material";

import uniqid from "uniqid";

import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ArticleCard from "../ArticleCard/ArticleCard";


interface BubbleChartProps {
  bubbleData: { name: string; value: number }[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ bubbleData }) => {
  const [zoomedId, setZoomedId] = useState(null);
  const [length, setLength] = useState("col-md-12 col-sm-12");
  const [articles, setArticles] = useState([]);

  const data = {
    name: "root",
    children: bubbleData,
  };

  const handleNodeClick = async (node: any) => {
    console.log();
    if (zoomedId === node.id) {
      setZoomedId(null);
      setLength("col-md-12 col-sm-12");
    } else {
      setArticles(node.data.articles);
      setLength("col-md-4 col-sm-12");
      setZoomedId(node.id);
    }
  };

  return (
    <>
      <div className="row justify-content-evenly">
        <div className={length}>
          <Card className="body" sx={{ width: "100%", height: "62vh" }}>
            <CardContent sx={{ height: "62vh" }}>
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
                labelsSkipRadius={30}
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
            </CardContent>
          </Card>
        </div>
        <div className="col-md-8 col-sm-12">{zoomedId && <ArticleCard optionalArticles={articles}></ArticleCard>}</div>
      </div>
    </>
  );
};

export default BubbleChart;