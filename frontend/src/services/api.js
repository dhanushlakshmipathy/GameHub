import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (payload) => API.post("/auth/register", payload);
export const loginUser = (payload) => API.post("/auth/login", payload);

// Users (basic)
export const getUsers = () => API.get("/users");

// Games
export const getAllGames = () => API.get("/games");
export const getGameById = (id) => API.get(`/games/${id}`);
export const searchGames = (q) => API.get(`/games/search?q=${encodeURIComponent(q)}`);

// Trending
export const getTrendingByReviewCount = () => API.get("/games/trending/review-count");
export const getTrendingByAvgRating = () => API.get("/games/trending/average-rating");
export const getTrending = getTrendingByAvgRating;

// Reviews
export const getReviewsByGame = (gameId) => API.get(`/reviews/game/${gameId}`);
export const getAverageRating = (gameId) => API.get(`/reviews/average/${gameId}`);
export const createReview = (payload) => API.post("/reviews", payload);

export default API;


// Users & social
export const getMe = () => API.get("/users/me");
export const followUser = (id) => API.post(`/users/${id}/follow`);
export const unfollowUser = (id) => API.delete(`/users/${id}/follow`);

// Feed
export const getFeed = () => API.get("/reviews/feed");
