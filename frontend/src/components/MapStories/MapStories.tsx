import { GeoJson, Map, Marker, Overlay, ZoomControl } from "pigeon-maps";
// import { Cluster } from "pigeon-maps-cluster";
import { useState, useContext, useEffect } from "react";
import useSupercluster from "use-supercluster";
import { ArticleContext } from "../../contexts/article_context";
import { Article } from "../../__generated__/graphql";
import Box from '@mui/material/Box';
import { BBox, GeoJsonProperties } from "geojson"; 
import { PointFeature, ClusterProperties} from 'supercluster';
import ArticleCard from "../../components/ArticleCard/ArticleCard";

import "./MapStories.css";
import { trace } from "console";


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
    const [activeTopic, setActiveTopic] = useState<string[]>([])
    const [selectedArticles, setSelectedArticles] = useState<Article[]>([]); 

    const [zoom, setZoom] = useState(13);
    const [center, setCenter] = useState<[number, number]>([42.3601, -71.0589]);
    const [bounds, setBounds] = useState<BBox>();


    const points: Array<PointFeature<GeoJsonProperties>> =  articles
        .filter(article => article.Coordinates && article.Coordinates.length >= 2)
        .map(article => ({
            type: "Feature",
            properties: { cluster: false, articleId: article.link, hl1: article.hl1, dateSum: article.dateSum, openai_labels: article.openai_labels, neighborhoods:article.neighborhoods, pub_date: article.pub_date , tracts: article.tracts},
            geometry: {
                type: "Point",
                coordinates: [article.Coordinates![0], article.Coordinates![1]]
            }
        }));

    const { clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom,
        options: { radius: 40, maxZoom: 20 }
    });


    
 
    useEffect(() => {
        if (articleData2) {
            setArticles(articleData2);
        }
      
    }, [articleData2]);  

    const handleClusterClick = (cluster_id:any) => {
        if (supercluster) {
            const articles = supercluster.getLeaves(cluster_id, Infinity);
            setSelectedArticles(articles.map((article:any) => article.properties));
        }
    };


return (
    <div>
        <Map
            height={900}
            center={center}
            zoom={zoom}
            onBoundsChanged={({ center, zoom, bounds }) => {
                setCenter(center);
                setZoom(zoom);
                setBounds([
                    bounds.sw[1],
                    bounds.sw[0],
                    bounds.ne[1],
                    bounds.ne[0]
                ]);
            }}
        >
            
            <ZoomControl />

            {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const properties = cluster.properties as GeoJsonProperties & { cluster: boolean, point_count: number };

                    if (properties.cluster) {
                        const size = 10 + (properties.point_count / points.length) * 80;
                        return (
                            <Overlay
                                key={`cluster-${cluster.id}`}
                                anchor={[latitude, longitude]}
                            >
                                <div className="cluster-marker" style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                }}
                                onClick={() => handleClusterClick(cluster.id)}
                                >

                                    {properties.point_count}
                                </div>
                            </Overlay>
                        );
                    }

                    return (
                        <Marker
                            key={`article-${properties.articleId}`}
                            anchor={[latitude, longitude]}
                            onClick={() => { window.open(properties.articleId) }}
                            onMouseOver={() => {
                                setShowPopup(true);
                                setActiveCoordinates([latitude, longitude]);
                                setActiveHl1(properties.hl1);
                                setActiveDateSum(properties.dateSum);
                                setActiveTopic(properties.openai_labels);
                            }}
                            onMouseOut={() => { setShowPopup(false) }}
                        />
                    );
                })}
            
            {showPopup && 
                <Overlay anchor={activeCoordinates}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                        <div>{activeHl1}</div>
                        <div>{formatDate(activeDateSum)}</div>
                        <div>{activeTopic.join(", ")}</div>
                    </Box>
                </Overlay>
            }

            
        </Map>

        {selectedArticles.length > 0 && (
            <ArticleCard optionalArticles={selectedArticles} />
        )}
    </div>
);
};

export default MapStories;