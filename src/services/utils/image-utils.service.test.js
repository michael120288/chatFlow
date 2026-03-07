import { ImageUtils } from '@services/utils/image-utils.service';

function makeFile(name, type, size = 1000) {
  const file = new File(['x'.repeat(size)], name, { type });
  return file;
}

describe('ImageUtils', () => {
  describe('convertRGBToHex', () => {
    it('converts black (0,0,0) to #000000', () => {
      expect(ImageUtils.convertRGBToHex(0, 0, 0)).toBe('#000000');
    });

    it('converts white (255,255,255) to #ffffff', () => {
      expect(ImageUtils.convertRGBToHex(255, 255, 255)).toBe('#ffffff');
    });

    it('converts red (255,0,0) to #ff0000', () => {
      expect(ImageUtils.convertRGBToHex(255, 0, 0)).toBe('#ff0000');
    });

    it('pads single-digit hex values with a leading zero', () => {
      expect(ImageUtils.convertRGBToHex(1, 1, 1)).toBe('#010101');
    });

    it('converts arbitrary color correctly', () => {
      expect(ImageUtils.convertRGBToHex(16, 32, 48)).toBe('#102030');
    });
  });

  describe('validateFile', () => {
    it('returns true for a valid image type (jpeg)', () => {
      const file = makeFile('photo.jpg', 'image/jpeg');
      expect(ImageUtils.validateFile(file, 'image')).toBe(true);
    });

    it('returns true for a valid image type (png)', () => {
      const file = makeFile('photo.png', 'image/png');
      expect(ImageUtils.validateFile(file, 'image')).toBe(true);
    });

    it('returns true for a valid image type (gif)', () => {
      const file = makeFile('anim.gif', 'image/gif');
      expect(ImageUtils.validateFile(file, 'image')).toBe(true);
    });

    it('returns true for a valid image type (webp)', () => {
      const file = makeFile('img.webp', 'image/webp');
      expect(ImageUtils.validateFile(file, 'image')).toBe(true);
    });

    it('returns false for an unsupported image type (bmp)', () => {
      const file = makeFile('photo.bmp', 'image/bmp');
      expect(ImageUtils.validateFile(file, 'image')).toBe(false);
    });

    it('returns true for a valid video type (mp4)', () => {
      const file = makeFile('video.mp4', 'video/mp4');
      expect(ImageUtils.validateFile(file, 'video')).toBe(true);
    });

    it('returns true for a valid video type (webm)', () => {
      const file = makeFile('video.webm', 'video/webm');
      expect(ImageUtils.validateFile(file, 'video')).toBe(true);
    });

    it('returns false for an unsupported video type (mov)', () => {
      const file = makeFile('clip.mov', 'video/mov');
      expect(ImageUtils.validateFile(file, 'video')).toBe(false);
    });

    it('returns falsy when file is null', () => {
      expect(ImageUtils.validateFile(null, 'image')).toBeFalsy();
    });
  });

  describe('checkFileSize', () => {
    it('returns empty string for a valid small image', () => {
      const file = makeFile('photo.jpg', 'image/jpeg', 1000);
      expect(ImageUtils.checkFileSize(file, 'image')).toBe('');
    });

    it('returns error message for an invalid file type', () => {
      const file = makeFile('photo.bmp', 'image/bmp', 1000);
      expect(ImageUtils.checkFileSize(file, 'image')).toBe('File photo.bmp not accepted');
    });

    it('returns "File is too large." when file exceeds 50MB', () => {
      const file = makeFile('big.jpg', 'image/jpeg', 50000001);
      expect(ImageUtils.checkFileSize(file, 'image')).toBe('File is too large.');
    });

    it('returns error message for invalid type even when also too large', () => {
      // invalid type check runs first, but size check can override it
      const file = makeFile('big.bmp', 'image/bmp', 50000001);
      // checkFileSize sets fileError for invalid type first, then overwrites with size error
      expect(ImageUtils.checkFileSize(file, 'image')).toBe('File is too large.');
    });
  });

  describe('checkFile', () => {
    beforeEach(() => {
      window.alert = jest.fn();
    });

    it('calls window.alert with file name when type is invalid', () => {
      const file = makeFile('photo.bmp', 'image/bmp');
      ImageUtils.checkFile(file, 'image');
      expect(window.alert).toHaveBeenCalledWith('File photo.bmp not accepted');
    });

    it('does not call window.alert for a valid small file', () => {
      const file = makeFile('photo.jpg', 'image/jpeg', 1000);
      ImageUtils.checkFile(file, 'image');
      expect(window.alert).not.toHaveBeenCalled();
    });

    it('calls window.alert with size error for an oversized valid file', () => {
      const file = makeFile('big.jpg', 'image/jpeg', 50000001);
      ImageUtils.checkFile(file, 'image');
      expect(window.alert).toHaveBeenCalledWith('File is too large.');
    });
  });
});
