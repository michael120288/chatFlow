import { useEffect, useState } from 'react';
import CardForm from '@components/flashcards/card-form/CardForm';
import CategoryFilter from '@components/flashcards/category-filter/CategoryFilter';
import CardList from '@components/flashcards/card-list/CardList';
import './Cards.scss';

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);

  // Mock data for now - will be replaced with actual API calls
  const mockCards = [
    {
      _id: '1',
      username: 'John Doe',
      avatarColor: '#667eea',
      profilePicture: '',
      question: 'What is React?',
      answer: 'React is a JavaScript library for building user interfaces.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'const App = () => <div>Hello</div>;',
      difficulty: 'Easy',
      likesCount: 15,
      commentsCount: 3,
      bookmarksCount: 8,
      studyCount: 42,
      userId: '1',
      createdAt: new Date()
    },
    {
      _id: '2',
      username: 'Jane Smith',
      avatarColor: '#f44336',
      profilePicture: '',
      question: 'What is useState?',
      answer: 'useState is a React Hook that lets you add state to function components.',
      category: 'React',
      questionCodeSnippet: '',
      answerCodeSnippet: 'const [count, setCount] = useState(0);',
      difficulty: 'Medium',
      likesCount: 23,
      commentsCount: 7,
      bookmarksCount: 12,
      studyCount: 67,
      userId: '2',
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    // Load cards from API
    setCards(mockCards);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmitCard = (cardData) => {
    console.log('New card:', cardData);
    setShowForm(false);
  };

  const handleFlip = (cardId) => {
    console.log('Flipped card:', cardId);
  };

  const handleBookmark = (cardId) => {
    console.log('Bookmarked card:', cardId);
  };

  const handleLike = (cardId) => {
    console.log('Liked card:', cardId);
  };

  const handleComment = (cardId) => {
    console.log('Comment on card:', cardId);
  };

  const handleEdit = (cardId) => {
    console.log('Edit card:', cardId);
  };

  const handleDelete = (cardId) => {
    console.log('Delete card:', cardId);
  };

  const filteredCards = selectedCategory === 'All' ? cards : cards.filter((card) => card.category === selectedCategory);

  return (
    <div className="cards-page">
      <div className="cards-container">
        <div className="cards-header">
          <h1>Flashcards</h1>
          <button className="create-button" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Card'}
          </button>
        </div>

        {showForm && <CardForm onSubmit={handleSubmitCard} />}

        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

        <CardList
          cards={filteredCards}
          onFlip={handleFlip}
          onBookmark={handleBookmark}
          onLike={handleLike}
          onComment={handleComment}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Cards;
