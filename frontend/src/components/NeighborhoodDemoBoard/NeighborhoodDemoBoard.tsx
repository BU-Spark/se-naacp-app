import React, { useState } from "react";

//css
import "./NeighborhoodDemoBoard.css";

// Assets
import emptyAstro from "../../assets/lottieFiles/astro_empty.json";
import { ResponsivePie } from "@nivo/pie";
import Lottie from "react-lottie-player";

// MUI Loading
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

//types
import { Demographics } from "../../__generated__/graphql";
import { Card, CardContent } from "@mui/material";
import { TractContext } from "../../contexts/tract_context";

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

interface DemographicsProps {
}

function getPercentage(total_population: string, population: string) {
  return ((parseInt(population) / parseInt(total_population)) * 100).toFixed(2);
}

const NeighborhoodDemographicsBoard: React.FC<DemographicsProps> = () => {

  const [demographics, setDemographics] = useState<Demographics | null>(null);
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;


  React.useEffect(() => {
   if(tractData){
    setDemographics(tractData.demographics)
  }
  }, [tractData]);



  if (!demographics) {
    return (
      <Card className="body" sx={{ width: "100%", height: "62vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CardContent sx={{ width: "100%", height: "62vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Lottie
              loop
              animationData={emptyAstro}
              play
              style={{ width: "100%", height: "auto" }}
          />
          <p className="empty-text">{"No Data out there :("}</p>
      </CardContent>
  </Card>
    );
  }

  const total_population = demographics.p2_001n;

  const data = [
    {
      id: "Hispanic/Latine",
      label: "Hispanic/Latine",
      value: getPercentage(total_population, demographics.p2_002n),
      color: colors[0],
    },
    {
      id: "White",
      label: "White",
      value: getPercentage(total_population, demographics.p2_005n),
      color: colors[1],
    },
    {
      id: "Black",
      label: "Black",
      value: getPercentage(total_population, demographics.p2_006n),
      color: colors[2],
    },
    {
      id: "American Indian",
      label: "American Indian",
      value: getPercentage(total_population, demographics.p2_007n),
      color: colors[3],
    },
    {
      id: "Asian",
      label: "Asian",
      value: getPercentage(total_population, demographics.p2_008n),
      color: colors[4],
    },
    {
      id: "Pacific Islander",
      label: "Pacific Islander",
      value: getPercentage(total_population, demographics.p2_009n),
      color: colors[5],
    },
    {
      id: "Other",
      label: "Other",
      value: getPercentage(total_population, demographics.p2_010n),
      color: colors[6],
    },
  ];
  return (
    <Card className="body" sx={{ width: "100%", height: "62vh" }}>
      <CardContent sx={{ width: "100%", height: "62vh" }}>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          legends={[
            {
              anchor: "left",
              direction: "column",
              justify: false,
              translateX: -50,
              translateY: 180,
              itemsSpacing: 7,
              itemWidth: 100,
              itemHeight: 10,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 15,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                  },
                },
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default NeighborhoodDemographicsBoard;
