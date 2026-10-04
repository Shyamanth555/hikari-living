import axiosClient from './axiosClient';

export const uploadApi = {
  upload: (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));
    return axiosClient
      .post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  remove: (publicId) =>
    axiosClient.delete(`/admin/upload/${encodeURIComponent(publicId)}`).then((r) => r.data),
};
