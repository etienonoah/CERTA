import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Match from './pages/Match';
import Booking from './pages/Booking';
import Preorder from './pages/Preorder';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';

function AppLayout({ children }) {
  const location = useLocation();
  const hideNavBar = location.pathname === '/auth';

  return (
    <div className="app-container">
      {children}
      {!hideNavBar && <NavBar />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AppLayout><Auth /></AppLayout>} />
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/match" element={<AppLayout><Match /></AppLayout>} />
        <Route path="/booking" element={<AppLayout><Booking /></AppLayout>} />
        <Route path="/preorder" element={<AppLayout><Preorder /></AppLayout>} />
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
