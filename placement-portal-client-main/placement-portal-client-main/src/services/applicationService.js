import API from './api';

const applicationService = {
  getApplications: async (params = {}) => {
    const response = await API.get('/applications', { params });
    return response.data;
  },

  createApplication: async (applicationData) => {
    const response = await API.post('/applications', applicationData);
    return response.data;
  },

  getApplicationDetails: async (id) => {
    const response = await API.get(`/applications/${id}`);
    return response.data;
  },

  updateApplicationDetails: async (id, applicationData) => {
    const response = await API.patch(`/applications/${id}`, applicationData);
    return response.data;
  },

  updateApplicationStage: async (id, stage) => {
    const response = await API.patch(`/applications/${id}/stage`, { currentStage: stage });
    return response.data;
  },

  updateApplicationEvent: async (id, eventType, eventDate) => {
    const response = await API.patch(`/applications/${id}/event`, {
      nextEventType: eventType,
      nextEventDate: eventDate,
    });
    return response.data;
  },

  deleteApplication: async (id) => {
    const response = await API.delete(`/applications/${id}`);
    return response.data;
  },

  getApplicationStats: async () => {
    const response = await API.get('/applications/stats');
    return response.data;
  },

  getApplicationAnalytics: async () => {
    const response = await API.get('/applications/analytics');
    return response.data;
  },
};

export default applicationService;
