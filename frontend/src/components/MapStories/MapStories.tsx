import { GeoJson, Map, Marker, Overlay, ZoomControl } from "pigeon-maps";

import { useState, useContext, useEffect } from "react";
import queryMethods from "../../Pipelines/data";

import { ArticleContext } from "../../contexts/article_context";
import { Article } from "../../__generated__/graphql";
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';


const formatDate = (dateSum: number) => {
    const dateStr = dateSum.toString();
    const formattedDateStr = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    return new Date(formattedDateStr).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};


const MapStories = () => {
    const [articles, setArticles] = useState<Article[]>([]);
	const { articleData, queryArticleDataType } = useContext(ArticleContext)!;
    const { articleData2, queryArticleDataType2 } = useContext(ArticleContext)!;
    const [showPopup, setShowPopup] = useState(false);
    const [activeCoordinates, setActiveCoordinates] = useState<[number, number]>([0,0]);
    const [activeHl1, setActiveHl1] = useState<string>("");
    const [activeDateSum, setActiveDateSum] = useState<number>(0);




  
  
    useEffect(() => {
        if (articleData2) {
            setArticles(articleData2);
        }
      
    }, [articleData2]);  

    console.log("articledata2", articleData2)

    

    return (
        <div>
        <Map height={900} defaultCenter={[42.3601,-71.0589]} defaultZoom={13}>
            {articles.map((article, index) => (
                article.Coordinates && article.Coordinates.length >= 2 && (
                  <Marker width={50} 
                  onClick = {() => {window.open(article.link)}}
                  key={index}
                  anchor={[article.Coordinates![1], article.Coordinates![0]]}
                  onMouseOver = {() => {
                    setShowPopup(true)
                    setActiveCoordinates([article.Coordinates![1], article.Coordinates![0]]);
                    setActiveHl1(article.hl1);
                    setActiveDateSum(article.dateSum);
                }}
                  onMouseOut = {() => {setShowPopup(false)}}
              />
            )
            ))}  

            {showPopup && 
                <Overlay anchor={activeCoordinates}>
                        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                            <div>{activeHl1}</div>
                            <div>{formatDate(activeDateSum)}</div>
                        </Box>

                </Overlay>

        }
        </Map>
        
        {/* {showPopup && <div>WGBH</div>} */}
        </div>
    );
    };

export default MapStories;

