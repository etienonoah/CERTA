import React from 'react';

export default function PartnerDashboard() {
  const OFFERS = [
    { id: 'route-1', type: 'Logistics Dispatch', route: 'Makarfi Cluster ➔ Zaria Hub', payload: '120 Crates (Tomatoes)', status: 'Pending Pickup', time: 'Aug 12 - Morning' },
    { id: 'route-2', type: 'Storage Allocation', route: 'Zaria Cold Corridor - Vault B3', payload: '500 Crates Capacity Reserved', status: 'Allocated', time: 'Aug 10 - Ongoing' }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Partner Portal Interface
        </span>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mt-1">Operator Dispatch Desk</h2>
        <p className="text-xs text-slate-500">Manage cluster transport logistics and warehouse volumetric capacity bookings.</p>
      </div>

      <div className="flex flex-col gap-3">
        {OFFERS.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-500 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                  item.type.includes('Logistics') ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                }`}>
                  {item.type}
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-2">{item.route}</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.status === 'Allocated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
              }`}>
                {item.status}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
              <span>Manifest: <strong>{item.payload}</strong></span>
              <span className="text-slate-700 font-semibold">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex justify-between items-center shadow">
        <div>
          <p className="font-bold text-emerald-400">Backhaul Optimization Active</p>
          <p className="text-[10px] text-slate-400">Empty return trip routing eliminated for this zone corridor.</p>
        </div>
        <span className="text-lg">🚚</span>
      </div>
    </div>
  );
}