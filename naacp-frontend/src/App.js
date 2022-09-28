import './App.css';
import SearchFields from './components/SearchFields/SearchFields.js'
import ArticlesCard from './components/ArticleCard/ArticleCard';
import NeighborhoodCard from './components/Neighborhood/NeighborhoodCard';

function App() {
  return (
    <div className="App">
      <SearchFields></SearchFields>
      <br></br>
      <ArticlesCard style={{marginLeft: 10}} topic="Technology"></ArticlesCard>
      <br></br>
      <NeighborhoodCard></NeighborhoodCard>
    </div>
  );
}

export default App;
