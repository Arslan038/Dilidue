import Vue from 'vue';
import Vuex from 'vuex';
import User from './models/User';
import News from './models/News';
import Branding from './models/Branding';
import Notes from './models/Notes';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    toast: {
      show: false,
      message: null,
      color: null,
    },
    isTokenExpired: null,
  },
  getters: {
    getToast: (state) => state.toast,
    getLogoutUser: (state) => state.isTokenExpired,
  },
  mutations: {
    setToast: (state, payload) => (state.toast = payload),
    logoutUser: (state, payload) => {
      state.isTokenExpired = payload;
    },
  },
  actions: {},
  modules: {
    User,
    News,
    Branding,
    Notes,
  },
});
