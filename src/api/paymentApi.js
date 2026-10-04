import axiosClient from './axiosClient';

export const paymentApi = {
  createRazorpayOrder: (orderId) =>
    axiosClient.post('/payments/razorpay/create-order', { orderId }).then((r) => r.data),
  verify: (data) => axiosClient.post('/payments/razorpay/verify', data).then((r) => r.data),
};
