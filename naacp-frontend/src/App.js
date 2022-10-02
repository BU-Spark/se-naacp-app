import './App.css';
import SearchFields from './components/SearchFields/SearchFields.js'
import ArticlesCard from './components/ArticleCard/ArticleCard';
import NeighborhoodCard from './components/Neighborhood/NeighborhoodCard';
import { Grid } from '@mui/material';
import { TopNavBar } from './components/TopNavBar/TopNavBar';
import { NeighborhoodDemoBoard } from './components/NeighborhoodDemoBoard/NeighborhoodDemoBoard';


function App() {
  return (
    <div className="App">
      <TopNavBar></TopNavBar>
      <Grid style={{marginTop: 100}} container spacing={1}>
        <Grid item xs={3}>
          <h>Logo</h>
        </Grid>
        <Grid item xs={9}>
        <SearchFields></SearchFields>
        </Grid>
      </Grid>
      <br></br>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <NeighborhoodCard></NeighborhoodCard>
        </Grid>
        <Grid item xs={6}>
          <h>Card 2</h>
        </Grid>
        <Grid item xs={6}>
          <NeighborhoodDemoBoard></NeighborhoodDemoBoard>
        </Grid>
        <Grid item xs={6}>
        <ArticlesCard style={{marginLeft: 20}} topic="Technology"></ArticlesCard>
        </Grid>

      </Grid>
    </div>
  );
}

export default App;
