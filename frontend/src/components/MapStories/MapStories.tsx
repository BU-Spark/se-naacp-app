import { GeoJson, Map, Marker, Overlay, ZoomControl } from "pigeon-maps";
// import { Cluster } from "pigeon-maps-cluster";
import { useState, useContext, useEffect } from "react";
import { ArticleContext } from "../../contexts/article_context";
import { Article } from "../../__generated__/graphql";
import Box from '@mui/material/Box';
import { BBox, GeoJsonProperties } from "geojson"; 
import { PointFeature, ClusterProperties} from 'supercluster';
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import { Modal } from '@mui/material'; // Import Modal
import { Link } from 'react-router-dom'; // Add this import
import useSupercluster from "use-supercluster";




import "./MapStories.css";


interface MapStoriesProps {
    selctedTopics: string[];
    setSelectedTopics: (topics: string[]) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    center: [number, number];
    setCenter: (center: [number, number]) => void;
}

const formatDate = (dateSum: number) => {
    const dateStr = dateSum.toString();
    const formattedDateStr = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    return new Date(formattedDateStr).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

const generateColor = (topic: string) => {
    // Generate a color based on the topic string
    const hash = Array.from(topic).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360; // Get a hue value based on the hash
    return `hsl(${hue}, 70%, 50%)`; // Return a color in HSL format
};



const getMostCommonLocations = (articles:Article[]) => {
    const locationCount: { [key: string]: number } = {};
    articles.forEach(article => {
        article.locations?.forEach(location => {
            locationCount[location] = (locationCount[location] || 0) + 1;
        });
    });

    return Object.entries(locationCount)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)
    .map(([location]) => location);

};

const getNeighborhoodAndTract = (articles:Article[], commonLocation:string) => {

    let articleIndex = -1

    for (let i = 0; i < articles.length; i++) {
        if (articles[i].locations?.includes(commonLocation)) {
            articleIndex = i
            break;
        }
    }

    if (articleIndex === -1) {
        return;
    }

    const locationIndex = articles[articleIndex].locations?.indexOf(commonLocation);
    const tract = articles[articleIndex].tracts[locationIndex!];
    const neighborhood = articles[articleIndex].neighborhoods[locationIndex!];

    return { neighborhood, tract };
}

const getRecentArticles = (articles: Article[]) => {
    return articles
        .sort((a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime()) // Sort by date published
        .slice(0, 3); // Get the top 3 most recent articles
};
    

const MapStories: React.FC<MapStoriesProps> = ({ selctedTopics, setSelectedTopics, zoom, setZoom, center, setCenter}) => {
    const [articles, setArticles] = useState<Article[]>([]);
	const { articleData, queryArticleDataType } = useContext(ArticleContext)!;
    const { articleData2, queryArticleDataType2 } = useContext(ArticleContext)!;
    const [showPopup, setShowPopup] = useState(false);
    const [activeCoordinates, setActiveCoordinates] = useState<[number, number]>([0,0]);
    const [activeHl1, setActiveHl1] = useState<string>("");
    const [activeDateSum, setActiveDateSum] = useState<number>(0);
    const [activeTopic, setActiveTopic] = useState<string>()
    const [activeLocations, setActiveLocations] = useState<string[]>([]);
    const [selectedArticles, setSelectedArticles] = useState<Article[]>([]); 

    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<any>(null); // State to hold modal data

    const [isMounted, setIsMounted] = useState(false);

    const [lastClickedClusterId, setLastClickedClusterId] = useState<number | null>(null);

    const [bounds, setBounds] = useState<BBox>();




    useEffect(() => {
        // Retrieve saved position from localStorage
        const savedCenter = localStorage.getItem('mapCenter');
        const savedZoom = localStorage.getItem('mapZoom');
        const storedClusterId = localStorage.getItem('lastClickedClusterId');
        if (storedClusterId) {
            setLastClickedClusterId(parseInt(storedClusterId));
        }
        if (savedCenter) {
            setCenter(JSON.parse(savedCenter));
        }
        if (savedZoom) {
            setZoom(Number(savedZoom));
        }
    }, []);


    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('mapZoom', zoom.toString());
            localStorage.setItem('mapCenter', JSON.stringify(center));
        } else {
            setIsMounted(true);
        }
    }, [center, zoom]);





    const points: Array<PointFeature<GeoJsonProperties>> =  articles
        .filter(article => 
            article.coordinates && article.coordinates.length > 0 &&
            (selctedTopics.length === 0 || selctedTopics.includes(article.openai_labels!))
        )
        .flatMap(article => 
            article.coordinates?.map(coord => ({
                type: "Feature",
                properties: { cluster: false, articleId: article.link, hl1: article.hl1, dateSum: article.dateSum, openai_labels: article.openai_labels, neighborhoods: article.neighborhoods, pub_date: article.pub_date, tracts: article.tracts, link: article.link, locations:article.locations },
                geometry: {
                    type: "Point",
                    coordinates: coord // Use each coordinate
                }
            })) || [] // Ensure it returns an empty array if undefined
        );

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
            setLastClickedClusterId(cluster_id)
            localStorage.setItem('lastClickedClusterId', (cluster_id)); // Store in localStorage
            const articles = supercluster.getLeaves(cluster_id, Infinity);


            const commonLocations = getMostCommonLocations(articles.map((article:any) => article.properties))
            const neighborhoodAndTract = getNeighborhoodAndTract(articles.map((article:any) => article.properties), commonLocations[0]);
            const commonNeighborhood = neighborhoodAndTract?.neighborhood; 
            const commonTract = neighborhoodAndTract?.tract; 
            const recentArticles = getRecentArticles(articles.map((article:any) => article.properties));


            setModalData({
                location: commonLocations,
                neighborhood: commonNeighborhood,
                tract: commonTract,
                articles:recentArticles
            })


            setModalOpen(true); // Open the modal
    }
    };



