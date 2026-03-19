import CommentInputBox from '@components/posts/comments/comment-input/CommentInputBox';
import { postMockData } from '@mocks/data/post.mock';
import { existingUser } from '@mocks/data/user.mock';
import { addUser } from '@redux/reducers/user/user.reducer';
import { store } from '@redux/store';
import { render, screen, waitFor } from '@root/test.utils';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

jest.mock('@services/socket/socket.service', () => ({
  socketService: { socket: { emit: jest.fn() } }
}));

jest.mock('@services/api/post/post.service', () => ({
  postService: { addComment: jest.fn().mockResolvedValue({ data: {} }) }
}));

const { postService } = require('@services/api/post/post.service');

describe('CommentInputBox', () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(addUser({ token: '123456', profile: existingUser }));
    });
    jest.clearAllMocks();
  });

  it('renders the comment input', () => {
    render(<CommentInputBox post={postMockData} />);
    expect(screen.getByTestId('comment-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
  });

  it('focuses the input on mount', () => {
    render(<CommentInputBox post={postMockData} />);
    expect(screen.getByPlaceholderText('Write a comment...')).toHaveFocus();
  });

  it('does not call addComment when comment contains profanity', async () => {
    render(<CommentInputBox post={postMockData} />);
    const input = screen.getByPlaceholderText('Write a comment...');
    userEvent.type(input, 'what the fuck');
    userEvent.type(input, '{enter}');

    await waitFor(() => {
      expect(postService.addComment).not.toHaveBeenCalled();
    });
  });

  it('calls addComment when comment is clean', async () => {
    render(<CommentInputBox post={postMockData} />);
    const input = screen.getByPlaceholderText('Write a comment...');
    userEvent.type(input, 'Great post!');
    userEvent.type(input, '{enter}');

    await waitFor(() => {
      expect(postService.addComment).toHaveBeenCalledWith(
        expect.objectContaining({
          postId: postMockData._id,
          comment: 'Great post!'
        })
      );
    });
  });

  it('clears the input after successful submit', async () => {
    render(<CommentInputBox post={postMockData} />);
    const input = screen.getByPlaceholderText('Write a comment...');
    userEvent.type(input, 'Nice work!');
    userEvent.type(input, '{enter}');

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });
});
