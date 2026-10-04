import axiosClient from './axiosClient';

export const heroSlideApi = {
  list: () => axiosClient.get('/hero-slides').then((r) => r.data),

  adminList: () => axiosClient.get('/admin/hero-slides').then((r) => r.data),
  adminGetById: (id) => axiosClient.get(`/admin/hero-slides/${id}`).then((r) => r.data),
  adminCreate: (data) => axiosClient.post('/admin/hero-slides', data).then((r) => r.data),
  adminUpdate: (id, data) => axiosClient.put(`/admin/hero-slides/${id}`, data).then((r) => r.data),
  adminDelete: (id) => axiosClient.delete(`/admin/hero-slides/${id}`).then((r) => r.data),
};
