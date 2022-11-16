import './App.css';
import SearchFields from './components/SearchFields/SearchFields.js'
import ArticlesCard from './components/ArticleCard/ArticleCard';
import NeighborhoodCard from './components/Neighborhood/NeighborhoodCard';
import { TopicsCount } from './components/TopicsCount/TopicsCount';
import { Grid } from '@mui/material';
import { TopNavBar } from './components/TopNavBar/TopNavBar';
import { NeighborhoodDemoBoard } from './components/NeighborhoodDemoBoard/NeighborhoodDemoBoard';
import { TrendBoard } from './components/TrendBoard/TrendBoard';
import Read from './components/DataRetrieve/data';
import Logo from "./logo.svg";
import { ArticlesContext, ArticlesProvider } from './context/ArticlesContext';
import {NeighborhoodsContext, NeighborhoodsProvider} from './context/NeighborhoodsContext'
import {SubneighborhoodsContext, SubneighborhoodsProvider } from './context/SubneighborhoodsContext';

function App() {
  return (
    <div className="App">
      <ArticlesProvider>
      <NeighborhoodsProvider>
      <SubneighborhoodsProvider>
        <TopNavBar></TopNavBar>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <img style={{marginLeft: 10, marginTop: 10, width: 150}}src={Logo}></img>
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
            <TrendBoard></TrendBoard>
          </Grid>
          <Grid item xs={6}>
            <NeighborhoodDemoBoard></NeighborhoodDemoBoard>
          </Grid>
          <Grid item xs={6}>
          <ArticlesCard style={{marginLeft: 20}} topic="Technology"></ArticlesCard>
          </Grid>
          <Grid item xs={12}>
            <TopicsCount></TopicsCount>
          </Grid>
        </Grid>
      </SubneighborhoodsProvider>
      </NeighborhoodsProvider>
      </ArticlesProvider>
    </div>
  );
}

export default App;
