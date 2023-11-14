import React, { useEffect } from "react";
import "./MapCard.css";

// GeoJSON
import geoData from "../../assets/mapsJSON/Census2020_Tracts.json";

// MUI Card
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// Map API (Pigeon Maps)
import { GeoJson, Map, Marker, ZoomControl } from "pigeon-maps";

// Uniqid for unique keys
import uniqid from "uniqid";
import dayjs from "dayjs";

// AntDesign
import { Menu } from "antd";

// Data Methods
import DataMethods from "../../Pipelines/data";
import { useParams } from "react-router-dom";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { TractContext } from "../../contexts/tract_context";
import Lottie from "react-lottie-player";

import emptyAstro from "../../assets/lottieFiles/astro_empty.json";

interface MapCardProps {
  clickable: boolean;
}

const fixedLatLong = (neighborhood: any) => {
  switch (neighborhood) {
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
    case "Longwood":
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

const setTractShapes = (tracts: string[]) => {
  let GEOJSON_All = geoData.features;
  let features_list: any = [];

  var dummy = tracts;
  if (!dummy) {
    dummy = [];
  }

  dummy.forEach((tract) => {
    let obj = GEOJSON_All.find((v) => v.properties.TRACTCE20 === "" + tract);
    features_list.push(obj);
  });

  return {
    type: "FeatureCollection",
    name: "Census2020_Tracts",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: features_list,
  };
};

const MapCard: React.FC<MapCardProps> = ({ clickable }) => {
  //Context
  const { neighborhoodMasterList, neighborhood, setNeighborhood } =
    React.useContext(NeighborhoodContext)!;
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;

  //UseState
  const [tract, setTract] = React.useState("");
  const [isNoData, setIsNoData] = React.useState(false);
  const latLong = fixedLatLong(neighborhood);
  const [location, setLocation] = React.useState({
    name: neighborhood,
    latitude: latLong.latitude,
    longitude: latLong.longitude,
  });

  React.useEffect(() => {
    if (!neighborhood || !tractData) {
      setIsNoData(true);
    } else {
      setIsNoData(false);
      const latLong = fixedLatLong(neighborhood);
      const defaultLocation = {
        name: neighborhood,
        latitude: latLong.latitude,
        longitude: latLong.longitude,
      };

      setTract(tractData!.tract);
      setLocation(defaultLocation);
    }
  }, [neighborhood, tractData]);

  return (
    <>
      <Card className="body" sx={{ width: "100%", height: "62vh" }}>
        <CardContent sx={{ width: "100%", height: "62vh" }}>
          {isNoData ? (
            <React.Fragment>
              <Lottie
                loop
                animationData={emptyAstro}
                play
                style={{ width: "100%", height: "auto" }}
              />
              <p className="empty-text">{"No Data out there :("}</p>
            </React.Fragment>
          ) : (
            <Map
              defaultCenter={[location.latitude, location.longitude]}
              defaultZoom={13}
              center={[location.latitude, location.longitude]}
            >
              <ZoomControl />
              <GeoJson
                onClick={(v) => {
                  // console.log(v.payload.properties.TRACTCE20);

                  if (clickable) {
                    // console.log(clickable);
                    queryTractDataType("TRACT_DATA", {
                      tract: v.payload.properties.TRACTCE20,
                    });
                  }
                }}
                data={setTractShapes(neighborhoodMasterList![neighborhood!])}
                styleCallback={(feature: any, hover: boolean) => {
                  if (feature.properties.TRACTCE20 === tract) {
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

              <Marker
                key={uniqid()}
                width={30}
                anchor={[location.latitude, location.longitude]}
              />
            </Map>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MapCard;
