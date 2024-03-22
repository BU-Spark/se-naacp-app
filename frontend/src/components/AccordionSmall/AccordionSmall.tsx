import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, CardContent } from "@mui/material";
import { ArticleContext } from "../../contexts/article_context";
import { Article } from "../../__generated__/graphql";
import Callback from "../../pages/Callback/Callback";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import "./AccordionSmall.css";
import BubbleChart from "../BubbleChart/BubbleChart";
interface TractCount {
  name: string;
  value: number;
}

interface LabelDetail {
  label: string;
  totalCount: number;
  tractsCount: TractCount[];
}

interface LabelCount {
  name: string;
  value: number;
}

interface TractDetail {
  tract: string;
  totalLabelCount: number;
  labelsCount: LabelCount[];
}

function getNeighborhood(
  code: string,
  neighborhoods: { [key: string]: string[] }
): string | null {
  for (let [neighborhoodName, codes] of Object.entries(neighborhoods)) {
    if (codes.includes(code)) {
      return neighborhoodName;
    }
  }
  return "";
}

const getTractDetailsWithTotalCount = (
  articles: Article[],
  neighborhoods: { [key: string]: string[] }
): React.ReactElement<any, any> => {
  const tractDetails: Record<
    string,
    { totalLabelCount: number; labels: Record<string, { count: number, articles: Article[] }> }
  > = {};

  // Counting tracts, labels within each tract, and storing articles
  articles.forEach((article) => {
    article.tracts.forEach((tract) => {
      if (!tractDetails[tract]) {
        tractDetails[tract] = { totalLabelCount: 0, labels: {} };
      }

      article.openai_labels.forEach((label) => {
        if (!tractDetails[tract].labels[label]) {
          tractDetails[tract].labels[label] = { count: 0, articles: [] };
        }
        tractDetails[tract].labels[label].count++;
        tractDetails[tract].labels[label].articles.push(article);
      });

      tractDetails[tract].totalLabelCount++;
    });
  });

  // Converting to desired structure
  const tractDetailsArray: TractDetail[] = Object.entries(tractDetails)
    .map(([tract, detail]) => ({
      tract: tract,
      totalLabelCount: detail.totalLabelCount,
      labelsCount: Object.entries(detail.labels)
        .map(([name, labelDetail]) => ({
          name,
          value: labelDetail.count,
          articles: labelDetail.articles
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10), // Limit to top 10 labels
    }))
    .sort((a, b) => b.totalLabelCount - a.totalLabelCount)
    .slice(0, 10); // Limit to top 10 tracts

    console.log(tractDetailsArray);
  return (
    <>
      <div>
          <Accordion key={tractDetailsArray[0].tract}>
            <BubbleChart bubbleData={tractDetailsArray[0].labelsCount}></BubbleChart>
          </Accordion>
      </div>
    </>
  );
};


const wrapper = (
  articles: Article[],
  neighborhoods: { [key: string]: string[] }
): React.ReactElement<any, any> => {
  return getTractDetailsWithTotalCount(articles, neighborhoods)
};


const BasicAccordionSmall: React.FC = () => {
  const { articleData, queryArticleDataType } =
    React.useContext(ArticleContext)!;
  const [articles, setArticles] = React.useState<Article[]>([]);
  const { neighborhoodMasterList } = React.useContext(NeighborhoodContext)!;
  React.useEffect(() => {
    if (articleData) {
      setArticles(articleData);
    }
  }, [articleData]);

  return (
    <>
      <Card className="body" sx={{ width: "100%" }}>
        <CardContent sx={{ width: "100%" }}>
          <div><h1 className='titles'>Top 10 Topics</h1></div>

          {articles === null || articles.length === 0 ? (
            <Callback></Callback>
          ) : (
            wrapper(articles, neighborhoodMasterList!)
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default BasicAccordionSmall;
