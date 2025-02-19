const BASE_URL = 'http://192.168.0.240:8000';
// const BASE_URL = 'https://tutorwise-backend.vercel.app';



export default BASE_URL;

// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// // Create an instance of axios
// const apiClient = axios.create({
//     // baseURL: 'https://tutorwise-backend.vercel.app/api',
//     // baseURL: 'https://tutor-wise-backend.vercel.app/api',
//     // baseURL: 'http://192.168.0.240:8000/api',
//     baseURL: 'https://backend.tutorwise.com.bd/api',
// });

// // Request interceptor to add token to all requests
// apiClient.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Token ${token}`;
//             // console.log('Authorization header set:', config.headers.Authorization);
//         } else {
//             console.warn('No token found, request may be unauthorized.');
//         }
//         return config;
//     },
//     error => Promise.reject(error)
// );

// // Response interceptor to handle responses
// apiClient.interceptors.response.use(
//     response => {
//         return response; // Success response
//     },
//     error => {
//         if (error.response && error.response.status === 401) {
//             // Handle unauthorized requests (e.g., redirect to login)
//             localStorage.removeItem('token'); // Clear the token
//             localStorage.removeItem('userRole');
//         }
//         return Promise.reject(error);
//     }
// );

// export default apiClient;
