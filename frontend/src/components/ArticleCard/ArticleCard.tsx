import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "./ArticleCard.css";
import queryMethods from "../../Pipelines/data";
import emptyAstro from "../../assets/lottieFiles/astro_empty.json";

//types
import { Article } from "../../__generated__/graphql";

// Uniqid for unique keys
import uniqid from "uniqid";

// Contexts
import { Link } from "@mui/material";
import Lottie from "react-lottie-player";
import { useState } from "react";
import { ArticleContext } from "../../contexts/article_context";



const columns = [
  {
    field: "title",
    headerName: "Title",
    width: 580,
    renderCell: (params: any) => (
      <Link href={`${params.row.title.link}`} target="_blank">
        {params.row.title.title}
      </Link>
    ),
  },
  { field: "author", headerName: "Author", width: 130 },
  { field: "publishingDate", headerName: "Publishing Date", width: 120 },
  { field: "neighborhood", headerName: "Neighborhood", width: 580 },
  { field: "censusTract", headerName: "Census Tract", width: 200 },
  { field: "category", headerName: "Category", width: 90 },
];

interface ArticleCardProps {}

const ArticleCard: React.FC<ArticleCardProps> = () => {
  var articleRow: any = [];

  const [articles, setArticles] = useState<Article[]>([]);
  const { articleData, queryArticleDataType } =
    React.useContext(ArticleContext)!;

  React.useEffect(() => {
    if (articleData) {
      setArticles(articleData);
    }
  }, [articleData]);

  articles.forEach((article, index) => {
    articleRow.push({
      id: uniqid(),
      title: { link: article.link, title: article.hl1 },
      author: `${article.author}`,
      publishingDate: `${dayjs(article.pub_date).format("MMM D, YYYY")}`,
      neighborhood: `${article.neighborhoods}`,
      censusTract: `${article.tracts}`,
      category: `${article.position_section}`,
    });
  });

  return (
    <>
      <Card className="body" sx={{ width: "100%", height: "62vh" }}>
        <CardContent>
          {articles.length === 0 ? (
            <React.Fragment>
              <Lottie
                loop
                animationData={emptyAstro}
                play
                style={{ width: "100%", height: "auto" }}
              />
              <p className="empty-text">{"No Data out there :("}</p>
            </React.Fragment>
          ) : (
            <div style={{ height: "52vh", width: "100%" }}>
              <DataGrid
                rows={articleRow}
                columns={columns}
                pageSize={100} // DataGrid is capped at 100 entries needs premium to go over, I will set the length to 100 to to avoid frontend crashing
                rowsPerPageOptions={[5]}
                hideFooter={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ArticleCard;
