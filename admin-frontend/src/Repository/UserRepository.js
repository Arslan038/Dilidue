import Repository from "./Repository";

const user_login = "auth/login";
const user = "user";
const users_list = "users";
const update_password = "update_password";

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

    // List Users
    fetchUsers() {
        return Repository.get(`${users_list}`);
    },

    // Update User
    updateUser(id, payload) {
        return Repository.put(`${user}/${id}`, payload);
    },

    // Update User Password
    updatePassword(id, payload) {
        return Repository.put(`${update_password}/${id}`, payload);
    },

    // Delete User
    deleteUser(id) {
        return Repository.delete(`${user}/${id}`);
    }
};
