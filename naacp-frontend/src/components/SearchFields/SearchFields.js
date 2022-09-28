import SearchBar from './SearchBar'
import DateBar from './DateBar'
import { Grid } from "@mui/material";

function SearchFields(){
    return (
      <div>
        <Grid container spacing={1}>
            <Grid item xs={2}>
              <SearchBar word="Neighborhood" placeholder="Search"></SearchBar>
            </Grid>
            <Grid item xs={2}>
              <SearchBar word="Sub-Neighborhood" placeholder="Search"></SearchBar>
            </Grid>
            <Grid item xs={2}>
              <SearchBar word="Topics" placeholder="Search"></SearchBar>
            </Grid>
            <Grid item xs={2}>
              <DateBar word="From" placeholder="Date"></DateBar>
            </Grid>
            <Grid item xs={2}>
              <DateBar word="To" placeholder="Date"></DateBar>
            </Grid>
        </Grid>
        </div>
    );
};

export default SearchFields;