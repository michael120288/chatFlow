import DeckForm from '@components/flashcards/deck-form/DeckForm';
import { render, screen, waitFor } from '@root/test.utils';
import userEvent from '@testing-library/user-event';

const onSubmit = jest.fn();
const onCancel = jest.fn();

describe('DeckForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders create mode when no deck is provided', () => {
      render(<DeckForm onSubmit={onSubmit} onCancel={onCancel} />);
      expect(screen.getByText('Create New Deck')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Deck' })).toBeInTheDocument();
    });

    it('renders edit mode when a deck is provided', () => {
      const deck = { name: 'React Basics', description: 'React fundamentals', category: 'React', privacy: 'public' };
      render(<DeckForm deck={deck} onSubmit={onSubmit} onCancel={onCancel} />);
      expect(screen.getByText('Edit Deck')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Update Deck' })).toBeInTheDocument();
    });

    it('pre-fills fields from deck prop', () => {
      const deck = { name: 'React Basics', description: 'React fundamentals', category: 'React', privacy: 'public' };
      render(<DeckForm deck={deck} onSubmit={onSubmit} onCancel={onCancel} />);
      expect(screen.getByDisplayValue('React Basics')).toBeInTheDocument();
      expect(screen.getByDisplayValue('React fundamentals')).toBeInTheDocument();
    });

    it('calls onCancel when Cancel button is clicked', () => {
      render(<DeckForm onSubmit={onSubmit} onCancel={onCancel} />);
      userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('validation', () => {
    it('shows error when deck name is empty', async () => {
      render(<DeckForm onSubmit={onSubmit} onCancel={onCancel} />);
      userEvent.click(screen.getByRole('button', { name: 'Create Deck' }));

      await waitFor(() => {
        expect(screen.getByText('Deck name is required')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows error when deck name contains profanity', async () => {
      render(<DeckForm onSubmit={onSubmit} onCancel={onCancel} />);
      userEvent.type(screen.getByPlaceholderText('e.g., React Fundamentals'), 'fuck everything');
      userEvent.click(screen.getByRole('button', { name: 'Create Deck' }));

      await waitFor(() => {
        expect(screen.getByText('Deck name contains inappropriate language.')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows error when description contains profanity', async () => {
      render(<DeckForm onSubmit={onSubmit} onCancel={onCancel} />);
      userEvent.type(screen.getByPlaceholderText('e.g., React Fundamentals'), 'Clean Deck Name');
      userEvent.type(screen.getByPlaceholderText(/brief description/i), 'this is bullshit content');
      userEvent.click(screen.getByRole('button', { name: 'Create Deck' }));

      await waitFor(() => {
        expect(screen.getByText('Description contains inappropriate language.')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('clears field error when user starts typing in that field', async () => {
      render(<DeckForm onSubmit={onSubmit} onCancel={onCancel} />);
      userEvent.click(screen.getByRole('button', { name: 'Create Deck' }));

      await waitFor(() => {
        expect(screen.getByText('Deck name is required')).toBeInTheDocument();
      });

      userEvent.type(screen.getByPlaceholderText('e.g., React Fundamentals'), 'A');
      await waitFor(() => {
        expect(screen.queryByText('Deck name is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('successful submission', () => {
    it('calls onSubmit with form data when all fields are valid', async () => {
      render(<DeckForm onSubmit={onSubmit} onCancel={onCancel} />);
      userEvent.type(screen.getByPlaceholderText('e.g., React Fundamentals'), 'My React Deck');
      userEvent.type(screen.getByPlaceholderText(/brief description/i), 'A great deck for React learners');
      userEvent.click(screen.getByRole('button', { name: 'Create Deck' }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'My React Deck',
            description: 'A great deck for React learners',
            category: 'JavaScript'
          })
        );
      });
    });
  });
});
