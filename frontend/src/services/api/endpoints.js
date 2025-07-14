import { axiosInstance } from "./axiosInstance";

export const signIn = (credentials) =>
  axiosInstance.post("/auth/signin", credentials);
export const signUp = (credentials) =>
  axiosInstance.post("/auth/signup", credentials);

export const getGroups = () => axiosInstance.get("/groups");
export const createGroup = (props) =>
  axiosInstance.post("/groups", { name: props.name });
export const editGroup = (props) =>
  axiosInstance.put(`/groups/${props._id}`, { name: props.name });
export const deleteGroup = (props) =>
  axiosInstance.delete(`/groups/${props._id}`);

export const getDevices = () => axiosInstance.get("/devices");
export const createDevice = (props) =>
  axiosInstance.post("/devices", { name: props.name, group: props.group });
export const editDevice = (props) =>
  axiosInstance.put(`/devices/${props._id}`, {
    name: props.name,
    group: props.group,
  });
export const deleteDevice = (props) =>
  axiosInstance.delete(`/devices/${props._id}`);

//Publishing

export const pushAction = (props) =>
  axiosInstance.post(`/elements/${props._id}/publish`, {
    payload: props.payload,
  });
export const toggleActionOn = (props) =>
  axiosInstance.post(`/elements/${props._id}/publish`, {
    payload: props.payloadOn,
  });
export const toggleActionOff = (props) =>
  axiosInstance.post(`/elements/${props._id}/publish`, {
    payload: props.payloadOff,
  });
export const slideAction = (props, value) =>
  axiosInstance.post(`/elements/${props._id}/publish`, { payload: value });
export const colorAction = (props, value) =>
  axiosInstance.post(`/elements/${props._id}/publish`, { payload: value });

export const getElements = () => axiosInstance.get("/elements");
export const deleteElements = (props) =>
  axiosInstance.delete(`/elements/${props._id}`);

// ───── SWITCHES ──────────────────────────────────────────────────────────────────

// Push Button (Switch)
export const createPushButton = (props) =>
  axiosInstance.post("/elements", {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    // The following fields are fixed for push buttons:
    type: "switch",
    subType: "push",
    payload: props.payload,
  });
export const editPushButton = (props) =>
  axiosInstance.put(`/elements/${props._id}`, {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "switch",
    subType: "push",
    payload: props.payload,
  });

// Toggle Button (Switch)
export const createToggle = (props) =>
  axiosInstance.post("/elements", {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "switch",
    subType: "toggle",
    payloadOn: props.payloadOn,
    payloadOff: props.payloadOff,
  });
export const editToggle = (props) =>
  axiosInstance.put(`/elements/${props._id}`, {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "switch",
    subType: "toggle",
    payloadOn: props.payloadOn,
    payloadOff: props.payloadOff,
  });

// Slider (Switch)
export const createSlider = (props) =>
  axiosInstance.post("/elements", {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "switch",
    subType: "slider",
    minValue: props.minValue,
    maxValue: props.maxValue,
  });
export const editSlider = (props) =>
  axiosInstance.put(`/elements/${props._id}`, {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "switch",
    subType: "slider",
    minValue: props.minValue,
    maxValue: props.maxValue,
  });

// Color Picker (Switch)
export const createColorPicker = (props) =>
  axiosInstance.post("/elements", {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "switch",
    subType: "color_picker",
  });
export const editColorPicker = (props) =>
  axiosInstance.put(`/elements/${props._id}`, {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "switch",
    subType: "color_picker",
  });

// ───── SENSORS ───────────────────────────────────────────────────────────────────

// Gauge (Sensor)
export const createGauge = (props) =>
  axiosInstance.post("/elements", {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "sensor",
    subType: "gauge",
    minValue: props.minValue,
    maxValue: props.maxValue,
  });
export const editGauge = (props) =>
  axiosInstance.put(`/elements/${props._id}`, {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "sensor",
    subType: "gauge",
    minValue: props.minValue,
    maxValue: props.maxValue,
  });

// Widget (Sensor)
export const createWidget = (props) =>
  axiosInstance.post("/elements", {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "sensor",
    subType: "widget",
    unit: props.unit,
    icon: props.icon,
  });
export const editWidget = (props) =>
  axiosInstance.put(`/elements/${props._id}`, {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "sensor",
    subType: "widget",
    unit: props.unit,
    icon: props.icon,
  });

// Notification (Sensor)
export const createNotification = (props) =>
  axiosInstance.post("/elements", {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "sensor",
    subType: "notification",
    element: props.element, // Reference element id
    message: props.message,
    email: props.email,
    condition: props.condition, // e.g., "> 25"
  });
export const editNotification = (props) =>
  axiosInstance.put(`/elements/${props._id}`, {
    name: props.name,
    device: props.device,
    subscribeTopic: props.subscribeTopic,
    type: "sensor",
    subType: "notification",
    element: props.element,
    message: props.message,
    email: props.email,
    condition: props.condition,
  });
