import React from 'react';

export default function ReservationConfirmation() {
    return (
        <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-2 text-lg font-bold">✓</div>
                <h2 className="text-base font-bold text-slate-800">Escrow Guarantee Issued</h2>
                <p className="text-xs text-slate-600 mt-1">Pre-Harvest Contract: <span className="font-mono font-bold text-slate-900">F2M-ESC-7732</span></p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-800 border-b pb-2">Harvest Ticket Specifications</h3>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-400">Escrow State:</span> <span className="font-bold text-amber-600">Locked / Vaulted</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Delivery Protection Model:</span> <span className="font-medium text-slate-700">Pay-After-Delivery / Inspection Option</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Est. Logistics Dispatch:</span> <span className="font-mono text-slate-900 font-semibold">August 12, 2026</span></div>
                </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <button className="text-xs text-amber-800 font-bold underline hover:text-amber-900">
                    ⚠️ Trigger Immediate Spoilage Refund Path
                </button>
            </div>
        </div>
    );
}