return (
    <div className="full-screen-container">
 
        <Map
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
                    const isLastClicked = lastClickedClusterId === cluster.id; // Check if this is the last clicked cluster

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
                                    backgroundColor: isLastClicked ? 'red' : '#1978c8', 
                                }}
                                onClick={() => handleClusterClick(cluster.id)}
                                >

                                    {properties.point_count}
                                </div>
                            </Overlay>
                        );
                    }

                    const pinColor = selctedTopics.length > 0 ? generateColor(properties.openai_labels!) : ''; // Default color if no topics selected
                    return (
                        <Marker
                        key={`article-${properties.articleId}-${latitude}-${longitude}`} // Updated key
                        anchor={[latitude, longitude]}
                            onClick={() => { window.open(properties.link) }}
                            onMouseOver={() => {
                                setShowPopup(true);
                                setActiveCoordinates([latitude, longitude]);
                                setActiveHl1(properties.hl1);
                                setActiveDateSum(properties.dateSum);
                                setActiveTopic(properties.openai_labels);
                                setActiveLocations(properties.locations);
                            }}
                            color={showPopup && activeHl1 === properties.hl1 ? 'red' : pinColor} // Updated color logic
                            onMouseOut={() => { setShowPopup(false) }}
                        />
                    );
                })}

                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ 
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 900,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 10, 
                        }}>
                        <div>
                            <h2>Cluster Information</h2>
                            <div>
                                <strong>Location:</strong> 
                                <ul>
                                    {modalData?.location.map((location: string, index: number) => (
                                        <li key={index}><Link to={`/Locations?location=${encodeURIComponent(location)}`}>{location}</Link></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <strong>Neighborhood:</strong> {modalData?.neighborhood}
                            </div>
                            <div>
                                <strong>Tract:</strong> {modalData?.tract}
                            </div>
                            <div>
                                <h2>Recent Articles:</h2>
                                <table style={{ padding: '10px' }} >
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Topic</th>
                                            <th>Date Published</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modalData?.articles.map((article: any, index: number) => (
                                            <tr key={index}>
                                                <td style={{ padding: '10px' }}>
                                                    <Link to={article.link}>{article.hl1}</Link>
                                                </td>
                                                <td style={{ padding: '10px' }}><Link to={`/Topics?topic=${encodeURIComponent(article.openai_labels)}`}>{article.openai_labels}</Link></td>
                                                <td style={{ padding: '10px' }}>{formatDate(article.dateSum)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                      
                    </Box>
                </Modal>

            {showPopup && 
                <Overlay anchor={activeCoordinates}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                        <div>{activeHl1}</div>
                        <div>Date: {formatDate(activeDateSum)}</div>
                        <div>Topic: {activeTopic}</div>
                        <div>Locations:</div>
                        {activeLocations.map((location, index) => (
                                <div key={index}>{index + 1}. {location}</div>
                            ))}
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