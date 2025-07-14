import { Outlet, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState, userProfile } from "./store/authAtoms";
import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import {
  useHandleSensorUpdate,
  useHandleResponseUpdate,
  useHandleStatusUpdate,
  useHandleSigstrUpdate,
} from "./services/api/wsHandlers";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "./services/api/webSocketClient";

export const ProtectedLayout = () => {
  const auth = useRecoilValue(authState);

  if (auth.loading) return <div>Loading...</div>;

  if (!auth.isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="app-layout">
      {/* Add common layout elements here (header, sidebar) */}
      <Outlet /> {/* This renders matched child routes */}
    </div>
  );
};

export const AuthLayout = () => {
  const auth = useRecoilValue(authState);

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout">
      <Outlet /> {/* Renders sign-in/sign-up pages */}
    </div>
  );
};

export const MainLayout = () => {
  const user = useRecoilValue(userProfile);
  const auth = useRecoilValue(authState);
  const handleSensor = useHandleSensorUpdate();
  const handleResponse = useHandleResponseUpdate();
  const handleStatus = useHandleStatusUpdate();
  const handleSigstr = useHandleSigstrUpdate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    connectWebSocket(token, (message) => {
          const { type, data } = message;
          switch (type) {
            case "SENSOR_UPDATE":
              handleSensor(data);
              break;
            case "STATUS_UPDATE":
              handleStatus(data);
              break;
            case "SIGSTR_UPDATE":
              handleSigstr(data);
              break;
            case "RESPONSE":
              handleResponse(data);
              break;
            default:
              console.log("[WS] Unknown message type:", type);
          }
        });
    return () => {
      disconnectWebSocket();
    };
  }, [auth.isAuthenticated]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen  overflow-hidden bg-gray-900">
      <Sidebar user={user} />
      <main className="flex-1 p-8">
        <div className="mx-auto">
          <Outlet /> {/* Page content will render here */}
        </div>
      </main>
    </div>
  );
};
