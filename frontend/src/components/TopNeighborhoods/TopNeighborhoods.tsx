import React from "react";
import "./TopNeighborhoods.css";
import { Card, CardContent, Stack, styled } from "@mui/material";
import { Article } from "../../__generated__/graphql";
import svg from "../../assets/NeighborhoodIcons/Vector 46.svg";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Paper from "@mui/material/Paper";

interface TopNeighborhoodsProps {
  articles: Article[];
  height: string;
}

const TopNeighborhoods: React.FC<TopNeighborhoodsProps> = ({
  articles,
  height,
}) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const articlesPerNeighborhood: Record<string, number> = {};
  articles.forEach((article) => {
    const uniqueNeighborhoods = new Set(article.neighborhoods);
    uniqueNeighborhoods.forEach((neighborhood) => {
      articlesPerNeighborhood[neighborhood] =
        (articlesPerNeighborhood[neighborhood] || 0) + 1;
    });
  });

  const handleBoxClick = (neighborhood: string) => {
    navigate(`./${neighborhood}`); // Navigate to the new route
  };

  const sortedNeighborhoods = Object.keys(articlesPerNeighborhood)
    .map((neighborhood) => ({
      name: neighborhood,
      count: articlesPerNeighborhood[neighborhood],
    }))
    .sort((a, b) => b.count - a.count);

  const DemoPaper = styled(Paper)(({ theme }) => ({
    bgcolor: "color.black",
    width: 120,
    height: 120,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: "center",
  }));

  return (
    <>
      <Card className="body" sx={{ width: "100%", height: "auto" }}>
        <div className="card-header">
          <span className="header-word">Top Neighborhoods</span>
        </div>
        <CardContent className="content" sx={{ height: height }}>
          <div className="scroll-container">
            {sortedNeighborhoods.map((item) => (
              <div className="number-box-1">
                <Stack direction="row" spacing={2}>
                  <DemoPaper variant="outlined" square={false}>
                    <div className="number-box">
                      <div className="big-number">{item.count}</div>
                      <div className="label">{item.name}</div>
                    </div>
                  </DemoPaper>
                </Stack>
                {/* <img className="vector" alt="Vector" src={svg} />
                <div className="label-neighborhoods">{item.name}</div>
                <div className="label-article">{item.count} Articles</div> */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TopNeighborhoods;
