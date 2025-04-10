import { atom } from 'recoil';

export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  }
});

export const userProfile = atom({
  key: 'userProfile',
  default: null
});