import api from "./ApiService";
export const PostService = {
  create: (data) => api.post("/posts/", data),
  feed: (params={}) => api.get("/posts/", { params }),
  like: (postId) => api.post(`/posts/${postId}/like`),
  comment: (postId, data) => api.post(`/posts/${postId}/comment`, data),
  comments: (postId, params={}) => api.get(`/posts/${postId}/comments`, { params }),
};

