import "./BubbleChartBig.css";

import { useContext, useState } from "react";
import * as React from "react";
import uniqid from "uniqid";
import dayjs from "dayjs";

import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";
import { Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ArticleCard from "../ArticleCard/ArticleCard";
import Button from "@mui/material/Button";
import { TopicsContext } from "../../contexts/topics_context";
import { useNavigate } from "react-router-dom";

interface BubbleChartProps {
  bubbleData: { name: string; value: number }[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ bubbleData }) => {
  const {
		setTopic
	} = useContext(TopicsContext)!;
  const navigate = useNavigate(); // Enforce typing here
  const [zoomedId, setZoomedId] = useState(null);
  const [length, setLength] = useState("col-md-12 col-sm-12");

  const data = {
    name: "root",
    children: bubbleData,
  };

  // route to topic page
  const handleNodeClick = async (node: any) => {
    // console.log("node: ", node);
    // node.id is the label
    setTopic(node.id);
    navigate("/Topics");
  };

  return (
    <>
      <div className="row justify-content-evenly">
        <div className={length}>
          <Card className="body" sx={{ width: "100%", height: "100vh" }}>
            {/* <CardContent sx={{ height: "100vh" }}> */}
              <ResponsiveCirclePackingCanvas
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                id="name"
                colors={{ scheme: "set3" }}
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
            {/* </CardContent> */}
          </Card>
        </div>
      </div>
    </>
  );
};

export default BubbleChart;
