import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Users
export const getUsers = () => API.get("/users");

// Games
export const getAllGames = () => API.get("/games");
export const getGameById = (id) => API.get(`/games/${id}`);
export const getTrendingByReviewCount = () => API.get("/games/trending/review-count");
export const getTrendingByAvgRating = () => API.get("/games/trending/average-rating");
export const searchGames = (query) => API.get(`/games/search?q=${query}`);

// Reviews
export const createReview = (token, data) => 
  API.post("/reviews", data, { headers: { Authorization: `Bearer ${token}` } });
export const getReviewsByGame = (gameId) => API.get(`/reviews/game/${gameId}`);
export const getAverageRating = (gameId) => API.get(`/reviews/average/${gameId}`);
