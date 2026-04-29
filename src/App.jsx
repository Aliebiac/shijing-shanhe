import FilterBar from './components/FilterBar';
import { categories } from './data/categories';

function App() {
  return (
    <div className="page">
      <header className="hero">
        <h1>诗经山河</h1>
        <p>在地图中寻找诗歌的地理记忆</p>
      </header>

      <main className="map-section">
        <div className="map-placeholder">地图区域（V0 占位）</div>
      </main>

      <FilterBar categories={categories} />
    </div>
  );
}

export default App;
