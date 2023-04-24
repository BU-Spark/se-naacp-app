import React from "react";
import "./Neighborhood.css";

// GeoJSON
import geoData from '../../assets/mapsJSON/Census2020_Tracts.json'

// MUI Card
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Map API (Pigeon Maps)
import { GeoJson, Map, Marker, ZoomControl } from "pigeon-maps"

// React Contexts/Context Methods
import { DateContext, DateMethods } from '../../contexts/dateContext.js';
import { StateContext, stateMethods } from '../../contexts/stateContext.js';

// Redux
import { useSelector } from 'react-redux'

// Uniqid for unique keys
import uniqid from 'uniqid';

// AntDesign
import { Menu } from 'antd';

// Data Methods 
import DataMethods from '../../Pipelines/data';

function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
}
  
const NeighborhoodCard = () => {
    const { dates } = React.useContext(DateContext);  // Global Context of dates
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

    const state_neigh = useSelector((state) => state.masterState.neighborhoods_master.payload) // Redux Neighborhood Master List

    // Default Location
    const defaultLoc = {
        name: "Boston City",
        latitude: 42.360953,
        longitude:-71.058304
    }

    // React Maps Objects recieved by data
    const [currLocation, SetCurrLocation] = React.useState(defaultLoc);
    const [tractGEOJSON, setTractGEOJSON] = React.useState(
        {
            "type": "FeatureCollection",
            "name": "Census2020_Tracts",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": []
        }
    );
    const [locations, SetLocations] = React.useState([]);
    const [items, setItems] = React.useState([]);

    const returnRawNeighborhoodNames = (str) => {
        return str.replaceAll(" ", "_").toLowerCase();
    }

    // Find and set relevant Tract Shapes
    const setTractShapes = (tracts) => {
        let GEOJSON_All = geoData.features;
        let features_list = [];

        tracts.forEach((tract) => {
            let obj = GEOJSON_All.find((v) => v.properties.TRACTCE20 === ("" + tract)); 
            features_list.push(obj)
        });

        setTractGEOJSON(
            {
                "type": "FeatureCollection",
                "name": "Census2020_Tracts",
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features": features_list
            }
        )
        return;
    }

    // Show Neighborhood and collection of Tracts
    const onSelectionNeigh = (v) => {
        if (v.length !== 0){
            let result = locations.filter( (obj) => {
                return obj.name === v[v.length - 1]
            })
            SetCurrLocation(result[0]);
            setTractShapes(result[0].tracts)
        }
    }

    // Handle Map API click
    const onTractMapAPIClick = (v) => {
        console.log("Tract:", v.payload.properties.TRACTCE20)
        console.log("Tract Name:", v.payload.properties.NAME20)
    }

    const setTractDataToAll =  async (tract) => {
        const data = await DataMethods.getCensusDateData(dates[0], dates[1], tract).then((v) => {
            let v_string = JSON.stringify(v);
            if (v_string.includes("Error")){
                console.log("Specific tract information not found!");
                let newState = currentState;
                delete newState.CensusTract;
                newState = stateMethods.updateModified(newState);
                setState(newState);
            } else {
                let newState = {
                    ...currentState,
                    CensusTract: v
                }
                newState = stateMethods.updateModified(newState);
                setState(newState);
            }
        })
    }

    const selectTrack = (e) => {
        console.log(e);
        if (e.key.includes("all")) {
            let deconstruct_str = e.key.slice(4);
            let tract_list = deconstruct_str.split(",");
            setTractShapes(tract_list);
        } else {
            setTractShapes([e.key]);
            setTractDataToAll(e.key);
        }
    };

    // Default center is Boston City
    const BostonMapAPI = () => {
        return (
          <Map defaultCenter={[defaultLoc.latitude, defaultLoc.longitude]} defaultZoom={13} center={[currLocation.latitude,currLocation.longitude]}>
            <ZoomControl />
            <GeoJson
                onClick={ (v) => {
                    onTractMapAPIClick(v)
                }}
                data={tractGEOJSON}
                styleCallback={(feature, hover) =>
                    hover
                      ? { fill: '#93c0d099', strokeWidth: '2'}
                      : { fill: '#0026ff', strokeWidth: '1', opacity: '0.5'}
                }
            />
            {locations.map( (v) => {
                return <Marker key={uniqid()} width={30} anchor={[v.latitude, v.longitude]} />
            })}
          </Map>
        )
    };

    // Temporary Latitude and longitudes (hardcoded)
    const fixedLatLong = (neigh) => {
        switch (neigh) {
            case "Allston":
                return {latitude: 42.353450, longitude: -71.132180};
            case "Back Bay":
                return {latitude: 42.348722, longitude: -71.079539};
            case "Beacon Hill":
                return {latitude: 42.359207, longitude: -71.067730};
            case "Brighton":
                return {latitude: 42.348378, longitude: -71.160506};
            case "Charlestown":
                return {latitude: 42.378250, longitude: -71.061559};
            case "Dorchester":
                return {latitude: 42.298543, longitude: -71.064899};  
            case "Downtown":
                return {latitude: 42.356037, longitude: -71.056680};
            case "East Boston":
                return {latitude: 42.379753, longitude: -71.025569};
            case "Fenway":
                return {latitude: 42.346434, longitude: -71.097272};
            case "Harbor Islands":
                return {latitude: 42.329368, longitude: -70.957648};
            case "Hyde Park":
                return {latitude: 42.255345, longitude: -71.125637}; 
            case "Jamaica Plain":
                return {latitude: 42.311641, longitude: -71.113521};
            case "Longwood Medical Area":
                return {latitude: 42.338214, longitude: -71.105204};
            case "Mattapan":
                return {latitude: 42.276680, longitude: -71.093567};
            case "Mission Hill":
                return {latitude: 42.329583, longitude: -71.106271};
            case "North End":
                return {latitude: 42.364957, longitude: -71.055490}; 
            case "Roslindale":
                return {latitude: 42.282620, longitude: -71.126447};
            case "Roxbury":
                return {latitude: 42.311231, longitude: -71.089716};
            case "South Boston":
                return {latitude: 42.334638, longitude: -71.045805};
            case "South Boston Waterfront":
                return {latitude: 42.345244, longitude: -71.042565}; 
            case "South End":
                return {latitude: 42.340366, longitude: -71.070795};
            case "West End":
                return {latitude: 42.365006, longitude: -71.064297};
            case "West Roxbury":
                return {latitude: 42.277277, longitude: -71.160691}; 
            default:
                return {latitude: 42.360081, longitude: -71.058884};
        }
        
    }

    React.useEffect(() => {
        if (currentState.Subneighborhoods !== undefined) {         // Quick and Dirt
            let neighborhoodTractMapData = stateMethods.updateModified(currentState.Subneighborhoods);
            let _items = [];

            for (let i = 0; i < neighborhoodTractMapData.length; i++) {
                // Create the names
                let nameList = neighborhoodTractMapData[i].neighborhood.replaceAll('_', ' ').split(" ");
                let name = ""
                nameList.forEach((e) => {
                    name = name + " " + e.charAt(0).toUpperCase() + e.slice(1);
                    name = name.trim();
                });
                // Get Lat Long information
                let latlongBlock = fixedLatLong(name);

                neighborhoodTractMapData[i] = {
                    name: name,
                    longitude: latlongBlock.longitude,
                    latitude: latlongBlock.latitude,
                    tracts: neighborhoodTractMapData[i].tracts
                }

                let tract_arr = [];
                let tracts = neighborhoodTractMapData[i].tracts;
                for (var k = 0; k < tracts.length; k++) {
                    tract_arr.push(
                        getItem(`Tract: ${tracts[k]}`, `${tracts[k]}`)
                    )
                }

                // Push a All option
                tract_arr.push(
                    getItem(`All`, `all_${tracts}`)
                )

                _items.push(
                    getItem(`${name}`, `${name}`, <></>, tract_arr)
                );
            }

            setItems(_items);
            SetLocations(neighborhoodTractMapData);
        }

        if (currentState.currentNeigh !== undefined){
            if (currentState.currentNeigh !== "boston_city") {
                let neigh = items.filter(obj => {
                    return returnRawNeighborhoodNames(obj.key) === currentState.currentNeigh
                });
                let tract_arr = [];
                neigh[0].children.map((v) => {
                    if (!v.key.includes("all")) {
                        tract_arr.push(v.key);
                    }
                });

                setTractShapes(tract_arr);
            }
        }

    },[dates, currentState, state_neigh])
    
    return (
    <>
        <Card className="body" sx={{width: "100%", height: "80.5vh"}}>
            <CardContent>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        {/* Table */}
                        <div style={{display: "flex", width: "40%", flexDirection: "column", marginRight: 20}}>
                            <h3 className="card">Neighborhoods Covered Most</h3>
                            <div style={{width: "100%"}}>
                                <Menu
                                    onClick={selectTrack}
                                    onOpenChange={(v) => {onSelectionNeigh(v)}}
                                    style={{
                                        width: "100%",
                                        maxHeight: "63%",
                                        overflow: "auto",
                                    }}
                                    mode="inline"
                                    items={items}
                                />
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