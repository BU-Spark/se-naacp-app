import React from "react";
import "./atGlance.css";
import { Article } from "../../__generated__/graphql";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
interface AtGlanceProps {
  articles: Article[];
  height: string
}

const AtGlance: React.FC<AtGlanceProps> = ({ articles, height }) => {
  const uniqueArticles = articles.length;

  const uniqueOpenaiLabels = new Set<string>();
  articles.forEach((article) => {
    article.openai_labels.forEach((label) => {
      uniqueOpenaiLabels.add(label);
    });
  });

  // Count unique neighborhoods globally
  const uniqueNeighborhoods = new Set<string>();
  articles.forEach((article) => {
    article.neighborhoods.forEach((neighborhood) => {
      uniqueNeighborhoods.add(neighborhood);
    });
  });

  return (
    <>
      <Card className="body" sx={{ width: "100%", height: "auto" }}>
        <div className="card-header">
          <span className="header-word">At a Glance</span>
        </div>
        <CardContent className="content" sx={{height: height}}>
          <div className="number-box">
            <div className="big-number">{uniqueArticles}</div>
            <div className="label">ARTICLES</div>
          </div>
          <div className="number-box">
            <div className="big-number">{uniqueOpenaiLabels.size}</div>
            <div className="label">TOPICS</div>
          </div>
          <div className="number-box">
            <div className="big-number">{uniqueNeighborhoods.size}</div>
            <div className="label">NEIGHBORHOODS</div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AtGlance;
