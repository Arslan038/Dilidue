import Repository from "./Repository";

const branding = "branding";
const branding_list = "brandings";

export default {
    // Create New Branding
    createBranding(payload) {
        return Repository.post(`${branding}`, payload);
    },

    // Find Branding
    findBranding(id) {
        return Repository.get(`${branding}/${id}`);
    },

    // List Branding
    fetchBrandings() {
        return Repository.get(`${branding_list}`);
    },

    // Update Branding
    updateBranding(id, payload) {
        return Repository.put(`${branding}/${id}`, payload);
    },

    // Delete Branding
    deleteBranding(id) {
        return Repository.delete(`${branding}/${id}`);
    }
};
