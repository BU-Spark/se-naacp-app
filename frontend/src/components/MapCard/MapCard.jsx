import React from "react";
import "./MapCard.css";

// GeoJSON
import geoData from "../../assets/mapsJSON/Census2020_Tracts.json";

// MUI Card
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { NeighborhoodContext2 } from "../../contexts/neighborhoodContext";

// MUI Loading
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

// Map API (Pigeon Maps)
import { GeoJson, Map, Marker, ZoomControl } from "pigeon-maps";

// React Contexts/Context Methods
import { DateContext, DateMethods } from "../../contexts/dateContext.js";
import { StateContext, stateMethods } from "../../contexts/stateContext.js";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setLoadingState } from "../../redux/masterState/masterStateSlice";

// Uniqid for unique keys
import uniqid from "uniqid";
import dayjs from "dayjs";

// AntDesign
import { Menu } from "antd";

// Data Methods
import DataMethods from "../../Pipelines/data";

const MapCard = () => {
  const defaultLoc = {
    name: "Boston City",
    latitude: 42.360953,
    longitude: -71.058304,
  };

  const [currLocation, SetCurrLocation] = React.useState(defaultLoc);

  const [currTractLocation, SetTractCurrLocation] = React.useState("");
  const [locations, SetLocations] = React.useState([]);

  const [tractGEOJSON, setTractGEOJSON] = React.useState({
    type: "FeatureCollection",
    name: "Census2020_Tracts",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [],
  });

  const onSelectionNeigh = (v) => {
    console.log("V:", v);
    if (v.length !== 0) {
      let result = locations.filter((obj) => {
        return obj.name === v[v.length - 1];
      });
      console.log("SELECTED TRACK:", result);
      SetCurrLocation(result[0]);
      setTractShapes(result[0].tracts);
    }
  };
  const setTractShapes = (tracts) => {
    let GEOJSON_All = geoData.features;
    let features_list = [];

    tracts.forEach((tract) => {
      let obj = GEOJSON_All.find((v) => v.properties.TRACTCE20 === "" + tract);
      features_list.push(obj);
    });

    setTractGEOJSON({
      type: "FeatureCollection",
      name: "Census2020_Tracts",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: features_list,
    });
    return;
  };
  // Default Location

  // Default center is Boston City
  const BostonMapAPI = () => {
    return (
      <Map
        defaultCenter={[defaultLoc.latitude, defaultLoc.longitude]}
        defaultZoom={13}
        center={[defaultLoc.latitude, defaultLoc.longitude]}
      >
        <ZoomControl />
        <GeoJson
          onClick={(v) => {
            console.log(v);
          }}
          data={tractGEOJSON}
          styleCallback={(feature, hover) => {
            if (feature.properties.TRACTCE20 === currTractLocation) {
              return hover
                ? { fill: "#93c0d099", strokeWidth: "2" }
                : { fill: "#ff0000", strokeWidth: "1", opacity: "0.5" };
            } else {
              return hover
                ? { fill: "#93c0d099", strokeWidth: "2" }
                : { fill: "#0026ff", strokeWidth: "1", opacity: "0.5" };
            }
          }}
        />
        {locations.map((v) => {
          return (
            <Marker
              key={uniqid()}
              width={30}
              anchor={[v.latitude, v.longitude]}
            />
          );
        })}
      </Map>
    );
  };

  const fixedLatLong = (neigh) => {
    switch (neigh) {
      case "Allston":
        return { latitude: 42.35345, longitude: -71.13218 };
      case "Back Bay":
        return { latitude: 42.348722, longitude: -71.079539 };
      case "Beacon Hill":
        return { latitude: 42.359207, longitude: -71.06773 };
      case "Brighton":
        return { latitude: 42.348378, longitude: -71.160506 };
      case "Charlestown":
        return { latitude: 42.37825, longitude: -71.061559 };
      case "Dorchester":
        return { latitude: 42.298543, longitude: -71.064899 };
      case "Downtown":
        return { latitude: 42.356037, longitude: -71.05668 };
      case "East Boston":
        return { latitude: 42.379753, longitude: -71.025569 };
      case "Fenway":
        return { latitude: 42.346434, longitude: -71.097272 };
      case "Harbor Islands":
        return { latitude: 42.329368, longitude: -70.957648 };
      case "Hyde Park":
        return { latitude: 42.255345, longitude: -71.125637 };
      case "Jamaica Plain":
        return { latitude: 42.311641, longitude: -71.113521 };
      case "Longwood Medical Area":
        return { latitude: 42.338214, longitude: -71.105204 };
      case "Mattapan":
        return { latitude: 42.27668, longitude: -71.093567 };
      case "Mission Hill":
        return { latitude: 42.329583, longitude: -71.106271 };
      case "North End":
        return { latitude: 42.364957, longitude: -71.05549 };
      case "Roslindale":
        return { latitude: 42.28262, longitude: -71.126447 };
      case "Roxbury":
        return { latitude: 42.311231, longitude: -71.089716 };
      case "South Boston":
        return { latitude: 42.334638, longitude: -71.045805 };
      case "South Boston Waterfront":
        return { latitude: 42.345244, longitude: -71.042565 };
      case "South End":
        return { latitude: 42.340366, longitude: -71.070795 };
      case "West End":
        return { latitude: 42.365006, longitude: -71.064297 };
      case "West Roxbury":
        return { latitude: 42.277277, longitude: -71.160691 };
      default:
        return { latitude: 42.360081, longitude: -71.058884 };
    }
  };

  return (
    <>
      <Card className="body" sx={{ width: "100%", height: "62vh" }}>
        <CardContent sx={{ width: "100%", height: "62vh" }}>
          {BostonMapAPI()}
        </CardContent>
      </Card>
    </>
  );
};

export default MapCard;
