import { format, getISOWeek, subDays } from 'date-fns';

import { timeAgo } from '@services/utils/timeago.utils';

const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;

describe('TimeAgo', () => {
  describe('secondsAgo', () => {
    it('returns "a second ago" for exactly 1 second', () => {
      expect(timeAgo.secondsAgo(1000)).toBe('a second ago');
    });

    it('returns "a second ago" for less than 1 second', () => {
      expect(timeAgo.secondsAgo(500)).toBe('a second ago');
    });

    it('returns "{n} seconds ago" for more than 1 second', () => {
      expect(timeAgo.secondsAgo(5000)).toBe('5 seconds ago');
    });
  });

  describe('minutesAgo', () => {
    it('returns "a minute ago" for exactly 1 minute', () => {
      expect(timeAgo.minutesAgo(60000, msPerMinute)).toBe('a minute ago');
    });

    it('returns "{n} minutes ago" for more than 1 minute', () => {
      expect(timeAgo.minutesAgo(120000, msPerMinute)).toBe('2 minutes ago');
    });
  });

  describe('hoursAgo', () => {
    it('returns "an hour ago" for exactly 1 hour', () => {
      expect(timeAgo.hoursAgo(3600000, msPerHour)).toBe('an hour ago');
    });

    it('returns "{n} hours ago" for more than 1 hour', () => {
      expect(timeAgo.hoursAgo(7200000, msPerHour)).toBe('2 hours ago');
    });
  });

  describe('monthsAgo', () => {
    it('returns day name (eeee) for elapsed <= 7 days', () => {
      const fiveDaysAgo = new Date('2022-06-10T12:00:00.000Z');
      const elapsed = 5 * msPerDay;
      expect(timeAgo.monthsAgo(fiveDaysAgo, elapsed, msPerDay)).toBe(format(fiveDaysAgo, 'eeee'));
    });

    it('returns "MMM d" format for elapsed > 7 days', () => {
      const tenDaysAgo = new Date('2022-06-05T12:00:00.000Z');
      const elapsed = 10 * msPerDay;
      expect(timeAgo.monthsAgo(tenDaysAgo, elapsed, msPerDay)).toBe(format(tenDaysAgo, 'MMM d'));
    });
  });

  describe('timeDifference', () => {
    const current = new Date('2022-06-15T12:00:00.000Z');

    it('returns seconds for elapsed < 1 minute', () => {
      const twoSecondsAgo = new Date('2022-06-15T11:59:58.000Z');
      expect(timeAgo.timeDifference(current, twoSecondsAgo)).toBe('2 seconds ago');
    });

    it('returns "a second ago" for elapsed < 1 second', () => {
      const halfSecondAgo = new Date(current.getTime() - 500);
      expect(timeAgo.timeDifference(current, halfSecondAgo)).toBe('a second ago');
    });

    it('returns minutes for elapsed < 1 hour', () => {
      const threeMinutesAgo = new Date('2022-06-15T11:57:00.000Z');
      expect(timeAgo.timeDifference(current, threeMinutesAgo)).toBe('3 minutes ago');
    });

    it('returns hours for elapsed < 1 day', () => {
      const twoHoursAgo = new Date('2022-06-15T10:00:00.000Z');
      expect(timeAgo.timeDifference(current, twoHoursAgo)).toBe('2 hours ago');
    });

    it('returns day name for 1-7 days elapsed (same year)', () => {
      const threeDaysAgo = new Date('2022-06-12T12:00:00.000Z');
      const result = timeAgo.timeDifference(current, threeDaysAgo);
      expect(result).toBe(format(threeDaysAgo, 'eeee'));
    });

    it('returns "MMM d" for 8-29 days elapsed (same year)', () => {
      const tenDaysAgo = new Date('2022-06-05T12:00:00.000Z');
      const result = timeAgo.timeDifference(current, tenDaysAgo);
      expect(result).toBe(format(tenDaysAgo, 'MMM d'));
    });

    it('returns "MMM d" for >= 30 days elapsed (same year)', () => {
      const fortyDaysAgo = new Date('2022-05-06T12:00:00.000Z');
      const result = timeAgo.timeDifference(current, fortyDaysAgo);
      expect(result).toBe(format(fortyDaysAgo, 'MMM d'));
    });

    it('returns "MMM d, yyyy" for different year', () => {
      const lastYear = new Date('2021-06-15T12:00:00.000Z');
      const result = timeAgo.timeDifference(current, lastYear);
      expect(result).toBe(format(lastYear, 'MMM d, yyyy'));
    });
  });

  describe('dayMonthYear', () => {
    it('formats a date string as d MMMM yyyy', () => {
      // Use noon UTC to avoid day-shift in negative-UTC timezones
      const date = new Date('2022-06-15T12:00:00.000Z');
      expect(timeAgo.dayMonthYear(date)).toBe(format(date, 'd MMMM yyyy'));
    });

    it('formats a Date object', () => {
      const date = new Date('2022-01-01T12:00:00.000Z');
      expect(timeAgo.dayMonthYear(date)).toBe(format(date, 'd MMMM yyyy'));
    });

    it('handles a date string with time component', () => {
      const dateStr = '2022-06-15T12:00:00.000Z';
      const date = new Date(dateStr);
      expect(timeAgo.dayMonthYear(dateStr)).toBe(format(date, 'd MMMM yyyy'));
    });
  });

  describe('timeFormat', () => {
    it('formats a Date object as HH:mm a', () => {
      const date = new Date('2022-06-15T14:30:00.000Z');
      expect(timeAgo.timeFormat(date)).toBe(format(date, 'HH:mm a'));
    });

    it('formats a date string', () => {
      const dateStr = '2022-06-15T09:05:00.000Z';
      const date = new Date(dateStr);
      expect(timeAgo.timeFormat(dateStr)).toBe(format(date, 'HH:mm a'));
    });
  });

  describe('transform', () => {
    it('handles a Date object input and returns a string', () => {
      const now = new Date();
      const twoSecondsAgo = new Date(now.getTime() - 2001);
      const result = timeAgo.transform(twoSecondsAgo);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('handles a date string input', () => {
      const now = new Date();
      const twoSecondsAgo = new Date(now.getTime() - 2001);
      const result = timeAgo.transform(twoSecondsAgo.toISOString());
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('chatMessageTransform', () => {
    it('returns "Today" for the current date', () => {
      expect(timeAgo.chatMessageTransform(new Date())).toBe('Today');
    });

    it('returns "Today" for a today ISO string', () => {
      expect(timeAgo.chatMessageTransform(new Date().toISOString())).toBe('Today');
    });

    it('returns "Yesterday" for yesterday', () => {
      const yesterday = subDays(new Date(), 1);
      expect(timeAgo.chatMessageTransform(yesterday)).toBe('Yesterday');
    });

    it('returns a day name for a date in the same/previous ISO week', () => {
      const threeDaysAgo = subDays(new Date(), 3);
      const result = timeAgo.chatMessageTransform(threeDaysAgo);
      const weekDiff = getISOWeek(new Date()) - getISOWeek(threeDaysAgo);
      if (weekDiff === 0 || weekDiff === 1) {
        expect(result).toBe(format(threeDaysAgo, 'EEEE'));
      } else {
        expect(result).toBe(format(threeDaysAgo, 'd MMMM yyyy'));
      }
    });

    it('returns "d MMMM yyyy" format for old dates', () => {
      const oldDate = new Date('2020-01-15T12:00:00.000Z');
      expect(timeAgo.chatMessageTransform(oldDate)).toBe(format(oldDate, 'd MMMM yyyy'));
    });
  });
});
