import React, { useState, useEffect } from 'react';

// Day 4 Update: Aligning Mock Data to the UI/UX Tomato Specification
const MOCK_MATCHES = [
    { id: 'match-1', buyer: 'AgroProcure Ltd', price: '₦450/Crate', score: '98%', distance: '12 km', costSaved: '15%' },
    { id: 'match-2', buyer: 'Delta Millers', price: '₦435/Crate', score: '91%', distance: '45 km', costSaved: '8%' },
];

export default function MatchResults({ onAcceptOffer }) {
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating Day 4 Async API Network Latency
        const fetchMatches = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(MOCK_MATCHES);
                }, 1500);
            });
        };

        fetchMatches().then((data) => {
            setMatches(data);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-mono animate-pulse">Running algorithmic matching logic...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Optimal Matches</h2>
                    <span className="bg-purple-100 text-purple-700 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded">Async V1</span>
                </div>
                <p className="text-xs text-slate-500">Logistics-optimized match recommendations.</p>
            </div>

            <div className="flex flex-col gap-3">
                {matches.map((match, index) => (
                    <div key={match.id} className={`p-4 rounded-xl border bg-white shadow-sm transition-all relative overflow-hidden ${index === 0 ? 'border-purple-500 ring-2 ring-purple-100' : 'border-slate-200'}`}>
                        {index === 0 && (
                            <span className="absolute top-0 right-0 bg-purple-500 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-bl">
                                Best Fit
                            </span>
                        )}

                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">{match.buyer}</h3>
                                <p className="text-xs text-purple-600 font-semibold">Match Score: {match.score}</p>
                            </div>
                            <span className="text-base font-black text-slate-900 font-mono">{match.price}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                            <div>Transit Distance: <strong className="text-slate-700">{match.distance}</strong></div>
                            <div className="text-right">Freight Saved: <strong className="text-emerald-600">+{match.costSaved}</strong></div>
                        </div>

                        <button
                            onClick={() => onAcceptOffer(match.buyer, match.price)}
                            className={`w-full mt-3 py-2 px-4 rounded-lg text-xs font-bold transition-colors ${index === 0 ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            Accept Match Offer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}