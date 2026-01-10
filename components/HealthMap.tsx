import React, { useEffect, useRef, useState } from 'react';
import { getFacilityDetails, analyzeFullSystemLineage } from '../services/gemini';
import { HealthIncident, Appointment, Facility, PatientProfile, Doctor, TransportVehicle } from '../types';
import { MOCK_INCIDENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_FACILITIES, MOCK_PATIENTS, MOCK_TAXONOMY, MOCK_TRANSPORTS } from '../constants';

interface HealthMapProps {
  variant?: 'standard' | 'lineage' | 'dashboard' | 'operations';
}

const HealthMap: React.FC<HealthMapProps> = ({ variant = 'standard' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  
  const [viewMode, setViewMode] = useState<'standard' | 'lineage' | 'ops'>(variant === 'operations' ? 'ops' : 'standard');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [infoContent, setInfoContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // @ts-ignore
      mapInstance.current = L.map(mapContainer.current, {
        zoomControl: variant !== 'dashboard',
        scrollWheelZoom: variant !== 'dashboard',
      }).setView([37.7749, -122.4194], variant === 'dashboard' ? 12 : 13);
      
      // @ts-ignore
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    renderLayers();
  }, [viewMode, variant]);

  const clearLayers = () => {
    if (mapInstance.current) {
      mapInstance.current.eachLayer((layer: any) => {
        if (!layer._url) {
          mapInstance.current.removeLayer(layer);
        }
      });
    }
  };

  const renderLayers = () => {
    clearLayers();
    if (!mapInstance.current) return;

    if (viewMode === 'standard' || variant === 'dashboard') {
      MOCK_FACILITIES.forEach(f => renderFacility(f));
      MOCK_INCIDENTS.forEach(inc => renderIncident(inc));
    }
    
    if (viewMode === 'ops' || variant === 'operations') {
      MOCK_FACILITIES.forEach(f => renderFacility(f));
      MOCK_TRANSPORTS.forEach(v => renderTransport(v));
    }

    if (viewMode === 'lineage' && variant !== 'dashboard') {
      MOCK_FACILITIES.forEach(f => renderFacility(f));
      MOCK_PATIENTS.forEach(p => renderPatient(p));
      drawConnections();
    }
  };

  const renderFacility = (f: Facility) => {
    const color = f.type === 'hospital' ? '#10b981' : f.type === 'pharmacy' ? '#3b82f6' : '#f59e0b';
    // @ts-ignore
    const marker = L.circleMarker([f.lat, f.lng], {
      radius: f.type === 'hospital' ? 12 : 8,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(mapInstance.current);

    if ((variant === 'dashboard' || variant === 'operations') && f.status) {
      // @ts-ignore
      const labelIcon = L.divIcon({
        className: 'facility-label-container',
        html: `<div class="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-slate-100 text-[9px] font-bold text-slate-700 whitespace-nowrap">${f.status} ${f.storageLevel ? `(${f.storageLevel}%)` : ''}</div>`,
        iconSize: [80, 20],
        iconAnchor: [40, -15]
      });
      // @ts-ignore
      L.marker([f.lat, f.lng], { icon: labelIcon }).addTo(mapInstance.current);
    }

    marker.on('click', () => variant !== 'dashboard' && handleNodeClick(f, 'FACILITY'));
  };

  const renderTransport = (v: TransportVehicle) => {
    const color = v.status === 'en-route' ? '#3b82f6' : v.status === 'available' ? '#10b981' : '#cbd5e1';
    // @ts-ignore
    const vehicleIcon = L.divIcon({
      className: 'transport-marker',
      html: `<div class="w-6 h-6 flex items-center justify-center rounded-lg shadow-md border-2 border-white" style="background-color: ${color}">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    // @ts-ignore
    L.marker([v.lat, v.lng], { icon: vehicleIcon }).addTo(mapInstance.current).bindPopup(`<b>${v.plate}</b><br>${v.status}<br>${v.currentPayload || ''}`);
  };

  const renderIncident = (inc: HealthIncident) => {
    const color = inc.severity === 'critical' ? '#be123c' : '#e11d48';
    // @ts-ignore
    const marker = L.circleMarker([inc.lat, inc.lng], {
      radius: 10 + (inc.cases / 15),
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 0.6,
      fillOpacity: 0.4,
      className: 'incident-pulse'
    }).addTo(mapInstance.current);

    if (variant === 'dashboard') {
      // @ts-ignore
      const labelIcon = L.divIcon({
        className: 'incident-label-container',
        html: `<div class="bg-rose-500 px-2 py-0.5 rounded shadow-sm border border-white text-[9px] font-bold text-white whitespace-nowrap">${inc.cases} cases</div>`,
        iconSize: [50, 20],
        iconAnchor: [25, -10]
      });
      // @ts-ignore
      L.marker([inc.lat, inc.lng], { icon: labelIcon }).addTo(mapInstance.current);
    }

    marker.on('click', () => variant !== 'dashboard' && handleNodeClick(inc, 'INCIDENT'));
  };

  const renderPatient = (p: PatientProfile) => {
    // @ts-ignore
    const userIcon = L.divIcon({
      className: 'patient-node-container',
      html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm ring-4 ring-blue-500/10"></div>`,
      iconSize: [16, 16]
    });
    // @ts-ignore
    const marker = L.marker([p.lat, p.lng], { icon: userIcon }).addTo(mapInstance.current);
    marker.on('click', () => handleNodeClick(p, 'PATIENT'));
  };

  const drawConnections = () => {
    MOCK_FACILITIES.forEach(f => {
      if (f.connectedHubId) {
        const hub = MOCK_FACILITIES.find(h => h.id === f.connectedHubId);
        if (hub) drawLine([hub.lat, hub.lng], [f.lat, f.lng], '#f59e0b', '5, 5', 'supply-flow');
      }
    });

    MOCK_PATIENTS.forEach(p => {
      if (p.assignedDoctorId) {
        const doctor = MOCK_DOCTORS.find(d => d.id === p.assignedDoctorId);
        if (doctor) {
          const fac = MOCK_FACILITIES.find(f => f.id === doctor.facilityId);
          if (fac) drawLine([p.lat, p.lng], [fac.lat, fac.lng], '#10b981', 'none', 'care-flow');
        }
      }
      if (p.incidentId) {
        const inc = MOCK_INCIDENTS.find(i => i.id === p.incidentId);
        if (inc) drawLine([inc.lat, inc.lng], [p.lat, p.lng], '#e11d48', '2, 4', 'epidemic-link');
      }
    });
  };

  const drawLine = (from: [number, number], to: [number, number], color: string, dash: string, className: string) => {
    // @ts-ignore
    L.polyline([from, to], {
      color: color,
      weight: 2,
      opacity: 0.5,
      dashArray: dash,
      className: className
    }).addTo(mapInstance.current);
  };

  const handleNodeClick = async (node: any, type: string) => {
    setSelectedNode({ ...node, nodeType: type });
    setLoading(true);
    setInfoContent(null);
    
    const related = [];
    if (type === 'FACILITY') {
      const doctors = MOCK_DOCTORS.filter(d => d.facilityId === node.id);
      related.push(...doctors);
    }

    const analysis = await analyzeFullSystemLineage(node, related);
    setInfoContent(analysis);
    setLoading(false);
  };

  return (
    <div className={`flex ${variant === 'dashboard' ? 'h-full w-full' : 'h-[calc(100vh-140px)] gap-6'} animate-in fade-in duration-500`}>
      <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
        {variant !== 'dashboard' && variant !== 'operations' && (
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex gap-2 w-max">
            <button 
              onClick={() => setViewMode('standard')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'standard' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Tactical View
            </button>
            <button 
              onClick={() => setViewMode('lineage')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'lineage' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              System Lineage
            </button>
          </div>
        )}
        
        <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden ${variant === 'dashboard' ? 'p-0 border-none rounded-none' : 'p-2'}`}>
          <div ref={mapContainer} className="w-full h-full" />
          
          {variant === 'dashboard' && (
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-emerald-100 flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Network Status</p>
                  <p className="text-sm font-bold text-slate-800">94% Optimal</p>
                </div>
              </div>
            </div>
          )}

          {variant === 'operations' && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-3 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-blue-100 flex items-center gap-3">
                   <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Fleet</p>
                      <p className="text-sm font-bold text-slate-800">2 In-Motion</p>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>

      {variant !== 'dashboard' && variant !== 'operations' && (
        <div className="w-96 flex flex-col gap-4">
          {selectedNode ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 flex flex-col min-h-0 overflow-y-auto animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg ${
                  selectedNode.nodeType === 'FACILITY' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  {selectedNode.name?.charAt(0) || 'L'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">
                    {selectedNode.name || selectedNode.type}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Node: {selectedNode.nodeType}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Properties</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                     <div>
                        <p className="text-slate-400">ID</p>
                        <p className="font-bold text-slate-700">{selectedNode.id}</p>
                     </div>
                     <div>
                        <p className="text-slate-400">Status</p>
                        <p className="font-bold text-emerald-600">{selectedNode.status || 'Verified'}</p>
                     </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                     AI System Analysis
                  </h4>
                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                    </div>
                  ) : infoContent ? (
                    <div className="prose prose-sm text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">
                      {infoContent}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                 </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Lineage Inspector</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Select a node to inspect operational details.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthMap;