import React from 'react';

export default function ListingView({ onTriggerMatch }) {
  const yields = [
    {
      id: 'yield-1',
      crop: 'TOMATOES',
      variety: 'Roma Variety',
      weight: '3,500 kg',
      window: 'Aug 10-15',
    },
    {
      id: 'yield-2',
      crop: 'CHILI PEPPERS',
      variety: 'Habenero Red',
      weight: '1,200 kg',
      window: 'Aug 18-22',
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Pre-Harvest Yields</h2>
        <p className="text-xs text-slate-500">Select an unharvested crop to trigger the matching engine.</p>
      </div>

      <div className="flex flex-col gap-3">
        {yields.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700">{item.crop}</h3>
                <p className="text-sm font-bold text-slate-800">Variety: {item.variety}</p>
              </div>
              <span className="text-sm font-black text-slate-900 font-mono">{item.weight}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-50 mt-2">
              <span className="text-[11px] text-slate-500">Est. Harvest: <strong className="text-slate-700">{item.window}</strong></span>
              <button 
                onClick={onTriggerMatch}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                Match Now →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-[11px] text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-blue-900">
          <span>📊</span> Network Optimization:
        </div>
        <p className="leading-relaxed">
          This view degrades gracefully into a structural text layout if user switches to SMS/USSD data stream paths.
        </p>
      </div>
    </div>
  );
}