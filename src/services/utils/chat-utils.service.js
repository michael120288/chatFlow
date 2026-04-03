import { chatService } from '@services/api/chat/chat.service';
import { socketService } from '@services/socket/socket.service';
import { cloneDeep, find, findIndex, remove } from 'lodash';
import { createSearchParams } from 'react-router-dom';

export class ChatUtils {
  static privateChatMessages = [];
  static chatUsers = [];

  static usersOnline(setOnlineUsers) {
    const onUserOnline = (data) => {
      setOnlineUsers(data);
    };
    socketService?.socket?.on('user online', onUserOnline);
    return () => {
      socketService?.socket?.off('user online', onUserOnline);
    };
  }

  static usersOnChatPage() {
    const onAddChatUsers = (data) => {
      ChatUtils.chatUsers = [...data];
    };
    socketService?.socket?.on('add chat users', onAddChatUsers);
    return () => {
      socketService?.socket?.off('add chat users', onAddChatUsers);
    };
  }

  static joinRoomEvent(user, profile) {
    const users = {
      receiverId: user.receiverId,
      receiverName: user.receiverUsername,
      senderId: profile?._id,
      senderName: profile?.username
    };
    socketService?.socket?.emit('join room', users);
  }

  static emitChatPageEvent(event, data) {
    socketService?.socket?.emit(event, data);
  }

  static chatUrlParams(user, profile) {
    const params = { username: '', id: '' };
    if (user.receiverUsername === profile?.username) {
      params.username = user.senderUsername.toLowerCase();
      params.id = user.senderId;
    } else {
      params.username = user.receiverUsername.toLowerCase();
      params.id = user.receiverId;
    }
    return params;
  }

  static messageData({
    receiver,
    message,
    searchParamsId,
    conversationId,
    chatMessages,
    isRead,
    gifUrl,
    selectedImage
  }) {
    const chatConversationId = find(
      chatMessages,
      (chat) => chat.receiverId === searchParamsId || chat.senderId === searchParamsId
    );

    const messageData = {
      conversationId: chatConversationId ? chatConversationId.conversationId : conversationId,
      receiverId: receiver?._id,
      receiverUsername: receiver?.username,
      receiverAvatarColor: receiver?.avatarColor,
      receiverProfilePicture: receiver?.profilePicture,
      body: message.trim(),
      isRead,
      gifUrl,
      selectedImage
    };
    return messageData;
  }

  static updatedSelectedChatUser({
    chatMessageList,
    profile,
    username,
    setSelectedChatUser,
    params,
    pathname,
    navigate,
    dispatch
  }) {
    if (chatMessageList.length) {
      dispatch(setSelectedChatUser({ isLoading: false, user: chatMessageList[0] }));
      navigate(`${pathname}?${createSearchParams(params)}`);
    } else {
      dispatch(setSelectedChatUser({ isLoading: false, user: null }));
      const sender = find(
        ChatUtils.chatUsers,
        (user) => user.userOne === profile?.username && user.userTwo.toLowerCase() === username
      );
      if (sender) {
        chatService.removeChatUsers(sender);
      }
    }
  }

  static socketIOChatList(profile, setChatMessageList) {
    const onChatList = (data) => {
      if (data.senderUsername === profile?.username || data.receiverUsername === profile?.username) {
        setChatMessageList((prev) => {
          const list = cloneDeep(prev);
          const messageIndex = findIndex(list, ['conversationId', data.conversationId]);
          if (messageIndex > -1) {
            remove(list, (chat) => chat.conversationId === data.conversationId);
          } else {
            remove(list, (chat) => chat.receiverUsername === data.receiverUsername);
          }
          return [data, ...list];
        });
      }
    };
    socketService?.socket?.on('chat list', onChatList);
    return () => {
      socketService?.socket?.off('chat list', onChatList);
    };
  }

  static socketIOMessageReceived(username, setConversationId, setChatMessages) {
    const onMessageReceived = (data) => {
      if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
        setConversationId(data.conversationId);
        ChatUtils.privateChatMessages.push(data);
        setChatMessages([...ChatUtils.privateChatMessages]);
      }
    };

    const onMessageRead = (data) => {
      if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
        const findMessageIndex = findIndex(ChatUtils.privateChatMessages, ['_id', data._id]);
        if (findMessageIndex > -1) {
          ChatUtils.privateChatMessages.splice(findMessageIndex, 1, data);
          setChatMessages([...ChatUtils.privateChatMessages]);
        }
      }
    };

    socketService?.socket?.on('message received', onMessageReceived);
    socketService?.socket?.on('message read', onMessageRead);

    return () => {
      socketService?.socket?.off('message received', onMessageReceived);
      socketService?.socket?.off('message read', onMessageRead);
    };
  }

  static socketIOMessageReaction(username, setConversationId, setChatMessages) {
    const onMessageReaction = (data) => {
      if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
        setConversationId(data.conversationId);
        setChatMessages((prev) => {
          const messages = cloneDeep(prev);
          const messageIndex = findIndex(messages, (message) => message?._id === data._id);
          if (messageIndex > -1) {
            messages.splice(messageIndex, 1, data);
          }
          return messages;
        });
      }
    };

    socketService?.socket?.on('message reaction', onMessageReaction);

    return () => {
      socketService?.socket?.off('message reaction', onMessageReaction);
    };
  }
}
