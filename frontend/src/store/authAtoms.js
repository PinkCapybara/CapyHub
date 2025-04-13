import { atom } from 'recoil';
import { atom } from 'recoil';

// Helper function to load initial state
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
  if (!token) return false;

  try {
    const response = await axios.get('/api/auth/verify', {
      headers: { authorization: token }
    });
    return response.data.valid;
  } catch (error) {
    return false;
  }
};
