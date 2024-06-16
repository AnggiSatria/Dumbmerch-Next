import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.39:4000",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://4d16-36-70-232-237.ngrok-free.app",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  function (config) {
    Cookies.get("token")
      ? (config.headers.Authorization = `Bearer ${Cookies.get("token")}`)
      : null;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (config) {
    return config;
  },
  function (error) {
    // if (error.response.status === 403) {
    //     return (window.location.href = '/auth/login');
    // }
    return Promise.reject(error);
  }
);

export default api;
