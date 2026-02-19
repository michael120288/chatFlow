import PropTypes from 'prop-types';
import './CategoryFilter.scss';

const CATEGORIES = [
  'All',
  'JavaScript',
  'React',
  'Vue',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'Go',
  'Rust',
  'Database',
  'SQL',
  'MongoDB',
  'Redis',
  'System Design',
  'DSA',
  'Algorithms',
  'AWS',
  'DevOps',
  'Docker',
  'Kubernetes',
  'Other'
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="category-filter">
      <div className="category-filter-header">
        <h3>Filter by Category</h3>
      </div>
      <div className="category-chips">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

CategoryFilter.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired
};

export default CategoryFilter;
