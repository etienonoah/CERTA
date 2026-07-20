import React from 'react';
import { User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TopBar({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="topbar" style={{ justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="logo-icon">
          <span>C</span>
        </div>
        <h1 className="screen-title" style={{ margin: 0 }}>{title}</h1>
      </div>
      
      {!isDashboard && (
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'var(--certa-surface-light)',
            border: '1px solid var(--certa-border)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--certa-primary)',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <User size={18} />
        </button>
      )}
    </div>
  );
}
