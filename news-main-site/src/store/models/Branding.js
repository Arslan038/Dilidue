import { RepositoryFactory } from '../../Repository/RepositoryFactory';
const BrandingRepository = RepositoryFactory.get('branding_repository');

const state = {
  brandings: [],
  branding: null,
};

const getters = {
  getBrandings: (state) => state.brandings,
  getBranding: (state) => state.branding,
};

const actions = {
  async fetchBrandings({ commit }) {
    try {
      commit('setBrandings', []);
      let resp = await BrandingRepository.fetchBrandings();
      if (resp.status == 201) {
        commit('setBrandings', resp.data);
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

  // FIND Branding
  async findBranding({ commit }, payload) {
    try {
      commit('setBranding', null);
      let resp = await BrandingRepository.findBranding(payload);
      if (resp.status == 201) {
        commit('setBranding', resp.data);
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
        commit('setBranding', 0);
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
};

const mutations = {
  setBrandings: (state, payload) => (state.brandings = payload),
  setBranding: (state, payload) => (state.branding = payload),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
