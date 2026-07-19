import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { Sprout, Activity, CalendarDays, Loader2 } from 'lucide-react';
import api from '../api';

export default function Home() {
  const [listing, setListing] = useState(null);
  const [stats, setStats] = useState({ matches: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [listingsRes, warehousesRes] = await Promise.all([
          api.get('/listings'),
          api.get('/warehouses')
        ]);
        
        // Grab the most recent listing for the digital twin
        if (listingsRes.data && listingsRes.data.length > 0) {
          setListing(listingsRes.data[listingsRes.data.length - 1]);
        }

        // Dummy logic to calculate active bookings/matches from existing data for now
        setStats({
          matches: listingsRes.data.length > 0 ? 3 : 0,
          bookings: warehousesRes.data.length > 0 ? 1 : 0
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="screenview">
      <TopBar title="Certa" />
      <div className="content">
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="lucide-spin" size={32} color="var(--certa-primary)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <>
            <Card>
              <div className="row" style={{ marginBottom: '8px', alignItems: 'flex-start' }}>
                <div>
                  <div className="label">Farm Digital Twin</div>
                  <div className="value">
                    {listing ? `${listing.crop_type} (${listing.quantity}kg)` : 'No active listings'}
                  </div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '12px', color: 'var(--certa-primary)' }}>
                  <Sprout size={24} />
                </div>
              </div>
              
              <div className="label" style={{ marginTop: '12px' }}>Estimated harvest window</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--certa-primary)', marginTop: '4px', letterSpacing: '-0.5px' }}>
                {listing ? listing.estimated_harvest_window : '—'}
              </div>
              <StatusPill status={listing ? 'pending' : 'neutral'} label="Based on weather + market signal" />
            </Card>
            
            <div className="row" style={{ marginBottom: '16px' }}>
              <Card style={{ flex: 1, marginBottom: 0, padding: '16px' }}>
                <div className="row" style={{ marginBottom: '8px' }}>
                  <div className="label" style={{ marginBottom: 0 }}>Active matches</div>
                  <Activity size={16} color="var(--certa-primary)" />
                </div>
                <div className="value" style={{ fontSize: '24px', fontWeight: 700 }}>{stats.matches}</div>
              </Card>
              <Card style={{ flex: 1, marginBottom: 0, padding: '16px' }}>
                <div className="row" style={{ marginBottom: '8px' }}>
                  <div className="label" style={{ marginBottom: 0 }}>Bookings</div>
                  <CalendarDays size={16} color="var(--certa-primary)" />
                </div>
                <div className="value" style={{ fontSize: '24px', fontWeight: 700 }}>{stats.bookings}</div>
              </Card>
            </div>
            
            <button className="btn">View today's recommendation</button>
          </>
        )}
      </div>
    </div>
  );
}
