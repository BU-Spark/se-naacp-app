import SearchBar from './SearchBar'
import DateBar from './DateBar'
import Button from '@mui/material/Button';


function SearchFields(){

    return (
      <div style={{display: "flex", flexDirection: "row", overflowX: "auto"}}>
          <SearchBar word="Neighborhood" placeholder="Search"></SearchBar>
          <SearchBar word="Sub-Neighborhood" placeholder="Search"></SearchBar>
          <SearchBar word="Topics" placeholder="Search"></SearchBar>
          <DateBar word="From" from_bool={true}></DateBar>
          <DateBar word="To" from_bool={false}></DateBar>
          <div style={{display: "flex", justifyContent:"center", alignItems: "center", height: "90px", width: "170px"}}>
            <Button onClick={() => console.log("Downloading Data...")} variant="contained" sx={{textTransform: "none"}} style={{height: "35px", width: "135px", marginTop: 21, marginLeft: 5, fontWeight: 500, fontSize: 14, backgroundColor: "rgb(93, 63, 211)"}}>Download Data</Button>
          </div>
        </div>
    );
};

export default SearchFields;