import React from "react";
import "./Neighborhood.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Temporary Map API (Pigeon Maps)
import { Map, Marker } from "pigeon-maps"

// MUI List
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// React Contexts/Context Methods
import { DateContext, DateMethods } from '../../contexts/dateContext.js';

// Uniqid for unique keys
import uniqid from 'uniqid';
  
const NeighborhoodCard = () => {
    const {dates} = React.useContext(DateContext);  // Global Context of dates

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

    // Default center is Boston
    const BostonMapAPI = () => {
        return (
          <Map defaultCenter={[mapData[0].latitude, mapData[0].longitude]} defaultZoom={13} center={[currLocation.latitude,currLocation.longitude]}>
            {mapData.map( (v) => {
                return <Marker key={uniqid()} width={30} anchor={[v.latitude, v.longitude]} />
            })}
          </Map>
        )
    };

    React.useEffect(() => {
        console.log("The Dates: ", dates);
        console.log("Is dates Empty? ", DateMethods.isEmpty(dates));
        console.log("Is from date Empty? ", DateMethods.fromEmpty(dates));
        console.log("Is to date Empty? ", DateMethods.toEmpty(dates));
    },[dates])
    
    return (
    <>
        <Card className="body" sx={{ maxWidth: 800, maxHeight: 450}}>
            <CardContent>
                    <h3 className="card">Neighborhoods Covered Most</h3>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        {/* Table */}
                        <div style={{marginRight: 20,  width: "60%"}}>
                            <List
                            sx={{overflow: "auto", maxHeight: 350, bgcolor: 'white' }}
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
                            
                        <div style={{flex: 1}}></div>

                        {/* Maps API */}
                        <div style={{ height: '350px', width: '250px' }}>
                            {BostonMapAPI()}
                        </div>
                    </div>
            </CardContent>
        </Card>
    </>
    );
}

export default NeighborhoodCard;