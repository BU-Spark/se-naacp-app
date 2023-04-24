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
import { Link } from '@mui/material';

function getHTML(str){
  const htmlString = str;
  const parser = new DOMParser();
  const html = parser.parseFromString(htmlString, 'text/html');
  const body = html.body.lastChild;
  console.log("HOST: ", body.hostname)
  console.log("href: ", body.href)
  return body
}

const columns = [
  {field: 'title', headerName: 'Title', width: 300, 
    renderCell:(params) => <Link href={`${params.row.title.link}`} target='_blank'>{params.row.title.title}</Link>},
  {field: 'publisher', headerName: 'Publisher', width: 110 },
  {field: 'publishingDate', headerName: 'Publishing Date', width: 200,},
  {field: 'neighborhood', headerName: 'Neighborhood', width: 150,},
  {field: 'censusTract', headerName: 'Census Tract', width: 150},
  {field: 'category', headerName: 'Category', width: 150,},
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
                title: {link: article.link, title: article.hl1}, 
                publisher: `${article.pub_name}`, 
                publishingDate: `${dayjs(article.pub_date).format('MMMM D, YYYY')}`,
                neighborhood: `${currentState.currentNeigh.charAt(0).toUpperCase()+currentState.currentNeigh.slice(1)}`,
                censusTract: `${article.tracts[0]}`,
                category: `${article.position_section}`
              }) 
            }
            setArticleData(articleRow)
          })
          
          


  
          
        }
      } else {
        setArticleData([]);
      }
    }
  }, [currentState])

  return (
    <>
    
        <Card className="body" sx={{ width: "100%", height: "62vh" }}>
    <CardContent>
        <h3 className="card">Articles on Topic</h3>
        <div style={{ height: 350, width: '100%' }}>
          <DataGrid
            rows={articleData}
            columns={columns}
            pageSize={articleData.length}
            rowsPerPageOptions={[5]}
            hideFooter={true}
          />
        </div>
        
    </CardContent>
    </Card>
    </>

  );
}