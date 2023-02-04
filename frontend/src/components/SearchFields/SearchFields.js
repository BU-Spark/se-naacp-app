import SearchBar from './SearchBar'
import DateBar from './DateBar'
import Button, { ButtonProps } from '@mui/material/Button';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';


function SearchFields(){

    return (
      <div style={{display: "flex", flexDirection: "row", overflowX: "auto"}}>
          <SearchBar word="Neighborhood" placeholder="Search"></SearchBar>
          <SearchBar word="Sub-Neighborhood" placeholder="Search"></SearchBar>
          <SearchBar word="Topics" placeholder="Search"></SearchBar>
          <DateBar word="From" placeholder="Date"></DateBar>
          <DateBar word="To" placeholder="Date"></DateBar>
          <div style={{display: "flex", justifyContent:"center", alignItems: "center", height: "90px", width: "170px"}}>
            <Button variant="contained" style={{height: "40px", width: "130px", marginTop: 12}}>Download</Button>
          </div>
        </div>
    );
};

export default SearchFields;