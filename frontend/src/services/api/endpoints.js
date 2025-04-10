const axiosInstance = require('./axiosInstance');

const signIn = (credentials) =>
  axiosInstance.post('/auth/signin', credentials);

// Define similar API methods for signup, getDevices, getGroups, addDevice, etc.
