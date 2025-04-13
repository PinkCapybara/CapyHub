import { Outlet, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from './store/authAtoms';

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