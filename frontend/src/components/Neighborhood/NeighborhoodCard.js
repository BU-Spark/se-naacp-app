import React, { useState, useEffect } from "react";
import "./Neighborhood.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import gm from'./gm.jpg';

// MUI List
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

// React Contexts/Context Methods
import { DateContext, DateMethods } from '../../contexts/dateContext.js';
import { Button } from "@mui/material";

function createData(name, calories, fat) {
    return { name, calories, fat };
  }
  
const NeighborhoodCard = () => {
    const {dates} = React.useContext(DateContext);  // Global Context of dates

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
                                <ListItemButton>
                                    <ListItemText primary="Allston Village" />
                                    <div style={{flex: 1}}></div>
                                    <p style={{
                                        backgroundColor: "#0080FF", 
                                        borderRadius: 100, 
                                        width: 30, 
                                        color: "white", 
                                        display: "flex", 
                                        justifyContent: "center"}}>17</p>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Dorchester" />
                                    <div style={{flex: 1}}></div>
                                    <p style={{
                                        backgroundColor: "#0080FF", 
                                        borderRadius: 100, 
                                        width: 30, 
                                        color: "white", 
                                        display: "flex", 
                                        justifyContent: "center"}}>17</p>
                                </ListItemButton>
                                <ListItemButton selected={true}>
                                    <ListItemText primary="Greater Ashmont" />
                                    <div style={{flex: 1}}></div>
                                    <p style={{
                                        backgroundColor: "#0080FF", 
                                        borderRadius: 100, 
                                        width: 30, 
                                        color: "white", 
                                        display: "flex", 
                                        justifyContent: "center"}}>17</p>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Mattapan Square" />
                                    <div style={{flex: 1}}></div>
                                    <p style={{
                                        backgroundColor: "#0080FF", 
                                        borderRadius: 100, 
                                        width: 30, 
                                        color: "white", 
                                        display: "flex", 
                                        justifyContent: "center"}}>17</p>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Roslindale" />
                                    <div style={{flex: 1}}></div>
                                    <p style={{
                                        backgroundColor: "#0080FF", 
                                        borderRadius: 100, 
                                        width: 30, 
                                        color: "white", 
                                        display: "flex", 
                                        justifyContent: "center"}}>17</p>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Prudential" />
                                    <div style={{flex: 1}}></div>
                                    <p style={{
                                        backgroundColor: "#0080FF", 
                                        borderRadius: 100, 
                                        width: 30, 
                                        color: "white", 
                                        display: "flex", 
                                        justifyContent: "center"}}>17</p>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Boston University" />
                                    <div style={{flex: 1}}></div>
                                    <p style={{
                                        backgroundColor: "#0080FF", 
                                        borderRadius: 100, 
                                        width: 30, 
                                        color: "white", 
                                        display: "flex", 
                                        justifyContent: "center"}}>17</p>
                                </ListItemButton>
                                
                                
                            </List>
                        </div>
                            
                        <div style={{flex: 1}}></div>

                        {/* Maps API */}
                        <div style={{ height: '350px', width: '250px' }}>
                            <a href="https://www.google.com/maps/place/Back+Bay,+Boston,+MA/@42.3492608,-71.0895385,15z/data=!3m1!4b1!4m5!3m4!1s0x89e37a0ef815f5b1:0xbca3cc92599b5bc4!8m2!3d42.3495236!4d-71.0794717">
                            <img src={gm} width="250" height="350"></img>
                            </a>
                        </div>
                    </div>
            </CardContent>
        </Card>
    </>
    );
}

export default NeighborhoodCard;