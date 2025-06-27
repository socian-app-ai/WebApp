// import axios from "axios";
// import secureLocalStorage from "react-secure-storage";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// // Set default headers
// axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
// axiosInstance.defaults.headers.common["x-platform"] = "web";

// // Add request interceptor to include authorization token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Get token from secure storage
//     const token = secureLocalStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for error handling
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle 401 responses by clearing storage and redirecting to login
//     if (error.response?.status === 401) {
//       secureLocalStorage.clear();
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance; 