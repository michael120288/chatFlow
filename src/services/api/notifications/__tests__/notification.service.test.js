import axios from '@services/axios';
import { notificationService } from '../notification.service';

jest.mock('@services/axios');

describe('notificationService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getUserNotifications GETs /notifications', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await notificationService.getUserNotifications();
    expect(axios.get).toHaveBeenCalledWith('/notifications');
  });

  it('markNotificationAsRead PUTs to /notification/:messageId', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    await notificationService.markNotificationAsRead('msg123');
    expect(axios.put).toHaveBeenCalledWith('/notification/msg123');
  });

  it('deleteNotification DELETEs /notification/:messageId', async () => {
    axios.delete.mockResolvedValueOnce({ data: {} });
    await notificationService.deleteNotification('msg456');
    expect(axios.delete).toHaveBeenCalledWith('/notification/msg456');
  });
});
