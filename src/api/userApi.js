import axiosClient from './axiosClient';

export const userApi = {
  getProfile: () => axiosClient.get('/users/profile').then((r) => r.data),
  updateProfile: (data) => axiosClient.put('/users/profile', data).then((r) => r.data),
  changePassword: (data) => axiosClient.put('/users/change-password', data).then((r) => r.data),
  addAddress: (data) => axiosClient.post('/users/addresses', data).then((r) => r.data),
  updateAddress: (addressId, data) =>
    axiosClient.put(`/users/addresses/${addressId}`, data).then((r) => r.data),
  deleteAddress: (addressId) =>
    axiosClient.delete(`/users/addresses/${addressId}`).then((r) => r.data),
};
