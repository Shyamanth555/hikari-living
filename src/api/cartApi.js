import axiosClient from './axiosClient';

export const cartApi = {
  get: () => axiosClient.get('/cart').then((r) => r.data),
  add: (productId, quantity = 1) => axiosClient.post('/cart', { productId, quantity }).then((r) => r.data),
  updateQuantity: (productId, quantity) =>
    axiosClient.put(`/cart/${productId}`, { quantity }).then((r) => r.data),
  remove: (productId) => axiosClient.delete(`/cart/${productId}`).then((r) => r.data),
  clear: () => axiosClient.delete('/cart').then((r) => r.data),
  merge: (items) => axiosClient.post('/cart/merge', { items }).then((r) => r.data),
};
