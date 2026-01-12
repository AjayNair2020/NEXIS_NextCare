
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
      content: 'Hello! I am NextCare AI (NEXIS Core). I am now connected to the global medical search network. How can I assist you with clinical insights or document analysis today?',
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

  const ensureApiKey = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      alert("NEXIS: High-fidelity reasoning requires an active clinical session key. Opening selector...");
      await (window as any).aistudio.openSelectKey();
    }
    return true;
  };

  const handleVideoGeneration = async () => {
    if (!input.trim() || isGeneratingVideo) return;
    await ensureApiKey();

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
    } catch (error: any) {
      console.error("Video Generation Error:", error);
      if (error.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      const errorMessage: EnhancedMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I encountered an error generating the animation. Please ensure you have selected a valid paid GCP project key with billing enabled.',
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

    if (isVisualGuideRequest) {
      await ensureApiKey();
    }

    let finalInput = input;
    if (attachedFile && !input.trim()) {
      finalInput = `Please perform a detailed clinical review of the attached document (${attachedFile.name}). Summarize findings and highlight any anomalies.`;
    } else if (isVisualGuideRequest) {
      finalInput = `Provide an anatomical diagram and explanation for: ${input}`;
    }

    const userMessage: EnhancedMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: finalInput,
      timestamp: new Date(),
      file: attachedFile || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = userMessage.content;
    const currentFile = attachedFile;
    
    setInput('');
    setAttachedFile(null);
    setIsLoading(true);

    try {
      let illustrationUrl = null;
      if (isVisualGuideRequest) {
        illustrationUrl = await generateMedicalIllustration(currentInput);
      }

      const history = messages
        .filter(m => m.id !== '1')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

      const response: AssistantResponse = await getHealthAssistantResponse(
        currentInput,
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
    } catch (error: any) {
      console.error("Health Assistant Error:", error);
      if (error.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'NEXIS Link interrupted. This usually happens if the API key is expired or lacks permissions. Please try re-selecting your key.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setAttachedFile({
        data: base64,
        mimeType: file.type,
        name: file.name,
        previewUrl: URL.createObjectURL(file)
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30 animate-pulse">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tighter italic">NEXIS Core Intelligence</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Global Search Grounding • Active</span>
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
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-amber-400'}`}>
                {msg.role === 'user' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              </div>
              <div className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.file && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl text-[10px] font-black uppercase text-amber-700 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Attached: {msg.file.name}
                  </div>
                )}
                
                {msg.illustrationUrl && (
                  <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl max-w-lg">
                    <img src={msg.illustrationUrl} alt="Clinical Illustration" className="w-full h-auto" />
                    <div className="bg-slate-900 px-4 py-2 text-[10px] font-black uppercase text-amber-400 tracking-widest text-center">
                      AI Anatomical Diagram Synthesis
                    </div>
                  </div>
                )}

                {msg.videoUrl && (
                  <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl max-w-xl">
                    <video src={msg.videoUrl} controls className="w-full" />
                    <div className="bg-slate-900 px-4 py-2 text-[10px] font-black uppercase text-amber-400 tracking-widest text-center">
                      Clinical Animation Generation (VEO)
                    </div>
                  </div>
                )}

                <div className={`p-6 rounded-3xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white font-medium' : 'bg-white text-slate-800 border border-slate-100'}`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{msg.content}</div>
                  {msg.sources && (
                    <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                       <p className="w-full text-[9px] font-black text-slate-400 uppercase mb-1">Knowledge Grounding</p>
                       {msg.sources.map((s, i) => (
                         <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                           {s.title}
                         </a>
                       ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isGeneratingVideo && (
          <div className="flex flex-col items-center justify-center py-12 gap-6 animate-in zoom-in duration-500">
             <div className="relative">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/20">
                   <svg className="w-10 h-10 text-amber-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                </div>
                <div className="absolute -inset-4 bg-amber-500 rounded-full animate-ping opacity-10"></div>
             </div>
             <div className="text-center">
                <p className="text-[11px] font-black uppercase text-amber-600 tracking-widest mb-1">{videoProgress}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Estimated generation time: 2-3 minutes</p>
             </div>
          </div>
        )}

        {isLoading && !isGeneratingVideo && (
          <div className="flex justify-start items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              {attachedFile ? 'Analyzing Clinical Document...' : 'Scanning Global Medical Records...'}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-white space-y-4 relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
           <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
           
           <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all whitespace-nowrap"
           >
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             Attach Lab Report
           </button>

           <button 
            type="button"
            onClick={() => handleSend(undefined, true)}
            disabled={!input.trim() || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap disabled:opacity-50"
           >
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             Request Visual Guide
           </button>

           <button 
            type="button"
            onClick={handleVideoGeneration}
            disabled={!input.trim() || isGeneratingVideo}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100 text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all whitespace-nowrap disabled:opacity-50"
           >
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
             Clinical Animation
           </button>
        </div>

        {attachedFile && (
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-2xl animate-in slide-in-from-left duration-300">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">Ready for Analysis</p>
                  <p className="text-xs font-bold text-amber-600">{attachedFile.name}</p>
               </div>
             </div>
             <button onClick={() => setAttachedFile(null)} className="p-2 text-amber-400 hover:text-amber-600">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        )}

        <form onSubmit={(e) => handleSend(e)} className="flex gap-3 items-center">
          <button 
            type="button" 
            onClick={toggleListening}
            className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z" /></svg>
          </button>
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type clinical symptoms or queries..." 
            className="flex-1 bg-slate-50 border-none focus:ring-2 focus:ring-amber-500/20 rounded-2xl py-4 px-6 text-sm font-medium placeholder:text-slate-400 outline-none transition-all"
          />
          <div className="flex gap-2">
            <button 
              type="submit" 
              disabled={(!input.trim() && !attachedFile) || isLoading} 
              className="p-4 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 shadow-lg shadow-amber-200 disabled:opacity-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </form>
        <div className="flex justify-center gap-6 mt-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
            NEXIS Document OCR Active
          </span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            Image Synth Eng: v4.1
          </span>
        </div>
      </div>
    </div>
  );
};

export default HealthAssistant;
