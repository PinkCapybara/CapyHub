import { Outlet, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState, userProfile } from './store/authAtoms';
import React from 'react';
import Sidebar from './components/Sidebar';

export const ProtectedLayout = () => {
  const auth = useRecoilValue(authState);

  if(auth.loading) return(<div/>);

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

  // If the user data hasn't loaded yet, display a loading indicator.
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
    <Sidebar user={user} />
      <main className="flex-1 p-8">
        <div className="mx-auto">
          <Outlet /> {/* Page content will render here */}
        </div>
      </main>
    </div>
  );
};

