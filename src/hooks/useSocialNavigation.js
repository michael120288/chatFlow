import { useCallback, useEffect, useState } from 'react';
import { useLocation, createSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '@redux/api/posts';
import { Utils } from '@services/utils/utils.service';
import { ChatUtils } from '@services/utils/chat-utils.service';
import { chatService } from '@services/api/chat/chat.service';
import { socketService } from '@services/socket/socket.service';

export const useSocialNavigation = () => {
  const { profile } = useSelector((state) => state.user);
  const { chatList } = useSelector((state) => state.chat);
  const [chatPageName, setChatPageName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkUrl = (name) => location.pathname.includes(name.toLowerCase());

  const createChatUrlParams = useCallback(
    (url) => {
      if (chatList.length) {
        const chatUser = chatList[0];
        const params = ChatUtils.chatUrlParams(chatUser, profile);
        ChatUtils.joinRoomEvent(chatUser, profile);
        return `${url}?${createSearchParams(params)}`;
      }
      return url;
    },
    [chatList, profile]
  );

  const markMessagesAsRead = useCallback(
    async (user) => {
      try {
        const receiverId = user?.receiverUsername !== profile?.username ? user?.receiverId : user?.senderId;
        if (user?.receiverUsername === profile?.username && !user.isRead) {
          await chatService.markMessagesAsRead(profile?._id, receiverId);
        }
        const userTwoName =
          user?.receiverUsername !== profile?.username ? user?.receiverUsername : user?.senderUsername;
        await chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
      } catch (error) {
        Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
      }
    },
    [dispatch, profile]
  );

  const leaveChatPage = async () => {
    try {
      const chatUser = chatList[0];
      const userTwoName =
        chatUser?.receiverUsername !== profile?.username ? chatUser?.receiverUsername : chatUser?.senderUsername;
      ChatUtils.privateChatMessages = [];
      if (!userTwoName) return;
      await chatService.removeChatUsers({ userOne: profile?.username, userTwo: userTwoName });
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  };

  const navigateToPage = (name, url) => {
    if (name === 'Profile') {
      url = `${url}/${profile?.username}?${createSearchParams({ id: profile?._id, uId: profile?.uId })}`;
    }
    if (name === 'Streams') {
      dispatch(getPosts());
    }
    if (name === 'Chat') {
      setChatPageName('Chat');
    } else {
      leaveChatPage();
      setChatPageName('');
    }
    socketService?.socket.off('message received');
    navigate(url);
  };

  useEffect(() => {
    if (chatPageName === 'Chat') {
      const url = createChatUrlParams('/app/social/chat/messages');
      navigate(url);
      if (chatList.length && !chatList[0].isRead) {
        markMessagesAsRead(chatList[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navigateToPage triggers this; createChatUrlParams and markMessagesAsRead are stable callbacks
  }, [chatList, chatPageName]);

  return { checkUrl, navigateToPage };
};
