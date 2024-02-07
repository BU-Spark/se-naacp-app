import React from "react";
import "./atGlance.css";
import { Article } from "../../__generated__/graphql";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Paper, Stack, styled } from "@mui/material";
interface AtGlanceProps {
  articles: Article[];
  height: string;
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

  const DemoPaper = styled(Paper)(({ theme }) => ({
    bgcolor: "color.black",
    width: 100,
    height: 70,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: "center",
  }));
  return (
    <>
      <Card className="body" sx={{ width: "100%", height: "auto" }}>
        <div className="card-header">
          <span className="header-word">Overview</span>
        </div>
        <CardContent className="content" sx={{ height: height }}>
          <Stack direction="row" spacing={2}>
            <DemoPaper variant="outlined" square={false}>
              <div className="number-box">
                <div className="big-number">{uniqueArticles}</div>
                <div className="label">ARTICLES</div>
              </div>
            </DemoPaper>
          </Stack>

          <Stack direction="row" spacing={2}>
            <DemoPaper variant="outlined" square={false}>
              <div className="number-box">
                <div className="big-number">{uniqueOpenaiLabels.size}</div>
                <div className="label">TOPICS</div>
              </div>
            </DemoPaper>
          </Stack>

          <Stack direction="row" spacing={2}>
            <DemoPaper variant="outlined" square={false}>
              <div className="number-box">
                <div className="big-number">{uniqueNeighborhoods.size}</div>
                <div className="label">NEIGHBORHOODS</div>
              </div>
            </DemoPaper>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default AtGlance;
