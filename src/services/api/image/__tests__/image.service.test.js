import axios from '@services/axios';
import { imageService } from '../image.service';

jest.mock('@services/axios');

describe('imageService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getUserImages GETs /images/:userId', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await imageService.getUserImages('user123');
    expect(axios.get).toHaveBeenCalledWith('/images/user123');
  });

  it('addImage POSTs to the given url with image data wrapped', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    await imageService.addImage('/user/profile/upload', 'base64data');
    expect(axios.post).toHaveBeenCalledWith('/user/profile/upload', { image: 'base64data' });
  });

  it('removeImage DELETEs the given url', async () => {
    axios.delete.mockResolvedValueOnce({ data: {} });
    await imageService.removeImage('/images/img123');
    expect(axios.delete).toHaveBeenCalledWith('/images/img123');
  });
});
