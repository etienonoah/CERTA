import React from 'react';

export default function ConsumerBrowse({ onSelectPlan }) {
    const PLANS = [
        { id: 'plan-weekly', name: 'Weekly Fresh Basket', price: '₦3,500/week', description: 'Perfect for standard households. Delivers 15kg of graded Roma tomatoes directly from Kaduna clusters.', savings: 'Saves ~₦1,200 in market spoilage' },
        { id: 'plan-biweekly', name: 'Bi-Weekly Smart Pack', price: '₦6,000/month', description: 'Coordinated delivery twice a month in logistics-optimized windows.', savings: 'Saves ~₦2,500 in market spoilage' }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Lagos Consumer Hub Active
                </span>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mt-1">Zero-Waste Fresh Supply</h2>
                <p className="text-xs text-slate-500">Subscribe to guaranteed fresh produce, framed directly around your baseline spoilage savings.</p>
            </div>

            <div className="flex flex-col gap-3">
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        onClick={() => onSelectPlan(plan.name, plan.price)}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group active:bg-slate-50"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{plan.name}</h3>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{plan.description}</p>
                            </div>
                            <span className="text-sm font-black text-slate-900 font-mono whitespace-nowrap ml-2">{plan.price}</span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                                🛡️ {plan.savings}
                            </span>
                            <span className="font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">Select Plan →</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 rounded-lg bg-slate-100 text-[11px] text-slate-600 border border-slate-200">
                💡 <strong>Did you know?</strong> 52.9% of urban consumers don't use typical grocery apps. We keep our system completely plain, direct, and focused strictly on reliable drop-offs.
            </div>
        </div>
    );
}