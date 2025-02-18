import axios from "axios";
import BASE_URL from "./baseUrl";
import { decryptData } from "../EncryptedPage";
import { useAuth } from "../Contexts/AuthProvider";


const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const encryptedUser = localStorage.getItem("user");
        let user;
        if (encryptedUser) {
            try {
                user = decryptData(encryptedUser);
            } catch (error) {
                console.error("Error decrypting user data:", error);
            }
        }

        console.log(user.token)

        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Token expired! Logging out...");
            localStorage.removeItem("user");


            const logoutUser = () => {
                const { setUser } = useAuth();
                setUser(null);
                window.location.href = "/login";
            };

            logoutUser();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
