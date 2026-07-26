import api from './axios';

export const repositoriesApi = {
  getRepositories: async () => {
    const response = await api.get('/repositories');
    return response.data;
  },

  createRepository: async (repoData) => {
    // repoData: { name, github_url, default_branch }
    const response = await api.post('/repositories', repoData);
    return response.data;
  },

  getRepository: async (repositoryId) => {
    const response = await api.get(`/repositories/${repositoryId}`);
    return response.data;
  },

  deleteRepository: async (repositoryId) => {
    const response = await api.delete(`/repositories/${repositoryId}`);
    return response.data;
  },

  indexRepository: async (repositoryId) => {
    const response = await api.post(`/repositories/${repositoryId}/index`);
    return response.data; // returns { message, chunks }
  },
};
