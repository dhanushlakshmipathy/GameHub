import axios from "axios";

// Adjust if you prefer .env: REACT_APP_API_BASE
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE,
});

// Attach token automatically if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ------- Auth -------
export const loginUser = (email, password) =>
  API.post("/auth/login", { email, password });

export const registerUser = (username, email, password) =>
  API.post("/auth/register", { username, email, password });

// ------- Users (simple list / by id if you need) -------
export const getUsers = () => API.get("/users");
export const getUserById = (id) => API.get(`/users/${id}`);

// ------- Games -------
export const getAllGames = () => API.get("/games");
export const getGameById = (id) => API.get(`/games/${id}`);

// Your backend has GET /api/games/trending
// (you previously tried different names — we'll export a friendly alias too)
export const getTrending = () => API.get("/games/trending");

// Search: GET /api/games/search?q=...
export const searchGames = (q) => API.get(`/games/search`, { params: { q } });

// ------- Reviews -------
export const getReviewsByGame = (gameId) => API.get(`/reviews/game/${gameId}`);
export const createReview = ({ gameId, rating, comment }) =>
  API.post("/reviews", { gameId, rating, comment });
export const getAverageRating = (gameId) => API.get(`/reviews/average/${gameId}`);

export default API;
