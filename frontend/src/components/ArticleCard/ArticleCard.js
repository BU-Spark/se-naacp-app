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
  {field: 'title', headerName: 'Title', width: 580, 
    renderCell:(params) => <Link href={`${params.row.title.link}`} target='_blank'>{params.row.title.title}</Link>},
  {field: 'author', headerName: 'Author', width: 130 },
  {field: 'publishingDate', headerName: 'Publishing Date', width: 120,},
  {field: 'neighborhood', headerName: 'Neighborhood', width: 110,},
  {field: 'censusTract', headerName: 'Census Tract', width: 110},
  {field: 'category', headerName: 'Category', width: 90,},
];





export default function ArticleCard() {

  const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

  const [articleData, setArticleData] = React.useState([]);


  React.useEffect(() => {
    
    if (currentState !== undefined) {
      if (currentState.hasOwnProperty('CensusTract')) {
        if (currentState.CensusTract.articles !== 'None') {
          let data = currentState.CensusTract.articleData;
          console.log("Sent article data:", data);
          let articles = queryMethods.getArticleData(data).then((articles) => {
            let articleRow = []
            console.log("Articles:", articles);
            for (const article_arr of articles) {
              let article = article_arr[0];
              articleRow.push({
                id: uniqid(), 
                title: {link: article.link, title: article.hl1}, 
                author: `${article.author}`, 
                publishingDate: `${dayjs(article.pub_date).format('MMM D, YYYY')}`,
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
        <h3 className="card">Articles From Neighborhood/Tract</h3>
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