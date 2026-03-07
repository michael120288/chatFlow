import { setSelectedChatUser } from '@redux/reducers/chat/chat.reducer';
import { ChatUtils } from '@services/utils/chat-utils.service';

describe('ChatUtils', () => {
  describe('chatUrlParams', () => {
    it('returns senderUsername and senderId when receiverUsername matches profile username', () => {
      const user = {
        receiverUsername: 'alice',
        senderUsername: 'BOB',
        senderId: 's1',
        receiverId: 'r1'
      };
      const profile = { username: 'alice' };

      const result = ChatUtils.chatUrlParams(user, profile);

      expect(result.username).toBe('bob');
      expect(result.id).toBe('s1');
    });

    it('returns receiverUsername and receiverId when receiverUsername does not match profile username', () => {
      const user = {
        receiverUsername: 'CHARLIE',
        senderUsername: 'bob',
        senderId: 's1',
        receiverId: 'r1'
      };
      const profile = { username: 'alice' };

      const result = ChatUtils.chatUrlParams(user, profile);

      expect(result.username).toBe('charlie');
      expect(result.id).toBe('r1');
    });

    it('lowercases the returned username', () => {
      const user = {
        receiverUsername: 'Alice',
        senderUsername: 'BobSmith',
        senderId: 's1',
        receiverId: 'r1'
      };
      const profile = { username: 'Alice' };

      const result = ChatUtils.chatUrlParams(user, profile);

      expect(result.username).toBe('bobsmith');
    });
  });

  describe('messageData', () => {
    it('uses conversationId from matching chatMessage when found', () => {
      const receiver = { _id: 'recv1', username: 'alice', avatarColor: 'red', profilePicture: 'http://pic.com/alice' };
      const chatMessages = [
        { _id: 'm1', conversationId: 'conv-from-chat', receiverId: 'recv1', senderId: 'send1' },
        { _id: 'm2', conversationId: 'other-conv', receiverId: 'other', senderId: 'other2' }
      ];

      const result = ChatUtils.messageData({
        receiver,
        message: ' hello ',
        searchParamsId: 'recv1',
        conversationId: 'fallback-conv',
        chatMessages,
        isRead: false,
        gifUrl: '',
        selectedImage: ''
      });

      expect(result.conversationId).toBe('conv-from-chat');
      expect(result.receiverId).toBe('recv1');
      expect(result.receiverUsername).toBe('alice');
      expect(result.body).toBe('hello');
      expect(result.isRead).toBe(false);
    });

    it('falls back to provided conversationId when no chatMessage matches', () => {
      const receiver = { _id: 'recv2', username: 'bob', avatarColor: 'blue', profilePicture: '' };
      const chatMessages = [
        { _id: 'm1', conversationId: 'other-conv', receiverId: 'unrelated', senderId: 'unrelated2' }
      ];

      const result = ChatUtils.messageData({
        receiver,
        message: 'world',
        searchParamsId: 'recv2',
        conversationId: 'fallback-conv',
        chatMessages,
        isRead: true,
        gifUrl: 'http://giphy.com/g1',
        selectedImage: 'http://img.com/img1'
      });

      expect(result.conversationId).toBe('fallback-conv');
      expect(result.gifUrl).toBe('http://giphy.com/g1');
      expect(result.selectedImage).toBe('http://img.com/img1');
      expect(result.isRead).toBe(true);
    });

    it('matches chatMessage by senderId when receiverId does not match', () => {
      const receiver = { _id: 'recv3', username: 'carol', avatarColor: 'green', profilePicture: '' };
      const chatMessages = [{ _id: 'm1', conversationId: 'conv-by-sender', receiverId: 'other', senderId: 'recv3' }];

      const result = ChatUtils.messageData({
        receiver,
        message: 'hi',
        searchParamsId: 'recv3',
        conversationId: 'fallback',
        chatMessages,
        isRead: false,
        gifUrl: '',
        selectedImage: ''
      });

      expect(result.conversationId).toBe('conv-by-sender');
    });

    it('returns empty conversationId when chatMessages is empty', () => {
      const receiver = { _id: 'r1', username: 'x', avatarColor: 'y', profilePicture: '' };

      const result = ChatUtils.messageData({
        receiver,
        message: 'test',
        searchParamsId: 'recv99',
        conversationId: 'fallback',
        chatMessages: [],
        isRead: false,
        gifUrl: '',
        selectedImage: ''
      });

      expect(result.conversationId).toBe('fallback');
    });

    it('trims whitespace from message body', () => {
      const receiver = { _id: 'r1', username: 'x', avatarColor: 'y', profilePicture: '' };

      const result = ChatUtils.messageData({
        receiver,
        message: '   trimmed message   ',
        searchParamsId: 'none',
        conversationId: 'conv',
        chatMessages: [],
        isRead: false,
        gifUrl: '',
        selectedImage: ''
      });

      expect(result.body).toBe('trimmed message');
    });
  });

  describe('updatedSelectedChatUser', () => {
    it('dispatches setSelectedChatUser with first chatMessage and navigates when chatMessageList is non-empty', () => {
      const dispatch = jest.fn();
      const navigate = jest.fn();
      const chatMessageList = [{ _id: 'm1', senderUsername: 'alice' }];
      const params = { username: 'alice', id: 'u1' };

      ChatUtils.updatedSelectedChatUser({
        chatMessageList,
        profile: { _id: 'me', username: 'me' },
        username: 'alice',
        setSelectedChatUser,
        params,
        pathname: '/app/social/chat/messages',
        navigate,
        dispatch
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('dispatches setSelectedChatUser with null user when chatMessageList is empty', () => {
      const dispatch = jest.fn();
      const navigate = jest.fn();
      // Reset chatUsers to empty to avoid finding a sender
      ChatUtils.chatUsers = [];

      ChatUtils.updatedSelectedChatUser({
        chatMessageList: [],
        profile: { _id: 'me', username: 'me' },
        username: 'alice',
        setSelectedChatUser,
        params: { username: 'alice', id: 'u1' },
        pathname: '/app/social/chat/messages',
        navigate,
        dispatch
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
