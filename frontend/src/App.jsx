import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));

// Admin Pages
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const CreateQuizPage = lazy(() => import('./pages/admin/CreateQuizPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
              <Route path="/results/:submissionId" element={<ResultsPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/quiz/create"
                element={
                  <ProtectedRoute>
                    <CreateQuizPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route - Redirect 404 to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
