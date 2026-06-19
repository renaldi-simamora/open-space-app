function CategoryBadge({ category, onClick, active }) {
  return (
    <button
      className={`category-badge${active ? ' category-badge--active' : ''}`}
      onClick={onClick}
      type="button"
    >
      #
      {category}
    </button>
  );
}

export default CategoryBadge;
