import React, { useState, useRef, useEffect } from 'react';
import { getHealthAssistantResponse, generateMedicalIllustration, startMedicalAnimationGeneration, pollVideoOperation, AssistantResponse } from '../services/gemini';
import { Message } from '../types';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

interface AttachedFile {
  data: string;
  mimeType: string;
  name: string;
  previewUrl: string;
}

interface EnhancedMessage extends Message {
  file?: AttachedFile;
  illustrationUrl?: string;
  videoUrl?: string;
  sources?: { uri: string; title: string }[];
}

const HealthAssistant: React.FC = () => {
  const [messages, setMessages] = useState<EnhancedMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am NextCare AI (NEXIS Core). I am now connected to the global medical search network. How can I assist you with clinical insights today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isGeneratingVideo]);

  const handleVideoGeneration = async () => {
    if (!input.trim() || isGeneratingVideo) return;

    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      alert("Cinematic animations require a paid API key for Veo models. Please select one in the following dialog.");
      await (window as any).aistudio.openSelectKey();
    }

    setIsGeneratingVideo(true);
    setVideoProgress('Initializing Veo Synthesis Engine...');
    
    try {
      let operation = await startMedicalAnimationGeneration(input);
      
      const statusMessages = [
        'Mapping anatomical vectors...',
        'Synthesizing clinical motion...',
        'Rendering high-fidelity frames...',
        'Optimizing medical visualization...',
        'Finalizing medical animation...'
      ];
      let msgIdx = 0;

      while (!operation.done) {
        setVideoProgress(statusMessages[msgIdx % statusMessages.length]);
        msgIdx++;
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await pollVideoOperation(operation);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);

      const assistantMessage: EnhancedMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I've generated a clinical animation of ${input} to help you understand the process better.`,
        timestamp: new Date(),
        videoUrl: videoUrl
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Video Generation Error:", error);
      const errorMessage: EnhancedMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I encountered an error generating the animation. If this was a billing error, please ensure you have selected a paid GCP project key.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingVideo(false);
      setVideoProgress('');
      setInput('');
    }
  };

  const handleSend = async (e?: React.FormEvent, isVisualGuideRequest: boolean = false) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !attachedFile) || isLoading) return;

    const userMessage: EnhancedMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: isVisualGuideRequest ? `Anatomical diagram: ${input}` : input,
      timestamp: new Date(),
      file: attachedFile || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentFile = attachedFile;
    
    setInput('');
    setAttachedFile(null);
    setIsLoading(true);

    let illustrationUrl = null;
    if (isVisualGuideRequest) {
      illustrationUrl = await generateMedicalIllustration(currentInput);
    }

    const history = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response: AssistantResponse = await getHealthAssistantResponse(
      isVisualGuideRequest 
        ? `Explain the clinical context of ${currentInput}.`
        : currentInput,
      history,
      currentFile ? { data: currentFile.data, mimeType: currentFile.mimeType } : undefined
    );
    
    const assistantMessage: EnhancedMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.text,
      timestamp: new Date(),
      illustrationUrl: illustrationUrl || undefined,
      sources: response.sources
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const toggleListening = async () => {
    if (isListening) stopListening();
    else await startListening();
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = audioContext.createMediaStreamSource(stream);
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (event) => {
              const inputData = event.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
          },
          onmessage: async (m) => { if (m.serverContent?.inputTranscription) setInput(p => p + m.serverContent.inputTranscription.text); },
          onclose: () => stopListening(),
        },
        config: { responseModalities: [Modality.AUDIO], inputAudioTranscription: {} },
      });
      sessionRef.current = await sessionPromise;
      setIsListening(true);
    } catch (e) { alert('Mic access required.'); }
  };

  const stopListening = () => {
    setIsListening(false);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (sessionRef.current) sessionRef.current.close();
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
      {/* HUD Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/30 animate-pulse">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tighter italic">NEXIS Core Intelligence</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Global Search Grounding • Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => setMessages([messages[0]])} className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest px-3 py-1.5 border border-slate-700 rounded-xl transition-colors">Reset Link</button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-emerald-400'}`}>
                {msg.role === 'user' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              </div>
              <div className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.videoUrl && (
                  <div className="mb-2 p-2 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/10 w-full max-w-lg">
                    <video src={msg.videoUrl} controls className="w-full rounded-3xl" />
                    <div className="p-4 flex items-center justify-between">
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Veo Cinematic Synthesis</span>
                    </div>
                  </div>
                )}
                {msg.illustrationUrl && (
                  <div className="mb-2 p-2 bg-white rounded-[2rem] border border-slate-100 shadow-xl w-full max-w-sm">
                    <img src={msg.illustrationUrl} className="w-full rounded-3xl" />
                    <div className="mt-2 text-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1K Anatomy Guide • Pro Vision</span>
                    </div>
                  </div>
                )}
                <div className={`p-6 rounded-3xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white font-medium' : 'bg-white text-slate-800 border border-slate-100'}`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{msg.content}</div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Grounding Sources</p>
                       <div className="flex flex-wrap gap-2">
                         {msg.sources.map((src, idx) => (
                           <a 
                            key={idx} 
                            href={src.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-all truncate max-w-[200px]"
                           >
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                             {src.title}
                           </a>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isGeneratingVideo && (
          <div className="flex justify-start">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col items-center gap-6 animate-in zoom-in duration-500">
               <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
               </div>
               <div className="text-center">
                  <h4 className="font-bold text-lg mb-1">Synthesizing Clinical Motion</h4>
                  <p className="text-xs text-slate-400 font-medium">{videoProgress}</p>
               </div>
            </div>
          </div>
        )}
        {isLoading && !isGeneratingVideo && (
          <div className="flex justify-start items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Scanning Global Medical Records...</span>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-white">
        <form onSubmit={handleSend} className="flex gap-3 items-center">
          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]; if (f) {
              const r = new FileReader(); r.onloadend = () => setAttachedFile({ data: (r.result as string).split(',')[1], mimeType: f.type, name: f.name, previewUrl: URL.createObjectURL(f)});
              r.readAsDataURL(f);
            }
          }} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-4 bg-slate-50 text-slate-500 rounded-2xl hover:bg-blue-50 transition-all border border-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3" /></svg>
          </button>
          <button type="button" onClick={toggleListening} className={`p-4 rounded-2xl transition-all border ${isListening ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7" /></svg>
          </button>
          <div className="flex-1 relative">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Query symptoms, medical trends, or global health research..." 
              className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
            />
            {attachedFile && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] font-bold shadow-sm">
                <span className="truncate max-w-[100px]">{attachedFile.name}</span>
                <button type="button" onClick={() => setAttachedFile(null)} className="text-rose-500 hover:text-rose-700">×</button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => handleSend(undefined, true)} 
              disabled={!input.trim()} 
              className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all" 
              title="High-Res Anatomy Diagram"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
            </button>
            <button 
              type="submit" 
              disabled={!input.trim() && !attachedFile} 
              className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 disabled:opacity-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </form>
        <div className="flex justify-center gap-6 mt-3">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
            NEXIS Grounding Enabled
          </span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            AES-256 Encrypted Tunnel
          </span>
        </div>
      </div>
    </div>
  );
};

export default HealthAssistant;