import React from 'react';

const MOCK_HUBS = [
  { id: 'hub-01', name: 'Zaria Cold Corridor Hub', type: 'Solar Cold Room', distance: '14 km', capacity: '120/500 Crates Available', price: '₦250 / crate / day', features: ['Solar Backup', 'Generator Backup'] },
  { id: 'hub-02', name: 'Kaduna Central Warehousing', type: 'Dry Storage', distance: '32 km', capacity: '1,400/3,000 Crates Available', price: '₦120 / crate / day', features: ['24/7 Security'] },
];

export default function AvailabilityView() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Cold-Storage Hubs</h2>
        <p className="text-xs text-slate-500">Real-time volumetric availability checking near your cluster corridor.</p>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_HUBS.map((hub) => (
          <div key={hub.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-emerald-500 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{hub.name}</h3>
                <span className="inline-block text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded mt-1">
                  {hub.type}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900">{hub.price}</span>
            </div>
            
            <p className="text-xs text-slate-500 mt-2">Distance: <strong>{hub.distance} away</strong></p>
            
            <div className="mt-3 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[35%]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>{hub.capacity}</span>
              <span className="text-emerald-600 font-bold">Space Reserved Securely</span>
            </div>

            <div className="flex gap-1 mt-3">
              {hub.features.map((feat, i) => (
                <span key={i} className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                  ⚡ {feat}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}