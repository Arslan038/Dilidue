import { RepositoryFactory } from "../../Repository/RepositoryFactory";
const NewsRepository = RepositoryFactory.get("news_repository");

const state = {
    news: [],
    found_news: null
};

const getters = {
    getNews: state => state.news,
    getFoundNews: state => state.found_news
};

const actions = {
    // Fetch All News
    async fetchNews({ commit }) {
        try {
            commit("setNews", []);
            let resp = await NewsRepository.fetchNews();
            if (resp.status == 201) {
                commit("setNews", resp.data);
            }
        } catch (err) {
            if (err.response.status == 403 || err.response.status == 401) {
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "News",
                    type: "danger"
                });
                commit("logoutUser", 1);
            }
            if (err.response.status == 500) {
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "News",
                    type: "danger"
                });
            } else {
                commit("setNotification", {
                    message: err.message,
                    title: "News",
                    type: "danger"
                });
            }
        }
    },

    // CREATE NEWS
    async createNews({ commit }, payload) {
        try {
            let resp = await NewsRepository.createNews(payload);
            if (resp.status == 201) {
                commit("addNews", resp.data.data);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Create News",
                    type: "success"
                });
                return 1;
            }
        } catch (err) {
            commit("setNotification", {
                message: err.response.data.message,
                title: "Create News",
                type: "danger"
            });
            return 0;
        }
    },

    // UPDATE NEWS
    async updateNews({ commit }, payload) {
        try {
            let id = payload.get("id");
            let resp = await NewsRepository.updateNews(id, payload);
            if (resp.status == 201) {
                commit("editNews", resp.data.data);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Update News",
                    type: "success"
                });
                return 1;
            }
        } catch (err) {
            commit("setNotification", {
                message: err.response.data.message,
                title: "Update News",
                type: "danger"
            });
            return 0;
        }
    },

    // Find News
    async findNews({ commit }, payload) {
        try {
            commit("setFoundNews", null);
            let resp = await NewsRepository.findNews(payload);
            if (resp.status == 201) {
                commit("setFoundNews", resp.data);
            }
        } catch (err) {
            if (err.response.status == 403) {
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "News",
                    type: "danger"
                });
                commit("logoutUser", 1);
            } else {
                commit("setNotification", {
                    message: err.message,
                    title: "News",
                    type: "danger"
                });
            }
        }
    },

    // Delete News
    async deleteNews({ commit }, payload) {
        try {
            let resp = await NewsRepository.deleteNews(payload);
            if (resp.status == 201) {
                commit("deleteNews", payload);
                commit("setNotification", {
                    message: resp.data.message,
                    title: "Delete News",
                    type: "success"
                });
                return 1;
            }
        } catch (err) {
            if (err.response.status == 403) {
                commit("setNotification", {
                    message: err.response.data.message,
                    title: "Delete News",
                    type: "danger"
                });
                commit("logoutUser", 1);
            } else {
                commit("setNotification", {
                    message: err.message,
                    title: "Delete News",
                    type: "danger"
                });
            }
            return 0;
        }
    }
};

const mutations = {
    setNews: (state, payload) => (state.news = payload),
    addNews: (state, payload) => {
        state.news.push(payload);
    },
    editNews: (state, payload) => {
        let news = [];
        state.news.forEach(element => {
            if (element.id == payload.id) {
                element = payload;
            }
            news.push(element);
        });
        state.news = news;
    },
    deleteNews: (state, payload) => {
        state.news = state.news.filter(news => news.id != payload);
    },
    setFoundNews: (state, payload) => (state.found_news = payload)
};

export default {
    state,
    getters,
    actions,
    mutations
};
