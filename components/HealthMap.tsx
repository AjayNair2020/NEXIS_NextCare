
import React, { useEffect, useRef, useState } from 'react';
import { getFacilityDetails, analyzeIncidentLineage } from '../services/gemini';
import { HealthIncident } from '../types';
import { MOCK_INCIDENTS } from '../constants';

interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'logistics';
  lat: number;
  lng: number;
  status?: string;
}

const SAMPLE_FACILITIES: Facility[] = [
  { id: '1', name: 'UCSF Medical Center', type: 'hospital', lat: 37.7631, lng: -122.4578, status: 'High Volume' },
  { id: '2', name: 'Zuckerberg SF General', type: 'hospital', lat: 37.7558, lng: -122.4047, status: 'Active' },
  { id: '3', name: 'Walgreens Pharmacy', type: 'pharmacy', lat: 37.7712, lng: -122.4344, status: 'Open' },
  { id: '4', name: 'SFFD Ambulance Station 49', type: 'logistics', lat: 37.7511, lng: -122.3965, status: '3 units available' },
  { id: '5', name: 'Care Distribution Hub', type: 'logistics', lat: 37.7831, lng: -122.4182, status: 'Stock: Normal' },
];

const HealthMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const polylineLayer = useRef<any>(null);
  
  const [viewMode, setViewMode] = useState<'facilities' | 'incidents'>('facilities');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<HealthIncident | null>(null);
  
  const [infoContent, setInfoContent] = useState<string | null>(null);
  const [grounding, setGrounding] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // @ts-ignore
      mapInstance.current = L.map(mapContainer.current).setView([37.7749, -122.4194], 13);
      
      // @ts-ignore
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Add user location
      // @ts-ignore
      const userIcon = L.divIcon({
        className: 'patient-pulse-container',
        html: '<div class="patient-pulse"></div>',
        iconSize: [20, 20]
      });
      // @ts-ignore
      L.marker([37.7749, -122.4194], { icon: userIcon }).addTo(mapInstance.current).bindPopup('Your Location');
    }

    renderLayers();
  }, [viewMode]);

  const clearLayers = () => {
    if (mapInstance.current) {
      mapInstance.current.eachLayer((layer: any) => {
        if (layer.options && (layer.options.radius || layer.options.dashArray)) {
          mapInstance.current.removeLayer(layer);
        }
      });
    }
  };

  const renderLayers = () => {
    clearLayers();
    if (!mapInstance.current) return;

    if (viewMode === 'facilities') {
      SAMPLE_FACILITIES.forEach(f => {
        const color = f.type === 'hospital' ? '#10b981' : f.type === 'pharmacy' ? '#3b82f6' : '#f59e0b';
        // @ts-ignore
        const marker = L.circleMarker([f.lat, f.lng], {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapInstance.current);

        marker.on('click', () => {
          setSelectedFacility(f);
          setSelectedIncident(null);
          fetchFacilityInfo(f);
        });
      });
    } else {
      // Render Incidents and Lineage
      MOCK_INCIDENTS.forEach(inc => {
        const color = inc.severity === 'critical' ? '#be123c' : inc.severity === 'high' ? '#e11d48' : '#fb923c';
        // @ts-ignore
        const marker = L.circleMarker([inc.lat, inc.lng], {
          radius: 8 + (inc.cases / 20),
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
          className: 'incident-pulse'
        }).addTo(mapInstance.current);

        marker.on('click', () => {
          setSelectedIncident(inc);
          setSelectedFacility(null);
          fetchIncidentAnalysis(inc);
        });

        // Draw Lineage
        if (inc.originId) {
          const origin = MOCK_INCIDENTS.find(o => o.id === inc.originId);
          if (origin) {
            // @ts-ignore
            L.polyline([[origin.lat, origin.lng], [inc.lat, inc.lng]], {
              color: '#94a3b8',
              weight: 2,
              dashArray: '5, 10',
              opacity: 0.6
            }).addTo(mapInstance.current);
          }
        }
      });
    }
  };

  const fetchFacilityInfo = async (facility: Facility) => {
    setLoading(true);
    setInfoContent(null);
    setGrounding(null);
    const data = await getFacilityDetails(facility.name, { latitude: facility.lat, longitude: facility.lng });
    if (data) {
      setInfoContent(data.text);
      setGrounding(data.grounding);
    }
    setLoading(false);
  };

  const fetchIncidentAnalysis = async (incident: HealthIncident) => {
    setLoading(true);
    setInfoContent(null);
    setGrounding(null);
    
    // Build lineage chain
    const lineage = [];
    let current = incident;
    while (current.originId) {
      const parent = MOCK_INCIDENTS.find(p => p.id === current.originId);
      if (parent) {
        lineage.unshift(parent);
        current = parent;
      } else break;
    }

    const analysis = await analyzeIncidentLineage(incident, lineage);
    setInfoContent(analysis);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
      {/* View Switcher */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-100 max-w-md">
        <button 
          onClick={() => setViewMode('facilities')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${
            viewMode === 'facilities' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Medical Facilities
        </button>
        <button 
          onClick={() => setViewMode('incidents')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${
            viewMode === 'incidents' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Incident Spread
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Map Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-2 relative overflow-hidden">
          <div ref={mapContainer} className="w-full h-full" />
          
          <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-3 text-[10px] font-bold text-slate-600">
            <p className="uppercase tracking-widest text-slate-400 mb-1">Map Legend</p>
            {viewMode === 'facilities' ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Hospitals & Clinics
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> Pharmacies
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span> Logistics Hubs
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-700"></span> Critical Clusters
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span> Active Transmission
                </div>
                <div className="flex items-center gap-2 border-t border-slate-200 pt-2">
                  <span className="w-6 h-0 border-t-2 border-dashed border-slate-400"></span> Spread Lineage
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="w-96 flex flex-col gap-6 overflow-y-auto pr-2">
          {selectedFacility || selectedIncident ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 flex flex-col animate-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                  selectedFacility ? (
                    selectedFacility.type === 'hospital' ? 'bg-emerald-500' : 
                    selectedFacility.type === 'pharmacy' ? 'bg-blue-500' : 'bg-amber-500'
                  ) : 'bg-rose-500'
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={selectedFacility ? "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" : "M13 10V3L4 14h7v7l9-11h-7z"} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">
                    {selectedFacility ? selectedFacility.name : selectedIncident?.type}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedFacility ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedFacility ? selectedFacility.status : `Detected: ${selectedIncident?.detectedAt}`}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                {selectedIncident && (
                  <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-rose-700 uppercase">Impact Metrics</span>
                      <span className="text-xs font-bold text-rose-500 px-2 py-0.5 bg-white rounded-full">
                        {selectedIncident.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-rose-400 font-bold uppercase">Reported Cases</p>
                        <p className="text-xl font-bold text-rose-700">{selectedIncident.cases}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-rose-400 font-bold uppercase">Causal Factor</p>
                        <p className="text-xs font-bold text-rose-700">{selectedIncident.causalFactor}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {selectedFacility ? 'Facility Insights' : 'Epidemiological Analysis'}
                  </h4>
                  
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                    </div>
                  ) : infoContent ? (
                    <div className="prose prose-sm text-slate-600 leading-relaxed whitespace-pre-wrap text-xs">
                      {infoContent}
                      
                      {grounding && grounding.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-50">
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Verified Sources</h5>
                          <div className="flex flex-col gap-2">
                            {grounding.map((chunk, i) => (
                              chunk.maps && (
                                <a 
                                  key={i} 
                                  href={chunk.maps.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  {chunk.maps.title || 'View on Google Maps'}
                                </a>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Select a marker to see AI-powered local insights.</p>
                  )}
                </div>

                {selectedIncident && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Lineage Timeline</h4>
                    <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                      {MOCK_INCIDENTS.filter(i => i.id === selectedIncident.id || i.id === selectedIncident.originId).map((step, idx) => (
                        <div key={step.id} className="relative pl-6">
                          <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                            step.id === selectedIncident.id ? 'bg-rose-500 scale-125' : 'bg-slate-300'
                          }`}></div>
                          <p className="text-[10px] font-bold text-slate-400">{step.detectedAt}</p>
                          <p className="text-xs font-bold text-slate-700">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className={`w-full mt-6 py-3 rounded-xl font-bold transition-colors ${
                selectedFacility ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}>
                {selectedFacility ? 'Facility Actions' : 'Deploy Containment Team'}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                viewMode === 'facilities' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
              }`}>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={viewMode === 'facilities' ? "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" : "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"} />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {viewMode === 'facilities' ? 'Facility Inspector' : 'Spread Investigator'}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {viewMode === 'facilities' 
                  ? 'Click any medical marker to see logistics, AI insights, and verified location details.'
                  : 'Analyze the transmission path and root causes of localized health incidents.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthMap;
