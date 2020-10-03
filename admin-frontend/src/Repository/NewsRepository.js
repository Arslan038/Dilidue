import Repository from "./Repository";

const news = "news";

export default {
    // Create New News
    createNews(payload) {
        return Repository.post(`${news}`, payload);
    },

    // Find News
    findNews(id) {
        return Repository.get(`${news}/${id}`);
    },

    // List News
    fetchNews() {
        return Repository.get(`${news}`);
    },

    // Update News
    updateNews(id, payload) {
        return Repository.put(`${news}/${id}`, payload);
    },

    // Delete News
    deleteNews(id) {
        return Repository.delete(`${news}/${id}`);
    }
};
