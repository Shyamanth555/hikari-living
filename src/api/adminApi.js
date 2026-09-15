import axiosClient from './axiosClient';

export const adminApi = {
  dashboardSummary: () => axiosClient.get('/admin/dashboard/summary').then((r) => r.data),
  customers: (params) => axiosClient.get('/admin/users', { params }).then((r) => r.data),
  customerById: (id) => axiosClient.get(`/admin/users/${id}`).then((r) => r.data),
};
