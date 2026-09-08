import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me'),
};

export const roomsAPI = {
  getAll: () => api.get('/rooms'),
  getOne: (id: number) => api.get(`/rooms/${id}`),
};

export const bookingsAPI = {
  create: (data: {
    room_id: number; check_in: string; check_out: string;
    adults: number; kids: number; guest_name: string;
    guest_email: string; guest_phone?: string; special_requests?: string;
  }) => api.post('/bookings', data),
  myBookings: () => api.get('/bookings/my'),
  cancel: (id: number) => api.patch(`/bookings/${id}/cancel`),
};

export default api;
