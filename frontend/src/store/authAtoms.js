import { atom } from 'recoil';
import axios from 'axios';

const loadAuthState = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    return {
      isAuthenticated: false,
      userId: userId || null,
      loading: !!token,
      error: null
    };
};

export const authState = atom({
  key: 'authState',
  default: loadAuthState(), // Initialize from localStorage
  effects: [
    ({ onSet }) => {
      onSet(newAuth => {
        if (newAuth.isAuthenticated) {
          localStorage.setItem('userId', newAuth.userId);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      });
    }
  ]
});

export const verifyToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return {valid: false};

  try {
    const response = await axios.get('/api/auth/verify', {
      headers: { authorization: token }
    });
    return response.data;
  } catch (error) {
    return {valid: false};
  }
};

export const userProfile = atom({
  key: "userProfile",
  default: null
})