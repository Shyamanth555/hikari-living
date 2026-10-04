import axiosClient from './axiosClient';

export const contactApi = {
  submit: (data) => axiosClient.post('/contact', data).then((r) => r.data),
  adminList: (params) => axiosClient.get('/admin/contact', { params }).then((r) => r.data),
};
