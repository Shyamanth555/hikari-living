import axiosClient from './axiosClient';

export const reviewApi = {
  list: (productId, params) => axiosClient.get(`/products/${productId}/reviews`, { params }).then((r) => r.data),
  // Approved reviews across every product, each with its product — home page and Reviews page.
  listAll: (params) => axiosClient.get('/reviews', { params }).then((r) => r.data),
  eligibility: (productId) => axiosClient.get(`/products/${productId}/reviews/eligibility`).then((r) => r.data),
  // Multipart, so the customer's photos (File objects, up to 4) go up with the review.
  create: (productId, { rating, title, comment, images = [] }) => {
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('title', title);
    formData.append('comment', comment);
    images.forEach((file) => formData.append('images', file));
    return axiosClient
      .post(`/products/${productId}/reviews`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },

  adminList: (params) => axiosClient.get('/admin/reviews', { params }).then((r) => r.data),
  adminUpdateStatus: (id, status) => axiosClient.put(`/admin/reviews/${id}`, { status }).then((r) => r.data),
  adminDelete: (id) => axiosClient.delete(`/admin/reviews/${id}`).then((r) => r.data),
};
