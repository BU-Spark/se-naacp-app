import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import "./ArticleCard.css";
import queryMethods from '../../Pipelines/data';

// Uniqid for unique keys
import uniqid from 'uniqid';

// Contexts
import { StateContext, stateMethods } from '../../contexts/stateContext';

const columns = [
  { field: 'title', headerName: 'Title', width: 180 },
  { field: 'publisher', headerName: 'Publisher', width: 180 },
  {field: 'publishingDate', headerName: 'Publishing Date', width: 150,},
  {field: 'neighborhood', headerName: 'Neighborhood', width: 110,},
  {field: 'censusTract', headerName: 'Census Tract', type: 'number', width: 100,},
  {field: 'category', headerName: 'Category', width: 90,},
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


export default function ArticleCard() {

  const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

  const [articleData, setArticleData] = React.useState([]);

  React.useEffect(() => {
    
    if (currentState !== undefined) {
      if (currentState.hasOwnProperty('CensusTract')) {
        if (currentState.CensusTract.articles !== 'None') {
          let data = currentState.CensusTract.articles;
          let articles = queryMethods.getArticleData(data).then((articles) => {
            let articleRow = []
            for (const article of articles) {
              articleRow.push({
                id: uniqid(), 
                title: `${article.content_id}`, 
                publisher: `${article.pub_name}`, 
                publishingDate: `${dayjs(article.pub_date).format('MMMM D YYYY')}`,
                neighborhood: `${currentState.currentNeigh.charAt(0).toUpperCase()+currentState.currentNeigh.slice(1)}`,
                censusTract: `${article.tracts[0]}`,
                category: `${article.position_section}`
              }) 
            }
            setArticleData(articleRow)
          })
          
          console.log("ArticleCards article data: ", articles)


  
          
        }
      }
    }
  }, [currentState])

  return (
    <Card className="body" sx={{ width: "100%", height: "61.5vh" }}>
    <CardContent>
        <h3 className="card">Articles on Topic</h3>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={articleData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
    </CardContent>
    </Card>
  );
}