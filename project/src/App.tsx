import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import CompleteProfile from './pages/Auth/CompleteProfile';
import CategoryPage from './pages/CategoryPage';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import WorkerProfile from './pages/WorkerProfile';
import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import AnimatedWelcome from './components/AnimatedWelcome';

function AppContent() {
  const { user, loading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    // Show welcome screen when user logs in
    if (!loading && user && !hasShownWelcome) {
      setShowWelcome(true);
      setHasShownWelcome(true);
    }
  }, [user, loading, hasShownWelcome]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/worker/:id" element={<WorkerProfile />} />
        <Route path="/auth/callback" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
      <Toaster position="top-right" />
      
      {showWelcome && user && (
        <AnimatedWelcome user={user} onClose={() => setShowWelcome(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;