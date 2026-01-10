
import React, { useState } from 'react';
import { MOCK_TAXONOMY, MOCK_INCIDENTS } from '../constants';
import { TaxonomyNode, HealthIncident } from '../types';
import { getTaxonomyConceptExplanation } from '../services/gemini';

const TaxonomyExplorer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    setExplanation(null);
    const text = await getTaxonomyConceptExplanation(node.name);
    setExplanation(text);
    setLoading(false);
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
      {/* Knowledge Tree */}
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

      {/* Concept Deep Dive */}
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
                {/* AI Medical Insights Section */}
                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      AI Medical Insights
                    </h4>
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Contextual Intelligence</span>
                    </div>
                  </div>

                  <div className={`transition-all duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                    {loading ? (
                      <div className="space-y-4 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-11/12 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-4/5 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-9/12 animate-pulse"></div>
                        <div className="pt-4 h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                      </div>
                    ) : explanation ? (
                      <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-[2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm leading-relaxed">
                          <div className="prose prose-slate max-w-none">
                            {explanation.split('\n').filter(line => line.trim()).map((line, i) => (
                              <p key={i} className="text-slate-600 mb-4 last:mb-0 text-sm md:text-base leading-7">
                                {line}
                              </p>
                            ))}
                          </div>
                          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-[10px] text-slate-400 font-medium italic">Generated by Gemini Pro • Clinical reference only</p>
                            <button className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                              <span>Ask Assistant for follow-up</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                         <p className="text-sm font-medium">Select a concept to expand knowledge.</p>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Patient Education Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <svg className="w-4 h-4 text-blue-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h5 className="font-bold text-slate-800 text-sm mb-1">Clinical Fact Sheet</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Detailed medical data and peer-reviewed research summaries.</p>
                    </div>
                    <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <svg className="w-4 h-4 text-emerald-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h5 className="font-bold text-slate-800 text-sm mb-1">Prevention Guide</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Actionable steps for patients and household members.</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Active Field Data</h4>
                  <div className="space-y-4">
                    {getRelatedIncidents(selectedNode.id).map(inc => (
                      <div key={inc.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-rose-200 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                          <svg className="w-12 h-12 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.4503.447l-7 14a1 1 0 101.788.894l7-14a1 1 0 00-.338-1.341z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            inc.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'
                          }`}>{inc.severity}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{inc.detectedAt}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 group-hover:text-rose-600 transition-colors mb-2">{inc.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">{inc.cases} confirmed cases</span>
                          <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                            <span className="w-1 h-1 bg-rose-500 rounded-full animate-ping"></span>
                            In Field
                          </span>
                        </div>
                      </div>
                    ))}
                    {getRelatedIncidents(selectedNode.id).length === 0 && (
                      <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 bg-slate-50/30">
                        <svg className="w-10 h-10 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs font-semibold uppercase tracking-wider">Environment Secure</p>
                        <p className="text-[10px] mt-1">No incidents linked to {selectedNode.name}</p>
                      </div>
                    )}
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
                    If you suspect exposure or are experiencing symptoms related to {selectedNode.name}, immediately trigger the assessment protocol.
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
              Explore our taxonomical medical engine. Select any node from the structural tree to receive AI-powered clinical definitions and active field data.
            </p>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl text-left border border-slate-100 hover:border-emerald-100 transition-colors group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <span className="font-bold text-xs">01</span>
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-800">Browse Structural Tree</p>
                   <p className="text-[10px] text-slate-400">Navigate disease categories and hierarchies.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl text-left border border-slate-100 hover:border-emerald-100 transition-colors group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <span className="font-bold text-xs">02</span>
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-800">Activate AI Insights</p>
                   <p className="text-[10px] text-slate-400">Fetch real-time clinical analysis via Gemini Pro.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxonomyExplorer;
