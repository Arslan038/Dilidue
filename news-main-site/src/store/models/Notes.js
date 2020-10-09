import { RepositoryFactory } from '../../Repository/RepositoryFactory';
const NotesRepository = RepositoryFactory.get('notes_repository');

const state = {
  notes: [],
};

const getters = {
  getNotes: (state) => state.notes,
};

const actions = {
  // Create Note
  async createNote({ commit }, payload) {
    try {
      let resp = await NotesRepository.createNote(payload);
      if (resp.status == 201) {
        commit('setToast', {
          message: resp.data.message,
          color: 'success',
          show: true,
        });
        commit('addNote', resp.data.data);
        return 1;
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
      return 0;
    }
  },

  // Fetch All Notes
  async fetchNotes({ commit }, payload) {
    try {
      commit('setNotes', []);
      let resp = await NotesRepository.fetchUserNotes(payload);
      if (resp.status == 201) {
        commit('setNotes', resp.data);
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

  // UPDATE NOTE
  async updateNote({ commit }, payload) {
    try {
      let resp = await NotesRepository.updateNote(payload.id, payload.data);
      if (resp.status == 201) {
        commit('setToast', {
          message: resp.data.message,
          color: 'success',
          show: true,
        });
        commit('editNote', payload);
        return 1;
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
      return 0;
    }
  },
};

const mutations = {
  addNote: (state, payload) => {
    let position = {
      lat: payload.position.coordinates[0],
      lng: payload.position.coordinates[1],
    };
    payload.position = position;
    state.notes.push(payload);
  },
  editNote: (state, payload) => {
    let note = state.notes.find((n) => n.id == payload.id);
    if (note) {
      note.note = payload.data.note;
    }
  },
  setNotes: (state, payload) => {
    let allNotes = [];
    payload.forEach((item) => {
      let position = {
        lat: item.position.coordinates[0],
        lng: item.position.coordinates[1],
      };
      item.position = position;
      allNotes.push(item);
    });
    state.notes = [];
    state.notes = allNotes;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
