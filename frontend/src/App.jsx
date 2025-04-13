import { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signin from './components/auth/Signin'
import Signup from './components/auth/Signup'
import { authState, verifyToken } from './store/authAtoms';
import { AuthLayout, ProtectedLayout } from './layouts'

function App() {
  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    const checkAuth = async () => {
      if (auth.loading) {
        const isValid = await verifyToken();
        
        setAuth(prev => ({
          ...prev,
          isAuthenticated: isValid,
          loading: false
        }));

        if (!isValid) {
          localStorage.clear();
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (sign-in/sign-up) */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes> 
    </BrowserRouter>
  )
}

export default App
