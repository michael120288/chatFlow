import axios from 'axios';
import { giphyService } from '../giphy.service';

jest.mock('axios');

const GIPHY_URL = 'https://api.giphy.com/v1/gifs';

describe('giphyService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('search GETs from Giphy search endpoint with query and api_key params', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    await giphyService.search('cats');
    expect(axios.get).toHaveBeenCalledWith(`${GIPHY_URL}/search`, {
      params: { api_key: process.env.REACT_APP_GIPHY_API_KEY, q: 'cats' }
    });
  });

  it('trending GETs from Giphy trending endpoint with api_key param', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    await giphyService.trending();
    expect(axios.get).toHaveBeenCalledWith(`${GIPHY_URL}/trending`, {
      params: { api_key: process.env.REACT_APP_GIPHY_API_KEY }
    });
  });

  it('search returns the full response', async () => {
    const mockResponse = { data: { data: [{ id: 'gif1' }], pagination: {} } };
    axios.get.mockResolvedValueOnce(mockResponse);
    const result = await giphyService.search('dogs');
    expect(result).toBe(mockResponse);
  });
});
