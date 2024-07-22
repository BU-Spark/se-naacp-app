import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

import "./TractsDropDownSmall.css";
import { TractContext } from "../../contexts/tract_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { lchown } from "fs";
import { ArticleContext } from "../../contexts/article_context";

// MUI UI
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

function getKeysByTract(tract: string, tracts: string[]): string {
  for (const key in tracts) {
    if (key.includes(tract)) {
      return key;
    }
  }
  return "";
}

function extractNeighborhoodTract(text: string) {
  const match = /([\w\s]+ - )?(\d+)/.exec(text);
  let location = "";
  let number = "";

  if (match) {
    location = match[1] ? match[1].slice(0, -3) : ""; // Remove trailing ' - ' from the location
    number = match[2];
  }

  return [location, number];
}

function getNeighborhood(
  code: string,
  neighborhoods: { [key: string]: string[] }
): string {
  for (let [neighborhoodName, codes] of Object.entries(neighborhoods)) {
    if (codes.includes(code)) {
      return neighborhoodName;
    }
  }
  return "";
}
interface TractsDropDownSmallProps {
  tracts: string[];
}

const TractsDropDownSmall: React.FC<TractsDropDownSmallProps> = ({ tracts = [] }) => {
  const { articleData, queryArticleDataType, setShouldRefresh, shouldRefresh } =
    React.useContext(ArticleContext)!;
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const { neighborhood, setNeighborhood, neighborhoodMasterList } =
    React.useContext(NeighborhoodContext)!;
  
  // const [selectedTract, setSelectedTract] = React.useState<string>(tractData!.tract || '');
  
  // const myParam = searchParams.get('myParam');

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialTract = queryParams.get('tract') || (tractData ? tractData.tract : '');


  const [selectedTract, setSelectedTract] = React.useState(initialTract);


  // update drop down when map clicks
  // Effect to handle initialization and re-fetching data when the tract changes
  React.useEffect(() => {
    if (tractData!.tract) {
      setSelectedTract(tractData!.tract);
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("neighborhood", neighborhood!);
      queryParams.set("tract", tractData!.tract);
      navigate(`?${queryParams.toString()}`);
      }
  }, [tractData]);



  const handleChange = (event: any) => {
    setSelectedTract(event.target.value);

    // set dummy array if no tract data - prevent rendering error 
    var dummy = tracts;
    if (!dummy) {
      dummy = [];
    }

    const items: MenuItem[] = [];
    for (let index = 0; index < dummy.length; index++) {
      items.push(getItem(dummy[index], dummy[index]));
    }
    
    // get location and number
    // const [location, number] = extractNeighborhoodTract(event.target.value);
    setShouldRefresh(false);

    queryTractDataType("TRACT_DATA", {
      tract: event.target.value,
    });

      // console.log(getNeighborhood(number, neighborhoodMasterList!))
      setNeighborhood(getNeighborhood(event.target.value, neighborhoodMasterList!));
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120, marginTop: 0.9 }}>
      <InputLabel id="tract-select-label">Tract</InputLabel>
      <Select
        style={{ height: "32px", borderRadius: 0, backgroundColor: "white" }}
        labelId="tract-select-label"
        id="tract-select"
        value={selectedTract}
        label="Tract"
        onChange={handleChange}
      >
        {tracts.map((tract) => (
          <MenuItem key={tract} value={tract}>{tract}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TractsDropDownSmall;
