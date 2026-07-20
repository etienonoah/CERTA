import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { User, Plus, Package, Loader2, LogOut } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Listing Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ crop_type: '', quantity: '', estimated_harvest_window: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const farmersRes = await api.get('/farmers');
      // For demo, we are just picking the first farmer, or if we passed email in localstorage we could filter
      const userEmail = localStorage.getItem('userEmail');
      const userProfile = farmersRes.data?.find(f => f.contact_info === userEmail) || farmersRes.data?.[0];
      
      if (userProfile) {
        setProfile(userProfile);
        const listingsRes = await api.get('/listings');
        // Filter listings for this farmer if backend doesn't do it automatically
        const userListings = (listingsRes.data || []).filter(l => l.farmer_id === userProfile.id);
        setListings(userListings);
      } else {
        setProfile({ name: 'Farmer', contact_info: userEmail }); // Fallback
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/auth');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile || !profile.id) return;
    setSubmitting(true);
    try {
      const payload = {
        farmer_id: profile.id,
        crop_type: formData.crop_type,
        quantity: parseInt(formData.quantity, 10),
        estimated_harvest_window: formData.estimated_harvest_window
      };
      await api.post('/listings', payload);
      
      setFormData({ crop_type: '', quantity: '', estimated_harvest_window: '' });
      setShowForm(false);
      fetchData(); 
    } catch (err) {
      console.error('Error creating listing:', err);
      alert('Failed to create listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="screenview">
        <TopBar title="Certa" />
        <div className="content" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 size={32} color="var(--certa-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="screenview">
      <TopBar title="Certa" />
      <div className="content">
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '0 8px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'var(--certa-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <User size={32} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--certa-text)' }}>{profile?.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--certa-muted)' }}>{profile?.contact_info}</div>
          </div>
          <button 
            onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid var(--certa-border)', borderRadius: '12px', padding: '10px', color: 'var(--certa-muted)', cursor: 'pointer' }}
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="row" style={{ marginBottom: '16px' }}>
          <div className="screen-title" style={{ fontSize: '18px' }}>My Active Listings</div>
          <button 
            className="btn-ghost" 
            style={{ width: 'auto', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : <><Plus size={16} /> New Listing</>}
          </button>
        </div>

        {showForm && (
          <Card style={{ border: '2px solid var(--certa-primary)', background: 'rgba(5, 150, 105, 0.02)' }}>
            <div className="label" style={{ marginBottom: '16px', color: 'var(--certa-primary)', fontWeight: 600 }}>Create New Crop Listing</div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                required
                placeholder="Crop Type (e.g. Tomatoes)" 
                value={formData.crop_type}
                onChange={e => setFormData({...formData, crop_type: e.target.value})}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--certa-border)', fontSize: '14px' }}
              />
              <input 
                required
                type="number"
                placeholder="Quantity (kg)" 
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--certa-border)', fontSize: '14px' }}
              />
              <input 
                required
                placeholder="Estimated Harvest Window (e.g. 5-7 days)" 
                value={formData.estimated_harvest_window}
                onChange={e => setFormData({...formData, estimated_harvest_window: e.target.value})}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--certa-border)', fontSize: '14px' }}
              />
              <button type="submit" className="btn" disabled={submitting} style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
                {submitting ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Publish Listing'}
              </button>
            </form>
          </Card>
        )}

        {listings.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--certa-surface-light)', borderRadius: '16px', border: '1px dashed var(--certa-border)' }}>
            <Package size={32} color="var(--certa-muted)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div className="value">No listings yet</div>
            <div className="label" style={{ marginTop: '4px' }}>Create a listing to populate the dashboard.</div>
          </div>
        ) : (
          listings.map(item => (
            <Card key={item.id}>
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <div>
                  <div className="value">{item.crop_type}</div>
                  <div className="label" style={{ marginTop: '4px' }}>{item.quantity} kg available</div>
                </div>
                <StatusPill status="confirmed" label="Active" />
              </div>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--certa-border)' }}>
                <div className="label">Harvest Window</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--certa-text)' }}>{item.estimated_harvest_window}</div>
              </div>
            </Card>
          ))
        )}

      </div>
    </div>
  );
}
