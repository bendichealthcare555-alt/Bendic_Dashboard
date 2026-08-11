import axios from "axios";

const api = axios.create({
  baseURL: "https://bendic-dashboard-1.onrender.com",
});

export default api;