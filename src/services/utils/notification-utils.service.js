import { notificationService } from '@services/api/notifications/notification.service';
import { socketService } from '@services/socket/socket.service';
import { Utils } from '@services/utils/utils.service';
import { cloneDeep, find, findIndex, remove, sumBy } from 'lodash';
import { timeAgo } from '@services/utils/timeago.utils';

export class NotificationUtils {
  static socketIONotification(profile, setNotifications, type, setNotificationsCount) {
    const onInsert = (data, userToData) => {
      if (profile?._id === userToData.userTo) {
        const notifications = [...data];
        if (type === 'notificationPage') {
          setNotifications(notifications);
        } else {
          const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
            notifications,
            setNotificationsCount
          );
          setNotifications(mappedNotifications);
        }
      }
    };

    const onUpdate = (notificationId) => {
      setNotifications((prev) => {
        const notifications = cloneDeep(prev);
        const notificationData = find(notifications, (n) => n._id === notificationId);
        if (!notificationData) return prev;
        const index = findIndex(notifications, (n) => n._id === notificationId);
        notificationData.read = true;
        notifications.splice(index, 1, notificationData);
        if (type === 'notificationPage') {
          return notifications;
        }
        return NotificationUtils.mapNotificationDropdownItems(notifications, setNotificationsCount);
      });
    };

    const onDelete = (notificationId) => {
      setNotifications((prev) => {
        const notifications = cloneDeep(prev);
        remove(notifications, { _id: notificationId });
        if (type === 'notificationPage') {
          return notifications;
        }
        return NotificationUtils.mapNotificationDropdownItems(notifications, setNotificationsCount);
      });
    };

    socketService?.socket?.on('insert notification', onInsert);
    socketService?.socket?.on('update notification', onUpdate);
    socketService?.socket?.on('delete notification', onDelete);

    return () => {
      socketService?.socket?.off('insert notification', onInsert);
      socketService?.socket?.off('update notification', onUpdate);
      socketService?.socket?.off('delete notification', onDelete);
    };
  }

  static mapNotificationDropdownItems(notificationData, setNotificationsCount) {
    const items = [];
    for (const notification of notificationData) {
      const item = {
        _id: notification?._id,
        topText: notification?.topText ? notification?.topText : notification?.message,
        subText: timeAgo.transform(notification?.createdAt),
        createdAt: notification?.createdAt,
        username: notification?.userFrom ? notification?.userFrom.username : notification?.username,
        avatarColor: notification?.userFrom ? notification?.userFrom.avatarColor : notification?.avatarColor,
        profilePicture: notification?.userFrom ? notification?.userFrom.profilePicture : notification?.profilePicture,
        read: notification?.read,
        post: notification?.post,
        imgUrl: notification?.imgId
          ? Utils.appImageUrl(notification?.imgVersion, notification?.imgId)
          : notification?.gifUrl
          ? notification?.gifUrl
          : notification?.imgUrl,
        comment: notification?.comment,
        reaction: notification?.reaction,
        senderName: notification?.userFrom ? notification?.userFrom.username : notification?.username,
        notificationType: notification?.notificationType
      };
      items.push(item);
    }

    const count = sumBy(items, (selectedNotification) => {
      return !selectedNotification.read ? 1 : 0;
    });
    setNotificationsCount(count);
    return items;
  }

  static async markMessageAsRead(messageId, notification, setNotificationDialogContent) {
    if (notification.notificationType !== 'follows') {
      const notificationDialog = {
        createdAt: notification?.createdAt,
        post: notification?.post,
        imgUrl: notification?.imgId
          ? Utils.appImageUrl(notification?.imgVersion, notification?.imgId)
          : notification?.gifUrl
          ? notification?.gifUrl
          : notification?.imgUrl,
        comment: notification?.comment,
        reaction: notification?.reaction,
        senderName: notification?.userFrom ? notification?.userFrom.username : notification?.username
      };
      setNotificationDialogContent(notificationDialog);
    }
    await notificationService.markNotificationAsRead(messageId);
  }

  static socketIOMessageNotification(profile, setMessageNotifications, setMessageCount, dispatch, locationRef) {
    const onChatList = (data) => {
      if (data?.receiverUsername !== profile?.username) return;
      const notificationData = {
        senderId: data.senderId,
        senderUsername: data.senderUsername,
        senderAvatarColor: data.senderAvatarColor,
        senderProfilePicture: data.senderProfilePicture,
        receiverId: data.receiverId,
        receiverUsername: data.receiverUsername,
        receiverAvatarColor: data.receiverAvatarColor,
        receiverProfilePicture: data.receiverProfilePicture,
        messageId: data._id,
        conversationId: data.conversationId,
        body: data.body,
        isRead: data.isRead
      };
      setMessageNotifications((prev) => {
        const messageNotifications = cloneDeep(prev);
        const messageIndex = findIndex(messageNotifications, (n) => n.conversationId === data.conversationId);
        if (messageIndex > -1) {
          remove(messageNotifications, (n) => n.conversationId === data.conversationId);
        }
        const updated = [notificationData, ...messageNotifications];
        const count = sumBy(updated, (n) => (!n.isRead ? 1 : 0));
        setMessageCount(count);
        return updated;
      });
      const location = locationRef?.current ?? locationRef;
      if (!Utils.checkUrl(location.pathname, 'chat')) {
        Utils.dispatchNotification('You have a new message', 'success', dispatch);
      }
    };

    socketService?.socket?.on('chat list', onChatList);

    return () => {
      socketService?.socket?.off('chat list', onChatList);
    };
  }
}
