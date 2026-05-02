import { useMemo, useState } from 'react';
import FilterBar from './components/FilterBar';
import ChinaMap from './components/ChinaMap';
import { categories } from './data/categories';
import { poems } from './data/poems';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');

  const mapCategory = useMemo(() => {
    const selected = categories.find((item) => item.id === activeCategory);
    if (!selected || selected.label === '全部') {
      return 'all';
    }
    return selected.label;
  }, [activeCategory]);

  return (
    <div className="page">
      <header className="hero">
        <h1>诗经山河</h1>
        <p>在地图中寻找诗歌的地理记忆</p>
      </header>

      <main className="map-section">
        <ChinaMap poems={poems} activeCategory={mapCategory} />
      </main>

      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </div>
  );
}

export default App;
