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
import "./Accordion.css"
interface TractCount {
  tract: string;
  count: number;
}

interface LabelDetail {
  label: string;
  totalCount: number;
  tractsCount: TractCount[];
}

interface LabelCount {
  label: string;
  count: number;
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
  return null;
}

const getLabelDetailsWithLimitedTracts = (
  articles: Article[],
  neighborhoods: { [key: string]: string[] }
): React.ReactElement<any, any> => {
  const labelDetails: Record<
    string,
    { totalCount: number; tracts: Record<string, number> }
  > = {};

  // Counting labels and tracts
  articles.forEach((article) => {
    const countedLabels: Set<string> = new Set();

    article.openai_labels.forEach((label) => {
      if (!countedLabels.has(label)) {
        if (!labelDetails[label]) {
          labelDetails[label] = { totalCount: 0, tracts: {} };
        }
        labelDetails[label].totalCount =
          labelDetails[label].totalCount + article.tracts.length;
        countedLabels.add(label);
      }

      article.tracts.forEach((tract) => {
        labelDetails[label].tracts[tract] =
          (labelDetails[label].tracts[tract] || 0) + 1;
      });
    });
  });

  // Converting to desired structure with sorting and limiting tracts
  const labelDetailsArray: LabelDetail[] = Object.entries(labelDetails).map(
    ([label, detail]) => ({
      label: label,
      totalCount: detail.totalCount,
      tractsCount: Object.entries(detail.tracts)
        .map(([tract, count]) => ({ tract, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5), // Limit to first 5 tracts
    })
  );

  // Sorting labels by total count
  const result = labelDetailsArray
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 5); // Limit to top 5 labels

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
              <Typography color="common.black">
                {label.tractsCount.map((tract) => (
                  <li key={tract.tract}>
                    {`${tract.tract} - ${getNeighborhood(tract.tract, neighborhoods)} - ${tract.count} articles`}
                  </li>
                ))}
              </Typography>
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
    { totalLabelCount: number; labels: Record<string, number> }
  > = {};

  // Counting tracts and labels within each tract
  articles.forEach((article) => {
    article.tracts.forEach((tract) => {
      if (!tractDetails[tract]) {
        tractDetails[tract] = { totalLabelCount: 0, labels: {} };
      }

      article.openai_labels.forEach((label) => {
        tractDetails[tract].labels[label] =
          (tractDetails[tract].labels[label] || 0) + 1;
        tractDetails[tract].totalLabelCount++;
      });
    });
  });

  // Converting to desired structure and slicing top 5 tracts
  const tractDetailsArray: TractDetail[] = Object.entries(tractDetails)
    .map(([tract, detail]) => ({
      tract: tract,
      totalLabelCount: detail.totalLabelCount,
      labelsCount: Object.entries(detail.labels)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5), // Limit to top 5 labels
    }))
    .sort((a, b) => b.totalLabelCount - a.totalLabelCount)
    .slice(0, 5); // Limit to top 5 tracts

  return (
    <>
      <div>
        {tractDetailsArray.map((label, index) => (
          <Accordion key={label.tract}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}a-content`}
              id={`panel${index + 1}a-header`}
            >
              <Typography color="common.black">{`${label.tract} - ${getNeighborhood(label.tract, neighborhoods)} - ${label.totalLabelCount} articles`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="common.black">
                {label.labelsCount.map((tract) => (
                  <li key={tract.label}>
                    {`${tract.label} - ${tract.count} articles`}
                  </li>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};


const wrapper = (flag: boolean,
    articles: Article[],
    neighborhoods: { [key: string]: string[] }
  ): React.ReactElement<any, any> => {

    return flag ? getLabelDetailsWithLimitedTracts(articles, neighborhoods) :getTractDetailsWithTotalCount(articles, neighborhoods)

  }



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
          {articles === null || articles.length === 0  ?(
            <Callback></Callback>
          ) : (
            wrapper(isLabels,articles, neighborhoodMasterList!)
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default BasicAccordion;
