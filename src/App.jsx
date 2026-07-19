import React, { useState, useEffect } from 'react';
import ListingView from './journeys/buyer-matching/ListingView';
import MatchResults from './journeys/buyer-matching/MatchResults';
import AvailabilityView from './journeys/warehouse-booking/AvailabilityView';
import BookingConfirmation from './journeys/warehouse-booking/BookingConfirmation';
import ListingDetail from './journeys/pre-order/ListingDetail';
import ReservationConfirmation from './journeys/pre-order/ReservationConfirmation';
import PartnerDashboard from './journeys/partner-flow/PartnerDashboard';

export default function App() {
  const [authState, setAuthState] = useState('splash');
  const [currentScreen, setCurrentScreen] = useState('home-dashboard');
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);

  const [matchedBuyer, setMatchedBuyer] = useState(() => {
    return localStorage.getItem('f2m_cached_buyer') || null;
  });
  const [matchedPrice, setMatchedPrice] = useState(() => {
    return localStorage.getItem('f2m_cached_price') || null;
  });

  const digitalTwinData = {
    farmerName: "Amina Yusuf",
    location: "Makarfi cluster, Kaduna",
    cropTracked: "Tomatoes (Roma variety)",
    soilCondition: "Optimum moisture",
    upcomingWeatherRisk: "Heavy rainfall forecasted (Aug 12)"
  };

  useEffect(() => {
    if (matchedBuyer) {
      localStorage.setItem('f2m_cached_buyer', matchedBuyer);
      localStorage.setItem('f2m_cached_price', matchedPrice);
    } else {
      localStorage.removeItem('f2m_cached_buyer');
      localStorage.removeItem('f2m_cached_price');
    }
  }, [matchedBuyer, matchedPrice]);

  const handleTriggerMatch = () => setCurrentScreen('matching-results');

  const handleAcceptOffer = (buyer, price) => {
    setMatchedBuyer(buyer);
    setMatchedPrice(price);
    setCurrentScreen('home-dashboard');
  };

  const style = {
    teal800: '#085041',
    teal200: '#5DCAA5',
    amber600: '#BA7517',
    gray900: '#2C2C2A',
    gray400: '#888780',
    lightSurface: '#E1F5EE',
    amberTint: '#FAEEDA',
  };

  const navigationItems = [
    { id: 'home-dashboard', label: 'Twin', check: (scr) => scr === 'home-dashboard' },
    { id: 'matching-list', label: 'Match', check: (scr) => scr.startsWith('matching') },
    { id: 'warehouse-avail', label: 'Storage', check: (scr) => scr.startsWith('warehouse') },
    { id: 'consumer-browse', label: 'Buyer', check: (scr) => scr.startsWith('consumer') || scr.startsWith('preorder') },
    { id: 'partner-portal', label: 'Ops', check: (scr) => scr === 'partner-portal' },
  ];

  const renderScreen = () => {
    if (lowBandwidthMode && currentScreen === 'home-dashboard') {
      return (
        <div className="text-[12px] space-y-4 font-mono max-w-4xl" style={{ color: style.gray900 }}>
          <div>
            <div>[Status: offline cache active]</div>
            <div>Farmer: {digitalTwinData.farmerName} ({digitalTwinData.location})</div>
          </div>
          <div className="border p-4 space-y-2 bg-white" style={{ borderColor: style.gray900 }}>
            <div className="font-bold">Weather alert</div>
            <div>Risk: {digitalTwinData.upcomingWeatherRisk}</div>
            <button
              onClick={() => setCurrentScreen('warehouse-avail')}
              className="mt-2 block border px-3 py-1 text-[11px] font-medium transition-colors hover:bg-opacity-90"
              style={{ backgroundColor: style.teal800, color: '#ffffff', borderColor: style.teal800 }}
            >
              [Book refrigeration now]
            </button>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'home-dashboard':
        return (
          <div className="flex flex-col gap-6 text-[13px] max-w-6xl w-full mx-auto" style={{ color: style.gray900 }}>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium tracking-tight">Farm digital twin</h2>
                <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: style.lightSurface, color: style.teal800 }}>
                  Live sync
                </span>
              </div>
              <p className="text-[13px]" style={{ color: style.gray400 }}>Active tracking for {digitalTwinData.farmerName} • {digitalTwinData.location}</p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm bg-white" style={{ backgroundColor: style.amberTint, borderColor: style.amber600 }}>
                <div className="space-y-2">
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: style.amber600 }}>Proactive coordination alert</h3>
                  <p className="text-[14px] leading-relaxed">{digitalTwinData.upcomingWeatherRisk}. Cold room capacities in nearby zones are dropping rapidly. Secure your preservation slot immediately.</p>
                </div>
                <button
                  onClick={() => setCurrentScreen('warehouse-avail')}
                  className="w-full sm:w-auto self-start text-white font-medium px-4 py-2 rounded-lg text-[13px] shadow-sm transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: style.teal800 }}
                >
                  Reserve vault space now →
                </button>
              </div>

              {matchedBuyer && (
                <div className="p-5 border rounded-xl flex flex-col justify-between space-y-4 shadow-sm bg-white" style={{ backgroundColor: style.lightSurface, borderColor: style.teal200 }}>
                  <div className="space-y-2">
                    <span className="font-medium text-[13px]" style={{ color: style.teal800 }}>Active Pre-Harvest Deal Secured</span>
                    <p className="font-bold text-lg md:text-xl tracking-tight mt-1">{matchedBuyer}</p>
                    <p className="text-base font-medium" style={{ color: style.teal800 }}>Contracted Rate: {matchedPrice}</p>
                  </div>
                  <button
                    onClick={() => setMatchedBuyer(null)}
                    className="self-start text-[12px] underline font-medium opacity-80 hover:opacity-100"
                    style={{ color: style.gray900 }}
                  >
                    Reset and unlock transaction pipeline
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-white shadow-sm" style={{ borderColor: '#e5e7eb' }}>
                <span className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: style.gray400 }}>Crop variety</span>
                <span className="font-medium text-base">{digitalTwinData.cropTracked}</span>
              </div>
              <div className="p-4 rounded-xl border bg-white shadow-sm" style={{ borderColor: '#e5e7eb' }}>
                <span className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: style.gray400 }}>Soil metrics</span>
                <span className="font-medium text-base">{digitalTwinData.soilCondition}</span>
              </div>
            </div>
          </div>
        );

      case 'matching-list': return <ListingView onTriggerMatch={handleTriggerMatch} />;
      case 'matching-results': return <MatchResults onAcceptOffer={handleAcceptOffer} />;
      case 'warehouse-avail': return <AvailabilityView onConfirm={() => setCurrentScreen('warehouse-confirm')} />;
      case 'warehouse-confirm': return <BookingConfirmation onBack={() => setCurrentScreen('home-dashboard')} />;

      case 'consumer-browse':
        return <ListingDetail buyer={matchedBuyer} price={matchedPrice} onConfirm={() => setCurrentScreen('preorder-confirm')} />;
      case 'preorder-confirm':
        return <ReservationConfirmation buyer={matchedBuyer} price={matchedPrice} onReset={() => setCurrentScreen('consumer-browse')} />;

      case 'partner-portal': return <PartnerDashboard />;
      default: return <ListingView onTriggerMatch={handleTriggerMatch} />;
    }
  };

  if (authState === 'splash' || authState === 'signup' || authState === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col justify-between p-8 min-h-[500px]">
          <div className="flex-1 flex flex-col justify-center items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl shadow-md" style={{ backgroundColor: style.lightSurface, color: style.teal800 }}>
              C
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: style.teal800 }}>Certa</h1>
            <p className="text-[14px] max-w-xs" style={{ color: style.gray400 }}>Unified trust infrastructure from farm to market.</p>
          </div>
          <button
            onClick={() => setAuthState('authenticated')}
            className="w-full text-white font-medium py-3 rounded-xl shadow-md hover:opacity-95 transition-opacity"
            style={{ backgroundColor: style.teal800 }}
          >
            launch Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">


      <aside className="w-full md:w-64 flex-shrink-0 flex flex-col text-[13px] shadow-md md:min-h-screen" style={{ backgroundColor: style.teal800 }}>
        <div className="p-4 flex justify-between items-center border-b border-opacity-20 border-white text-white">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center font-medium text-[12px]" style={{ backgroundColor: style.teal200, color: style.teal800 }}>C</div>
            <span className="font-semibold text-base tracking-tight">Certa Platform</span>
          </div>
          <button
            onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
            className="px-2 py-0.5 rounded text-[11px] font-medium border border-white border-opacity-40 transition-colors hover:bg-white hover:bg-opacity-10"
          >
            {lowBandwidthMode ? 'SMS' : 'Web Engine'}
          </button>
        </div>


        <nav className="grid grid-cols-5 md:flex md:flex-col gap-1 p-2 md:p-4 text-center md:text-left text-[11px] md:text-[13px] text-white">
          {navigationItems.map((item) => {
            const isActive = item.check(currentScreen);
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className="py-2 px-3 rounded-lg font-medium transition-all duration-150 whitespace-nowrap block"
                style={{
                  backgroundColor: isActive ? style.lightSurface : 'transparent',
                  color: isActive ? style.teal800 : '#ffffff'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>


      <main className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 min-h-[calc(100vh-4rem)] md:min-h-0">
          {renderScreen()}
        </div>
      </main>

    </div>
  );
}