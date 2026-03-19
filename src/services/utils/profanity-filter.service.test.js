import { ProfanityFilter } from '@services/utils/profanity-filter.service';

describe('ProfanityFilter.containsProfanity', () => {
  describe('edge cases', () => {
    it('returns false for clean text', () => {
      expect(ProfanityFilter.containsProfanity('Hello world')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(ProfanityFilter.containsProfanity('')).toBe(false);
    });

    it('returns false for null', () => {
      expect(ProfanityFilter.containsProfanity(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(ProfanityFilter.containsProfanity(undefined)).toBe(false);
    });

    it('returns false for a non-string value', () => {
      expect(ProfanityFilter.containsProfanity(42)).toBe(false);
    });
  });

  describe('profanity detection', () => {
    it('returns true when text contains a banned word', () => {
      expect(ProfanityFilter.containsProfanity('what the fuck is this')).toBe(true);
    });

    it('is case-insensitive', () => {
      expect(ProfanityFilter.containsProfanity('What the FUCK')).toBe(true);
      expect(ProfanityFilter.containsProfanity('SHIT happens')).toBe(true);
    });

    it('detects a banned word at the start of text', () => {
      expect(ProfanityFilter.containsProfanity('bastard left early')).toBe(true);
    });

    it('detects a banned word at the end of text', () => {
      expect(ProfanityFilter.containsProfanity('you are such a bitch')).toBe(true);
    });

    it('detects a standalone banned word', () => {
      expect(ProfanityFilter.containsProfanity('asshole')).toBe(true);
    });

    it('returns false when a partial match is not a whole word', () => {
      // "ass" is banned but "assess" should not trigger due to word-boundary matching
      expect(ProfanityFilter.containsProfanity('I need to assess the situation')).toBe(false);
    });

    it('returns false for similar-but-clean words', () => {
      expect(ProfanityFilter.containsProfanity('she sells seashells')).toBe(false);
    });

    it('detects multi-word banned terms', () => {
      expect(ProfanityFilter.containsProfanity('motherfucker alert')).toBe(true);
    });

    it('detects banned word mixed with punctuation', () => {
      expect(ProfanityFilter.containsProfanity('wow, shit!')).toBe(true);
    });

    it('returns false for normal sentences with no profanity', () => {
      expect(ProfanityFilter.containsProfanity('The quick brown fox jumps over the lazy dog')).toBe(false);
    });
  });
});
