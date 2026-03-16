import axios from '@services/axios';
import { gameService } from '../game.service';

jest.mock('@services/axios');

describe('gameService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getLevels GETs /game/levels and returns levels array', async () => {
    axios.get.mockResolvedValueOnce({ data: { levels: [{ id: 'cy-01' }] } });
    const result = await gameService.getLevels();
    expect(axios.get).toHaveBeenCalledWith('/game/levels');
    expect(result).toEqual([{ id: 'cy-01' }]);
  });

  it('getLevel GETs /game/levels/:id and returns the level', async () => {
    axios.get.mockResolvedValueOnce({ data: { level: { id: 'cy-01', title: 'First' } } });
    const result = await gameService.getLevel('cy-01');
    expect(axios.get).toHaveBeenCalledWith('/game/levels/cy-01');
    expect(result).toEqual({ id: 'cy-01', title: 'First' });
  });

  it('submitCode POSTs to /game/submit with levelId and code', async () => {
    axios.post.mockResolvedValueOnce({ data: { passed: true, xpAwarded: 150 } });
    const result = await gameService.submitCode('cy-01', 'cy.get("h1")');
    expect(axios.post).toHaveBeenCalledWith('/game/submit', { levelId: 'cy-01', code: 'cy.get("h1")' });
    expect(result).toEqual({ passed: true, xpAwarded: 150 });
  });

  it('getProgress GETs /progress and returns data', async () => {
    axios.get.mockResolvedValueOnce({ data: { completedLevels: ['cy-01'], xp: 150 } });
    const result = await gameService.getProgress();
    expect(axios.get).toHaveBeenCalledWith('/progress');
    expect(result).toEqual({ completedLevels: ['cy-01'], xp: 150 });
  });

  it('saveProgress PUTs to /progress with data', async () => {
    axios.put.mockResolvedValueOnce({ data: { message: 'saved' } });
    await gameService.saveProgress({ completedLevels: ['cy-01'], xp: 150 });
    expect(axios.put).toHaveBeenCalledWith('/progress', { completedLevels: ['cy-01'], xp: 150 });
  });
});
