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
import "./Accordion.css";
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

const getLabelDetailsWithLimitedTracts = (articles: Article[], neighborhoods: { [key: string]: string[] }): React.ReactElement<any, any> => {
  const labelDetails: Record<
    string,
    { totalCount: number; tracts: Record<string, { count: number, articles: Article[] }> }
  > = {};

  // Counting labels, tracts, and storing articles for each tract
  articles.forEach((article) => {
    article.openai_labels.forEach((label) => {
      if (!labelDetails[label]) {
        labelDetails[label] = { totalCount: 0, tracts: {} };
      }
      labelDetails[label].totalCount += article.tracts.length;

      article.tracts.forEach((tract) => {
        if (!labelDetails[label].tracts[tract]) {
          labelDetails[label].tracts[tract] = { count: 0, articles: [] };
        }
        labelDetails[label].tracts[tract].count++;
        labelDetails[label].tracts[tract].articles.push(article);
      });
    });
  });

  // Transforming to the desired structure
  const labelDetailsArray: LabelDetail[] = Object.entries(labelDetails).map(
    ([label, detail]) => ({
      label: label,
      totalCount: detail.totalCount,
      tractsCount: Object.entries(detail.tracts)
        .map(([name, tractDetail]) => ({
          name,
          value: tractDetail.count,
          articles: tractDetail.articles
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5), // Limit to first 5 tracts
    })
  );

  // Sorting labels by total count
  const result = labelDetailsArray
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 5); // Limit to top 5 labels

    console.log(result);

  return (
    <>
      <div>
        {result.map((label, index) => (
          <Accordion key={label.label}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}a-content`}
              id={`panel${index + 1}a-header`}
            >
              <Typography color="common.black">{`${label.label} - ${label.totalCount} articles`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              
              <BubbleChart bubbleData={label.tractsCount}></BubbleChart>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};


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
        .slice(0, 5), // Limit to top 5 labels
    }))
    .sort((a, b) => b.totalLabelCount - a.totalLabelCount)
    .slice(0, 10); // Limit to top 5 tracts

    console.log("tractDetailsArray: ", tractDetailsArray);
  return (
    <>
      <div>
        {tractDetailsArray.map((tractDetail, index) => (
          <Accordion key={tractDetail.tract}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}a-content`}
              id={`panel${index + 1}a-header`}
            >
              <Typography color="common.black">{`${
                tractDetail.tract
              } - ${getNeighborhood(tractDetail.tract, neighborhoods)} - ${
                tractDetail.totalLabelCount
              } articles`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              
              <BubbleChart bubbleData={tractDetail.labelsCount}></BubbleChart>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};



const wrapper = (
  flag: boolean,
  articles: Article[],
  neighborhoods: { [key: string]: string[] }
): React.ReactElement<any, any> => {
  return flag
    ? getLabelDetailsWithLimitedTracts(articles, neighborhoods)
    : getTractDetailsWithTotalCount(articles, neighborhoods);
};

interface AccordionProps {
  isLabels: boolean;
}

const BasicAccordion: React.FC<AccordionProps> = ({ isLabels }) => {
  const { articleData, queryArticleDataType } =
    React.useContext(ArticleContext)!;
  const [articles, setArticles] = React.useState<Article[]>([]);
  const { neighborhoodMasterList } = React.useContext(NeighborhoodContext)!;
  React.useEffect(() => {
    if (articleData) {
      setArticles(articleData);
    }
  }, [articleData]);

  const component = isLabels
    ? getLabelDetailsWithLimitedTracts(articles, neighborhoodMasterList!)
    : getTractDetailsWithTotalCount(articles, neighborhoodMasterList!);

  return (
    <>
      <Card className="body" sx={{ width: "100%" }}>
        <CardContent sx={{ width: "100%" }}>
          {articles === null || articles.length === 0 ? (
            <Callback></Callback>
          ) : (
            wrapper(isLabels, articles, neighborhoodMasterList!)
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default BasicAccordion;
