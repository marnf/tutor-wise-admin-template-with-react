import { createContext, useContext, useEffect, useState } from "react";
import { decryptData } from "../EncryptedPage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const encryptedUser = localStorage.getItem("user");
        if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            setUser(decryptedUser);

            // Token expiry check
            if (decryptedUser?.token) {
                const tokenParts = decryptedUser.token.split(".")[1];
                if (tokenParts) {
                    const decoded = JSON.parse(atob(tokenParts));
                    const expTime = decoded.exp * 1000; // Convert to milliseconds
                    const currentTime = Date.now();

                    if (expTime < currentTime) {
                        console.log("Token expired! Logging out...");
                        localStorage.removeItem("user");
                        setUser(null);
                        window.location.href = "/login"; 
                    }
                }
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
