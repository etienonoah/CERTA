import React, { useState } from 'react';

export default function ConsumerOrderDetails({ selectedPlan, selectedPrice, onReset }) {
    const [orderStatus, setOrderStatus] = useState('Arrived - Awaiting Inspection');
    const [refundTriggered, setRefundTriggered] = useState(false);

    const handleVerifyAndPay = () => {
        setOrderStatus('Delivered & Paid');
        alert('Escrow released to farmer wallet! Transaction settled securely.');
    };

    const handleRefund = () => {
        setRefundTriggered(true);
        setOrderStatus('Refund Initiated');
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Active Delivery Ticket</h2>
                <p className="text-xs text-slate-500">Inspect your basket before releasing payment tokens.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                    <div>
                        <span className="text-[9px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">ID: F2M-CON-4491</span>
                        <h3 className="text-sm font-bold text-slate-800 mt-1">{selectedPlan || 'Weekly Fresh Basket'}</h3>
                    </div>
                    <span className="text-base font-black text-slate-900 font-mono">{selectedPrice || '₦3,500'}</span>
                </div>

                
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Verification Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${orderStatus.includes('Paid') ? 'bg-emerald-100 text-emerald-800' :
                            orderStatus.includes('Refund') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                        {orderStatus}
                    </span>
                </div>

                
                <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-900 space-y-1">
                    <p className="font-bold">🤝 Pay-After-Delivery Model Active</p>
                    <p className="text-blue-800 leading-relaxed">
                        Your delivery courier is waiting. Open the crate, confirm the tomatoes match the designated grade quality, and select your action below.
                    </p>
                </div>

               
                {orderStatus === 'Arrived - Awaiting Inspection' && (
                    <div className="flex flex-col gap-2 pt-2">
                        <button
                            onClick={handleVerifyAndPay}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow transition-colors"
                        >
                            Accept Quality & Authorize Payment
                        </button>
                        <button
                            onClick={handleRefund}
                            className="w-full bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold py-2 px-4 rounded-xl text-xs transition-colors"
                        >
                            ⚠️ Flag Spoilage / Request Direct Refund
                        </button>
                    </div>
                )}

                {refundTriggered && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900 text-center font-medium">
                        🚨 Refund triggered in 1-Tap. Return transit manifest routed back to cluster hub cache automatically.
                    </div>
                )}

                <button
                    onClick={onReset}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-600 pt-2 underline transition-colors"
                >
                    Return to Marketplace Home
                </button>
            </div>
        </div>
    );
}