import api from './axios';

export const authApi = {
  register: async (userData) => {
    // userData: { full_name, email, password }
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async ({ email, password }) => {
    // FastAPI OAuth2PasswordRequestForm expects x-www-form-urlencoded data with 'username' and 'password'
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data; // returns { access_token, token_type: "bearer" }
  },

  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data; // returns UserResponse { id, full_name, email, is_active }
  },
};
