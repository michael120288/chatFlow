import ChatList from '@components/chat/list/ChatList';
import ChatWindow from '@components/chat/window/ChatWindow';
import useEffectOnce from '@hooks/useEffectOnce';
import '@pages/social/chat/Chat.scss';
import { getConversationList } from '@redux/api/chat';
import { setSelectedChatUser } from '@redux/reducers/chat/chat.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Chat = () => {
  const { selectedChatUser, chatList } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasActiveConversation = !!searchParams.get('username');

  useEffectOnce(() => {
    dispatch(getConversationList());
  });

  const handleBack = () => {
    dispatch(setSelectedChatUser({ isLoading: false, user: null }));
    navigate('/app/social/chat/messages');
  };

  return (
    <div className="private-chat-wrapper">
      <div
        className={`private-chat-wrapper-content${
          hasActiveConversation ? ' private-chat-wrapper-content--active' : ''
        }`}
      >
        <div className="private-chat-wrapper-content-side">
          <ChatList />
        </div>
        <div className="private-chat-wrapper-content-conversation">
          <button className="chat-back-btn" onClick={handleBack} aria-label="Back to conversations">
            ← Conversations
          </button>
          {(selectedChatUser || chatList.length > 0) && <ChatWindow />}
          {!selectedChatUser && !chatList.length && (
            <div className="no-chat" data-testid="no-chat">
              Select or Search for users to chat with
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Chat;
