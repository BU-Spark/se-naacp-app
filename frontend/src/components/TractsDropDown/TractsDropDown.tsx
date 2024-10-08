import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Card, CardContent } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./TractsDropDown.css";
import { TractContext } from "../../contexts/tract_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { lchown } from "fs";
import { ArticleContext } from "../../contexts/article_context";
import { get } from "http";

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
  var dummy = tracts;
  if (!dummy) {
    dummy = [];
  }

  const items: MenuItem[] = [];

  for (let index = 0; index < dummy.length; index++) {
    const x = extractNeighborhoodTract(dummy[index]);

    items.push(getItem(dummy[index] + " Articles", x[1]));
  }

  const onSelectItem: MenuProps["onClick"] = (keys) => {
    const match = /([\w\s]+ - )?(\d+)/.exec(keys.key);
    let location = "";
    let number = "";

    if (match) {
      location = match[1] ? match[1].slice(0, -3) : ""; // Remove trailing ' - ' from the location
      number = match[2];
    }
    setShouldRefresh(false);
    if (getNeighborhood(number, neighborhoodMasterList!) === "") {
      toast.error("Greater Boston Coming Soon!");
      return;
    }

    if (getNeighborhood(number, neighborhoodMasterList!) === "Unknown Neighborhood") {
      toast.error("Unknown Neighborhood!");
      return;
    }

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
    <div>
      <ToastContainer />
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
    </div>
  );
};

export default TractsDropDown;
