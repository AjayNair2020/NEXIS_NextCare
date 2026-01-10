import React, { useEffect, useRef, useState } from 'react';
import { getFacilityDetails, analyzeFullSystemLineage } from '../services/gemini';
import { HealthIncident, Appointment, Facility, PatientProfile, Doctor, TransportVehicle, ServiceArea, InventoryItem } from '../types';
import { MOCK_INCIDENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_FACILITIES, MOCK_PATIENTS, MOCK_TAXONOMY, MOCK_TRANSPORTS, MOCK_SERVICE_AREAS, MOCK_INVENTORY } from '../constants';

interface HealthMapProps {
  variant?: 'standard' | 'lineage' | 'dashboard' | 'operations' | 'optimizer' | 'journey';
  selectedAreaId?: string | null;
  activeAppointment?: Appointment | null;
}

const HealthMap: React.FC<HealthMapProps> = ({ variant = 'standard', selectedAreaId, activeAppointment }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  
  const [viewMode, setViewMode] = useState<'standard' | 'lineage' | 'ops'>(variant === 'operations' ? 'ops' : 'standard');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [infoContent, setInfoContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // @ts-ignore
      mapInstance.current = L.map(mapContainer.current, {
        zoomControl: false,
        scrollWheelZoom: variant !== 'dashboard' && variant !== 'optimizer',
      }).setView([37.7749, -122.4194], variant === 'dashboard' ? 12 : 13);
      
      // @ts-ignore
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    renderLayers();
  }, [viewMode, variant, showTraffic, selectedAreaId, activeAppointment]);

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

    if (variant === 'journey' && activeAppointment) {
      renderPatientJourney(activeAppointment);
      return;
    }

    if (variant === 'optimizer') {
      MOCK_SERVICE_AREAS.forEach(area => renderServiceArea(area));
      MOCK_FACILITIES.filter(f => f.type === 'hospital').forEach(f => renderFacility(f));
      return;
    }

    if (showTraffic) {
      renderTrafficLayer();
    }

    if (viewMode === 'standard' || variant === 'dashboard') {
      MOCK_FACILITIES.forEach(f => renderFacility(f));
      MOCK_INCIDENTS.forEach(inc => renderIncident(inc));
      drawSupplyChain();
    }
    
    if (viewMode === 'ops' || variant === 'operations') {
      MOCK_FACILITIES.forEach(f => renderFacility(f));
      MOCK_TRANSPORTS.forEach(v => renderTransport(v));
      drawSupplyChain();
    }

    if (viewMode === 'lineage' && variant !== 'dashboard') {
      MOCK_FACILITIES.forEach(f => renderFacility(f));
      MOCK_PATIENTS.forEach(p => renderPatient(p));
      drawConnections();
      drawSupplyChain();
    }
  };

  const renderPatientJourney = (app: Appointment) => {
    const doctor = MOCK_DOCTORS.find(d => d.id === app.doctorId);
    if (!app.patientLocation || !doctor) return;

    const patientPos: [number, number] = [app.patientLocation.lat, app.patientLocation.lng];
    const doctorPos: [number, number] = [doctor.location.lat, doctor.location.lng];

    // Patient Marker
    // @ts-ignore
    L.circleMarker(patientPos, {
      radius: 8,
      fillColor: '#3b82f6',
      color: '#fff',
      weight: 3,
      opacity: 1,
      fillOpacity: 1
    }).addTo(mapInstance.current).bindPopup('<b>Your Location</b><br>' + app.patientLocation.address);

    // Doctor/Facility Marker
    // @ts-ignore
    L.circleMarker(doctorPos, {
      radius: 12,
      fillColor: '#10b981',
      color: '#fff',
      weight: 3,
      opacity: 1,
      fillOpacity: 1
    }).addTo(mapInstance.current).bindPopup(`<b>Destination: ${doctor.name}</b><br>${doctor.specialty}`);

    // Journey Path (Animated Gradient-like effect)
    // @ts-ignore
    const path = L.polyline([patientPos, doctorPos], {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.5,
      className: 'journey-path-line'
    }).addTo(mapInstance.current);

    // Outcome Vector Visualization (Spatial "Health Gain" radius at destination)
    if (app.outcomeMetrics) {
      // @ts-ignore
      L.circle(doctorPos, {
        radius: 300,
        color: '#10b981',
        weight: 1,
        opacity: 0.4,
        fillColor: '#10b981',
        fillOpacity: 0.2,
        className: 'health-vector-pulse'
      }).addTo(mapInstance.current).bindPopup(`
        <div class="p-2">
          <p class="text-[10px] font-black uppercase text-emerald-600 mb-1">Predicted Outcome Vector</p>
          <p class="text-xs font-bold text-slate-800">Health Gain: ${app.outcomeMetrics.healthGainScore}%</p>
          <p class="text-[9px] text-slate-500 mt-1">${app.outcomeMetrics.predictedRecoveryBoost}</p>
        </div>
      `);
    }

    // Zoom to fit both
    // @ts-ignore
    mapInstance.current.fitBounds([patientPos, doctorPos], { padding: [50, 50] });
  };

  const drawSupplyChain = () => {
    const logHub = MOCK_FACILITIES.find(f => f.id === 'log-1');
    if (!logHub) return;

    MOCK_FACILITIES.forEach(f => {
      if (f.connectedHubId === 'log-1') {
        const inventoryAtHub = MOCK_INVENTORY.filter(inv => inv.locationId === 'log-1');
        const itemsList = inventoryAtHub.map(i => i.name).slice(0, 2).join(', ');
        
        // @ts-ignore
        const supplyLine = L.polyline([[logHub.lat, logHub.lng], [f.lat, f.lng]], {
          color: '#f59e0b',
          weight: 3,
          opacity: 0.6,
          dashArray: '5, 10',
          className: 'supply-flow'
        }).addTo(mapInstance.current);

        supplyLine.bindPopup(`
          <div class="p-2">
            <p class="text-[10px] font-black uppercase text-amber-600 mb-1">Critical Supply Flow</p>
            <p class="text-xs font-bold text-slate-800">Route: ${logHub.name} → ${f.name}</p>
            <p class="text-[9px] text-slate-500 mt-1">Transmitting: ${itemsList}...</p>
          </div>
        `);
      }
    });
  };

  const renderServiceArea = (area: ServiceArea) => {
    const isSelected = selectedAreaId === area.id;
    const color = area.efficiencyScore >= 90 ? '#10b981' : area.efficiencyScore >= 75 ? '#f59e0b' : '#ef4444';
    
    // @ts-ignore
    const circle = L.circle([area.lat, area.lng], {
      radius: area.radius,
      color: color,
      weight: isSelected ? 3 : 1,
      opacity: isSelected ? 1 : 0.6,
      fillColor: color,
      fillOpacity: isSelected ? 0.3 : 0.15,
      className: isSelected ? 'area-highlight' : ''
    }).addTo(mapInstance.current).bindPopup(`<b>${area.name}</b><br>Efficiency: ${area.efficiencyScore}%`);

    if (isSelected) {
      mapInstance.current.panTo([area.lat, area.lng]);
    }
  };

  const renderTrafficLayer = () => {
    const routes = [
      { path: [[37.783, -122.418], [37.763, -122.457]], color: '#10b981', label: 'Optimal Flow' },
      { path: [[37.755, -122.404], [37.771, -122.434]], color: '#f59e0b', label: 'Moderate' },
      { path: [[37.774, -122.419], [37.755, -122.404]], color: '#ef4444', label: 'Congested' },
      { path: [[37.783, -122.418], [37.741, -122.396]], color: '#f59e0b', label: 'Moderate' }, 
    ];

    routes.forEach(route => {
      // @ts-ignore
      L.polyline(route.path, {
        color: route.color,
        weight: 6,
        opacity: 0.6,
        lineCap: 'round',
        className: 'traffic-path'
      }).addTo(mapInstance.current).bindPopup(`<b>Dispatch Traffic:</b> ${route.label}`);
    });
  };

  const renderFacility = (f: Facility) => {
    const isLogistics = f.id === 'log-1';
    const color = isLogistics ? '#f59e0b' : (f.type === 'hospital' ? '#3b82f6' : f.type === 'pharmacy' ? '#06b6d4' : '#f59e0b');
    // @ts-ignore
    const marker = L.circleMarker([f.lat, f.lng], {
      radius: f.type === 'hospital' ? 12 : 8,
      fillColor: color,
      color: isLogistics ? '#fff' : '#fff',
      weight: isLogistics ? 4 : 2,
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

    marker.on('click', () => variant !== 'dashboard' && variant !== 'optimizer' && variant !== 'journey' && handleNodeClick(f, 'FACILITY'));
  };

  const renderTransport = (v: TransportVehicle) => {
    const color = v.status === 'en-route' ? '#3b82f6' : v.status === 'available' ? '#10b981' : '#cbd5e1';
    // @ts-ignore
    const vehicleIcon = L.divIcon({
      className: 'transport-marker',
      html: `<div class="w-6 h-6 flex items-center justify-center rounded-lg shadow-md border-2 border-white" style="background-color: ${color}">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1-1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
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

    marker.on('click', () => variant !== 'dashboard' && variant !== 'optimizer' && variant !== 'journey' && handleNodeClick(inc, 'INCIDENT'));
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
      if (f.connectedHubId && f.connectedHubId !== 'log-1') {
        const hub = MOCK_FACILITIES.find(h => h.id === f.connectedHubId);
        if (hub) drawLine([hub.lat, hub.lng], [f.lat, f.lng], '#94a3b8', '5, 5', 'standard-flow');
      }
    });

    MOCK_PATIENTS.forEach(p => {
      if (p.assignedDoctorId) {
        const doctor = MOCK_DOCTORS.find(d => d.id === p.assignedDoctorId);
        if (doctor) {
          const fac = MOCK_FACILITIES.find(f => f.id === doctor.facilityId);
          if (fac) drawLine([p.lat, p.lng], [fac.lat, fac.lng], '#3b82f6', 'none', 'care-flow');
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

  const handleZoom = (delta: number) => {
    if (!mapInstance.current) return;
    const currentZoom = mapInstance.current.getZoom();
    mapInstance.current.setZoom(currentZoom + delta);
  };

  const handleLocateMe = () => {
    if (!mapInstance.current) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      mapInstance.current.setView([latitude, longitude], 15);
      // @ts-ignore
      L.marker([latitude, longitude]).addTo(mapInstance.current).bindPopup('You are here').openPopup();
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const found = MOCK_FACILITIES.find(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found && mapInstance.current) {
      mapInstance.current.setView([found.lat, found.lng], 15);
    }
  };

  return (
    <div className={`flex ${variant === 'dashboard' || variant === 'optimizer' || variant === 'journey' ? 'h-full w-full' : 'h-[calc(100vh-140px)] gap-6'} animate-in fade-in duration-500`}>
      <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
        {variant !== 'dashboard' && variant !== 'operations' && variant !== 'optimizer' && variant !== 'journey' && (
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex gap-2 w-max">
            <button 
              onClick={() => setViewMode('standard')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'standard' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Tactical View
            </button>
            <button 
              onClick={() => setViewMode('lineage')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'lineage' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              System Lineage
            </button>
          </div>
        )}
        
        <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden ${variant === 'dashboard' || variant === 'optimizer' || variant === 'journey' ? 'p-0 border-none rounded-none' : 'p-2'}`}>
          <div ref={mapContainer} className="w-full h-full" />
          
          <div className="absolute left-6 top-6 z-[1000] flex flex-col gap-3">
             <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden">
                <button onClick={() => handleZoom(1)} className="p-3 hover:bg-slate-50 text-slate-600 transition-colors border-b border-slate-100">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </button>
                <button onClick={() => handleZoom(-1)} className="p-3 hover:bg-slate-50 text-slate-600 transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                </button>
             </div>
             
             {variant !== 'optimizer' && variant !== 'journey' && (
               <>
                <button 
                onClick={handleLocateMe}
                className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>

                <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full transition-all ${showTraffic ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Traffic</span>
                    <button 
                    onClick={() => setShowTraffic(!showTraffic)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${showTraffic ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${showTraffic ? 'left-4.5' : 'left-0.5'}`}></div>
                    </button>
                </div>
               </>
             )}
          </div>

          {variant !== 'optimizer' && variant !== 'journey' && (
            <form onSubmit={handleSearch} className="absolute right-6 top-6 z-[1000] w-64">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 flex items-center px-4 py-1">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Locate Facility..." 
                    className="bg-transparent border-none focus:ring-0 text-xs text-slate-600 placeholder:text-slate-400 w-full ml-2"
                  />
              </div>
            </form>
          )}

          {variant === 'journey' && (
            <div className="absolute top-6 right-6 z-[1000]">
               <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Journey Status</p>
                  <p className="text-sm font-bold text-blue-600">Route Optimized</p>
               </div>
            </div>
          )}
          
          {variant === 'dashboard' && (
            <div className="absolute top-16 right-4 z-[1000] flex flex-col gap-2 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-emerald-100 flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Network Status</p>
                  <p className="text-sm font-bold text-slate-800">94% Optimal</p>
                </div>
              </div>
            </div>
          )}

          {variant === 'optimizer' && (
            <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
              <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Efficiency Legend</p>
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-bold text-slate-600">Optimal (90%+)</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-[10px] font-bold text-slate-600">Stable (75-89%)</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span className="text-[10px] font-bold text-slate-600">At Risk (&lt;75%)</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {variant !== 'dashboard' && variant !== 'operations' && variant !== 'optimizer' && variant !== 'journey' && (
        <div className="w-96 flex flex-col gap-4">
          {selectedNode ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 flex flex-col min-h-0 overflow-y-auto animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg ${
                  selectedNode.nodeType === 'FACILITY' ? 'bg-blue-500' : 'bg-rose-500'
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
                        <p className="font-bold text-blue-600">{selectedNode.status || 'Verified'}</p>
                     </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
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