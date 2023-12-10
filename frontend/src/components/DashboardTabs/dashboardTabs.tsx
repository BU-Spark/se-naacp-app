import React, { useState } from "react";
import "./dashboardTabs.css";

import { HiOutlineUserGroup } from "react-icons/hi2";
import { HiOutlineNewspaper } from "react-icons/hi2";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid, Paper, Stack, Typography, styled } from "@mui/material";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ArticleCard from "../ArticleCard/ArticleCard";
import BasicAccordion from "../Accordion/Accordion";
import { Article } from "../../__generated__/graphql";

import "./dashboardTabs.css";

interface dashboardTabs {
  articles: Article[];
}

const DashboardTabs: React.FC<dashboardTabs> = ({ articles }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const uniqueOpenaiLabels = new Set<string>();
  articles.forEach((article) => {
    article.openai_labels.forEach((label) => {
      uniqueOpenaiLabels.add(label);
    });
  });
  const uniqueTracts = new Set<string>();

  articles.forEach((article) => {
    article.tracts.forEach((tracts) => {
      uniqueTracts.add(tracts);
    });
  });

  function tab1(clicked: boolean) {
    return (
      <Card
        sx={{
          minWidth: 275,
          background: clicked
            ? "linear-gradient(180deg, rgb(27, 176, 161) 0%, rgba(27, 176, 161, 0.7) 100%)"
            : "white",
          color: "white",
        }}
      >
        <CardContent>
          <Grid container>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                sx={{
                  padding: "10px",
                  background: "#35c3b5",
                  color: "white",
                }}
              >
                <HiOutlineUserGroup size={40} />
              </Card>
            </Grid>
            <Grid item xs={8} sx={{ textAlign: "center" }}>
              <Typography
                align="left"
                component="div"
                style={{
                  color: clicked ? "#7cf5e9" : "#8e8e8e",
                  fontSize: "15px",
                }}
              >
                TOTAL CENSUS TRACTS
              </Typography>
              <Typography
                align="left"
                variant="h5"
                style={{
                  color: clicked ? "white" : "black",
                  fontWeight: "bold",
                }}
              >
                {uniqueTracts.size}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  function tab2(clicked: boolean) {
    return (
      <Card
        sx={{
          minWidth: 275,
          background: clicked
            ? "linear-gradient(180deg, rgb(252, 88, 56) 0%, rgba(252, 88, 56, 0.7) 100%)"
            : "white",
          color: "white",
        }}
      >
        <CardContent>
          <Grid container>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                sx={{
                  padding: "10px",
                  background: "#fb7359",
                  color: "white",
                }}
              >
                <HiOutlineNewspaper size={40} />
              </Card>
            </Grid>
            <Grid item xs={8} sx={{ textAlign: "center" }}>
              <Typography
                align="left"
                component="div"
                style={{
                  color: clicked ? "#ffcec4" : "#8e8e8e",
                  fontSize: "15px",
                }}
              >
                TOTAL TOPICS
              </Typography>
              <Typography
                align="left"
                variant="h5"
                style={{
                  color: clicked ? "white" : "black",
                  fontWeight: "bold",
                }}
              >
                {uniqueOpenaiLabels.size}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  function tab3(clicked: boolean) {
    return (
      <Card
        sx={{
          minWidth: 275,
          background: clicked
            ? "linear-gradient(180deg, rgba(210, 229, 98) 0%, rgba(195, 213, 88, 0.7) 100%)"
            : "white",
          color: "white",
        }}
      >
        <CardContent>
          <Grid container>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                sx={{
                  padding: "10px",
                  background: "#c3d558",
                  color: "white",
                }}
              >
                <HiOutlineUserGroup size={40} />
              </Card>
            </Grid>
            <Grid item xs={8} sx={{ textAlign: "center" }}>
              <Typography
                align="left"
                component="div"
                style={{
                  color: clicked ? "#effda0" : "#8e8e8e",
                  fontSize: "15px",
                }}
              >
                TOTAL ARTICLES
              </Typography>
              <Typography
                align="left"
                variant="h5"
                style={{
                  color: clicked ? "white" : "black",
                  fontWeight: "bold",
                }}
              >
                {articles.length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Tabs>
        <TabList>
          <Tab onClick={() => setActiveTabIndex(0)}>
            {tab1(activeTabIndex === 0)}
          </Tab>
          <Tab onClick={() => setActiveTabIndex(1)}>
            {tab2(activeTabIndex === 1)}
          </Tab>
          <Tab onClick={() => setActiveTabIndex(2)}>
            {tab3(activeTabIndex === 2)}
          </Tab>
        </TabList>
        <TabPanel>
          <BasicAccordion isLabels={false}></BasicAccordion>
        </TabPanel>
        <TabPanel>
          <BasicAccordion isLabels={true}></BasicAccordion>
        </TabPanel>
        <TabPanel>
          <ArticleCard></ArticleCard>
        </TabPanel>
      </Tabs>
    </>
  );
};

export default DashboardTabs;
