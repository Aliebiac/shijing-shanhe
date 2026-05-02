function FilterBar({ categories, activeCategory, onCategoryChange }) {
  return (
    <footer className="filter-bar">
      {categories.map((item) => {
        const isActive = item.id === activeCategory;
        return (
          <button
            key={item.id}
            className={`filter-button ${isActive ? 'active' : ''}`}
            type="button"
            onClick={() => onCategoryChange(item.id)}
            aria-pressed={isActive}
          >
            {item.label}
          </button>
        );
      })}
    </footer>
  );
}

export default FilterBar;
