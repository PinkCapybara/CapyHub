import { atom } from "recoil";
import { axiosInstance } from "../services/api/axiosInstance";

const loadAuthState = () => {
  const userId = localStorage.getItem("userId");

  return {
    isAuthenticated: false,
    userId: userId || null,
    loading: true,
    error: null,
  };
};

export const authState = atom({
  key: "authState",
  default: loadAuthState(), // Initialize from localStorage
  effects: [
    ({ onSet }) => {
      onSet((newAuth) => {
        if (newAuth.isAuthenticated) {
          localStorage.setItem("userId", newAuth.userId);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        }
      });
    },
  ],
});

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { valid: false };

  try {
    const response = await axiosInstance.get("/auth/verify");
    console.log("response from verification: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Token verification failed:", error);
    return { valid: false };
  }
};

export const userProfile = atom({
  key: "userProfile",
  default: null,
});
