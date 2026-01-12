
import React, { useState, useRef, useEffect } from 'react';
import { getHealthAssistantResponse, generateMedicalIllustration, startMedicalAnimationGeneration, pollVideoOperation, AssistantResponse } from '../services/gemini';
import { Message } from '../types';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

// ... encode function remains same ...
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// ... AttachedFile and EnhancedMessage interfaces ...
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

  const isMedicalQuery = (text: string) => {
    const medicalKeywords = ['pain', 'heart', 'brain', 'lung', 'anatomy', 'muscle', 'bone', 'skin', 'diagram', 'stomach', 'fever', 'symptom', 'back', 'neck', 'headache', 'chest'];
    return medicalKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white ring-4 ring-red-500/20 shadow-lg shadow-red-500/30 animate-pulse">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tighter italic">NEXIS Core Intelligence</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase text-red-400 tracking-widest">Global Search Grounding • Active</span>
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
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-red-400'}`}>
                {msg.role === 'user' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              </div>
              <div className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.file && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-[10px] font-black uppercase text-red-700 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Attached: {msg.file.name}
                  </div>
                )}
                {/* ... videoUrl and illustrationUrl sections ... */}
                <div className={`p-6 rounded-3xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white font-medium' : 'bg-white text-slate-800 border border-slate-100'}`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* ... Loading and progress sections ... */}
        {isLoading && !isGeneratingVideo && (
          <div className="flex justify-start items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              {attachedFile ? 'Analyzing Clinical Document...' : 'Scanning Global Medical Records...'}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-white space-y-4 relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
           <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all whitespace-nowrap"
           >
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             Attach Lab Report
           </button>
           {/* ... Other assistant action buttons update to red-50 / red-600 ... */}
        </div>

        <form onSubmit={handleSend} className="flex gap-3 items-center">
          {/* ... input elements ... */}
          <div className="flex gap-2">
            <button 
              type="submit" 
              disabled={(!input.trim() && !attachedFile) || isLoading} 
              className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 shadow-lg shadow-red-200 disabled:opacity-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </form>
        <div className="flex justify-center gap-6 mt-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            NEXIS Document OCR Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default HealthAssistant;
