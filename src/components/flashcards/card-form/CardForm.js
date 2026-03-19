import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiImage, FiCode } from 'react-icons/fi';
import { ProfanityFilter } from '@services/utils/profanity-filter.service';
import './CardForm.scss';

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

const CardForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    answer: initialData?.answer || '',
    category: initialData?.category || 'JavaScript',
    questionCodeSnippet: initialData?.questionCodeSnippet || '',
    answerCodeSnippet: initialData?.answerCodeSnippet || '',
    privacy: initialData?.privacy || 'public',
    difficulty: initialData?.difficulty || ''
  });

  const [questionImage, setQuestionImage] = useState(null);
  const [answerImage, setAnswerImage] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState(initialData?.questionImgVersion || null);
  const [answerImagePreview, setAnswerImagePreview] = useState(initialData?.answerImgVersion || null);
  const [showQuestionCode, setShowQuestionCode] = useState(false);
  const [showAnswerCode, setShowAnswerCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profanityError, setProfanityError] = useState('');

  const questionImageRef = useRef();
  const answerImageRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionImage(reader.result);
        setQuestionImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnswerImage(reader.result);
        setAnswerImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeQuestionImage = () => {
    setQuestionImage(null);
    setQuestionImagePreview(null);
    if (questionImageRef.current) {
      questionImageRef.current.value = '';
    }
  };

  const removeAnswerImage = () => {
    setAnswerImage(null);
    setAnswerImagePreview(null);
    if (answerImageRef.current) {
      answerImageRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const textFields = [formData.question, formData.answer, formData.questionCodeSnippet, formData.answerCodeSnippet];
    if (textFields.some(ProfanityFilter.containsProfanity)) {
      setProfanityError('Your card contains inappropriate language.');
      return;
    }
    setProfanityError('');
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        questionImage,
        answerImage
      };
      await onSubmit(submitData);

      // Reset form after successful submission
      setFormData({
        question: '',
        answer: '',
        category: 'JavaScript',
        questionCodeSnippet: '',
        answerCodeSnippet: '',
        privacy: 'public',
        difficulty: ''
      });
      setQuestionImage(null);
      setAnswerImage(null);
      setQuestionImagePreview(null);
      setAnswerImagePreview(null);
      setShowQuestionCode(false);
      setShowAnswerCode(false);
    } catch (error) {
      console.error('Error submitting card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-form-container">
      <form className="card-form" onSubmit={handleSubmit}>
        <div className="card-form-header">
          <h3>{initialData ? 'Edit Card' : 'Create New Flashcard'}</h3>
        </div>

        <div className="card-form-body">
          {/* Question Section */}
          <div className="form-section">
            <label className="form-label">Question *</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="Enter your question..."
              className="form-textarea"
              rows="3"
              required
            />

            <div className="media-actions">
              <button type="button" className="media-button" onClick={() => questionImageRef.current.click()}>
                <FiImage /> Add Image
              </button>
              <button type="button" className="media-button" onClick={() => setShowQuestionCode(!showQuestionCode)}>
                <FiCode /> {showQuestionCode ? 'Hide' : 'Add'} Code
              </button>
            </div>

            <input
              ref={questionImageRef}
              type="file"
              accept="image/*"
              onChange={handleQuestionImageChange}
              style={{ display: 'none' }}
            />

            {questionImagePreview && (
              <div className="image-preview">
                <img src={questionImagePreview} alt="Question" />
                <button type="button" className="remove-image" onClick={removeQuestionImage}>
                  ×
                </button>
              </div>
            )}

            {showQuestionCode && (
              <textarea
                name="questionCodeSnippet"
                value={formData.questionCodeSnippet}
                onChange={handleInputChange}
                placeholder="Paste your code here..."
                className="code-textarea"
                rows="6"
              />
            )}
          </div>

          {/* Answer Section */}
          <div className="form-section">
            <label className="form-label">Answer *</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              placeholder="Enter the answer..."
              className="form-textarea"
              rows="4"
              required
            />

            <div className="media-actions">
              <button type="button" className="media-button" onClick={() => answerImageRef.current.click()}>
                <FiImage /> Add Image
              </button>
              <button type="button" className="media-button" onClick={() => setShowAnswerCode(!showAnswerCode)}>
                <FiCode /> {showAnswerCode ? 'Hide' : 'Add'} Code
              </button>
            </div>

            <input
              ref={answerImageRef}
              type="file"
              accept="image/*"
              onChange={handleAnswerImageChange}
              style={{ display: 'none' }}
            />

            {answerImagePreview && (
              <div className="image-preview">
                <img src={answerImagePreview} alt="Answer" />
                <button type="button" className="remove-image" onClick={removeAnswerImage}>
                  ×
                </button>
              </div>
            )}

            {showAnswerCode && (
              <textarea
                name="answerCodeSnippet"
                value={formData.answerCodeSnippet}
                onChange={handleInputChange}
                placeholder="Paste your code here..."
                className="code-textarea"
                rows="6"
              />
            )}
          </div>

          {/* Category & Settings */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">None</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Privacy</label>
              <select name="privacy" value={formData.privacy} onChange={handleInputChange} className="form-select">
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-form-footer">
          {profanityError && <p className="profanity-error">{profanityError}</p>}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : initialData ? 'Update Card' : 'Create Card'}
          </button>
        </div>
      </form>
    </div>
  );
};

CardForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default CardForm;
