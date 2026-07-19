import React from 'react';

export default function BookingConfirmation() {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-2 text-lg font-bold">✓</div>
        <h2 className="text-base font-bold text-slate-800">Storage Allocated</h2>
        <p className="text-xs text-slate-600 mt-1">Reference Ticket: <span className="font-mono font-bold text-slate-900">F2M-WH-9081</span></p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Booking Pipeline</h3>
        
        <div className="space-y-4 relative before:absolute before:bottom-2 before:top-2 before:left-3 before:w-0.5 before:bg-slate-200">
          <div className="flex items-start gap-3 relative">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold z-10">1</div>
            <div>
              <p className="text-xs font-bold text-slate-800">Crate Space Reserved</p>
              <p className="text-[10px] text-slate-500">Confirmed at Zaria Cold Corridor Hub</p>
            </div>
          </div>
          <div className="flex items-start gap-3 relative">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold z-10">2</div>
            <div>
              <p className="text-xs font-bold text-slate-800">Awaiting Logistics Hand-Off</p>
              <p className="text-[10px] text-slate-500">Refrigerated truck routing active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}