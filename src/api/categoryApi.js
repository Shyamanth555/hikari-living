import axiosClient from './axiosClient';

export const categoryApi = {
  list: () => axiosClient.get('/categories').then((r) => r.data),
  getBySlug: (slug) => axiosClient.get(`/categories/${slug}`).then((r) => r.data),

  adminList: () => axiosClient.get('/admin/categories').then((r) => r.data),
  adminCreate: (data) => axiosClient.post('/admin/categories', data).then((r) => r.data),
  adminUpdate: (id, data) => axiosClient.put(`/admin/categories/${id}`, data).then((r) => r.data),
  adminDelete: (id) => axiosClient.delete(`/admin/categories/${id}`).then((r) => r.data),
};
