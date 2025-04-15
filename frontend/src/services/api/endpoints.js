import {axiosInstance} from './axiosInstance';

export const signIn = (credentials) => axiosInstance.post('/auth/signin', credentials);
export const signUp = (credentials) => axiosInstance.post('/auth/signup', credentials);

export const getGroups = () => axiosInstance.get('/groups');
export const createGroup = (props) => axiosInstance.post('/groups', {name: props.name});
export const editGroup = (props) => axiosInstance.put(`/groups/${props._id}`, {name: props.name});
export const deleteGroup = (props) => axiosInstance.delete(`/groups/${props._id}`);

export const getDevices = () => axiosInstance.get('/devices');
export const createDevice = (props) => axiosInstance.post('/devices', {name: props.name, group: props.group});                                                                  
export const editDevice = (props) => axiosInstance.put(`/devices/${props._id}`, {name: props.name, group: props.group});   
export const deleteDevice = (props) => axiosInstance.delete(`/devices/${props._id}`);

// Define similar API methods for signup, getDevices, getGroups, addDevice, etc.

