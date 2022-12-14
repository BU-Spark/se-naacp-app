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
import "./ArticleCard.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


const ArticlesCard = (props, topic) => {
    const [articles, setArticles] = useState([])
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
        { id: "articleTitle", label: "Title", minWidth: 120 },
        { id: "authorName", label: "Author", minWidth: 50 },
        { id: "publishingDate", label: "Publishing Date", minWidth: 50 },
      ];
    const data = [
        { id: "articleTitle", label: "Article About Jamacia Plain", minWidth: 120 },
        { id: "authorName", label: "by John Chai", minWidth: 50 },
        { id: "publishingDate", label: "2019-09-09", minWidth: 50 },
    ];
    const data2 = [
        { id: "articleTitle", label: "Article About Dorchester", minWidth: 120 },
        { id: "authorName", label: "by Asad", minWidth: 50 },
        { id: "publishingDate", label: "2019-03-09", minWidth: 50 },
    ];
    const data3 = [
        { id: "articleTitle", label: "Article About Arlington", minWidth: 120 },
        { id: "authorName", label: "by Daniel", minWidth: 50 },
        { id: "publishingDate", label: "2019-04-04", minWidth: 50 },
    ];

    
      return (
        <>
        <Card className="body" sx={{ maxWidth: 800, minHeight:400}}>
        <CardContent>
            <h3 className="card">Articles on Topic</h3>
            <Container maxWidth="md">
            <TableContainer>
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
        </CardContent>
        </Card>
    </>
    );
}

export default ArticlesCard;