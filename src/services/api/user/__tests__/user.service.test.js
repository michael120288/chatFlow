import axios from '@services/axios';
import { userService } from '../user.service';

jest.mock('@services/axios');

describe('userService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getUserSuggestions GETs /user/profile/user/suggestions', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await userService.getUserSuggestions();
    expect(axios.get).toHaveBeenCalledWith('/user/profile/user/suggestions');
  });

  it('logoutUser POSTs /signout', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    await userService.logoutUser();
    expect(axios.post).toHaveBeenCalledWith('/signout');
  });

  it('checkCurrentUser GETs /currentuser', async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    await userService.checkCurrentUser();
    expect(axios.get).toHaveBeenCalledWith('/currentuser');
  });

  it('getAllUsers GETs /user/all/:page', async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    await userService.getAllUsers(2);
    expect(axios.get).toHaveBeenCalledWith('/user/all/2');
  });

  it('searchUsers GETs /user/profile/search/:query', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await userService.searchUsers('alice');
    expect(axios.get).toHaveBeenCalledWith('/user/profile/search/alice');
  });

  it('getUserProfileByUserId GETs /user/profile/:userId', async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    await userService.getUserProfileByUserId('user123');
    expect(axios.get).toHaveBeenCalledWith('/user/profile/user123');
  });

  it('getUserProfileByUsername GETs /user/profile/posts/:username/:userId/:uId', async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    await userService.getUserProfileByUsername('Alice', 'id1', 'uid1');
    expect(axios.get).toHaveBeenCalledWith('/user/profile/posts/Alice/id1/uid1');
  });

  it('changePassword PUTs to /user/profile/change-password', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    const body = { currentPassword: 'old', newPassword: 'new1' };
    await userService.changePassword(body);
    expect(axios.put).toHaveBeenCalledWith('/user/profile/change-password', body);
  });

  it('updateNotificationSettings PUTs to /user/profile/settings', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    const settings = { messages: true };
    await userService.updateNotificationSettings(settings);
    expect(axios.put).toHaveBeenCalledWith('/user/profile/settings', settings);
  });

  it('updateBasicInfo PUTs to /user/profile/basic-info', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    const info = { quote: 'Hello world' };
    await userService.updateBasicInfo(info);
    expect(axios.put).toHaveBeenCalledWith('/user/profile/basic-info', info);
  });

  it('updateSocialLinks PUTs to /user/profile/social-links', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    const info = { twitter: '@alice' };
    await userService.updateSocialLinks(info);
    expect(axios.put).toHaveBeenCalledWith('/user/profile/social-links', info);
  });
});
