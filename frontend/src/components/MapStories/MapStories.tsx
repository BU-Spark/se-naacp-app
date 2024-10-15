import { GeoJson, Map, Marker, Overlay, ZoomControl } from "pigeon-maps";
// import { Cluster } from "pigeon-maps-cluster";
import { useState, useContext, useEffect } from "react";
import { ArticleContext } from "../../contexts/article_context";
import { LocationContext } from "../../contexts/location_context";
import { Article, Locations } from "../../__generated__/graphql";
import Box from '@mui/material/Box';
import { BBox, GeoJsonProperties } from "geojson"; 
import { PointFeature, ClusterProperties} from 'supercluster';
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import { Modal } from '@mui/material'; // Import Modal
import { Link } from 'react-router-dom'; // Add this import
import useSupercluster from "use-supercluster";
import { Typography } from '@mui/material'; // Import Typography for better text styling
import "./MapStories.css";


interface MapStoriesProps {
    selectedTopics: string[];
    setSelectedTopics: (topics: string[]) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    center: [number, number];
    setCenter: (center: [number, number]) => void;
}

const ColorLegend: React.FC<{ selectedTopics: string[] }> = ({ selectedTopics }) => (
    <div style={{ margin: '10px', padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc', opacity: 0.8}}>
        {selectedTopics.map((topic,index) => (
            <div key={topic} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: presetColors[index], marginRight: '5px' }}></div>
                <Typography style={{color: 'black'}}>{topic}</Typography>
            </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#1978c8', marginRight: '5px' }}></div>
            <Typography style={{ color: 'black' }}>Cluster </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'red', marginRight: '5px' }}></div>
            <Typography style={{color: 'black'}}>Last Clicked Cluster</Typography>
        </div>
    </div>
);

const formatDate = (dateSum: number) => {
    const dateStr = dateSum.toString();
    const formattedDateStr = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    return new Date(formattedDateStr).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

const presetColors = [
    '#FF5733', // Color for topic 1
    '#33FF57', // Color for topic 2
    '#3357FF', // Color for topic 3
    '#F1C40F', // Color for topic 4
    '#8E44AD'  // Color for topic 5
];



const getRecentArticles = (articles: Article[]) => {
    return articles
        .sort((a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime()) // Sort by date published
        .slice(0, 3); // Get the top 3 most recent articles
};
    

const MapStories: React.FC<MapStoriesProps> = ({ selectedTopics, setSelectedTopics, zoom, setZoom, center, setCenter}) => {
	const { articleData, queryArticleDataType } = useContext(ArticleContext)!;
    const { articleData2, queryArticleDataType2 } = useContext(ArticleContext)!;
    const { locationsData } = useContext(LocationContext)!;

    const [articles, setArticles] = useState<Article[]>([]);
    const [locations, setLocations] = useState<Locations[]>([]);

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
            (selectedTopics.length === 0 || selectedTopics.includes(article.openai_labels!))
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

    useEffect(() => {
        if (locationsData) {
            setLocations(locationsData);
        }
    }, [locationsData]);

    const handleClusterClick = (cluster_id:any) => {
        if (supercluster) {
            setLastClickedClusterId(cluster_id)
            localStorage.setItem('lastClickedClusterId', (cluster_id)); // Store in localStorage
            const articles = supercluster.getLeaves(cluster_id, Infinity);
            
            const uniqueCords = new Set(articles.map((article:any) => article.geometry.coordinates.toString()));
            const matchingLocations = locations.filter(location => 
                uniqueCords.has(location.coordinates.toString())
            );

            const commonLocations = matchingLocations.sort((a, b) => b.articles.length - a.articles.length).slice(0, 5);
            const commonNeighborhood = commonLocations[0]?.neighborhood;
            const commonTract = commonLocations[0]?.tract;


            const recentArticles = getRecentArticles(articles.map((article:any) => article.properties));

            const locationValues = commonLocations.map(location => location.value);

            setModalData({
                location: locationValues,
                neighborhood: commonNeighborhood,
                tract: commonTract,
                articles:recentArticles
            })


            setModalOpen(true); // Open the modal
    }
    };

    useEffect(() => {
        console.log(modalData);
    }, [modalData]);


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

                    const pinColor = selectedTopics.length > 0 ? presetColors[selectedTopics.indexOf(properties.openai_labels!)] : ''; // Default color if no topics selected
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
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}> {/* Added absolute positioning for the legend */}
            <ColorLegend selectedTopics={selectedTopics} />
        </div>

        {selectedArticles.length > 0 && (
            <ArticleCard optionalArticles={selectedArticles} />
        )}
    </div>
);
};

export default MapStories;