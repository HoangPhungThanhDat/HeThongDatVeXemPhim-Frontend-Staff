// src/App.js
import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import PrivateRoute from './components/PrivateRoute';
import useTokenRefresh from './hooks/useTokenRefresh';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  useTokenRefresh();

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />

        <Route
          path="staff/*"
          element={
            <PrivateRoute>
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/staff/default" replace />} />
        <Route path="*" element={<Navigate to="/staff/default" replace />} />
      </Routes>
    </ChakraProvider>
  );
}