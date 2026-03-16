import axios from '@services/axios';
import { authService } from '../auth.service';

jest.mock('@services/axios');

describe('authService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('signUp posts to /signup with the body', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'abc' } });
    const body = { username: 'Alice', password: 'pass1' };
    const result = await authService.signUp(body);
    expect(axios.post).toHaveBeenCalledWith('/signup', body);
    expect(result).toEqual({ data: { token: 'abc' } });
  });

  it('signIn posts to /signin with the body', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'xyz' } });
    const body = { username: 'Alice', password: 'pass1' };
    const result = await authService.signIn(body);
    expect(axios.post).toHaveBeenCalledWith('/signin', body);
    expect(result).toEqual({ data: { token: 'xyz' } });
  });

  it('forgotPassword posts to /forgot-password with email wrapped in an object', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    await authService.forgotPassword('alice@example.com');
    expect(axios.post).toHaveBeenCalledWith('/forgot-password', { email: 'alice@example.com' });
  });

  it('resetPassword posts to /reset-password/:token with the body', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const token = 'reset-token-123';
    const body = { password: 'newpass1', confirmPassword: 'newpass1' };
    await authService.resetPassword(token, body);
    expect(axios.post).toHaveBeenCalledWith(`/reset-password/${token}`, body);
  });

  it('ssoLogin posts to /sso with the token wrapped in an object', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'sso-tok' } });
    await authService.ssoLogin('google-token');
    expect(axios.post).toHaveBeenCalledWith('/sso', { token: 'google-token' });
  });
});
