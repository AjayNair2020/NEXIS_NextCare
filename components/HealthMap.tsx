
import React, { useEffect, useRef, useState } from 'react';
import { analyzeFullSystemLineage } from '../services/gemini';
import { HealthIncident, Appointment, Facility, PatientProfile, Doctor, TransportVehicle, ServiceArea, InventoryItem } from '../types';
import { MOCK_INCIDENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_FACILITIES, MOCK_PATIENTS, MOCK_TAXONOMY, MOCK_TRANSPORTS, MOCK_SERVICE_AREAS, MOCK_INVENTORY } from '../constants';

interface HealthMapProps {
  variant?: 'standard' | 'lineage' | 'dashboard' | 'operations' | 'optimizer' | 'journey';
  selectedAreaId?: string | null;
  activeAppointment?: Appointment | null;
}

type MapLayerType = 'base' | 'satellite' | 'land' | 'roads' | 'country' | 'cities';

interface MapLayerConfig {
  id: MapLayerType;
  label: string;
  url: string;
  attribution: string;
}

const MAP_LAYERS: MapLayerConfig[] = [
  { 
    id: 'base', 
    label: 'Standard View', 
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', 
    attribution: '&copy; CartoDB' 
  },
  { 
    id: 'satellite', 
    label: 'World Satellite', 
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
    attribution: 'Esri, DigitalGlobe, GeoEye' 
  },
  { 
    id: 'land', 
    label: 'Terrain & Land', 
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
    attribution: '&copy; OpenTopoMap' 
  },
  { 
    id: 'roads', 
    label: 'World Roads', 
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    attribution: '&copy; OSM' 
  },
  { 
    id: 'country', 
    label: 'Country/Political', 
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
    attribution: '&copy; CartoDB' 
  },
  { 
    id: 'cities', 
    label: 'Urban/Cities', 
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    attribution: '&copy; CartoDB' 
  },
];

