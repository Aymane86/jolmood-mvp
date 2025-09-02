import api from "./ApiService";
export const AppointmentService = {
  create: (data) => api.post("/appointments/", data),
  mine: (userId) => api.get(`/appointments/user/${userId}`),
  coach: (coachId) => api.get(`/appointments/coach/${coachId}`),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, null, { params: { status } }),
};

