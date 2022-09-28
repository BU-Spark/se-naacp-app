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
        { id: "name", label: "N1", minWidth: 50 },
        { id: "coverage", label: "8", minWidth: 50 },
    ];
    const data2 = [
        { id: "name", label: "N2", minWidth: 50 },
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
                    <p>Google Maps</p>
                    </div>
                </Grid>
            </Grid>
        </CardContent>
        </Card>
    </>
    );
}

export default NeighborhoodCard;