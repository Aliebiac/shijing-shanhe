function FilterBar({ categories }) {
  return (
    <footer className="filter-bar">
      {categories.map((item) => (
        <button key={item.id} className="filter-button" type="button">
          {item.label}
        </button>
      ))}
    </footer>
  );
}

export default FilterBar;
