import axiosClient from './axiosClient';

export const orderApi = {
  create: (shippingAddress, paymentMethod = 'razorpay') =>
    axiosClient.post('/orders', { shippingAddress, paymentMethod }).then((r) => r.data),
  my: (params) => axiosClient.get('/orders/my', { params }).then((r) => r.data),
  myByNumber: (orderNumber) => axiosClient.get(`/orders/my/${encodeURIComponent(orderNumber)}`).then((r) => r.data),
  track: (orderNumber, email) =>
    axiosClient.get(`/orders/track/${encodeURIComponent(orderNumber)}`, { params: { email } }).then((r) => r.data),

  adminList: (params) => axiosClient.get('/admin/orders', { params }).then((r) => r.data),
  adminGetById: (id) => axiosClient.get(`/admin/orders/${id}`).then((r) => r.data),
  adminUpdateStatus: (id, status) =>
    axiosClient.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data),
  adminUpdateTracking: (id, data) =>
    axiosClient.put(`/admin/orders/${id}/tracking`, data).then((r) => r.data),
  adminRetryShiprocket: (id) =>
    axiosClient.post(`/admin/orders/${id}/shiprocket/retry`).then((r) => r.data),
};
