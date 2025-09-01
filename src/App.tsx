import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/auth.context';
import { ProtectedRoute } from './components/auth';
import { Layout } from './components/layout';
import { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm } from './components/auth';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { ErrorBoundary } from './components/common';
import { UserList } from './components/users';
import { RoleList } from './components/roles';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="App">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#059669',
                    },
                  },
                  error: {
                    style: {
                      background: '#DC2626',
                    },
                  },
                }}
              />
              
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* User management routes */}
                <Route path="/users" element={
                  <ProtectedRoute>
                    <Layout>
                      <UserList />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Role management routes */}
                <Route path="/roles" element={
                  <ProtectedRoute>
                    <Layout>
                      <RoleList />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* 404 page */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-4">Page not found</p>
                      <a href="/dashboard" className="text-primary hover:text-primary/90">
                        Go to Dashboard
                      </a>
                    </div>
                  </div>
                } />
              </Routes>
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
