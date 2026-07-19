import React from 'react';

export default function ListingDetail() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Batch Escrow Securement</h2>
        <p className="text-xs text-slate-500">Lock commitments directly on upcoming harvests to secure processing lines.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="border-b pb-3">
          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase">B2B Processing Contract</span>
          <h3 className="text-base font-bold text-slate-800 mt-2">5,000 kg Premium Roma Tomatoes</h3>
          <p className="text-xs text-slate-500 mt-0.5">Origin Cluster: Makarfi, Kaduna State</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Agreed Batch Price</span>
            <strong className="text-slate-900 text-sm">₦2,250,000</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Quality Grading Target</span>
            <strong className="text-emerald-600 text-sm">Grade A (Verified)</strong>
          </div>
        </div>

        
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 flex items-center gap-1">🛡️ Farm2Market Escrow Safeguard:</p>
          <p className="text-[11px] mt-1 text-slate-600">Funds are held safely in trust. Capital releases to the smallholder's digital wallet only *after* verified arrival grading inspects and clears crop defects.</p>
        </div>

        <button className="w-full bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-slate-800 transition-colors shadow">
          Lock Pre-Order & Deposit to Escrow
        </button>
      </div>
    </div>
  );
}