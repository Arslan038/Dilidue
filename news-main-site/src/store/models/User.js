import Repository from '../../Repository/Repository';
import { RepositoryFactory } from '../../Repository/RepositoryFactory';
const UserRepository = RepositoryFactory.get('user_repository');

const state = {
  user: null,
};

const getters = {
  getUsers: (state) => state.users,
};

const actions = {
  // CREATE USER
  async createUser({ commit }, payload) {
    try {
      let resp = await UserRepository.createUser(payload);
      if (resp.status == 201) {
        commit('setToast', {
          message: 'Your account has been created.',
          color: 'success',
          show: true,
        });
        return 1;
      }
    } catch (err) {
      commit('setToast', {
        message: err.response.data.message,
        color: 'red',
        show: true,
      });
      return 0;
    }
  },

  // Login User
  async loginUser({ commit }, payload) {
    try {
      let resp = await UserRepository.authenticateUser(payload);
      if (resp.status == 201) {
        if (resp.data.user.role != 'user') {
          commit('setToast', {
            message: 'You are not allowed to Login.',
            color: 'warning',
            show: true,
          });
          return 0;
        }
        commit('setUser', resp.data);
        commit('setToast', {
          message: resp.data.message,
          color: 'success',
          show: true,
        });
        return 1;
      }
    } catch (err) {
      commit('setToast', {
        message: err.response.data.message,
        color: 'red',
        show: true,
      });
      return 0;
    }
  },

  // Login Linkedin User
  async linkedinLogin({ commit }, payload) {
    try {
      let resp = await UserRepository.linkedinLogin(payload);
      if (resp.status == 201) {
        if (resp.data.user.role != 'user') {
          commit('setToast', {
            message: 'You are not allowed to Login.',
            color: 'warning',
            show: true,
          });
          return 0;
        }
        commit('setUser', resp.data);
        commit('setToast', {
          message: resp.data.message,
          color: 'success',
          show: true,
        });
        return 1;
      }
    } catch (err) {
      commit('setToast', {
        message: err.response.data.message,
        color: 'red',
        show: true,
      });
      return 0;
    }
  },

  // UPDATE USER
  async updateUser({ commit }, payload) {
    try {
      let resp = await UserRepository.updateUser(payload.id, payload.data);
      if (resp.status == 201) {
        commit('editUser', resp.data.user);
        commit('setToast', {
          message: resp.data.message,
          color: 'success',
          show: true,
        });
        return 1;
      }
    } catch (err) {
      commit('setToast', {
        message: err.response.data.message,
        color: 'red',
        show: true,
      });
      return 0;
    }
  },

  // UPDATE PASSWORD
  async updatePassword({ commit }, payload) {
    try {
      let id = payload.id;
      let resp = await UserRepository.updatePassword(id, payload.data);
      if (resp.status == 201) {
        commit('setToast', {
          message: resp.data.message,
          color: 'success',
          show: true,
        });
        return 1;
      }
    } catch (err) {
      commit('setToast', {
        message: err.response.data.message,
        color: 'red',
        show: true,
      });
      return 0;
    }
  },

  // Social Signup
  async socialSignup({ commit }) {
    try {
      let resp = await UserRepository.socialSignup();
      console.log(resp.data);
    } catch (err) {
      console.log(err);
      commit('setToast', {
        message: err.message,
        color: 'red',
        show: true,
      });
    }
  },
};

const mutations = {
  setUser: (state, payload) => {
    let user = payload.user;
    user.token = payload.token;
    state.user = user;
    Repository.defaults.headers.Authorization = `Bearer ${payload.token}`;
    localStorage.setItem('dilidueUser', JSON.stringify(user));
  },
  editUser: (state, payload) => {
    let user = JSON.parse(localStorage.getItem('dilidueUser'));
    if (user) {
      user.name = payload.name;
      user.email = payload.email;
      user.phone = payload.phone;
      user.image = payload.image;
      state.user = user;
      localStorage.setItem('dilidueUser', JSON.stringify(user));
    }
  },
  editUserPassword: () => {},
};

export default {
  state,
  getters,
  actions,
  mutations,
};
