import { server } from '@mocks/server';
import { userService } from '@services/api/user/user.service';
import { BASE_ENDPOINT } from '@services/axios';
import { rest } from 'msw';

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

describe('UserService', () => {
  it('getUserSuggestions returns users', async () => {
    const response = await userService.getUserSuggestions();
    expect(response.data.users).toBeDefined();
  });

  it('logoutUser returns success', async () => {
    server.use(rest.get(`${BASE_URL}/signout`, (req, res, ctx) => res(ctx.json({ message: 'Logged out successfully' }))));
    const response = await userService.logoutUser();
    expect(response.data.message).toBe('Logged out successfully');
  });

  it('checkCurrentUser returns current user', async () => {
    server.use(rest.get(`${BASE_URL}/currentuser`, (req, res, ctx) => res(ctx.json({ message: 'Current user', user: { username: 'manny' } }))));
    const response = await userService.checkCurrentUser();
    expect(response.data.user).toBeDefined();
  });

  it('getAllUsers returns paginated users', async () => {
    const response = await userService.getAllUsers(1);
    expect(response.data.users).toBeDefined();
  });

  it('searchUsers returns matching users', async () => {
    server.use(rest.get(`${BASE_URL}/user/profile/search/:query`, (req, res, ctx) => res(ctx.json({ message: 'Search results', users: [] }))));
    const response = await userService.searchUsers('manny');
    expect(response.data.users).toEqual([]);
  });

  it('getUserProfileByUserId returns user profile', async () => {
    const response = await userService.getUserProfileByUserId('123456');
    expect(response.data.user).toBeDefined();
  });

  it('getUserProfileByUsername returns user and posts', async () => {
    const response = await userService.getUserProfileByUsername('Manny', '60263f14648fed5246e322d9', '1621613119252066');
    expect(response.data.user).toBeDefined();
  });

  it('changePassword returns success message', async () => {
    const response = await userService.changePassword({ currentPassword: 'old', newPassword: 'new' });
    expect(response.data.message).toContain('Password updated');
  });

  it('updateNotificationSettings returns updated settings', async () => {
    server.use(rest.put(`${BASE_URL}/user/profile/settings`, (req, res, ctx) => res(ctx.json({ message: 'Settings updated', settings: {} }))));
    const response = await userService.updateNotificationSettings({ messages: true });
    expect(response.data.message).toBe('Settings updated');
  });

  it('updateBasicInfo returns updated info', async () => {
    server.use(rest.put(`${BASE_URL}/user/profile/basic-info`, (req, res, ctx) => res(ctx.json({ message: 'Basic info updated' }))));
    const response = await userService.updateBasicInfo({ quote: 'hello' });
    expect(response.data.message).toBe('Basic info updated');
  });

  it('updateSocialLinks returns updated links', async () => {
    server.use(rest.put(`${BASE_URL}/user/profile/social-links`, (req, res, ctx) => res(ctx.json({ message: 'Social links updated' }))));
    const response = await userService.updateSocialLinks({ instagram: 'http://ig.com/user' });
    expect(response.data.message).toBe('Social links updated');
  });
});
