
import React, { useState } from 'react';
import { MOCK_TAXONOMY, MOCK_INCIDENTS } from '../constants';
import { TaxonomyNode, HealthIncident } from '../types';
import { getTaxonomyConceptExplanation, generateMedicalIllustration, TaxonomyInsight } from '../services/gemini';

const TaxonomyExplorer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);
  const [insight, setInsight] = useState<TaxonomyInsight | null>(null);
  const [illustrationUrl, setIllustrationUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['tax-1']));

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedNodes(newExpanded);
  };

  const handleNodeClick = async (node: TaxonomyNode) => {
    setSelectedNode(node);
    setLoading(true);
    setLoadingImage(true);
    setInsight(null);
    setIllustrationUrl(null);

    // Fetch text explanation and image illustration concurrently
    const textPromise = getTaxonomyConceptExplanation(node.name);
    const imagePromise = generateMedicalIllustration(`Anatomy diagram or clinical illustration of ${node.name}`);

    const [data, imageUrl] = await Promise.all([textPromise, imagePromise]);
    
    setInsight(data);
    setIllustrationUrl(imageUrl);
    setLoading(false);
    setLoadingImage(false);
  };

  const getRelatedIncidents = (taxonomyId: string): HealthIncident[] => {
    return MOCK_INCIDENTS.filter(inc => inc.taxonomyId === taxonomyId);
  };

  const renderTree = (nodes: TaxonomyNode[], level: number = 0) => {
    return (
      <ul className={`${level > 0 ? 'ml-6 border-l border-slate-100 pl-4 mt-2' : ''} space-y-2`}>
        {nodes.map(node => (
          <li key={node.id}>
            <div className="flex items-center gap-2 group">
              {node.children && node.children.length > 0 && (
                <button 
                  onClick={() => toggleExpand(node.id)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 group-hover:text-slate-600 transition-colors"
                >
                  <svg className={`w-3 h-3 transform transition-transform ${expandedNodes.has(node.id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              <button 
                onClick={() => handleNodeClick(node)}
                className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedNode?.id === node.id 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{node.name}</span>
                  {getRelatedIncidents(node.id).length > 0 && (
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {getRelatedIncidents(node.id).length} Active
                    </span>
                  )}
                </div>
              </button>
            </div>
            {node.children && expandedNodes.has(node.id) && renderTree(node.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-8 animate-in fade-in duration-500">
      <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col min-h-0">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Taxonomy Explorer
          </h3>
          <p className="text-xs text-slate-400 mt-1">Medical Knowledge Hierarchy</p>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {renderTree(MOCK_TAXONOMY)}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        {selectedNode ? (
          <div className="max-w-4xl animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-50">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl transition-all transform hover:scale-105 ${
                selectedNode.category === 'infectious' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-100' : 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-100'
              }`}>
                {selectedNode.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{selectedNode.name}</h2>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    selectedNode.category === 'infectious' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedNode.category}
                  </span>
                </div>
                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">{selectedNode.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <div className="xl:col-span-2 space-y-10">
                {/* Visual Anatomy/Illustration Section */}
                <section>
                   <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Clinical Visualization
                    </h4>
                  </div>
                  
                  {loadingImage ? (
                    <div className="aspect-video bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center gap-4 animate-pulse">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                           <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Scanning Anatomy...</span>
                    </div>
                  ) : illustrationUrl ? (
                    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl transition-all hover:shadow-2xl">
                      <img src={illustrationUrl} alt={`${selectedNode.name} illustration`} className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Simplified Anatomical Diagram</span>
                            <span className="text-[8px] font-bold text-slate-300 uppercase px-2 py-0.5 border border-slate-500 rounded backdrop-blur-sm">Gemini AI Imagery</span>
                         </div>
                      </div>
                    </div>
                  ) : null}
                </section>

                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      AI Medical Insights
                    </h4>
                    {insight && (
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase tracking-widest">
                        Clinical Confidence 94%
                      </span>
                    )}
                  </div>

                  <div className={`transition-all duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                    {loading ? (
                      <div className="space-y-6">
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                          <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                          <div className="h-4 bg-slate-200 rounded w-11/12 animate-pulse"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse"></div>)}
                        </div>
                      </div>
                    ) : insight ? (
                      <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm leading-relaxed">
                          <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Definition & Significance</h5>
                          <p className="text-slate-700 text-sm md:text-base leading-7 font-medium mb-4">{insight.definition}</p>
                          <p className="text-slate-500 text-sm italic">{insight.clinicalSignificance}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Clinical Presentation
                              </h5>
                              <ul className="space-y-2">
                                {insight.symptoms.map((s, i) => (
                                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                    <div className="w-1 h-1 bg-rose-400 rounded-full"></div>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                           </div>
                           <div className="bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100">
                              <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                Prevention Vectors
                              </h5>
                              <ul className="space-y-2">
                                {insight.prevention.map((p, i) => (
                                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                    {p}
                                  </li>
                                ))}
                              </ul>
                           </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                           <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                           <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Core Clinical Protocol</h5>
                           <p className="text-sm font-medium leading-relaxed italic opacity-90">"{insight.primaryProtocol}"</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-sm text-slate-400 font-medium italic">NEXIS Intelligence Link Standby...</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Active Field Data</h4>
                  <div className="space-y-4">
                    {getRelatedIncidents(selectedNode.id).map(inc => (
                      <div key={inc.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-rose-200 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            inc.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'
                          }`}>{inc.severity}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{inc.detectedAt}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 group-hover:text-rose-600 transition-colors mb-2">{inc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200">
                  <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Action Protocol
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    If you suspect exposure or are experiencing symptoms related to {selectedNode.name}, trigger the assessment protocol.
                  </p>
                  <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-500/20">
                    Symptom Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto h-full">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 ring-8 ring-emerald-500/5">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Clinical Knowledge Hub</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
              Explore our taxonomical medical engine with AI-generated anatomical illustrations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxonomyExplorer;
