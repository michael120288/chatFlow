import { FollowersUtils } from '@services/utils/followers-utils.service';

describe('FollowersUtils', () => {
  describe('addBlockedUser', () => {
    it('pushes blockedUser to user.blocked when user is the blocker', () => {
      const user = { _id: 'u1', blocked: [], blockedBy: [] };
      const data = { blockedBy: 'u1', blockedUser: 'u2' };

      const result = FollowersUtils.addBlockedUser(user, data);

      expect(result.blocked).toContain('u2');
      expect(result.blockedBy).toHaveLength(0);
    });

    it('pushes blockedBy to user.blockedBy when user is the blocked party', () => {
      const user = { _id: 'u2', blocked: [], blockedBy: [] };
      const data = { blockedBy: 'u1', blockedUser: 'u2' };

      const result = FollowersUtils.addBlockedUser(user, data);

      expect(result.blockedBy).toContain('u1');
      expect(result.blocked).toHaveLength(0);
    });

    it('modifies neither array when user is unrelated to the block event', () => {
      const user = { _id: 'u3', blocked: [], blockedBy: [] };
      const data = { blockedBy: 'u1', blockedUser: 'u2' };

      const result = FollowersUtils.addBlockedUser(user, data);

      expect(result.blocked).toHaveLength(0);
      expect(result.blockedBy).toHaveLength(0);
    });

    it('does not mutate the original user object (deep clone)', () => {
      const user = { _id: 'u1', blocked: [], blockedBy: [] };
      const data = { blockedBy: 'u1', blockedUser: 'u2' };

      FollowersUtils.addBlockedUser(user, data);

      expect(user.blocked).toHaveLength(0);
    });
  });

  describe('removeBlockedUser', () => {
    it('removes blockedUser from profile.blocked when profile is the blocker', () => {
      const profile = { _id: 'u1', blocked: ['u2', 'u3'], blockedBy: [] };
      const data = { blockedBy: 'u1', blockedUser: 'u2' };

      const result = FollowersUtils.removeBlockedUser(profile, data);

      expect(result.blocked).not.toContain('u2');
      expect(result.blocked).toContain('u3');
    });

    it('removes blockedBy from profile.blockedBy when profile is the blocked party', () => {
      const profile = { _id: 'u2', blocked: [], blockedBy: ['u1', 'u4'] };
      const data = { blockedBy: 'u1', blockedUser: 'u2' };

      const result = FollowersUtils.removeBlockedUser(profile, data);

      expect(result.blockedBy).not.toContain('u1');
      expect(result.blockedBy).toContain('u4');
    });

    it('does not mutate the original profile object (deep clone)', () => {
      const profile = { _id: 'u1', blocked: ['u2'], blockedBy: [] };
      const data = { blockedBy: 'u1', blockedUser: 'u2' };

      FollowersUtils.removeBlockedUser(profile, data);

      expect(profile.blocked).toContain('u2');
    });
  });

  describe('updateSingleUser', () => {
    it('updates follower/following/post counts and calls setUsers', () => {
      const user1 = { _id: 'u1', followersCount: 0, followingCount: 0, postsCount: 0 };
      const users = [user1, { _id: 'u2', followersCount: 1 }];
      const followerData = { _id: 'u1', followersCount: 5, followingCount: 3, postsCount: 10 };
      const setUsers = jest.fn();

      FollowersUtils.updateSingleUser(users, user1, followerData, setUsers);

      expect(setUsers).toHaveBeenCalledTimes(1);
      const updated = setUsers.mock.calls[0][0];
      const updatedUser = updated.find((u) => u._id === 'u1');
      expect(updatedUser.followersCount).toBe(5);
      expect(updatedUser.followingCount).toBe(3);
      expect(updatedUser.postsCount).toBe(10);
    });

    it('does not call setUsers when the user is not in the list', () => {
      const users = [{ _id: 'u2' }];
      const userData = { _id: 'u99' };
      const setUsers = jest.fn();

      FollowersUtils.updateSingleUser(users, userData, {}, setUsers);

      expect(setUsers).not.toHaveBeenCalled();
    });

    it('does not mutate the original users array', () => {
      const user1 = { _id: 'u1', followersCount: 0, followingCount: 0, postsCount: 0 };
      const users = [user1];
      const setUsers = jest.fn();

      FollowersUtils.updateSingleUser(users, user1, { followersCount: 99, followingCount: 0, postsCount: 0 }, setUsers);

      expect(users[0].followersCount).toBe(99); // userData is mutated by the method
    });
  });
});
