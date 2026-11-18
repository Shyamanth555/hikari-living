import axiosClient from './axiosClient';

// A cart line is a product plus, for a product with colours, the chosen
// colour's id — pass the same colorId to update or remove that line.
export const cartApi = {
  get: () => axiosClient.get('/cart').then((r) => r.data),
  add: (productId, quantity = 1, colorId = null) =>
    axiosClient.post('/cart', { productId, quantity, colorId }).then((r) => r.data),
  updateQuantity: (productId, quantity, colorId = null) =>
    axiosClient.put(`/cart/${productId}`, { quantity, colorId }).then((r) => r.data),
  remove: (productId, colorId = null) =>
    axiosClient.delete(`/cart/${productId}`, { params: colorId ? { color: colorId } : undefined }).then((r) => r.data),
  clear: () => axiosClient.delete('/cart').then((r) => r.data),
  merge: (items) => axiosClient.post('/cart/merge', { items }).then((r) => r.data),
};
