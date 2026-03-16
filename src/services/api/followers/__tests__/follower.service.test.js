import axios from '@services/axios';
import { followerService } from '../follower.service';

jest.mock('@services/axios');

describe('followerService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getUserFollowing GETs /user/following', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await followerService.getUserFollowing();
    expect(axios.get).toHaveBeenCalledWith('/user/following');
  });

  it('getUserFollowers GETs /user/followers/:userId', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await followerService.getUserFollowers('user123');
    expect(axios.get).toHaveBeenCalledWith('/user/followers/user123');
  });

  it('followUser PUTs to /user/follow/:followerId', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    await followerService.followUser('user123');
    expect(axios.put).toHaveBeenCalledWith('/user/follow/user123');
  });

  it('unFollowUser PUTs to /user/unfollow/:followeeId/:followerId', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    await followerService.unFollowUser('followee1', 'follower1');
    expect(axios.put).toHaveBeenCalledWith('/user/unfollow/followee1/follower1');
  });

  it('blockUser PUTs to /user/block/:followerId', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    await followerService.blockUser('user456');
    expect(axios.put).toHaveBeenCalledWith('/user/block/user456');
  });

  it('unblockUser PUTs to /user/unblock/:followerId', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    await followerService.unblockUser('user456');
    expect(axios.put).toHaveBeenCalledWith('/user/unblock/user456');
  });
});
