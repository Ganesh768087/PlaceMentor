import API from './api';

const aiService = {
  prepareAI: async (applicationId, mode = 'stage', regenerate = false) => {
    const response = await API.post('/ai/prepare', {
      applicationId,
      mode,
      regenerate,
    });
    return response.data;
  },

  getLatestHistory: async (applicationId) => {
    const response = await API.get(`/ai/history/${applicationId}`);
    return response.data;
  },

  getAllHistory: async (applicationId) => {
    const response = await API.get(`/ai/history/${applicationId}/all`);
    return response.data;
  },

  // Resume management endpoints (associated with AI Preparation)
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await API.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getResume: async () => {
    const response = await API.get('/resume');
    return response.data;
  },

  deleteResume: async () => {
    const response = await API.delete('/resume');
    return response.data;
  },
};

export default aiService;
