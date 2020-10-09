import Repository from './Repository';

const note = 'note';
const notes = 'notes';

export default {
  // Create Note
  createNote(payload) {
    return Repository.post(`${note}`, payload);
  },

  // List User Notes
  fetchUserNotes(id) {
    return Repository.get(`${notes}/${id}`);
  },

  // Update User Note
  updateNote(id, payload) {
    return Repository.put(`${note}/${id}`, payload);
  },
};
