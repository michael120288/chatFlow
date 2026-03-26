import axios from '@services/axios';
import { chatService } from '../chat.service';

jest.mock('@services/axios');

describe('chatService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getConversationList GETs /chat/message/conversation-list', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await chatService.getConversationList();
    expect(axios.get).toHaveBeenCalledWith('/chat/message/conversation-list');
  });

  it('getChatMessages GETs /chat/message/user/:receiverId', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await chatService.getChatMessages('user123');
    expect(axios.get).toHaveBeenCalledWith('/chat/message/user/user123');
  });

  it('addChatUsers POSTs to /chat/message/add-chat-users', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const body = { userIds: ['u1', 'u2'] };
    await chatService.addChatUsers(body);
    expect(axios.post).toHaveBeenCalledWith('/chat/message/add-chat-users', body);
  });

  it('removeChatUsers POSTs to /chat/message/remove-chat-users', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const body = { userIds: ['u1'] };
    await chatService.removeChatUsers(body);
    expect(axios.post).toHaveBeenCalledWith('/chat/message/remove-chat-users', body);
  });

  it('markMessagesAsRead PUTs to /chat/message/mark-as-read with senderId and receiverId', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    await chatService.markMessagesAsRead('sender1', 'receiver1');
    expect(axios.put).toHaveBeenCalledWith('/chat/message/mark-as-read', {
      senderId: 'sender1',
      receiverId: 'receiver1'
    });
  });

  it('saveChatMessage POSTs to /chat/message', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const body = { receiverId: 'u2', body: 'Hello!' };
    await chatService.saveChatMessage(body);
    expect(axios.post).toHaveBeenCalledWith('/chat/message', body);
  });

  it('updateMessageReaction PUTs to /chat/message/reaction', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    const body = { messageId: 'msg1', reaction: '❤️', type: 'add' };
    await chatService.updateMessageReaction(body);
    expect(axios.put).toHaveBeenCalledWith('/chat/message/reaction', body);
  });

  it('markMessageAsDelete DELETEs the correct URL', async () => {
    axios.delete.mockResolvedValueOnce({ data: {} });
    await chatService.markMessageAsDelete('msg1', 'sender1', 'receiver1', 'deleteForMe');
    expect(axios.delete).toHaveBeenCalledWith('/chat/message/mark-as-deleted/msg1/sender1/receiver1/deleteForMe');
  });
});
