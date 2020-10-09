import Repository from './Repository';

const news = 'news';
const like_news = 'like_news';

export default {
  // Find News
  findNews(id) {
    return Repository.get(`${news}/${id}`);
  },

  // List News
  fetchNews() {
    return Repository.get(`${news}`);
  },

  // Fetch URL
  fetchURL(payload) {
    return Repository.post(`url`, payload);
  },

  // Like News
  createLike(payload) {
    return Repository.post(`${like_news}`, payload);
  },

  // Update Like
  updateLike(payload) {
    return Repository.put(`${like_news}`, payload);
  },
};
