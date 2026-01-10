
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
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Knowledge Tree
        </h3>
        <div className="flex-1 overflow-y-auto pr-2">
          {renderTree(MOCK_TAXONOMY)}
        </div>
      </div>

      {/* Concept Deep Dive */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col min-h-0 overflow-y-auto">
        {selectedNode ? (
          <div className="max-w-3xl animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg ${
                selectedNode.category === 'infectious' ? 'bg-emerald-500 shadow-emerald-100' : 'bg-blue-500 shadow-blue-100'
              }`}>
                {selectedNode.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-800">{selectedNode.name}</h2>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    selectedNode.category === 'infectious' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedNode.category}
                  </span>
                </div>
                <p className="text-slate-500 text-sm">{selectedNode.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Medical Insights
                  </h4>
                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-4/6 animate-pulse"></div>
                    </div>
                  ) : explanation ? (
                    <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                      {explanation.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">Select a concept to expand knowledge.</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Active Field Incidents</h4>
                  <div className="space-y-3">
                    {getRelatedIncidents(selectedNode.id).map(inc => (
                      <div key={inc.id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-rose-200 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">{inc.severity} severity</span>
                          <span className="text-[10px] text-slate-400 font-medium">{inc.detectedAt}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 group-hover:text-rose-600 transition-colors">{inc.description}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{inc.cases} confirmed cases</p>
                      </div>
                    ))}
                    {getRelatedIncidents(selectedNode.id).length === 0 && (
                      <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
                        <svg className="w-8 h-8 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs font-medium">No active incidents</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Knowledge Hub</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Explore our structured medical taxonomy to understand disease classification, causal relationships, and preventative strategies.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-left border border-slate-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-emerald-500 font-bold text-xs">01</span>
                </div>
                <p className="text-xs font-medium text-slate-600">Select a category from the left tree</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-left border border-slate-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-emerald-500 font-bold text-xs">02</span>
                </div>
                <p className="text-xs font-medium text-slate-600">Deep dive with AI-powered clinical explanations</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxonomyExplorer;
