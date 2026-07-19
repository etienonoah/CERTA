import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Match from './pages/Match';
import Booking from './pages/Booking';
import Preorder from './pages/Preorder';
import Dashboard from './pages/Dashboard';

function AppLayout({ children }) {
  return (
    <div className="app-container">
      {children}
      <NavBar />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
