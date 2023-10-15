import React from "react";
import "./TopNeighborhoods.css";
import { Card, CardContent } from "@mui/material";
import { Article } from "../../__generated__/graphql";
import svg from "../../assets/NeighborhoodIcons/Vector 46.svg";

interface TopNeighborhoodsProps {
  articles: Article[];
}

const TopNeighborhoods: React.FC<TopNeighborhoodsProps> = ({ articles }) => {
  const articlesPerNeighborhood: Record<string, number> = {};
  articles.forEach((article) => {
    const uniqueNeighborhoods = new Set(article.neighborhoods);
    uniqueNeighborhoods.forEach((neighborhood) => {
      articlesPerNeighborhood[neighborhood] =
        (articlesPerNeighborhood[neighborhood] || 0) + 1;
    });
  });

  const sortedNeighborhoods = Object.keys(articlesPerNeighborhood)
    .map((neighborhood) => ({
      name: neighborhood,
      count: articlesPerNeighborhood[neighborhood],
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <Card className="body" sx={{ width: "100%", height: "auto" }}>
        <div className="card-header">
          <span className="header-word">Top Neighborhoods</span>
        </div>
        <CardContent className="content">
          <div className="scroll-container">
            {sortedNeighborhoods.map((item) => (
              <div className="number-box-1" key={item.name}>
                <img className="vector" alt="Vector" src={svg} />
                <div className="label-neighborhoods">{item.name}</div>
                <div className="label-article">{item.count} Articles</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TopNeighborhoods;
