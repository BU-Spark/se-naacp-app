import SearchFields from '../components/SearchFields/SearchFields.js'
import ArticlesCard from '../components/ArticleCard/ArticleCard';
import NeighborhoodCard from '../components/Neighborhood/NeighborhoodCard';
import { Grid } from '@mui/material';
import { TopNavBar } from '../components/TopNavBar/TopNavBar';
import { NeighborhoodDemoBoard } from '../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard';
import { TrendBoard } from '../components/TrendBoard/TrendBoard';
import Read from '../components/DataRetrieve/data';
import Logo from "../logo.svg";

export default function Home() {
    return (
        <>
            <div className="App">
            <TopNavBar></TopNavBar>
            <Read></Read>
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
            </Grid>
            </div>
        </>
    );
}