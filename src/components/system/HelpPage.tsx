import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MapPin, AlertTriangle, Bot, Phone } from 'lucide-react';

export const HelpPage: React.FC = () => {

  const guides = [
    { title: 'Emergency Mode', desc: 'One-tap SOS, safe route, shelter finder', to: '/emergency', icon: AlertTriangle },
    { title: 'Live Map', desc: 'Real-time incidents, risk zones, shelters', to: '/map', icon: MapPin },
    { title: 'Report Incident', desc: 'Submit ground reports with AI verification', to: '/report-incident', icon: Phone },
    { title: 'AI Assistant', desc: 'Emergency guidance and safety directives', to: '/ai-assistant', icon: Bot },
    { title: 'Shelters', desc: 'Find nearest verified shelters', to: '/shelters', icon: Home },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white font-mono">Emergency Help & Safety Guide</h2>
        <p className="text-xs text-gray-400 mt-1">Quick access to Disaster X safety features.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.to}
              to={g.to}
              className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-xl p-4 shadow-lg transition space-y-2"
            >
              <Icon className="w-5 h-5 text-red-400" />
              <div className="text-sm font-bold text-white">{g.title}</div>
              <div className="text-xs text-gray-400">{g.desc}</div>
            </Link>
          );
        })}
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-2">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Emergency Contacts</h3>
        <div className="text-xs text-gray-300 space-y-1">
          <div>Police / Fire / Ambulance: <span className="font-bold text-white">112</span></div>
          <div>Ambulance: <span className="font-bold text-white">108</span></div>
          <div>NDRF: <span className="font-bold text-white">1078</span></div>
          <div>State Disaster Control: <span className="font-bold text-white">1070</span></div>
        </div>
      </div>
    </div>
  );
};
