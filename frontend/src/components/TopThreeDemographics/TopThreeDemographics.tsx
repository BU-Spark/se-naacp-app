import React, { useState } from "react";
import "./TopThreeDemographics.css";
import { Article, Demographics } from "../../__generated__/graphql";
import emptyAstro from "../../assets/lottieFiles/astro_empty.json";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Paper, Stack, styled } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import Lottie from "react-lottie-player";
import { TractContext } from "../../contexts/tract_context";

interface TopThreeDemographicsProps {
  articles: Article[];
  height: string;
}
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



function getPercentage(total_population: string, population: string) {
  return ((parseInt(population) / parseInt(total_population)) * 100).toFixed(2);
}

const TopThreeDemographics: React.FC<TopThreeDemographicsProps> = ({ articles, height }) => {
  

  const [demographics, setDemographics] = useState<Demographics | null>(null);
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;


  React.useEffect(() => {
   if(tractData){
    setDemographics(tractData.demographics)
  }
  }, [tractData]);



  if (!demographics) {
    return (
      
  <Card className="body" sx={{ width: "100%", height: "auto" }}>
        <div className="card-header">
          <span className="header-word">Overview</span>
        </div>
        <CardContent className="content" sx={{ height: height }}>
          <Lottie
              loop
              animationData={emptyAstro}
              play
              style={{ width: "100%", height: "auto" }}
          />
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

  data.sort((a,b) => parseFloat(b.value) - parseFloat(a.value))
  
  return (
    <>
      <Card className="body" sx={{ width: "100%", height: "auto" }}>
        <div className="card-header">
          <span className="header-word">Top 3 Demographics</span>
        </div>
        <CardContent className="content" sx={{ height: height }}>
            <BarChart
  			    xAxis={[{ scaleType: 'band', data: ["Tract Demographics in Percentage(%)"] }]}
  			    series={[
              { 
                data: [parseFloat(data[0].value)], 
                label: data[0].label, 
                color: data[0].color,
                  
              }, 
              { 
                data: [parseFloat(data[1].value)], 
                label: data[1].label, 
                color: data[1].color,
                
              }, 
              { 
                data: [parseFloat(data[2].value)], 
                label: data[2].label, 
                color: data[2].color  
              }
            ]}
            tooltip={{ trigger: 'item' }}

		    />	
        </CardContent>
      </Card>
    </>
  );
};

export default TopThreeDemographics;
