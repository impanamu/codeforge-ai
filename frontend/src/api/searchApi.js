import api from './axios';

export const searchApi = {
  searchRepository: async (repositoryId, question) => {
    // POST /api/v1/search/{repository_id} body: { question }
    const response = await api.post(`/search/${repositoryId}`, { question });
    return response.data; // returns { results: [ { file_path, start_line, end_line, content } ] }
  },
};
