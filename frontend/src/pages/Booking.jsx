import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { Warehouse, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api';

export default function Booking() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await api.get('/warehouses');
        setWarehouses(res.data || []);
      } catch (err) {
        console.error('Error fetching warehouses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const handleBook = async (warehouseId) => {
    try {
      // Assuming listing_id 15 based on API docs example
      const res = await api.post('/bookings', { warehouse_id: warehouseId, listing_id: 15 });
      setBookingStatus(res.data.status); // "requested"
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking.');
    }
  };

  if (loading) {
    return (
      <div className="screenview">
        <TopBar title="Warehouse Booking" />
        <div className="content" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 size={32} color="var(--certa-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  const primaryWarehouse = warehouses.length > 0 ? warehouses[0] : null;
  const isFull = !primaryWarehouse;

  return (
    <div className="screenview">
      <TopBar title="Warehouse Booking" />
      <div className="content">
        
        {!isFull ? (
          <>
            <Card>
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <div>
                  <div className="value" style={{ fontSize: '15px', marginBottom: '4px' }}>{primaryWarehouse.name} — {primaryWarehouse.location}</div>
                  <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Warehouse size={14} /> Cold storage · {primaryWarehouse.capacity} bays total
                  </div>
                </div>
                <StatusPill status="confirmed" label="Available" />
              </div>
            </Card>

            <Card>
              <div className="label">Booking status</div>
              <div className="row" style={{ marginTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <StatusPill status={bookingStatus ? 'fulfilled' : 'neutral'} label="Requested" />
                <ArrowRight size={14} color="var(--certa-muted)" />
                <StatusPill status="pending" label="Confirmed" />
                <ArrowRight size={14} color="var(--certa-muted)" />
                <StatusPill status="neutral" label="Stored" />
              </div>
            </Card>

            {!bookingStatus ? (
              <button className="btn" style={{ marginBottom: '16px' }} onClick={() => handleBook(primaryWarehouse.id)}>
                Book Storage
              </button>
            ) : (
              <button className="btn-ghost" style={{ marginBottom: '16px', display: 'block', textAlign: 'center' }}>
                Booking Requested!
              </button>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="state-icon" style={{ color: 'var(--certa-accent)', background: 'var(--certa-pill-pending-bg)' }}>
                <AlertTriangle size={32} />
              </div>
              <div className="headline">No Warehouses Available</div>
              <div className="body-text" style={{ marginBottom: '24px' }}>There are currently no warehouses registered in the system.</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
