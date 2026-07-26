import api from './axios';

export const chatApi = {
  chatWithRepository: async (repositoryId, question) => {
    // POST /api/v1/repositories/{repository_id}/chat body: { question }
    const response = await api.post(`/repositories/${repositoryId}/chat`, { question });
    return response.data; // returns { answer: string, sources: [ { file_path, start_line, end_line } ] }
  },
};
