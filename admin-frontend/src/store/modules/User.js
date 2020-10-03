import { RepositoryFactory } from "../../Repository/RepositoryFactory";
const UserRepository = RepositoryFactory.get("user_repository");

const state = {
    users: []
};

const getters = {
    getUsers: state => state.users
};

const actions = {
    // Fetch All User
    async fetchUsers({ commit }) {
        try {
            commit("setUsers", []);
            let resp = await UserRepository.fetchUsers();
            if (resp.status == 201) {
                commit("setUsers", resp.data);
            }
        } catch (err) {
            if (err.response.status == 500) {
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "News",
                    type: "danger"
                });
            }
            if (err.response.status == 403 || err.response.status == 401) {
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "Users",
                    type: "danger"
                });
                commit("logoutUser", 1);
            } else {
                commit("setNotification", {
                    message: err.message,
                    title: "Users",
                    type: "danger"
                });
            }
        }
    },

    // CREATE USER
    async createUser({ commit }, payload) {
        try {
            let resp = await UserRepository.createUser(payload);
            if (resp.status == 201) {
                commit("addUser", resp.data.data);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Create User",
                    type: "success"
                });
            }
        } catch (err) {
            commit("setNotification", {
                message: err.response.data.message,
                title: "Create User",
                type: "danger"
            });
        }
    },

    // UPDATE USER
    async updateUser({ commit }, payload) {
        try {
            let resp = await UserRepository.updateUser(
                payload.id,
                payload.data
            );
            if (resp.status == 201) {
                commit("editUser", payload);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Edit User",
                    type: "success"
                });
            }
        } catch (err) {
            commit("setNotification", {
                message: err.response.data.message,
                title: "Edit User",
                type: "danger"
            });
        }
    },

    // DELETE USER
    async deleteUser({ commit }, payload) {
        try {
            let resp = await UserRepository.deleteUser(payload);
            if (resp.status == 201) {
                commit("deleteUser", payload);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Delete User",
                    type: "success"
                });
            }
        } catch (err) {
            commit("setNotification", {
                message: err.response.data.message,
                title: "Delete User",
                type: "danger"
            });
        }
    },

    // UPDATE PASSWORD
    async updatePassword({ commit }, payload) {
        try {
            let id = payload.id;
            let resp = await UserRepository.updatePassword(id, payload.data);
            if (resp.status == 201) {
                const password = {
                    id: id,
                    pwd: resp.data.data
                };
                commit("editUserPassword", password);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Update Password",
                    type: "success"
                });
            }
        } catch (err) {
            commit("setNotification", {
                message: err.response.data.message,
                title: "Update Password",
                type: "danger"
            });
        }
    }
};

const mutations = {
    setUsers: (state, payload) => (state.users = payload),
    addUser: (state, payload) => {
        state.users.push(payload);
    },
    editUser: (state, payload) => {
        let user = state.users.find(user => user.id == payload.id);
        if (user) {
            user.name = payload.data.get("name");
            user.email = payload.data.get("email");
            user.phone = payload.data.get("phone");
            user.role = payload.data.get("role");
        }
    },
    deleteUser: (state, payload) => {
        state.users = state.users.filter(user => user.id !== payload);
    },
    editUserPassword: (state, payload) => {
        let user = state.users.find(user => user.id == payload.id);
        if (user) {
            user.password = payload.password;
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
