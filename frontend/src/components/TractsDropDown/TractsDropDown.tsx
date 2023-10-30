import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Card, CardContent } from "@mui/material";

import "./TractsDropDown.css";
import { TractContext } from "../../contexts/tract_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";

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

interface TractsDropDownProps {
  tracts: string[];
}

const TractsDropDown: React.FC<TractsDropDownProps> = ({ tracts }) => {
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const { neighborhood } = React.useContext(NeighborhoodContext)!;
  const [selectedItems, setSelectedItems] = React.useState([""]);


  // React.useEffect(() => {
  //   setIsLoading([tracts[0]]);
  // }, [neighborhood]);

  const items: MenuItem[] = [];

  for (let index = 0; index < tracts.length; index++) {
    items.push(getItem(tracts[index], tracts[index]));
  }

  const onSelectItem: MenuProps["onClick"] = (keys) => {
    queryTractDataType("TRACT_DATA", {
      tract: keys.key,
    });
    console.log(keys.key);
  };

  console.log(items[0]?.key);

  return (
    <Card sx={{ width: "100%", height: "62vh" }}>
      <CardContent sx={{ width: "100%", height: "62vh" }}>
        <Menu
          mode="inline"
          onClick={onSelectItem}
          style={{ width: "100%", height: "100%", overflow: "auto" }} // Added overflow: 'auto'
          items={items}
          selectedKeys={[tractData!.tract]}
        />
      </CardContent>
    </Card>
  );
};

export default TractsDropDown;
