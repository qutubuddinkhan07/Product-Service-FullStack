import axios from "axios";

// One shared axios instance for the whole app.
// - baseURL comes from your .env (VITE_API_URL)
// - every request automatically gets the JWT bearer token attached, if one is stored
// - the ngrok header is only needed while you're testing through an ngrok tunnel;
//   drop it once you're hitting a normal deployed/local URL if you don't need it
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});

// If a token has expired/is invalid, clear it so the app doesn't keep sending
// a dead token. Each component still handles its own error UI.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
