import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Card, CardContent } from "@mui/material";

import "./TractsDropDown.css";
import { TractContext } from "../../contexts/tract_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { lchown } from "fs";

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
interface TractsDropDownProps {
  tracts: string[];
}

const TractsDropDown: React.FC<TractsDropDownProps> = ({ tracts }) => {
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const { neighborhood, setNeighborhood } = React.useContext(NeighborhoodContext)!;

  const [currentTract, setCurrentTract ] = React.useState<string>(tracts[0])!;

  const items: MenuItem[] = [];

  for (let index = 0; index < tracts.length; index++) {
    const extractedItems = extractNeighborhoodTract(tracts[index]);
    items.push(getItem(tracts[index], tracts[index]));
  }

  const onSelectItem: MenuProps["onClick"] = (keys) => {

    setCurrentTract(keys.key);
    const match = /([\w\s]+ - )?(\d+)/.exec(keys.key);
    let location = "";
    let number = "";

    if (match) {
      location = match[1] ? match[1].slice(0, -3) : ""; // Remove trailing ' - ' from the location
      number = match[2];
    }

    console.log(location);
    queryTractDataType("TRACT_DATA", {
      tract: number,
    });

    if (location) {
      setNeighborhood(location);
    }
  };

  return (
    <Card sx={{ width: "100%", height: "62vh" }}>
      <CardContent sx={{ width: "100%", height: "62vh" }}>
        <Menu
          mode="inline"
          onClick={onSelectItem}
          style={{ width: "100%", height: "100%", overflow: "auto" }} // Added overflow: 'auto'
          items={items}
          selectedKeys={[currentTract]}
        />
      </CardContent>
    </Card>
  );
};

export default TractsDropDown;
