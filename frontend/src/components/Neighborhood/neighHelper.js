import React, { useState } from 'react';

// MUI List
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// MUI collapse
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import PushPinIcon from '@mui/icons-material/PushPin';
import ListItemIcon from '@mui/material/ListItemIcon';

// Uniqid for unique keys
import uniqid from 'uniqid';

const NeighHelper = (props) => {
    const [open, setOpen] = useState(false);

    const onSelect = (c) => {
        setOpen(!open)
    };

    //console.log("In neighHelper Props.locaiton: ", props.location.tracts)
    //console.log("In neighHelper Props.currLoc: ", props.currLoc)
    return(
        <>
        <ListItemButton 
            key={uniqid()}
            id={`${props.location.name}`}
            onClick={(c) => {onSelect(c)}}
            selected={props.currLoc.name === props.location.name ? true:false}>
                <ListItemText primary={`${props.location.name}`} />
                <div style={{flex: 1}}></div>
                <p style={{
                    backgroundColor: "#0080FF", 
                    borderRadius: 100, 
                    width: 30, 
                    color: "white", 
                    display: "flex", 
                    justifyContent: "center"}}>{props.location.tracts.length}</p>
                {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse key={uniqid()} in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {(props.location.tracts).map((v) => {
                    return <> 
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <PushPinIcon />
                            </ListItemIcon>
                            <ListItemText primary={v} />
                        </ListItemButton>                        
                    </>
                })}
            </List>
        </Collapse>
        </>

    )
}

export default NeighHelper;