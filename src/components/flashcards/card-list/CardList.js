import PropTypes from 'prop-types';
import CardItem from '@components/flashcards/card-item/CardItem';
import './CardList.scss';

const CardList = ({ cards, onFlip, onBookmark, onLike, onComment, onEdit, onDelete }) => {
  if (!cards || cards.length === 0) {
    return (
      <div className="card-list-empty">
        <div className="empty-state">
          <h3>No cards found</h3>
          <p>Create your first flashcard to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-list">
      {cards.map((card) => (
        <CardItem
          key={card._id}
          card={card}
          onFlip={onFlip}
          onBookmark={onBookmark}
          onLike={onLike}
          onComment={onComment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

CardList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFlip: PropTypes.func,
  onBookmark: PropTypes.func,
  onLike: PropTypes.func,
  onComment: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default CardList;
