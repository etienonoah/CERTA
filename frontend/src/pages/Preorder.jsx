import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { Package, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../api';

export default function Preorder() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserved, setReserved] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get('/listings');
        if (res.data && res.data.length > 0) {
          setListing(res.data[0]); // Pick the first available
        }
      } catch (err) {
        console.error('Error fetching listings for preorder:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  const handleReserve = async () => {
    if (!listing) return;
    try {
      // Hardcode consumer_id for demo
      await api.post('/preorders', { consumer_id: 1, listing_id: listing.id });
      setReserved(true);
    } catch (err) {
      console.error('Error making preorder:', err);
      alert('Failed to reserve crop.');
    }
  };

  if (loading) {
    return (
      <div className="screenview">
        <TopBar title="Pre-order" />
        <div className="content" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 size={32} color="var(--certa-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="screenview">
        <TopBar title="Pre-order" />
        <div className="content">
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--certa-muted)' }}>
            No crops available for pre-order at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screenview">
      <TopBar title="Pre-order" />
      <div className="content">
        <Card>
          <div className="row" style={{ alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div className="label">{listing.crop_type} · Kano farm cluster</div>
              <div className="value" style={{ fontSize: '20px', fontWeight: 700 }}>₦145/kg</div>
              <div className="label" style={{ marginTop: '2px' }}>Min. order 5kg</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--certa-pill-pending-bg)', borderRadius: '14px', color: 'var(--certa-accent)' }}>
              <Package size={24} />
            </div>
          </div>
          
          <div style={{ background: 'var(--certa-surface-light)', padding: '16px', borderRadius: '12px', border: '1px solid var(--certa-border)' }}>
            <div className="label" style={{ marginBottom: '4px' }}>Estimated harvest ready</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--certa-primary)', marginBottom: '12px' }}>
              {listing.estimated_harvest_window}
            </div>
            <StatusPill status={reserved ? 'confirmed' : 'pending'} label={reserved ? "Confirmed" : "Available"} />
          </div>
        </Card>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', marginBottom: '16px' }}>
          <ShieldCheck size={18} color="var(--certa-primary)" />
          <div className="label" style={{ marginBottom: 0, color: 'var(--certa-text)' }}>Only pay after delivery is confirmed</div>
        </div>

        {!reserved ? (
          <button className="btn" onClick={handleReserve}>Reserve 5kg — ₦725</button>
        ) : (
          <button className="btn-ghost" disabled>Reservation Confirmed</button>
        )}
      </div>
    </div>
  );
}
