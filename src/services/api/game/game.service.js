import axios from '@services/axios';

class GameService {
  async getLevels() {
    const res = await axios.get('/game/levels');
    return res.data.levels;
  }

  async getLevel(id) {
    const res = await axios.get(`/game/levels/${id}`);
    return res.data.level;
  }

  async submitCode(levelId, code) {
    const res = await axios.post('/game/submit', { levelId, code });
    return res.data;
  }

  async getProgress() {
    const res = await axios.get('/progress');
    return res.data;
  }

  async saveProgress(data) {
    await axios.put('/progress', data);
  }
}

export const gameService = new GameService();
