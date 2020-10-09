import Repository from './Repository';

const branding = 'branding';
const branding_list = 'brandings';

export default {
  // Find Branding
  findBranding(id) {
    return Repository.get(`${branding}/${id}`);
  },

  // List Branding
  fetchBrandings() {
    return Repository.get(`${branding_list}`);
  },
};
