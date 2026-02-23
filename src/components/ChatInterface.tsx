import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onEvaluate: () => void;
  isTyping: boolean;
  canEvaluate: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  onEvaluate, 
  isTyping,
  canEvaluate
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900">SmartStartupAdvisor</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Online Consultant</span>
            </div>
          </div>
        </div>
        {canEvaluate && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onEvaluate}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Sparkles size={16} />
            Evaluate Idea
          </motion.button>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
            <div className="w-16 h-16 rounded-3xl bg-zinc-100 flex items-center justify-center text-zinc-400">
              <Sparkles size={32} />
            </div>
            <div>
              <p className="text-zinc-900 font-medium">Ready to evaluate your vision?</p>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-1">
                Tell me about your startup idea. I'll help you refine it before we run a full analysis.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-zinc-200 text-zinc-600" : "bg-indigo-100 text-indigo-600"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-zinc-900 text-white rounded-tr-none" 
                  : "bg-zinc-100 text-zinc-800 rounded-tl-none"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 mr-auto"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-zinc-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-6 pt-0">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your startup idea..."
            disabled={isTyping}
            className="w-full bg-zinc-100 border-none rounded-2xl pl-5 pr-14 py-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-zinc-400 text-center mt-3 uppercase tracking-widest font-medium">
          Powered by Gemini 3.1 Pro
        </p>
      </form>
    </div>
  );
};
