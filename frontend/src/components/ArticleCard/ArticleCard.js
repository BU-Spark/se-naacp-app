import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import "./ArticleCard.css";

// Uniqid for unique keys
import uniqid from 'uniqid';


function createData(title, author, publishingDate) {
    author = "by ".concat(author)
    return { title, author , publishingDate };
}

const rows = [
  createData('Article About Neighborhood', 'Daniel Gonzalez', '02-08-2023'),
  createData('Article About Neighborhood', 'Zach Gou', '02-08-2023'),
  createData('Article About Neighborhood', 'Asad Malik', '02-08-2023'),
  createData('Article About Neighborhood', 'Michelle Voong', '02-08-2023'),
  createData('Article About Neighborhood', 'Ziba', '02-08-2023'),
];

export default function ArticleCard() {
  return (
    <Card className="body" sx={{ width: "100%", height: "61.5vh" }}>
    <CardContent>
        <h3 className="card">Articles on Topic</h3>
        <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
            <TableHead>
            <TableRow>
                <TableCell style={{borderBottom:"none"}}><strong>Title</strong></TableCell>
                <TableCell style={{borderBottom:"none"}} align="left"><strong>Author</strong></TableCell>
                <TableCell style={{borderBottom:"none"}} align="left"><strong>Publishing Date</strong></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                key={uniqid()}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell style={{borderBottom:"none"}} component="th" scope="row">
                    {row.title}
                </TableCell>
                <TableCell  style={{borderBottom:"none"}} align="left">{row.author}</TableCell>
                <TableCell style={{borderBottom:"none"}} align="left">{row.publishingDate}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </CardContent>
    </Card>
  );
}