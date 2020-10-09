import { RepositoryFactory } from '../../Repository/RepositoryFactory';
const NewsRepository = RepositoryFactory.get('news_repository');

const state = {
  news: [],
  found_news: null,
};

const getters = {
  getNews: (state) => state.news,
  getFoundNews: (state) => state.found_news,
};

const actions = {
  // Fetch All News
  async fetchNews({ commit }) {
    try {
      commit('setNews', []);
      let resp = await NewsRepository.fetchNews();
      if (resp.status == 201) {
        commit('setNews', resp.data);
      }
    } catch (err) {
      if (err.response.status == 403 || err.response.status == 401) {
        commit('setToast', {
          message: err.response.data.message,
          color: 'red',
          show: true,
        });
        commit('logoutUser', 1);
      }
      if (err.response.status == 500) {
        commit('setToast', {
          message: err.response.data.message,
          color: 'red',
          show: true,
        });
      } else {
        commit('setToast', {
          message: err.response.data.message,
          color: 'red',
          show: true,
        });
      }
    }
  },

  // Find News
  async findNews({ commit }, payload) {
    try {
      commit('setFoundNews', null);
      let resp = await NewsRepository.findNews(payload);
      if (resp.status == 201) {
        commit('setFoundNews', resp.data);
      }
    } catch (err) {
      if (err.response.status == 403 || err.response.status == 401) {
        commit('setToast', {
          message: err.response.data.message,
          color: 'red',
          show: true,
        });
        commit('logoutUser', 1);
      } else {
        commit('setToast', {
          message: err.response.data.message,
          color: 'red',
          show: true,
        });
      }
    }
  },

  // Create Like
  async createLike({ commit }, payload) {
    try {
      let resp = await NewsRepository.createLike(payload);
      if (resp.status == 201) {
        commit('setLike', payload);
      }
    } catch (err) {
      if (err.response.status == 403 || err.response.status == 401) {
        commit('setToast', {
          message: err.response.data.message,
          color: 'red',
          show: true,
        });
        commit('logoutUser', 1);
      } else {
        commit('setToast', {
          message: err.response.data.message,
          color: 'red',
          show: true,
        });
      }
    }
  },

  // Update Like
  async updateLike({ commit }, payload) {
    try {
      let resp = await NewsRepository.updateLike(payload);
      if (resp.status == 201) {
        console.log(resp.data);
        commit('updateLike', payload);
      }
    } catch (err) {
      if (err.response.status == 403 || err.response.status == 401) {
        commit('setToast', {
          message: err.response.data.message,
          color: 'red',
          show: true,
        });
        commit('logoutUser', 1);
      } else {
        commit('setToast', {
          message: err.response.data.message,
          color: 'red',
          show: true,
        });
      }
    }
  },
};

const mutations = {
  setNews: (state, payload) => (state.news = payload),
  setFoundNews: (state, payload) => (state.found_news = payload),
  setLike: (state, payload) => {
    let news = state.news.find((n) => n.id == payload.newsId);
    if (news) {
      news.news_likes.push(payload);
    }
  },
  updateLike: (state, payload) => {
    let news = state.news.find((n) => n.id == payload.newsId);
    if (news) {
      let like = news.news_likes.find(
        (n) => n.newsId == payload.newsId && n.userId == payload.userId
      );
      if (like) {
        like.action = payload.action;
      }
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
