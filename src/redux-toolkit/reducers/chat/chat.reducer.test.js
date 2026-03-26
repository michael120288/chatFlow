import { getConversationList } from '@redux/api/chat';
import reducer, { addToChatList, setSelectedChatUser } from '@redux/reducers/chat/chat.reducer';

let initialState;

describe('chat reducer', () => {
  beforeEach(() => {
    initialState = {
      chatList: [],
      selectedChatUser: null,
      isLoading: false
    };
  });

  it('returns initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('addToChatList populates chatList and sets isLoading', () => {
    const chatList = [{ _id: 'c1' }, { _id: 'c2' }];
    const result = reducer(initialState, addToChatList({ chatList, isLoading: false }));
    expect(result.chatList).toEqual(chatList);
    expect(result.isLoading).toBe(false);
  });

  it('setSelectedChatUser sets selectedChatUser and isLoading', () => {
    const user = { _id: 'u1', username: 'alice' };
    const result = reducer(initialState, setSelectedChatUser({ user, isLoading: false }));
    expect(result.selectedChatUser).toEqual(user);
    expect(result.isLoading).toBe(false);
  });

  it('setSelectedChatUser can set user to null', () => {
    const result = reducer(initialState, setSelectedChatUser({ user: null, isLoading: false }));
    expect(result.selectedChatUser).toBeNull();
  });

  describe('getConversationList async thunk', () => {
    it('sets isLoading true on pending', () => {
      const result = reducer(initialState, getConversationList.pending('req-1'));
      expect(result.isLoading).toBe(true);
    });

    it('populates chatList sorted by createdAt desc on fulfilled', () => {
      const list = [
        { _id: 'c1', createdAt: '2022-01-01' },
        { _id: 'c2', createdAt: '2022-06-01' },
        { _id: 'c3', createdAt: '2022-03-01' }
      ];
      const result = reducer({ ...initialState, isLoading: true }, getConversationList.fulfilled({ list }, 'req-1'));
      expect(result.isLoading).toBe(false);
      expect(result.chatList[0]._id).toBe('c2');
      expect(result.chatList[1]._id).toBe('c3');
      expect(result.chatList[2]._id).toBe('c1');
    });

    it('clears isLoading on rejected', () => {
      const result = reducer({ ...initialState, isLoading: true }, getConversationList.rejected(null, 'req-1'));
      expect(result.isLoading).toBe(false);
    });
  });
});
