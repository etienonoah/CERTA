import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Box, ShoppingCart } from 'lucide-react';

export default function NavBar() {
  return (
    <div className="navbar">
      <NavLink to="/" className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`} end>
        <Home size={20} />
        Home
      </NavLink>
      <NavLink to="/match" className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}>
        <Users size={20} />
        Match
      </NavLink>
      <NavLink to="/booking" className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}>
        <Box size={20} />
        Book
      </NavLink>
      <NavLink to="/preorder" className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}>
        <ShoppingCart size={20} />
        Pre-order
      </NavLink>
    </div>
  );
}
