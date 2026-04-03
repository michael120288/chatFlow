import { Utils } from '@services/utils/utils.service';

const CLOUD_NAME = 'dhcw9nswr';

beforeAll(() => {
  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME = CLOUD_NAME;
});

afterAll(() => {
  delete process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
});

describe('Utils', () => {
  describe('appEnvironment', () => {
    it('returns "LOCAL" in local environment', () => {
      expect(Utils.appEnvironment()).toBe('LOCAL');
    });
  });

  describe('appImageUrl', () => {
    it('builds a cloudinary image URL from version and id', () => {
      expect(Utils.appImageUrl('1234', 'abc')).toBe('https://res.cloudinary.com/dhcw9nswr/image/upload/v1234/abc');
    });

    it('strips surrounding double quotes from version and id', () => {
      expect(Utils.appImageUrl('"5678"', '"xyz"')).toBe('https://res.cloudinary.com/dhcw9nswr/image/upload/v5678/xyz');
    });
  });

  describe('generateString', () => {
    it('returns a string of length + 1 (leading space)', () => {
      const result = Utils.generateString(5);
      expect(result.length).toBe(6);
      expect(result[0]).toBe(' ');
    });

    it('only contains alphanumeric characters after the leading space', () => {
      const result = Utils.generateString(20);
      expect(result.slice(1)).toMatch(/^[A-Za-z0-9]+$/);
    });
  });

  describe('checkIfUserIsBlocked', () => {
    it('returns true when userId is in the blocked list', () => {
      expect(Utils.checkIfUserIsBlocked(['u1', 'u2', 'u3'], 'u2')).toBe(true);
    });

    it('returns false when userId is not in the blocked list', () => {
      expect(Utils.checkIfUserIsBlocked(['u1', 'u2'], 'u99')).toBe(false);
    });

    it('returns false for an empty list', () => {
      expect(Utils.checkIfUserIsBlocked([], 'u1')).toBe(false);
    });
  });

  describe('checkIfUserIsFollowed', () => {
    const followers = [{ _id: 'creator1' }, { _id: 'creator2' }];

    it('returns true when postCreatorId matches a follower _id', () => {
      expect(Utils.checkIfUserIsFollowed(followers, 'creator1', 'me')).toBe(true);
    });

    it('returns true when postCreatorId equals userId (own post, non-empty list)', () => {
      // some() needs at least one element to evaluate the predicate
      expect(Utils.checkIfUserIsFollowed([{ _id: 'anyone' }], 'me', 'me')).toBe(true);
    });

    it('returns false when not following and not own post', () => {
      expect(Utils.checkIfUserIsFollowed(followers, 'unknown', 'me')).toBe(false);
    });
  });

  describe('checkIfUserIsOnline', () => {
    const onlineUsers = ['alice', 'bob', 'charlie'];

    it('returns true when username is in online users', () => {
      expect(Utils.checkIfUserIsOnline('Alice', onlineUsers)).toBe(true);
    });

    it('returns false when username is not in online users', () => {
      expect(Utils.checkIfUserIsOnline('dave', onlineUsers)).toBe(false);
    });

    it('returns false for undefined username', () => {
      expect(Utils.checkIfUserIsOnline(undefined, onlineUsers)).toBe(false);
    });
  });

  describe('firstLetterUpperCase', () => {
    it('uppercases the first letter of a word', () => {
      expect(Utils.firstLetterUpperCase('hello')).toBe('Hello');
    });

    it('returns empty string for empty input', () => {
      expect(Utils.firstLetterUpperCase('')).toBe('');
    });

    it('returns empty string for falsy input', () => {
      expect(Utils.firstLetterUpperCase(null)).toBe('');
    });
  });

  describe('formattedReactions', () => {
    it('filters out reactions with zero value', () => {
      const reactions = { like: 5, love: 0, wow: 3, angry: 0 };
      expect(Utils.formattedReactions(reactions)).toEqual([
        { type: 'like', value: 5 },
        { type: 'wow', value: 3 }
      ]);
    });

    it('returns empty array when all reactions are zero', () => {
      expect(Utils.formattedReactions({ like: 0, love: 0 })).toEqual([]);
    });

    it('returns all reactions when all are positive', () => {
      const reactions = { like: 1, love: 2 };
      expect(Utils.formattedReactions(reactions)).toEqual([
        { type: 'like', value: 1 },
        { type: 'love', value: 2 }
      ]);
    });
  });

  describe('shortenLargeNumbers', () => {
    it('returns 0 for undefined input', () => {
      expect(Utils.shortenLargeNumbers(undefined)).toBe(0);
    });

    it('returns a millified string for large numbers', () => {
      const result = Utils.shortenLargeNumbers(1000000);
      expect(typeof result).toBe('string');
      expect(result).toBe('1M');
    });

    it('returns the number as string for small values', () => {
      expect(Utils.shortenLargeNumbers(5)).toBe('5');
    });
  });

  describe('getImage', () => {
    it('returns cloudinary URL when both imageId and imageVersion are provided', () => {
      const result = Utils.getImage('myId', 'v123');
      expect(result).toBe('https://res.cloudinary.com/dhcw9nswr/image/upload/vv123/myId');
    });

    it('returns empty string when imageId is missing', () => {
      expect(Utils.getImage('', 'v123')).toBe('');
    });

    it('returns empty string when imageVersion is missing', () => {
      expect(Utils.getImage('myId', '')).toBe('');
    });
  });

  describe('getVideo', () => {
    it('returns cloudinary video URL when both ids are provided', () => {
      const result = Utils.getVideo('videoId', 'v456');
      expect(result).toBe('https://res.cloudinary.com/dhcw9nswr/video/upload/vv456/videoId');
    });

    it('returns empty string when videoId is missing', () => {
      expect(Utils.getVideo('', 'v456')).toBe('');
    });

    it('returns empty string when videoVersion is missing', () => {
      expect(Utils.getVideo('videoId', '')).toBe('');
    });
  });

  describe('removeUserFromList', () => {
    it('removes the user id from the list', () => {
      const list = ['u1', 'u2', 'u3'];
      const result = Utils.removeUserFromList(list, 'u2');
      expect(result).toEqual(['u1', 'u3']);
    });

    it('removes the first matching entry', () => {
      const list = ['u1', 'u2'];
      Utils.removeUserFromList(list, 'u1');
      expect(list).toEqual(['u2']);
    });
  });

  describe('checkUrl', () => {
    it('returns true when url contains the word', () => {
      expect(Utils.checkUrl('/app/social/streams', 'streams')).toBe(true);
    });

    it('returns false when url does not contain the word', () => {
      expect(Utils.checkUrl('/app/social/streams', 'videos')).toBe(false);
    });
  });

  describe('mapSettingsDropdownItems', () => {
    it('calls setSettings with a My Profile item and returns it', () => {
      const setSettings = jest.fn();
      const result = Utils.mapSettingsDropdownItems(setSettings);
      expect(result).toEqual([{ topText: 'My Profile', subText: 'View personal profile.' }]);
      expect(setSettings).toHaveBeenCalledWith(result);
    });
  });
});
