import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";
import {useState} from "react"
export default function BubbleChart(Props) {
  const [zoomedId, setZoomedId] = useState(null);

  const data = {
    name: "root",
    children: Props.data,
  };
  console.log(Props.data);

  const handleNodeClick = (node) => {
    if (zoomedId === node.id) {
      // If the clicked node is already zoomed, reset the zoom
      setZoomedId(null);
    } else {
      // Zoom in on the clicked node
      setZoomedId(node.id);
    }
  };
  return (
    <>
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
        padding={1}
        leavesOnly={true}
        enableLabels={true}
        labelsSkipRadius={50}
        zoomedId = {zoomedId}
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
    </>
  );
}
