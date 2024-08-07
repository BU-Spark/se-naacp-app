import { GeoJson, Map, Marker, ZoomControl } from "pigeon-maps";

import { useState, useContext, useEffect } from "react";
import queryMethods from "../../Pipelines/data";

import { ArticleContext } from "../../contexts/article_context";
import { Article } from "../../__generated__/graphql";



const MapStories = () => {
    const [articles, setArticles] = useState<Article[]>([]);
	const { articleData, queryArticleDataType } = useContext(ArticleContext)!;
    const { articleData2, queryArticleDataType2 } = useContext(ArticleContext)!;

  
  
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
                //   onMouseOver = {() => {setShowPopup(true)}}
                //   onMouseOut = {() => {setShowPopup(false)}}
              />
            )
            ))}  
        </Map>
        
        {/* {showPopup && <div>WGBH</div>} */}
        </div>
    );
    };

export default MapStories;

