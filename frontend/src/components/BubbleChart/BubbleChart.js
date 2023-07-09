import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";

export default function BubbleChart(Props) {
  const data = {
    name: "root",
    children: Props.data,
  };
  console.log(Props.data);
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
        labelsSkipRadius={64}

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
