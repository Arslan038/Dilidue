import Repository from './Repository';

const user_login = 'auth/login';
const user = 'user';
const update_password = 'update_password';
const linked_signup = 'linkedin';

export default {
  // Login Request
  authenticateUser(payload) {
    return Repository.post(`${user_login}`, payload);
  },

  // Create New User
  createUser(payload) {
    return Repository.post(`${user}`, payload);
  },

  // Find User
  findUser(id) {
    return Repository.get(`${user}/${id}`);
  },

  // Update User
  updateUser(id, payload) {
    return Repository.put(`${user}/${id}`, payload);
  },

  // Update User Password
  updatePassword(id, payload) {
    return Repository.put(`${update_password}/${id}`, payload);
  },

  // Signup via LinkedIn
  socialSignup() {
    return Repository.get(`${linked_signup}`);
  },
};
