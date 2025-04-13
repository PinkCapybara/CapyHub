import { Outlet, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from './store/authAtoms';
import React from 'react';
import Sidebar from './components/Sidebar';

export const ProtectedLayout = () => {
  const auth = useRecoilValue(authState);

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
  const auth = useRecoilValue(authState);
  
  return (
    <div className="flex h-screen">
      <Sidebar username={auth.user?.username} />
      <div className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

