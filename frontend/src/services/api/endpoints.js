import {axiosInstance}from './axiosInstance';

export const signIn = (credentials) => axiosInstance.post('/auth/sign-in', credentials);
export const signUp = (credentials) => axiosInstance.post('/auth/signup', credentials);

// Define similar API methods for signup, getDevices, getGroups, addDevice, etc.

