import PracticeCard from '@components/flashcards/practice-card/PracticeCard';
import { render, screen } from '@root/test.utils';
import userEvent from '@testing-library/user-event';

const mockCard = {
  _id: 'card1',
  question: 'What is JavaScript?',
  answer: 'A dynamic programming language',
  category: 'JavaScript',
  questionCodeSnippet: '',
  answerCodeSnippet: '',
  questionImgId: '',
  answerImgId: ''
};

const onAnswer = jest.fn();

describe('PracticeCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state (question side)', () => {
    it('renders the question text', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      expect(screen.getByText('What is JavaScript?')).toBeInTheDocument();
    });

    it('shows the category badge', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      expect(screen.getAllByText('JavaScript').length).toBeGreaterThanOrEqual(1);
    });

    it('shows the "Show Answer" flip button', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      expect(screen.getByRole('button', { name: /show answer/i })).toBeInTheDocument();
    });

    it('does not show difficulty controls before flipping', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      expect(screen.queryByText('Again')).not.toBeInTheDocument();
    });

    it('card does not have the flipped class initially', () => {
      const { container } = render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      expect(container.querySelector('.practice-card')).not.toHaveClass('flipped');
    });
  });

  describe('after flipping to answer side', () => {
    it('adds the flipped CSS class when Show Answer is clicked', () => {
      const { container } = render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      expect(container.querySelector('.practice-card')).toHaveClass('flipped');
    });

    it('shows the answer text after flip', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      expect(screen.getByText('A dynamic programming language')).toBeInTheDocument();
    });

    it('shows difficulty controls after flip', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      expect(screen.getByText('Again')).toBeInTheDocument();
      expect(screen.getByText('Hard')).toBeInTheDocument();
      expect(screen.getByText('Good')).toBeInTheDocument();
      expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    it('shows the "Back to Question" button after flip', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      expect(screen.getByRole('button', { name: /back to question/i })).toBeInTheDocument();
    });

    it('clicking "Back to Question" removes the flipped class', () => {
      const { container } = render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      userEvent.click(screen.getByRole('button', { name: /back to question/i }));
      expect(container.querySelector('.practice-card')).not.toHaveClass('flipped');
    });
  });

  describe('difficulty rating', () => {
    it('calls onAnswer with "again" and hides controls', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      userEvent.click(screen.getByText('Again').closest('button'));
      expect(onAnswer).toHaveBeenCalledWith('again');
      expect(screen.queryByText('Again')).not.toBeInTheDocument();
    });

    it('calls onAnswer with "hard"', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      userEvent.click(screen.getByText('Hard').closest('button'));
      expect(onAnswer).toHaveBeenCalledWith('hard');
    });

    it('calls onAnswer with "good"', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      userEvent.click(screen.getByText('Good').closest('button'));
      expect(onAnswer).toHaveBeenCalledWith('good');
    });

    it('calls onAnswer with "easy"', () => {
      render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      userEvent.click(screen.getByText('Easy').closest('button'));
      expect(onAnswer).toHaveBeenCalledWith('easy');
    });

    it('unflips the card after answering', () => {
      const { container } = render(<PracticeCard card={mockCard} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      userEvent.click(screen.getByText('Good').closest('button'));
      expect(container.querySelector('.practice-card')).not.toHaveClass('flipped');
    });
  });

  describe('code snippets', () => {
    it('renders question code snippet when provided', () => {
      const cardWithCode = { ...mockCard, questionCodeSnippet: 'const x = 1;' };
      render(<PracticeCard card={cardWithCode} onAnswer={onAnswer} />);
      expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });

    it('renders answer code snippet after flip', () => {
      const cardWithCode = { ...mockCard, answerCodeSnippet: 'return true;' };
      render(<PracticeCard card={cardWithCode} onAnswer={onAnswer} />);
      userEvent.click(screen.getByRole('button', { name: /show answer/i }));
      expect(screen.getByText('return true;')).toBeInTheDocument();
    });
  });
});
