import CardComments from '@components/flashcards/card-comments/CardComments';
import { render, screen, waitFor } from '@root/test.utils';
import userEvent from '@testing-library/user-event';

const currentUser = {
  _id: 'user1',
  username: 'TestUser',
  avatarColor: '#9c27b0',
  profilePicture: ''
};

const mockComments = [
  {
    _id: 'comment1',
    username: 'TestUser',
    avatarColor: '#9c27b0',
    profilePicture: '',
    comment: 'Great card!',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'comment2',
    username: 'OtherUser',
    avatarColor: '#2196f3',
    profilePicture: '',
    comment: 'Very helpful.',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString()
  }
];

const defaultProps = {
  cardId: 'card1',
  comments: [],
  onAddComment: jest.fn(),
  onEditComment: jest.fn(),
  onDeleteComment: jest.fn(),
  currentUser
};

describe('CardComments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('empty state', () => {
    it('shows empty state message when there are no comments', () => {
      render(<CardComments {...defaultProps} />);
      expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
    });

    it('does not show a comment count when comments list is empty', () => {
      render(<CardComments {...defaultProps} />);
      expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
    });
  });

  describe('with comments', () => {
    it('renders all comments', () => {
      render(<CardComments {...defaultProps} comments={mockComments} />);
      expect(screen.getByText('Great card!')).toBeInTheDocument();
      expect(screen.getByText('Very helpful.')).toBeInTheDocument();
    });

    it('shows comment count in the header', () => {
      render(<CardComments {...defaultProps} comments={mockComments} />);
      expect(screen.getByText(`(${mockComments.length})`)).toBeInTheDocument();
    });

    it('shows the comment author username', () => {
      render(<CardComments {...defaultProps} comments={mockComments} />);
      expect(screen.getByText('TestUser')).toBeInTheDocument();
      expect(screen.getByText('OtherUser')).toBeInTheDocument();
    });

    it("does not show options button for another user's comment", () => {
      render(<CardComments {...defaultProps} comments={[mockComments[1]]} />);
      // options button is only rendered for own comments
      const buttons = screen.getAllByRole('button');
      // Only the submit button should be visible (options not shown for OtherUser's comment)
      expect(buttons).toHaveLength(1);
    });
  });

  describe('adding a comment', () => {
    it('submit button is disabled when textarea is empty', () => {
      render(<CardComments {...defaultProps} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('submit button is enabled after typing', () => {
      render(<CardComments {...defaultProps} />);
      userEvent.type(screen.getByPlaceholderText('Write a comment...'), 'A new comment');
      expect(screen.getByRole('button')).toBeEnabled();
    });

    it('calls onAddComment with cardId and comment text on submit', () => {
      render(<CardComments {...defaultProps} />);
      userEvent.type(screen.getByPlaceholderText('Write a comment...'), 'A new comment');
      userEvent.click(screen.getByRole('button'));
      expect(defaultProps.onAddComment).toHaveBeenCalledWith('card1', 'A new comment');
    });

    it('clears the textarea after submitting', () => {
      render(<CardComments {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Write a comment...');
      userEvent.type(textarea, 'A new comment');
      userEvent.click(screen.getByRole('button'));
      expect(textarea).toHaveValue('');
    });

    it('shows profanity error and does not call onAddComment', () => {
      render(<CardComments {...defaultProps} />);
      userEvent.type(screen.getByPlaceholderText('Write a comment...'), 'what the fuck');
      userEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Your comment contains inappropriate language.')).toBeInTheDocument();
      expect(defaultProps.onAddComment).not.toHaveBeenCalled();
    });
  });

  describe('editing a comment', () => {
    it('shows options button for own comment', () => {
      render(<CardComments {...defaultProps} comments={[mockComments[0]]} />);
      const { container } = render(<CardComments {...defaultProps} comments={[mockComments[0]]} />);
      expect(container.querySelector('.options-button')).toBeInTheDocument();
    });

    it('opens options menu on options button click', async () => {
      const { container } = render(<CardComments {...defaultProps} comments={[mockComments[0]]} />);
      userEvent.click(container.querySelector('.options-button'));
      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
    });

    it('shows edit form pre-filled with original text', async () => {
      const { container } = render(<CardComments {...defaultProps} comments={[mockComments[0]]} />);
      userEvent.click(container.querySelector('.options-button'));
      userEvent.click(await screen.findByText('Edit'));
      expect(screen.getByPlaceholderText('Edit your comment...')).toHaveValue('Great card!');
    });

    it('calls onEditComment with updated text on save', async () => {
      const { container } = render(<CardComments {...defaultProps} comments={[mockComments[0]]} />);
      userEvent.click(container.querySelector('.options-button'));
      userEvent.click(await screen.findByText('Edit'));
      const editArea = screen.getByPlaceholderText('Edit your comment...');
      userEvent.clear(editArea);
      userEvent.type(editArea, 'Updated comment');
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
      expect(defaultProps.onEditComment).toHaveBeenCalledWith('comment1', 'Updated comment');
    });

    it('shows profanity error and does not call onEditComment', async () => {
      const { container } = render(<CardComments {...defaultProps} comments={[mockComments[0]]} />);
      userEvent.click(container.querySelector('.options-button'));
      userEvent.click(await screen.findByText('Edit'));
      const editArea = screen.getByPlaceholderText('Edit your comment...');
      userEvent.clear(editArea);
      userEvent.type(editArea, 'bullshit edit');
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
      expect(screen.getByText('Your comment contains inappropriate language.')).toBeInTheDocument();
      expect(defaultProps.onEditComment).not.toHaveBeenCalled();
    });

    it('cancels edit and restores comment view', async () => {
      const { container } = render(<CardComments {...defaultProps} comments={[mockComments[0]]} />);
      userEvent.click(container.querySelector('.options-button'));
      userEvent.click(await screen.findByText('Edit'));
      userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByPlaceholderText('Edit your comment...')).not.toBeInTheDocument();
    });
  });

  describe('deleting a comment', () => {
    it('calls onDeleteComment with the comment id', async () => {
      const { container } = render(<CardComments {...defaultProps} comments={[mockComments[0]]} />);
      userEvent.click(container.querySelector('.options-button'));
      userEvent.click(await screen.findByText('Delete'));
      expect(defaultProps.onDeleteComment).toHaveBeenCalledWith('comment1');
    });
  });
});
