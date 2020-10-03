import { RepositoryFactory } from "../../Repository/RepositoryFactory";
const BrandingRepository = RepositoryFactory.get("branding_repository");

const state = {
    brandings: [],
    branding: null
};

const getters = {
    getBrandings: state => state.brandings,
    getBranding: state => state.branding
};

const actions = {
    // CREATE BRANDING
    async createBranding({ commit }, payload) {
        try {
            let resp = await BrandingRepository.createBranding(payload);
            if (resp.status == 201) {
                commit("addBranding", resp.data.data);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Create Branding",
                    type: "success"
                });
                return 1;
            }
        } catch (err) {
            commit("setNotification", {
                message: err.response.data.message,
                title: "Create Branding",
                type: "danger"
            });
            return 0;
        }
    },

    async fetchBrandings({ commit }) {
        try {
            commit("setBrandings", []);
            let resp = await BrandingRepository.fetchBrandings();
            if (resp.status == 201) {
                commit("setBrandings", resp.data);
            }
        } catch (err) {
            if (err.response.status == 403 || err.response.status == 401) {
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "Brandings",
                    type: "danger"
                });
                commit("logoutUser", 1);
            } else {
                commit("setNotification", {
                    message: err.message,
                    title: "Brandings",
                    type: "danger"
                });
            }
        }
    },

    // FIND Branding
    async findBranding({ commit }, payload) {
        try {
            commit("setBranding", null);
            let resp = await BrandingRepository.findBranding(payload);
            if (resp.status == 201) {
                commit("setBranding", resp.data);
            }
        } catch (err) {
            if (err.response.status == 403 || err.response.status == 401) {
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "Branding",
                    type: "danger"
                });
                commit("logoutUser", 1);
            }
            if (err.response.status == 500) {
                commit("setBranding", 0);
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "Branding",
                    type: "danger"
                });
            } else {
                commit("setNotification", {
                    message: err.message,
                    title: "Branding",
                    type: "danger"
                });
            }
        }
    },

    // Delete Branding
    async deleteBranding({ commit }, payload) {
        try {
            let resp = await BrandingRepository.deleteBranding(payload);
            if (resp.status == 201) {
                commit("deleteBranding", payload);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Delete Branding",
                    type: "success"
                });
                return 1;
            }
        } catch (err) {
            if (err.response.status == 403 || err.response.status == 401) {
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "Delete Branding",
                    type: "danger"
                });
                commit("logoutUser", 1);
            } else {
                commit("setNotification", {
                    message: err.message,
                    title: "Delete Branding",
                    type: "danger"
                });
            }
            return 0;
        }
    },

    // UPDATE Branding
    async updateBranding({ commit }, payload) {
        try {
            let id = payload.get("id");
            let resp = await BrandingRepository.updateBranding(id, payload);
            if (resp.status == 201) {
                commit("editBranding", resp.data.data);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Update Branding",
                    type: "success"
                });
                return 1;
            }
        } catch (err) {
            commit("setNotification", {
                message: err.response.data.message,
                title: "Update Branding",
                type: "danger"
            });
            return 0;
        }
    }
};

const mutations = {
    addBranding: (state, payload) => {
        state.brandings.push(payload);
    },
    setBrandings: (state, payload) => (state.brandings = payload),
    setBranding: (state, payload) => (state.branding = payload),
    deleteBranding: (state, payload) => {
        state.brandings = state.brandings.filter(brand => brand.id != payload);
    },
    editBranding: (state, payload) => {
        let brandings = [];
        state.brandings.forEach(element => {
            if (element.id == payload.id) {
                element = payload;
            }
            brandings.push(element);
        });
        state.brandings = brandings;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
