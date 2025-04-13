import React,{ useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signin from './components/auth/Signin'
import Signup from './components/auth/Signup'
import { authState, verifyToken, userProfile } from './store/authAtoms';
import { AuthLayout, ProtectedLayout, MainLayout } from './layouts'
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil'
import {Dashboard} from './components/Dashboard'

function App() {
  const [auth, setAuth] = useRecoilState(authState);
  const setUserProfile = useSetRecoilState(userProfile);

  useEffect(() => {
    const checkAuth = async () => {
      if (auth.loading) {
        const {valid, user} = await verifyToken();
        
        setAuth(prev => ({
          ...prev,
          isAuthenticated: valid,
          loading: false
        }));

        if (!valid) {
          localStorage.clear();
        }

        if(valid){
          setUserProfile(user);
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <RecoilRoot>
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
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes> 
    </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
