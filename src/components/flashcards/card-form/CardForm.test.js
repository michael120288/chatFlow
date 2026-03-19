import CardForm from '@components/flashcards/card-form/CardForm';
import { render, screen, fireEvent, waitFor } from '@root/test.utils';
import userEvent from '@testing-library/user-event';

const onSubmit = jest.fn();

describe('CardForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders create mode by default', () => {
      render(<CardForm onSubmit={onSubmit} />);
      expect(screen.getByText('Create New Flashcard')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Card' })).toBeInTheDocument();
    });

    it('renders edit mode when initialData is provided', () => {
      const initialData = { question: 'What is React?', answer: 'A JS library', category: 'React', privacy: 'public', difficulty: 'easy' };
      render(<CardForm onSubmit={onSubmit} initialData={initialData} />);
      expect(screen.getByText('Edit Card')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Update Card' })).toBeInTheDocument();
    });

    it('pre-fills fields from initialData', () => {
      const initialData = { question: 'What is React?', answer: 'A JS library', category: 'React', privacy: 'public', difficulty: 'easy' };
      render(<CardForm onSubmit={onSubmit} initialData={initialData} />);
      expect(screen.getByDisplayValue('What is React?')).toBeInTheDocument();
      expect(screen.getByDisplayValue('A JS library')).toBeInTheDocument();
    });

    it('has a category selector with JavaScript selected by default', () => {
      render(<CardForm onSubmit={onSubmit} />);
      expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();
    });
  });

  describe('profanity validation', () => {
    it('shows error when question contains profanity', async () => {
      render(<CardForm onSubmit={onSubmit} />);
      const questionField = screen.getByPlaceholderText('Enter your question...');
      const answerField = screen.getByPlaceholderText('Enter the answer...');

      userEvent.type(questionField, 'What the fuck is this?');
      userEvent.type(answerField, 'A clean answer');
      fireEvent.submit(screen.getByRole('button', { name: 'Create Card' }).closest('form'));

      await waitFor(() => {
        expect(screen.getByText('Your card contains inappropriate language.')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows error when answer contains profanity', async () => {
      render(<CardForm onSubmit={onSubmit} />);
      userEvent.type(screen.getByPlaceholderText('Enter your question...'), 'Clean question');
      userEvent.type(screen.getByPlaceholderText('Enter the answer...'), 'bullshit answer');
      fireEvent.submit(screen.getByRole('button', { name: 'Create Card' }).closest('form'));

      await waitFor(() => {
        expect(screen.getByText('Your card contains inappropriate language.')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('successful submission', () => {
    it('calls onSubmit with form data when content is clean', async () => {
      onSubmit.mockResolvedValue({});
      render(<CardForm onSubmit={onSubmit} />);
      userEvent.type(screen.getByPlaceholderText('Enter your question...'), 'What is a closure?');
      userEvent.type(screen.getByPlaceholderText('Enter the answer...'), 'A function with access to its outer scope');
      fireEvent.submit(screen.getByRole('button', { name: 'Create Card' }).closest('form'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            question: 'What is a closure?',
            answer: 'A function with access to its outer scope'
          })
        );
      });
      // wait for all post-submit state updates to flush
      await waitFor(() => expect(screen.getByRole('button', { name: 'Create Card' })).not.toBeDisabled());
    });

    it('resets the form after successful submission', async () => {
      onSubmit.mockResolvedValue({});
      render(<CardForm onSubmit={onSubmit} />);
      const questionField = screen.getByPlaceholderText('Enter your question...');
      userEvent.type(questionField, 'What is a closure?');
      userEvent.type(screen.getByPlaceholderText('Enter the answer...'), 'A clean answer');
      fireEvent.submit(screen.getByRole('button', { name: 'Create Card' }).closest('form'));

      await waitFor(() => expect(questionField).toHaveValue(''));
    });
  });
});
