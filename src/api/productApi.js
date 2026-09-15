import axiosClient from './axiosClient';

export const productApi = {
  list: (params) => axiosClient.get('/products', { params }).then((r) => r.data),
  bulk: (ids) => axiosClient.get('/products/bulk', { params: { ids: ids.join(',') } }).then((r) => r.data),
  getBySlug: (slug) => axiosClient.get(`/products/${slug}`).then((r) => r.data),

  adminList: (params) => axiosClient.get('/admin/products', { params }).then((r) => r.data),
  adminGetById: (id) => axiosClient.get(`/admin/products/${id}`).then((r) => r.data),
  adminCreate: (data) => axiosClient.post('/admin/products', data).then((r) => r.data),
  adminUpdate: (id, data) => axiosClient.put(`/admin/products/${id}`, data).then((r) => r.data),
  adminDelete: (id) => axiosClient.delete(`/admin/products/${id}`).then((r) => r.data),
};
