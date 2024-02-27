import React, { useEffect, useState } from "react";
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
interface TractsDropDownProps {
  tracts: string[];
}

const TractsDropDown: React.FC<TractsDropDownProps> = ({ tracts }) => {
  const { articleData, queryArticleDataType, setShouldRefresh, shouldRefresh } =
    React.useContext(ArticleContext)!;
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const { neighborhood, setNeighborhood, neighborhoodMasterList } =
    React.useContext(NeighborhoodContext)!;
  
  const [selectedTract, setSelectedTract] = React.useState<string>(tractData!.tract || '');

  const handleChange = (event: any) => {
    setSelectedTract(event.target.value);
    var dummy = tracts;
    if (!dummy) {
      dummy = [];
    }

    const items: MenuItem[] = [];

    for (let index = 0; index < dummy.length; index++) {
      const x = extractNeighborhoodTract(dummy[index]);
      items.push(getItem(dummy[index], x[1]));
    }

    const onSelectItem: MenuProps["onClick"] = (keys) => {
      // console.log(keys);
      const match = /([\w\s]+ - )?(\d+)/.exec(keys.key);
      let location = "";
      let number = "";

      if (match) {
        location = match[1] ? match[1].slice(0, -3) : ""; // Remove trailing ' - ' from the location
        number = match[2];
      }
      setShouldRefresh(false);

      queryTractDataType("TRACT_DATA", {
        tract: number,
      });

      if (location) {
        setNeighborhood(location);
      } else {
        // console.log(getNeighborhood(number, neighborhoodMasterList!))
        setNeighborhood(getNeighborhood(number, neighborhoodMasterList!));
      }
    };

  }

  var dummy = tracts;
  if (!dummy) {
    dummy = [];
  }

  const items: MenuItem[] = [];

  for (let index = 0; index < dummy.length; index++) {
    const x = extractNeighborhoodTract(dummy[index]);
    items.push(getItem(dummy[index], x[1]));
  }

  const onSelectItem: MenuProps["onClick"] = (keys) => {
    // console.log(keys);
    const match = /([\w\s]+ - )?(\d+)/.exec(keys.key);
    let location = "";
    let number = "";

    if (match) {
      location = match[1] ? match[1].slice(0, -3) : ""; // Remove trailing ' - ' from the location
      number = match[2];
    }
    setShouldRefresh(false);

    queryTractDataType("TRACT_DATA", {
      tract: number,
    });

    if (location) {
      setNeighborhood(location);
    } else {
      // console.log(getNeighborhood(number, neighborhoodMasterList!))
      setNeighborhood(getNeighborhood(number, neighborhoodMasterList!));
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="tract-select-label">Tract</InputLabel>
      <Select
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

export default TractsDropDown;
