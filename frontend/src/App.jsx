import React,{ useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signin from './components/auth/Signin'
import Signup from './components/auth/Signup'
import { authState, verifyToken, userProfile } from './store/authAtoms';
import { AuthLayout, ProtectedLayout, MainLayout } from './layouts'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {Dashboard} from './components/Dashboard'
import { Groups } from './components/Groups'
import { Devices } from './components/Devices'
import { Toggle } from './components/switches/ToggleSwitch'
import { Push } from './components/switches/PushButton'
import { Slider } from './components/switches/Slider'
import { ColorPicker } from './components/switches/ColorPicker'
import { Gauges } from './components/sensors/Gauges'
import { Notifications } from './components/sensors/Notifications'
import { Widgets } from './components/sensors/Widgets'
import { connectWebSocket, disconnectWebSocket } from './services/api/webSocketClient'
import {
  useHandleSensorUpdate,
  useHandleResponseUpdate,
  useHandleStatusUpdate,
  useHandleSigstrUpdate
} from './services/api/wsHandlers';

function App() {
  const [auth, setAuth] = useRecoilState(authState);
  const setUserProfile = useSetRecoilState(userProfile);
  const handleSensor   = useHandleSensorUpdate();
  const handleResponse = useHandleResponseUpdate();
  const handleStatus   = useHandleStatusUpdate();
  const handleSigstr   = useHandleSigstrUpdate();

  useEffect(() => {
    const checkAuth = async () => {
      if (auth.loading) {
        const response = await verifyToken();

        setAuth(prev => ({
          ...prev,
          isAuthenticated: response.valid,
          userId: response.userId,
          loading: false
        }));

        if(response.valid === true){
          setUserProfile(response.user);
        }
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(auth.isAuthenticated){
    connectWebSocket(token,(message) => {
      const { type, data } = message;
      switch (type) {
        case 'SENSOR_UPDATE':
          handleSensor(data);
          break;
        case 'STATUS_UPDATE':
          handleStatus(data);
          break;
        case 'SIGSTR_UPDATE':
          handleSigstr(data);
          break;
        case 'RESPONSE':
          handleResponse(data);
          break;
        default:
          console.log('[WS] Unknown message type:', type);
      }
    })

    return () => {
      disconnectWebSocket();
    };
  }
  }, [auth.isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (sign-in/sign-up) */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/switches/push-button" element={<Push />} />
            <Route path="/switches/toggle-switch" element={<Toggle />} />
            <Route path="/switches/slider" element={<Slider />} />
            <Route path="/switches/color-picker" element={<ColorPicker />} />
            <Route path="/sensors/notifications" element={<Notifications />} />
            <Route path="/sensors/widgets" element={<Widgets />} />
            <Route path="/sensors/gauges" element={<Gauges />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes> 
    </BrowserRouter>
  )
}

export default App
