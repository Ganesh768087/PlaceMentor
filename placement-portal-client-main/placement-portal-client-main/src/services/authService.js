import API from './api';

const authService = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await API.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default authService;
