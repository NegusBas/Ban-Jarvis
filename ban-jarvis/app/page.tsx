'use client';

import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
// Define a more flexible type that matches what the hook actually returns at runtime
type Message = UIMessage & { content: string; toolInvocations?: any[] };
import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  // We strictly destructure what we need. 
  // 'handleSubmit' automatically uses 'append' internally.
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    // @ts-ignore - api option exists in the hook but might be missing from types
    api: '/api/chat',
    onError: (err: any) => console.error("Chat Error:", err),
  }) as any;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="flex min-h-screen flex-col bg-[#050505] text-[#00f3ff] font-mono overflow-hidden relative">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00f3ff 1px, transparent 1px), linear-gradient(90deg, #00f3ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* HEADER */}
      <header className="z-10 w-full p-6 border-b border-[#00f3ff]/30 bg-black/80 backdrop-blur-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-[0.2em] shadow-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
          JARVIS <span className="text-xs text-white/50">MK. V</span>
        </h1>
        <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                SYSTEM ONLINE
            </span>
        </div>
      </header>

      {/* CHAT AREA */}
      <section className="flex-1 overflow-y-auto p-6 z-10 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
                <div className="w-16 h-16 border-2 border-[#00f3ff] rounded-full flex items-center justify-center animate-spin-slow mb-4">
                    <div className="w-2 h-2 bg-[#00f3ff] rounded-full"></div>
                </div>
                <p>AWAITING INPUT...</p>
            </div>
        )}
        
        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 border ${
                m.role === 'user' 
                ? 'border-white/20 bg-white/5 text-white' 
                : 'border-[#00f3ff]/30 bg-[#001015] text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.1)]'
            } rounded-lg`}>
              <div className="text-[10px] uppercase opacity-50 mb-1 tracking-wider">{m.role}</div>
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              
              {/* Tool Execution Logs */}
              {m.toolInvocations?.map((tool: any) => (
                 <div key={tool.toolCallId} className="mt-3 p-2 bg-yellow-900/20 border border-yellow-500/30 text-yellow-500 text-xs font-mono rounded">
                    <span className="animate-pulse">▶</span> RUNNING: {tool.toolName}...
                 </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </section>

      {/* INPUT AREA */}
      <footer className="z-10 p-6 bg-black/90 border-t border-[#00f3ff]/30">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto w-full">
          <input
            className="w-full bg-[#0a0a0a] border border-[#00f3ff]/50 text-[#00f3ff] p-4 pr-12 rounded focus:outline-none focus:ring-1 focus:ring-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.1)] placeholder-[#00f3ff]/30"
            value={input}
            onChange={handleInputChange}
            placeholder="> ENTER COMMAND..."
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00f3ff] hover:text-white transition-colors disabled:opacity-30"
          >
            ⏎
          </button>
        </form>
      </footer>
    </main>
  );
}