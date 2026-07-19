import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { User, Plus, Package, Loader2, RefreshCcw } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Listing Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ crop_type: '', quantity: '', estimated_harvest_window: '' });
  const [submitting, setSubmitting] = useState(false);

  // Profile Form state
  const [profileData, setProfileData] = useState({ name: '', contact_info: '' });
  const [submittingProfile, setSubmittingProfile] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const farmersRes = await api.get('/farmers');
      if (farmersRes.data && farmersRes.data.length > 0) {
        setProfile(farmersRes.data[0]); // Use the first real farmer for now
        
        // Fetch listings only if a profile exists
        const listingsRes = await api.get('/listings');
        setListings(listingsRes.data || []);
      } else {
        setProfile(null);
        setListings([]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setSubmittingProfile(true);
    try {
      await api.post('/farmers', profileData);
      setProfileData({ name: '', contact_info: '' });
      fetchData(); // Reload to get the newly created profile
    } catch (err) {
      console.error('Error creating profile:', err);
      alert('Failed to create profile.');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;
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
        <TopBar title="User Dashboard" />
        <div className="content" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 size={32} color="var(--certa-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  // If no profile exists, show the Create Profile form
  if (!profile) {
    return (
      <div className="screenview">
        <TopBar title="User Dashboard" />
        <div className="content">
          <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
            <div className="state-icon" style={{ margin: '0 auto 16px', background: 'rgba(5, 150, 105, 0.1)', color: 'var(--certa-primary)' }}>
              <User size={32} />
            </div>
            <div className="headline">Welcome to Certa</div>
            <div className="body-text">Please create a real farmer profile to start adding listings and managing your dashboard.</div>
          </div>

          <Card style={{ border: '2px solid var(--certa-primary)' }}>
            <div className="label" style={{ marginBottom: '16px', color: 'var(--certa-primary)', fontWeight: 600 }}>Create Profile</div>
            <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                required
                placeholder="Full Name" 
                value={profileData.name}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--certa-border)', fontSize: '14px' }}
              />
              <input 
                required
                type="email"
                placeholder="Contact Email" 
                value={profileData.contact_info}
                onChange={e => setProfileData({...profileData, contact_info: e.target.value})}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--certa-border)', fontSize: '14px' }}
              />
              <button type="submit" className="btn" disabled={submittingProfile} style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
                {submittingProfile ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create Profile'}
              </button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="screenview">
      <TopBar title="Dashboard" />
      <div className="content">
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '0 8px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'var(--certa-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <User size={32} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--certa-text)' }}>{profile.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--certa-muted)' }}>{profile.contact_info}</div>
          </div>
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
