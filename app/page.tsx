"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
// FIX: Correct path to Globe component
import Globe from "./components/HUD/GlobalGlobe"; 
import { Send, Terminal, Cpu, Activity } from "lucide-react";

export default function Home() {
  // FIX: useChat in @ai-sdk/react provides status and sendMessage, but not input management
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';

  // FIX: Manual input management
  const [input, setInput] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Cast to any to avoid type issues with specific SDK version
    sendMessage({ role: 'user', content: input } as any);
    setInput('');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-8 overflow-hidden">
      
      {/* BACKGROUND LAYER */}
      <Globe />
      
      {/* HUD HEADER */}
      <header className="w-full max-w-5xl flex justify-between items-center border-b border-cyan-900/50 pb-4 mb-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f3ff]" />
            <h1 className="text-2xl font-bold tracking-[0.2em] text-cyan-400 text-glow">
              JARVIS <span className="text-xs text-cyan-700">MK. V</span>
            </h1>
        </div>
        <div className="flex gap-6 text-xs text-cyan-600 font-mono">
            <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 
                <span>SYSTEM: ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" /> 
                <span>SIDECAR: CONNECTED</span>
            </div>
        </div>
      </header>

      {/* TERMINAL WINDOW */}
      <section className="flex-1 w-full max-w-5xl flex flex-col gap-4 relative z-10">
        
        {/* Output Area */}
        <div className="flex-1 rounded-lg border border-cyan-900/50 bg-[#050a10]/80 backdrop-blur-md p-6 overflow-y-auto shadow-[0_0_30px_rgba(0,243,255,0.05)] h-[60vh]">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-cyan-800 space-y-4 opacity-50">
              <Terminal className="w-16 h-16 opacity-50" />
              <p className="tracking-widest">AWAITING INPUT...</p>
            </div>
          )}
          
          {/* FIX 2: Type 'm' as any to avoid strict type mismatch with UIMessage */}
          {messages.map((m: any) => (
            <div key={m.id} className={`mb-6 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-md border ${
                m.role === 'user' 
                  ? 'bg-cyan-950/30 border-cyan-800 text-cyan-100' 
                  : 'bg-black/50 border-cyan-900/50 text-cyan-300'
              }`}>
                <p className="text-xs font-bold mb-1 opacity-50 uppercase">{m.role}</p>
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {m.content}
                </div>
                
                {/* FIX 3: Type 'tool' as any */}
                {m.toolInvocations?.map((tool: any) => (
                    <div key={tool.toolCallId} className="mt-2 p-2 bg-black/60 rounded text-xs text-yellow-500 border border-yellow-900/30 font-mono">
                        Running: {tool.toolName}...
                    </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative w-full group">
          <input
            className="w-full bg-[#050a10] border border-cyan-800/50 rounded-lg py-4 pl-6 pr-12 text-cyan-100 placeholder-cyan-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-lg"
            value={input}
            onChange={handleInputChange}
            placeholder="ENTER COMMAND..."
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-cyan-600 hover:text-cyan-400 transition-colors disabled:opacity-30"
          >
            {isLoading ? (
                <div className="h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            ) : (
                <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="w-full text-center py-4 text-[10px] text-cyan-900 tracking-[0.3em] uppercase">
        Secure Connection • Local Environment • v0.5.0
      </footer>
    </main>
  );
}
