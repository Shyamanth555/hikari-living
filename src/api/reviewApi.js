import axiosClient from './axiosClient';

export const reviewApi = {
  list: (productId, params) => axiosClient.get(`/products/${productId}/reviews`, { params }).then((r) => r.data),
  eligibility: (productId) => axiosClient.get(`/products/${productId}/reviews/eligibility`).then((r) => r.data),
  create: (productId, data) => axiosClient.post(`/products/${productId}/reviews`, data).then((r) => r.data),

  adminList: (params) => axiosClient.get('/admin/reviews', { params }).then((r) => r.data),
  adminUpdateStatus: (id, status) => axiosClient.put(`/admin/reviews/${id}`, { status }).then((r) => r.data),
  adminDelete: (id) => axiosClient.delete(`/admin/reviews/${id}`).then((r) => r.data),
};
