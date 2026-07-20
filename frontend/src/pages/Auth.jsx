import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, Loader2 } from 'lucide-react';
import api from '../api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login flow
        const res = await api.post('/login', {
          email: formData.email,
          password: formData.password
        });
        
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          // Assuming the user is farmer ID 1 for now (to connect to existing mock dashboard logic)
          localStorage.setItem('userEmail', formData.email); 
          navigate('/dashboard');
        }
      } else {
        // Registration flow
        const res = await api.post('/register', {
          email: formData.email,
          password: formData.password
        });
        
        // After register, you could auto-login, but for now let's just log them in
        if (res.status === 201) {
          // Immediately log them in
          const loginRes = await api.post('/login', {
            email: formData.email,
            password: formData.password
          });
          
          if (loginRes.data.token) {
            localStorage.setItem('token', loginRes.data.token);
            localStorage.setItem('userEmail', formData.email);
            
            // Register their farmer profile automatically so Dashboard works immediately
            await api.post('/farmers', {
              name: formData.name || 'New Farmer',
              contact_info: formData.email
            }, {
              headers: { Authorization: `Bearer ${loginRes.data.token}` }
            });

            navigate('/dashboard');
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screenview" style={{ justifyContent: 'center', background: 'var(--certa-bg)' }}>
      <div className="content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-icon" style={{ margin: '0 auto 16px', width: '48px', height: '48px', fontSize: '24px' }}>
            <span>C</span>
          </div>
          <div className="screen-title" style={{ fontSize: '24px' }}>Welcome to Certa</div>
          <div className="body-text" style={{ marginTop: '8px' }}>
            {isLogin ? 'Sign in to manage your Farm Digital Twin.' : 'Create an account to join the network.'}
          </div>
        </div>

        <div style={{ background: 'var(--certa-surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--certa-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.02)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} color="var(--certa-muted)" style={{ position: 'absolute', top: '14px', left: '14px' }} />
                <input 
                  required
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '12px', border: '1px solid var(--certa-border)', fontSize: '15px' }}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--certa-muted)" style={{ position: 'absolute', top: '14px', left: '14px' }} />
              <input 
                required
                type="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '12px', border: '1px solid var(--certa-border)', fontSize: '15px' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--certa-muted)" style={{ position: 'absolute', top: '14px', left: '14px' }} />
              <input 
                required
                type="password"
                placeholder="Password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '12px', border: '1px solid var(--certa-border)', fontSize: '15px' }}
              />
            </div>

            <button type="submit" className="btn" disabled={loading} style={{ marginTop: '8px', padding: '14px' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--certa-muted)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setIsLogin(!isLogin)} 
              style={{ color: 'var(--certa-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
