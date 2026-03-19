import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiX } from 'react-icons/fi';
import { ProfanityFilter } from '@services/utils/profanity-filter.service';
import './DeckForm.scss';

const CATEGORIES = [
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

const DeckForm = ({ deck, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'JavaScript',
    privacy: 'public'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deck) {
      setFormData({
        name: deck.name || '',
        description: deck.description || '',
        category: deck.category || 'JavaScript',
        privacy: deck.privacy || 'public'
      });
    }
  }, [deck]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Deck name is required';
    } else if (formData.name.length > 200) {
      newErrors.name = 'Deck name cannot exceed 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (ProfanityFilter.containsProfanity(formData.name)) {
      newErrors.name = 'Deck name contains inappropriate language.';
    }
    if (ProfanityFilter.containsProfanity(formData.description)) {
      newErrors.description = 'Description contains inappropriate language.';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="deck-form">
      <div className="form-header">
        <h2>{deck ? 'Edit Deck' : 'Create New Deck'}</h2>
        <button className="close-button" onClick={onCancel}>
          <FiX />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Deck Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., React Fundamentals"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
          <span className="char-count">{formData.name.length}/200</span>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of what this deck covers..."
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
          <span className="char-count">{formData.description.length}/1000</span>
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category <span className="required">*</span>
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={errors.category ? 'error' : ''}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Privacy</label>
          <div className="privacy-options">
            <label className={`privacy-option ${formData.privacy === 'public' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={formData.privacy === 'public'}
                onChange={(e) => handleChange('privacy', e.target.value)}
              />
              <div className="option-content">
                <span className="option-title">Public</span>
                <span className="option-description">Anyone can view and practice this deck</span>
              </div>
            </label>

            <label className={`privacy-option ${formData.privacy === 'private' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={formData.privacy === 'private'}
                onChange={(e) => handleChange('privacy', e.target.value)}
              />
              <div className="option-content">
                <span className="option-title">Private</span>
                <span className="option-description">Only you can view and practice this deck</span>
              </div>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {deck ? 'Update Deck' : 'Create Deck'}
          </button>
        </div>
      </form>
    </div>
  );
};

DeckForm.propTypes = {
  deck: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    privacy: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DeckForm;
