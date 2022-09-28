import './App.css';
import SearchFields from './components/SearchFields/SearchFields.js'
import ArticlesCard from './components/ArticleCard/ArticleCard';

function App() {
  return (
    <div className="App">
      <SearchFields></SearchFields>
      <br></br>
      <ArticlesCard style={{marginLeft: 10}} topic="Technology"></ArticlesCard>
    </div>
  );
}

export default App;
