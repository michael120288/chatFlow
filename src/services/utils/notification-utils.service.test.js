import { notificationService } from '@services/api/notifications/notification.service';
import { NotificationUtils } from '@services/utils/notification-utils.service';

const makeNotification = (overrides = {}) => ({
  _id: 'n1',
  topText: 'liked your post',
  createdAt: new Date('2022-06-15T10:00:00.000Z').toISOString(),
  userFrom: { username: 'alice', avatarColor: 'red', profilePicture: 'http://pic.com/alice' },
  read: false,
  post: 'Great post!',
  imgId: '',
  imgVersion: '',
  gifUrl: '',
  imgUrl: '',
  comment: '',
  reaction: 'like',
  notificationType: 'reactions',
  ...overrides
});

describe('NotificationUtils', () => {
  describe('mapNotificationDropdownItems', () => {
    it('maps a notification with userFrom correctly', () => {
      const setNotificationsCount = jest.fn();
      const items = NotificationUtils.mapNotificationDropdownItems([makeNotification()], setNotificationsCount);

      expect(items).toHaveLength(1);
      expect(items[0].username).toBe('alice');
      expect(items[0].avatarColor).toBe('red');
      expect(items[0].senderName).toBe('alice');
    });

    it('falls back to root notification fields when userFrom is absent', () => {
      const setNotificationsCount = jest.fn();
      const notification = makeNotification({
        userFrom: null,
        username: 'bob',
        avatarColor: 'blue',
        profilePicture: 'http://pic.com/bob'
      });
      const items = NotificationUtils.mapNotificationDropdownItems([notification], setNotificationsCount);

      expect(items[0].username).toBe('bob');
      expect(items[0].senderName).toBe('bob');
    });

    it('uses topText when present', () => {
      const setNotificationsCount = jest.fn();
      const items = NotificationUtils.mapNotificationDropdownItems(
        [makeNotification({ topText: 'Custom top text' })],
        setNotificationsCount
      );
      expect(items[0].topText).toBe('Custom top text');
    });

    it('falls back to message when topText is absent', () => {
      const setNotificationsCount = jest.fn();
      const notification = makeNotification({ topText: undefined, message: 'A plain message' });
      const items = NotificationUtils.mapNotificationDropdownItems([notification], setNotificationsCount);
      expect(items[0].topText).toBe('A plain message');
    });

    it('builds cloudinary imgUrl when imgId is present', () => {
      const setNotificationsCount = jest.fn();
      const notification = makeNotification({ imgId: 'myImgId', imgVersion: '1234' });
      const items = NotificationUtils.mapNotificationDropdownItems([notification], setNotificationsCount);
      expect(items[0].imgUrl).toContain('cloudinary');
    });

    it('uses gifUrl when imgId is absent but gifUrl is present', () => {
      const setNotificationsCount = jest.fn();
      const notification = makeNotification({ imgId: '', gifUrl: 'http://giphy.com/gif1' });
      const items = NotificationUtils.mapNotificationDropdownItems([notification], setNotificationsCount);
      expect(items[0].imgUrl).toBe('http://giphy.com/gif1');
    });

    it('uses imgUrl fallback when neither imgId nor gifUrl are present', () => {
      const setNotificationsCount = jest.fn();
      const notification = makeNotification({ imgId: '', gifUrl: '', imgUrl: 'http://cdn.com/img.jpg' });
      const items = NotificationUtils.mapNotificationDropdownItems([notification], setNotificationsCount);
      expect(items[0].imgUrl).toBe('http://cdn.com/img.jpg');
    });

    it('counts unread notifications and calls setNotificationsCount', () => {
      const setNotificationsCount = jest.fn();
      const notifications = [
        makeNotification({ _id: 'n1', read: false }),
        makeNotification({ _id: 'n2', read: true }),
        makeNotification({ _id: 'n3', read: false })
      ];
      NotificationUtils.mapNotificationDropdownItems(notifications, setNotificationsCount);
      expect(setNotificationsCount).toHaveBeenCalledWith(2);
    });

    it('returns empty array for empty notificationData', () => {
      const setNotificationsCount = jest.fn();
      const items = NotificationUtils.mapNotificationDropdownItems([], setNotificationsCount);
      expect(items).toEqual([]);
      expect(setNotificationsCount).toHaveBeenCalledWith(0);
    });
  });

  describe('markMessageAsRead', () => {
    beforeEach(() => {
      jest.spyOn(notificationService, 'markNotificationAsRead').mockResolvedValue({ data: {} });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls setNotificationDialogContent for non-follows notification', async () => {
      const setNotificationDialogContent = jest.fn();
      const notification = makeNotification({ notificationType: 'reactions' });

      await NotificationUtils.markMessageAsRead('msg1', notification, setNotificationDialogContent);

      expect(setNotificationDialogContent).toHaveBeenCalledTimes(1);
      expect(notificationService.markNotificationAsRead).toHaveBeenCalledWith('msg1');
    });

    it('does NOT call setNotificationDialogContent for follows notification', async () => {
      const setNotificationDialogContent = jest.fn();
      const notification = makeNotification({ notificationType: 'follows' });

      await NotificationUtils.markMessageAsRead('msg2', notification, setNotificationDialogContent);

      expect(setNotificationDialogContent).not.toHaveBeenCalled();
      expect(notificationService.markNotificationAsRead).toHaveBeenCalledWith('msg2');
    });

    it('builds imgUrl from imgId when present', async () => {
      const setNotificationDialogContent = jest.fn();
      const notification = makeNotification({ notificationType: 'comments', imgId: 'myId', imgVersion: '1234' });

      await NotificationUtils.markMessageAsRead('msg3', notification, setNotificationDialogContent);

      const dialog = setNotificationDialogContent.mock.calls[0][0];
      expect(dialog.imgUrl).toContain('cloudinary');
    });

    it('builds imgUrl from gifUrl when imgId absent', async () => {
      const setNotificationDialogContent = jest.fn();
      const notification = makeNotification({
        notificationType: 'comments',
        imgId: '',
        gifUrl: 'http://giphy.com/g1'
      });

      await NotificationUtils.markMessageAsRead('msg4', notification, setNotificationDialogContent);

      const dialog = setNotificationDialogContent.mock.calls[0][0];
      expect(dialog.imgUrl).toBe('http://giphy.com/g1');
    });
  });
});
