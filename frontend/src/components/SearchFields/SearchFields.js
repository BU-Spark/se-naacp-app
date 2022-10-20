import SearchBar from './SearchBar'
import DateBar from './DateBar'
import Button, { ButtonProps } from '@mui/material/Button';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';


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
            <Grid item xs={2}>
              <Button variant="contained" style={{marginTop: 38, marginLeft: 10}}>Download</Button>
            </Grid>
        </Grid>
        </div>
    );
};

export default SearchFields;