const HealthMap: React.FC<HealthMapProps> = ({ variant = 'standard', selectedAreaId, activeAppointment }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const baseTileLayer = useRef<any>(null);
  
  const [viewMode, setViewMode] = useState<'standard' | 'lineage' | 'ops'>(variant === 'operations' ? 'ops' : 'standard');
  const [activeBaseLayer, setActiveBaseLayer] = useState<MapLayerType>('base');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [infoContent, setInfoContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGISBotOpen, setIsGISBotOpen] = useState(false);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // @ts-ignore
      mapInstance.current = L.map(mapContainer.current, {
        zoomControl: false,
        scrollWheelZoom: variant !== 'dashboard' && variant !== 'optimizer',
      }).setView([37.7749, -122.4194], variant === 'dashboard' ? 12 : 13);
      
      const config = MAP_LAYERS.find(l => l.id === activeBaseLayer) || MAP_LAYERS[0];
      // @ts-ignore
      baseTileLayer.current = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: 19
      }).addTo(mapInstance.current);
    }

    renderLayers();
    
    // Invalidate size when layout changes to fix gray box issues
    if (mapInstance.current) {
      setTimeout(() => mapInstance.current.invalidateSize(), 300);
    }
  }, [viewMode, variant, showTraffic, selectedAreaId, activeAppointment, isGISBotOpen, activeBaseLayer]);

  // Handle Base Layer Switch
  useEffect(() => {
    if (mapInstance.current && baseTileLayer.current) {
      const config = MAP_LAYERS.find(l => l.id === activeBaseLayer) || MAP_LAYERS[0];
      mapInstance.current.removeLayer(baseTileLayer.current);
      // @ts-ignore
      baseTileLayer.current = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: 19
      }).addTo(mapInstance.current);
      baseTileLayer.current.bringToBack();
    }
  }, [activeBaseLayer]);

  const clearLayers = () => {
    if (mapInstance.current) {
      mapInstance.current.eachLayer((layer: any) => {
        // Keep the tile layer, remove everything else
        if (!layer._url || layer !== baseTileLayer.current) {
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

    if (viewMode === 'standard' || variant === 'dashboard' || variant === 'operations') {
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

    // @ts-ignore
    L.circleMarker(patientPos, {
      radius: 8,
      fillColor: '#3b82f6',
      color: '#fff',
      weight: 3,
      opacity: 1,
      fillOpacity: 1
    }).addTo(mapInstance.current).bindPopup('<b>Your Location</b><br>' + app.patientLocation.address);

    // @ts-ignore
    L.circleMarker(doctorPos, {
      radius: 12,
      fillColor: '#10b981',
      color: '#fff',
      weight: 3,
      opacity: 1,
      fillOpacity: 1
    }).addTo(mapInstance.current).bindPopup(`<b>Destination: ${doctor.name}</b><br>${doctor.specialty}`);

    // @ts-ignore
    L.polyline([patientPos, doctorPos], {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.5,
      className: 'journey-path-line'
    }).addTo(mapInstance.current);

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

    // @ts-ignore
    mapInstance.current.fitBounds([patientPos, doctorPos], { padding: [50, 50] });
  };

  const drawSupplyChain = () => {
    const logHub = MOCK_FACILITIES.find(f => f.id === 'log-1');
    if (!logHub) return;

    MOCK_FACILITIES.forEach(f => {
      if (f.connectedHubId === 'log-1') {
        const inventoryAtHub = MOCK_INVENTORY.filter(inv => inv.locationId === 'log-1');
        const itemsList = inventoryAtHub.map(i => i.name).slice(0, 3).join(', ');
        const flowColor = f.type === 'hospital' ? '#3b82f6' : f.type === 'pharmacy' ? '#06b6d4' : '#f59e0b';
        
        // @ts-ignore
        const supplyLine = L.polyline([[logHub.lat, logHub.lng], [f.lat, f.lng]], {
          color: flowColor,
          weight: 4,
          opacity: 0.6,
          dashArray: '12, 12', 
          className: 'supply-flow'
        }).addTo(mapInstance.current);

        supplyLine.bindPopup(`
          <div class="p-3 bg-white rounded-xl shadow-lg border border-slate-100 min-w-[200px]">
            <div class="flex items-center gap-2 mb-2">
               <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Supply Vector</p>
            </div>
            <p class="text-xs font-bold text-slate-800 mb-2">${logHub.name} <span class="text-slate-400 mx-1">→</span> ${f.name}</p>
            <div class="pt-2 border-t border-slate-50">
               <p class="text-[9px] font-black text-emerald-600 uppercase tracking-tighter mb-1">Payload Priority Items:</p>
               <p class="text-[10px] text-slate-500 leading-relaxed italic">${itemsList}...</p>
            </div>
          </div>
        `, { className: 'custom-popup' });
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
    const isLogistics = f.id === 'log-1' || f.type === 'logistics';
    const color = isLogistics ? '#f59e0b' : (f.type === 'hospital' ? '#3b82f6' : f.type === 'pharmacy' ? '#06b6d4' : '#f59e0b');
    
    // @ts-ignore
    const marker = L.circleMarker([f.lat, f.lng], {
      radius: f.type === 'hospital' || isLogistics ? 12 : 8,
      fillColor: color,
      color: isLogistics ? '#000' : '#fff',
      weight: isLogistics ? 3 : 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(mapInstance.current);

    if ((variant === 'dashboard' || variant === 'operations') && f.status) {
      // @ts-ignore
      const labelIcon = L.divIcon({
        className: 'facility-label-container',
        html: `<div class="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-slate-100 text-[9px] font-bold text-slate-700 whitespace-nowrap">${f.name}</div>`,
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1-1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
              </svg>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    // @ts-ignore
    L.marker([v.lat, v.lng], { icon: vehicleIcon }).addTo(mapInstance.current).bindPopup(`<b>${v.plate}</b><br>${v.status}<br>${v.currentPayload || ''}`);
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'low': return { color: '#eab308', class: 'severity-low' };
      case 'medium': return { color: '#f97316', class: 'severity-medium' };
      case 'high': return { color: '#ef4444', class: 'severity-high' };
      case 'critical': return { color: '#991b1b', class: 'severity-critical' };
      default: return { color: '#e11d48', class: 'severity-medium' };
    }
  };

  const renderIncident = (inc: HealthIncident) => {
    const config = getSeverityConfig(inc.severity);
    // @ts-ignore
    const marker = L.circleMarker([inc.lat, inc.lng], {
      radius: 12 + (inc.cases / 12),
      fillColor: config.color,
      color: '#fff',
      weight: 3,
      opacity: 0.8,
      fillOpacity: 0.6,
      className: config.class
    }).addTo(mapInstance.current);

    if (variant === 'dashboard' || variant === 'standard') {
      // @ts-ignore
      const labelIcon = L.divIcon({
        className: 'incident-label-container',
        html: `<div class="bg-slate-900 px-2 py-0.5 rounded shadow-xl border border-white/20 text-[9px] font-bold text-white whitespace-nowrap flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: ${config.color}"></div>
                ${inc.cases} Cases
               </div>`,
        iconSize: [60, 20],
        iconAnchor: [30, -12]
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
    } else if (type === 'INCIDENT') {
       const taxonomy = MOCK_TAXONOMY.find(t => t.id === node.taxonomyId);
       if (taxonomy) related.push(taxonomy);
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
    const q = searchQuery.toLowerCase().trim();
    if (!q) return;

    const foundFacility = MOCK_FACILITIES.find(f => 
      f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q)
    );
    const foundIncident = MOCK_INCIDENTS.find(i => 
      i.type.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    );
    const target = foundFacility || foundIncident;

    if (target && mapInstance.current) {
      mapInstance.current.setView([target.lat, target.lng], 15);
      if ('name' in target) {
        handleNodeClick(target, 'FACILITY');
      } else {
        handleNodeClick(target, 'INCIDENT');
      }
      setSearchQuery('');
    } else {
      alert(`NEXIS: No location matches for "${searchQuery}" in current sector.`);
    }
  };

  return (
    <div className={`flex ${variant === 'dashboard' || variant === 'optimizer' || variant === 'journey' ? 'h-full w-full' : 'h-[calc(100vh-140px)] gap-6'} animate-in fade-in duration-500`}>
      <div className="flex-1 flex flex-col gap-4 min-w-0 h-full relative overflow-hidden">
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
        
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          {/* Top Map Area */}
          <div className={`relative flex-1 ${isGISBotOpen ? 'h-1/2' : 'h-full'} transition-all duration-500 ease-in-out`}>
            <div ref={mapContainer} className="w-full h-full" />
            
            <div className="absolute right-6 top-6 z-[1000] flex flex-col items-end gap-3">
               {/* Map Layer Intelligence Menu */}
               <div className="relative">
                  <button 
                    onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
                    className={`bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border transition-all duration-300 ${isLayerMenuOpen ? 'border-blue-500 text-blue-600 ring-2 ring-blue-500/20' : 'border-slate-100 text-slate-600 hover:text-blue-500'}`}
                    title="Layer Intelligence"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10" /></svg>
                  </button>

                  {isLayerMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden p-2 z-[1010] animate-in slide-in-from-top-2 duration-300">
                      <div className="px-4 py-3 border-b border-slate-50 mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Mapping Protocol</p>
                      </div>
                      <div className="space-y-1">
                        {MAP_LAYERS.map(layer => (
                          <button
                            key={layer.id}
                            onClick={() => { setActiveBaseLayer(layer.id); setIsLayerMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeBaseLayer === layer.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            <span className="text-[11px] font-black uppercase tracking-widest">{layer.label}</span>
                            <div className={`w-2 h-2 rounded-full ${activeBaseLayer === layer.id ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-200'}`}></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
               </div>

               <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden">
                  <button onClick={() => handleZoom(1)} className="p-3 hover:bg-slate-50 text-slate-600 transition-colors border-b border-slate-100" title="Zoom In">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  </button>
                  <button onClick={() => handleZoom(-1)} className="p-3 hover:bg-slate-50 text-slate-600 transition-colors" title="Zoom Out">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                  </button>
               </div>
               
               {/* GIS Bot Tool Button */}
               <button 
                  onClick={() => setIsGISBotOpen(!isGISBotOpen)}
                  className={`bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border transition-all duration-300 ${isGISBotOpen ? 'border-amber-500 text-amber-600 ring-2 ring-amber-500/20' : 'border-slate-100 text-slate-600 hover:text-amber-500'}`}
                  title="Toggle GIS Intelligence Engine"
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    <circle cx="12" cy="12" r="3" strokeWidth={2} />
                  </svg>
               </button>

               {variant !== 'optimizer' && variant !== 'journey' && (
                 <>
                  <button 
                  onClick={handleLocateMe}
                  className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Center on My Location"
                  >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>

                  <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full transition-all ${showTraffic ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Traffic</span>
                      <button 
                      onClick={() => setShowTraffic(!showTraffic)}
                      className={`w-9 h-5 rounded-full relative transition-colors ${showTraffic ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showTraffic ? 'translate-x-5' : 'translate-x-1'}`}></div>
                      </button>
                  </div>
                 </>
               )}
            </div>

            {(viewMode === 'standard' || variant === 'dashboard') && (
              <div className="absolute bottom-6 left-6 z-[1000]">
                 <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 min-w-[160px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Health Severity Gradient</p>
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-red-900 severity-critical"></div>
                          <span className="text-[10px] font-bold text-slate-700">Level 4: Critical Outbreak</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-red-500 severity-high"></div>
                          <span className="text-[10px] font-bold text-slate-700">Level 3: High Transmission</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-orange-500 severity-medium"></div>
                          <span className="text-[10px] font-bold text-slate-700">Level 2: Moderate Risk</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 severity-low"></div>
                          <span className="text-[10px] font-bold text-slate-700">Level 1: Clinical Observation</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {variant !== 'optimizer' && variant !== 'journey' && (
              <form onSubmit={handleSearch} className="absolute left-6 top-6 z-[1000] w-72">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 flex items-center px-4 py-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Locate Facility, Incident, or Node..." 
                      className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium w-full ml-2"
                    />
                </div>
              </form>
            )}
          </div>

          {/* Bottom GIS Analysis Bot Panel */}
          <div 
            className={`w-full bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out ${isGISBotOpen ? 'h-1/2' : 'h-0'}`}
          >
            {isGISBotOpen && (
              <div className="flex flex-col h-full animate-in slide-in-from-bottom duration-500">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#FFF9F2]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tighter text-slate-800">GIS Intelligence Stream</h3>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Biometric Spatial Sync • External Pipeline: geobots.xyz</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">Live Telemetry Active</span>
                    <button 
                      onClick={() => setIsGISBotOpen(false)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-200/50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-[#F8FAFC] relative overflow-hidden">
                  <iframe 
                    src="https://geobots.xyz/" 
                    className="w-full h-full border-none"
                    title="GIS Analysis Bot"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {variant !== 'dashboard' && variant !== 'operations' && variant !== 'optimizer' && variant !== 'journey' && (
        <div className="w-96 flex flex-col gap-4">
          {selectedNode ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 flex flex-col min-h-0 overflow-y-auto animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg ${
                  selectedNode.nodeType === 'FACILITY' ? 'bg-blue-500' : (selectedNode.severity === 'critical' ? 'bg-red-900' : 'bg-rose-500')
                }`}>
                  {selectedNode.name?.charAt(0) || selectedNode.type?.charAt(0) || 'L'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">
                    {selectedNode.name || selectedNode.type}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Node: {selectedNode.nodeType} {selectedNode.severity ? `(${selectedNode.severity.toUpperCase()})` : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Node Properties</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                     <div>
                        <p className="text-slate-400">System ID</p>
                        <p className="font-bold text-slate-700">{selectedNode.id}</p>
                     </div>
                     <div>
                        <p className="text-slate-400">Sync Status</p>
                        <p className={`font-bold ${selectedNode.severity === 'critical' ? 'text-red-600' : 'text-blue-600'}`}>
                          {selectedNode.status || 'Verified'}
                        </p>
                     </div>
                     {selectedNode.cases && (
                       <div className="col-span-2 pt-2 border-t border-slate-200 mt-2">
                          <p className="text-slate-400">Total Recorded Load</p>
                          <p className="text-lg font-black text-slate-800">{selectedNode.cases} Active Cases</p>
                       </div>
                     )}
                     {selectedNode.causalFactor && (
                       <div className="col-span-2 pt-2 border-t border-slate-200 mt-2">
                          <p className="text-slate-400">Causal Identity</p>
                          <p className="text-xs font-black text-rose-600 uppercase tracking-tight">{selectedNode.causalFactor}</p>
                       </div>
                     )}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full animate-pulse ${selectedNode.nodeType === 'INCIDENT' ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                     AI Lineage Insights
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
              <h3 className="text-lg font-bold text-slate-800 mb-2">Spatial Inspector</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Select any map entity to visualize clinical lineage and real-time operational metrics.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthMap;
