import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import "./Neighborhood.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import GoogleMapReact from 'google-map-react';
import { Grid } from "@mui/material";
import gm from'./gm.jpg';


const NeighborhoodCard = (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [listingData, setListingData] = useState([]);

    const tableStyle = {
        border: "none",
        boxShadow: "none"
      };
  
    // useEffect(() => {
    //   getPostings();
    // }, []);

    const columns = [
        { id: "name", label: "Name", minWidth: 120 },
        { id: "coverage", label: "Coverage", minWidth: 50 },

      ];
    const data = [
        { id: "name", label: "Allston", minWidth: 50 },
        { id: "coverage", label: "8", minWidth: 50 },
    ];
    const data2 = [
        { id: "name", label: "Back Bay", minWidth: 50 },
        { id: "coverage", label: "7", minWidth: 50 },
    ];
    const data3 = [
        { id: "name", label: "North End", minWidth: 50 },
        { id: "coverage", label: "7", minWidth: 50 },
    ];

    
      return (
        <>
        <Card className="body" sx={{ maxWidth: 800, minHeight:400}}>
        <CardContent>
            <h3 className="card">Neighborhoods Covered Most</h3>

            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Container maxWidth="sm">
                    <TableContainer sx={{ maxWidth: 300, maxHeight: 300}} >
                        <Table className="body" stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth}}
                                >
                                {column.label}
                                </TableCell>
                                ))}
                            </TableRow>

                            <TableRow>
                                {data.map((column) => (
                                <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth}}
                                >
                                {column.label}
                                </TableCell>
                                ))}
                            </TableRow>

                            <TableRow>
                                {data2.map((column) => (
                                <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth}}
                                >
                                {column.label}
                                </TableCell>
                                ))}
                            </TableRow>

                            <TableRow>
                                {data3.map((column) => (
                                <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth}}
                                >
                                {column.label}
                                </TableCell>
                                ))}
                            </TableRow>
                            
                        </TableHead>
                        </Table>
                    </TableContainer>
                </Container>
                </Grid>

                <Grid item xs={6}>
                    <div style={{ height: '450px', width: '380px' }}>
                    {/* <GoogleMapReact
                    bootstrapURLKeys={{ key: 'asfdsafeafsf' }}
                    >
                    </GoogleMapReact> */}
                    <a href="https://www.google.com/maps/place/Back+Bay,+Boston,+MA/@42.3492608,-71.0895385,15z/data=!3m1!4b1!4m5!3m4!1s0x89e37a0ef815f5b1:0xbca3cc92599b5bc4!8m2!3d42.3495236!4d-71.0794717">
                      <img src={gm} width="310" height="400"></img>
                    </a>
                    </div>
                </Grid>
            </Grid>
        </CardContent>
        </Card>
    </>
    );
}

export default NeighborhoodCard;