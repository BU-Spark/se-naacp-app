import React from "react";
import "./Neighborhood.css";

// GeoJSON
import geoData from '../../assets/mapsJSON/Census2020_Tracts.json'

// MUI Card
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Map API (Pigeon Maps)
import { GeoJson, GeoJsonLoader, Map, Marker } from "pigeon-maps"

// MUI List
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// React Contexts/Context Methods
import { DateContext, DateMethods } from '../../contexts/dateContext.js';
import { StateContext, StateMethods } from '../../contexts/stateContext.js';

// Uniqid for unique keys
import uniqid from 'uniqid';
  
const NeighborhoodCard = () => {
    const { dates } = React.useContext(DateContext);  // Global Context of dates
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

    // Map Data
    const mapData = [
        {
            name: "Allston Village",
            latitude: 42.353450,
            longitude: -71.132180
        },
        {
            name: "Dorchester",
            latitude: 42.299782,
            longitude: -71.078842
        },
        {
            name: "Boston University",
            latitude: 42.351170,
            longitude: -71.110870
        },
        {
            name: "Mattapan Square",
            latitude: 42.279625,
            longitude: -71.093216
        },
        {
            name: "Roslindale",
            latitude: 42.2799644,
            longitude: -71.11892
        },
        {
            name: "Prudential",
            latitude: 42.347000,
            longitude: -71.07964
        },
        {
            name: "Roxbury",
            latitude: 42.31460,
            longitude: -71.0883
        },
    ];

    // React Maps Objects recieved by data
    const [currLocation, SetCurrLocation] = React.useState(mapData[0]);
    // const [locations, SetLocations] = React.useState(mapData);

    // Use this to see individual tract
    const geoJsonSample = {
        "type": "FeatureCollection",
        "name": "Census2020_Tracts",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        features: [
            { "type": "Feature", "properties": { "OBJECTID": 91, "STATEFP20": "25", "COUNTYFP20": "025", "TRACTCE20": "030302", "GEOID20": "25025030302", "NAME20": "303.02", "NAMELSAD20": "Census Tract", "MTFCC20": "G5020", "FUNCSTAT20": "S", "ALAND20": 477388, "AWATER20": 0, "INTPTLAT20": "+42.3601404", "INTPTLON20": "-071.0577232", "Shape_STAr": 5138176.8777200002, "Shape_STLe": 9705.4173260999996 }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -71.062911, 42.361228999999888 ], [ -71.062762, 42.361641999999883 ], [ -71.062626, 42.361841999999825 ], [ -71.062499, 42.362000999999879 ], [ -71.062354, 42.362143 ], [ -71.062268, 42.362204999999847 ], [ -71.062194999999875, 42.362257999999848 ], [ -71.061856, 42.362429999999883 ], [ -71.061668999999895, 42.36249299999988 ], [ -71.061223, 42.362632999999839 ], [ -71.060878, 42.362730999999847 ], [ -71.060042, 42.362966999999855 ], [ -71.059939, 42.362990999999894 ], [ -71.059629999999899, 42.363045999999841 ], [ -71.059490999999838, 42.363103999999886 ], [ -71.05918, 42.363267999999898 ], [ -71.058957999999848, 42.363384999999873 ], [ -71.058389, 42.363691 ], [ -71.058412, 42.363847999999855 ], [ -71.058442, 42.364056 ], [ -71.058451, 42.364424 ], [ -71.058442, 42.364542999999898 ], [ -71.058435, 42.364616999999889 ], [ -71.058433, 42.36464099999985 ], [ -71.058295999999842, 42.364471999999864 ], [ -71.058228999999898, 42.364388999999854 ], [ -71.057893, 42.364041999999856 ], [ -71.057801, 42.363950999999858 ], [ -71.057661, 42.363811999999825 ], [ -71.057505, 42.363655999999885 ], [ -71.057289, 42.363467999999855 ], [ -71.05721, 42.363401999999887 ], [ -71.05707, 42.363288999999874 ], [ -71.056972, 42.363207999999837 ], [ -71.056381, 42.362883999999823 ], [ -71.055812, 42.362541999999848 ], [ -71.055681, 42.362468999999855 ], [ -71.055433, 42.36233 ], [ -71.054925, 42.362045999999872 ], [ -71.054858, 42.362013999999881 ], [ -71.05471, 42.361939999999862 ], [ -71.054562, 42.361866999999883 ], [ -71.053942, 42.36156 ], [ -71.053613, 42.361391999999896 ], [ -71.053297, 42.361218999999856 ], [ -71.052967, 42.361028999999846 ], [ -71.052809, 42.360914999999892 ], [ -71.052655999999899, 42.360793999999849 ], [ -71.052426999999852, 42.360595999999873 ], [ -71.052258, 42.360408 ], [ -71.052154, 42.360269999999851 ], [ -71.051996, 42.360025 ], [ -71.051895, 42.359815999999846 ], [ -71.051817, 42.359614999999891 ], [ -71.05172, 42.359291999999861 ], [ -71.051682, 42.359132999999844 ], [ -71.051657, 42.359039999999844 ], [ -71.051582, 42.358761999999878 ], [ -71.051652, 42.358750999999891 ], [ -71.051784, 42.358728999999883 ], [ -71.051993, 42.358693999999851 ], [ -71.052158, 42.358665999999843 ], [ -71.05219799999989, 42.358659999999837 ], [ -71.052294, 42.358646 ], [ -71.052748999999849, 42.358575999999836 ], [ -71.053192, 42.358495999999882 ], [ -71.053247999999869, 42.358478 ], [ -71.053321, 42.35845499999985 ], [ -71.053518, 42.35835599999988 ], [ -71.053764999999871, 42.358182999999869 ], [ -71.053961, 42.358011999999867 ], [ -71.054265, 42.357737 ], [ -71.054369999999821, 42.357661999999856 ], [ -71.054524, 42.357550999999894 ], [ -71.054847999999851, 42.35735 ], [ -71.05502, 42.357244999999899 ], [ -71.05519, 42.357143 ], [ -71.055539, 42.356971 ], [ -71.055758999999881, 42.356912999999842 ], [ -71.056292, 42.356873999999834 ], [ -71.056589999999858, 42.356851999999876 ], [ -71.057191, 42.356821999999887 ], [ -71.057709999999815, 42.356776999999823 ], [ -71.057993, 42.356788999999807 ], [ -71.058139999999867, 42.356814999999898 ], [ -71.058235, 42.356831999999848 ], [ -71.058737, 42.356988 ], [ -71.058561, 42.357160999999891 ], [ -71.05849499999988, 42.357220999999875 ], [ -71.05829, 42.357409999999852 ], [ -71.058759, 42.357576999999885 ], [ -71.059299, 42.357765999999849 ], [ -71.059612999999814, 42.357862999999881 ], [ -71.060354, 42.358092 ], [ -71.061258999999865, 42.358283 ], [ -71.06151, 42.358336 ], [ -71.061714, 42.358318 ], [ -71.061976999999871, 42.358245999999866 ], [ -71.062374999999861, 42.358094999999864 ], [ -71.062642, 42.357976999999863 ], [ -71.062726999999896, 42.358310999999894 ], [ -71.062816999999896, 42.358664999999839 ], [ -71.062823, 42.358714 ], [ -71.062846, 42.358888999999863 ], [ -71.062862, 42.35920399999987 ], [ -71.062874999999863, 42.359482999999848 ], [ -71.062865, 42.359989 ], [ -71.06286399999982, 42.36009 ], [ -71.062911, 42.361228999999888 ] ] ] } },
        ],
    };

    // Default center is Boston
    const BostonMapAPI = () => {
        return (
          <Map defaultCenter={[mapData[0].latitude, mapData[0].longitude]} defaultZoom={13} center={[currLocation.latitude,currLocation.longitude]}>
            <GeoJson
                data={geoJsonSample}
                styleCallback={(feature, hover) =>
                    hover
                      ? { fill: '#93c0d099', strokeWidth: '2'}
                      : { fill: '#0026ff', strokeWidth: '1', opacity: '0.5'}
                }
            />
            {mapData.map( (v) => {
                return <Marker key={uniqid()} width={30} anchor={[v.latitude, v.longitude]} />
            })}
          </Map>
        )
    };

    React.useEffect(() => {
        
    },[dates, currentState])
    
    return (
    <>
        <Card className="body" sx={{width: "100%", height: "80.5vh"}}>
            <CardContent>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        {/* Table */}
                        <div style={{display: "flex", width: "40%", flexDirection: "column", marginRight: 20}}>
                            <h3 className="card">Neighborhoods Covered Most</h3>
                            <div style={{width: "100%"}}>
                                <List
                                sx={{overflow: "auto", maxHeight: "85%", bgcolor: 'white' }}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <p>Name</p>
                                    <div style={{flex: 1}}></div>
                                    <p>Coverage</p>
                                </div>
                                </ListSubheader>}>
                                    {mapData.map( (v) => { return <ListItemButton 
                                    key={uniqid()}
                                    onClick={() => {SetCurrLocation(v)}}
                                    selected={currLocation.name === v.name ? true:false}>
                                        <ListItemText primary={`${v.name}`} />
                                        <div style={{flex: 1}}></div>
                                        <p style={{
                                            backgroundColor: "#0080FF", 
                                            borderRadius: 100, 
                                            width: 30, 
                                            color: "white", 
                                            display: "flex", 
                                            justifyContent: "center"}}>17</p>
                                    </ListItemButton>
                                    })}
                                </List>
                            </div>
                        </div> 
                        <div style={{flex: 1}}></div>

                        {/* Maps API */}
                        <div style={{ height: "75vh", width: '70%' }}>
                            {BostonMapAPI()}
                        </div>
                    </div>
            </CardContent>
        </Card>
    </>
    );
}

export default NeighborhoodCard;