import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Card, CardContent } from "@mui/material";

import "./TractsDropDown.css";

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
  // console.log(tracts);
  const items: MenuItem[] = [];
  const [selectedItem, setSelectedItem] = useState([tracts[0]]);

  for (let index = 0; index < tracts.length; index++) {
    items.push(getItem(tracts[index], tracts[index]));
  }

  const onSelectItem: MenuProps["onClick"] = (keys) => {
    console.log(keys);
  };

  return (
    <Card sx={{ width: "100%", height: "62vh" }}>
      <CardContent sx={{ width: "100%", height: "62vh" }}>
        <Menu
          mode="inline"
          onClick={onSelectItem}
          style={{ width: "100%", height: "100%", overflow: "auto" }} // Added overflow: 'auto'
          items={items}
        />
      </CardContent>
    </Card>
  );
};

export default TractsDropDown;
