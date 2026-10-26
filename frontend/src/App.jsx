import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Explore from './components/Explore';
import TripDetails from './components/TripDetails';
import CreateTrip from './components/CreateTrip';
import EditTrip from './components/EditTrip';
import Bookings from './components/Bookings';
import TripExpenses from './components/TripExpenses';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './theme1.css'; // Imports the global theme styles

// Layout component to hide Navbar on Login / Register pages
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

// Root Redirect Helper
const RootRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Smart Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/explore" 
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips" 
            element={
              <ProtectedRoute>
                <TripDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips/edit/:tripId" 
            element={
              <ProtectedRoute>
                <EditTrip />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips/:tripId/expenses" 
            element={
              <ProtectedRoute>
                <TripExpenses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-trip" 
            element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;