import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import StatusPill from '../components/StatusPill';
import { SearchX, UserCheck, MapPin, Loader2 } from 'lucide-react';
import api from '../api';

export default function Match() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Try to get matches or simulate them
        const res = await api.get('/listings');
        if (res.data && res.data.length > 0) {
          // If listings exist, simulate some matches for the first one
          setMatches([
            { id: 1, name: 'Amina Traders — Kano', price: '₦185/kg', dist: '12km away', score: '92%', status: 'confirmed' },
            { id: 2, name: 'Greenfield Buyers', price: '₦170/kg', dist: '30km away', score: '78%', status: 'pending' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching matches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="screenview">
      <TopBar title="Buyer Matching" />
      <div className="content">
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 size={32} color="var(--certa-primary)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : matches.length > 0 ? (
          <>
            <div className="label" style={{ marginBottom: '12px' }}>Matches for your crop listing</div>
            
            {matches.map((m) => (
              <div className="match-item" key={m.id}>
                <div className="avatar">{m.name.substring(0, 2).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div className="value" style={{ fontSize: '14px', marginBottom: '4px' }}>{m.name}</div>
                  <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> Offers {m.price} · {m.dist}
                  </div>
                </div>
                <StatusPill status={m.status} label={`${m.score} match`} />
              </div>
            ))}

            <button className="btn" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <UserCheck size={18} /> Confirm best match
            </button>
            <button className="btn-ghost" style={{ marginTop: '12px' }} onClick={() => setMatches([])}>Clear Matches</button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '20px 0' }}>
            <div className="state-icon">
              <SearchX size={32} />
            </div>
            <div className="headline">No matches yet</div>
            <div className="body-text">You have no active listings or haven't matched with a buyer yet.</div>
            <div className="sub-text">We'll notify you the moment a trader in your area matches. Listings with current-market pricing typically match within a few hours.</div>
          </div>
        )}

      </div>
    </div>
  );
}
