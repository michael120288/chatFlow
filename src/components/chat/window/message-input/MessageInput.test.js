import MessageInput from '@components/chat/window/message-input/MessageInput';
import { existingUser } from '@mocks/data/user.mock';
import { addUser } from '@redux/reducers/user/user.reducer';
import { store } from '@redux/store';
import { render, screen, waitFor } from '@root/test.utils';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

jest.mock('@services/utils/image-utils.service', () => ({
  ImageUtils: { checkFile: jest.fn(), readAsBase64: jest.fn().mockResolvedValue('') }
}));

describe('MessageInput', () => {
  const setChatMessage = jest.fn();

  beforeEach(() => {
    act(() => {
      store.dispatch(addUser({ token: '123456', profile: existingUser }));
    });
    jest.clearAllMocks();
  });

  it('renders the chat input area', () => {
    render(<MessageInput setChatMessage={setChatMessage} />);
    expect(screen.getByTestId('chat-inputarea')).toBeInTheDocument();
  });

  it('renders the message text input', () => {
    render(<MessageInput setChatMessage={setChatMessage} />);
    expect(screen.getByPlaceholderText('Enter your message...')).toBeInTheDocument();
  });

  it('does not call setChatMessage when message contains profanity', async () => {
    render(<MessageInput setChatMessage={setChatMessage} />);
    const input = screen.getByPlaceholderText('Enter your message...');
    userEvent.type(input, 'what the fuck');

    const sendButton = screen.getByRole('button');
    userEvent.click(sendButton);

    await waitFor(() => {
      expect(setChatMessage).not.toHaveBeenCalled();
    });
  });

  it('calls setChatMessage with clean message on send', async () => {
    render(<MessageInput setChatMessage={setChatMessage} />);
    const input = screen.getByPlaceholderText('Enter your message...');
    userEvent.type(input, 'Hello there!');

    const sendButton = screen.getByRole('button');
    userEvent.click(sendButton);

    await waitFor(() => {
      expect(setChatMessage).toHaveBeenCalledWith('Hello there!', '', '');
    });
  });

  it('clears the message input after send', async () => {
    render(<MessageInput setChatMessage={setChatMessage} />);
    const input = screen.getByPlaceholderText('Enter your message...');
    userEvent.type(input, 'Hello there!');

    userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });
});
