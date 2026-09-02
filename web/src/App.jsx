import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './index.css';

import ApiDocs from './pages/ApiDocs';
import AboutUs from './pages/AboutUs';
import Guidelines from './pages/Guidelines';
import Transparency from './pages/Transparency';
import ContactSupport from './pages/ContactSupport';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Place your Google Client ID here or in a .env file
const GOOGLE_CLIENT_ID = "506395453665-a1a8p682o491b4r3t670v03fnobqo1jl.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route 
                  path="dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="api-docs" element={<ApiDocs />} />
                <Route path="about-us" element={<AboutUs />} />
                <Route path="guidelines" element={<Guidelines />} />
                <Route path="transparency" element={<Transparency />} />
                <Route path="contact-support" element={<ContactSupport />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
