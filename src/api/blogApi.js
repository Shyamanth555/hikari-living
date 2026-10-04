import axiosClient from './axiosClient';

export const blogApi = {
  list: (params) => axiosClient.get('/blog', { params }).then((r) => r.data),
  getBySlug: (slug) => axiosClient.get(`/blog/${slug}`).then((r) => r.data),

  adminList: (params) => axiosClient.get('/admin/blog', { params }).then((r) => r.data),
  adminGetById: (id) => axiosClient.get(`/admin/blog/${id}`).then((r) => r.data),
  adminCreate: (data) => axiosClient.post('/admin/blog', data).then((r) => r.data),
  adminUpdate: (id, data) => axiosClient.put(`/admin/blog/${id}`, data).then((r) => r.data),
  adminDelete: (id) => axiosClient.delete(`/admin/blog/${id}`).then((r) => r.data),
};
