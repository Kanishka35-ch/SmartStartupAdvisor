/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Sparkles, 
  MessageSquare, 
  ArrowLeft, 
  LayoutDashboard,
  BrainCircuit,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { EvaluationReport } from './components/EvaluationReport';
import { evaluateStartupIdea, getChatResponse, EvaluationResult } from './services/geminiService';
import { Modality } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function App() {
  const [view, setView] = useState<'landing' | 'chat' | 'report'>('landing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleSendMessage = async (content: string) => {
    const newMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const geminiMessages = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      const response = await getChatResponse(geminiMessages);
      setMessages([...newMessages, { role: 'model', content: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([...newMessages, { role: 'model', content: "I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    setView('report');
    
    // Use the entire chat history as context for the evaluation
    const chatContext = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const lastIdea = messages.filter(m => m.role === 'user').pop()?.content || "";

    try {
      const result = await evaluateStartupIdea(lastIdea, chatContext);
      setEvaluation(result);
    } catch (error) {
      console.error("Evaluation error:", error);
      // Fallback or error state could be handled here
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSpeak = useCallback(async (text: string) => {
    try {
      // Using the standard Web Speech API for simplicity and immediate feedback
      // as it doesn't require complex base64 handling for a quick demo
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech error:", error);
    }
  }, []);

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('landing')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <Rocket size={18} />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-zinc-900">SmartStartupAdvisor</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setView('landing')} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Home</button>
            <button onClick={() => setView('chat')} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Consultant</button>
            <button className="px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-all">Get Started</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              {/* Hero Section */}
              <div className="text-center max-w-4xl mx-auto space-y-8 py-12">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-widest"
                >
                  <Sparkles size={14} />
                  Next-Gen Startup Intelligence
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-zinc-900 leading-[0.9] tracking-tight">
                  Validate your vision <br />
                  <span className="text-indigo-600">before you build.</span>
                </h1>
                <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                  The world's most advanced AI startup consultant. Get deep SWOT analysis, risk assessments, and strategic roadmaps in seconds.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button 
                    onClick={() => setView('chat')}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    Start Free Consultation
                    <ArrowLeft className="rotate-180" size={20} />
                  </button>
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-zinc-900 border border-zinc-200 font-bold text-lg hover:bg-zinc-50 transition-all">
                    View Sample Report
                  </button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <BrainCircuit className="text-indigo-600" />,
                    title: "Deep SWOT Analysis",
                    desc: "Go beyond the surface with AI-driven insights into your core strengths and hidden market threats."
                  },
                  {
                    icon: <Globe className="text-emerald-600" />,
                    title: "Market Benchmarking",
                    desc: "See how your idea stacks up against industry leaders and identify your unique competitive edge."
                  },
                  {
                    icon: <ShieldCheck className="text-amber-600" />,
                    title: "Risk Mitigation",
                    desc: "Identify operational, financial, and technical risks early to build a more resilient business model."
                  }
                ].map((f, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6">
                      {f.icon}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">{f.title}</h3>
                    <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[calc(100vh-12rem)]"
            >
              <div className="mb-6 flex items-center justify-between">
                <button 
                  onClick={() => setView('landing')}
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
                >
                  <ArrowLeft size={18} />
                  Back to Home
                </button>
                <div className="text-sm text-zinc-400 font-medium">
                  Consultation in progress...
                </div>
              </div>
              <ChatInterface 
                messages={messages}
                onSendMessage={handleSendMessage}
                onEvaluate={handleEvaluate}
                isTyping={isTyping}
                canEvaluate={messages.length >= 2}
              />
            </motion.div>
          )}

          {view === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto"
            >
              <div className="mb-8 flex items-center justify-between">
                <button 
                  onClick={() => setView('chat')}
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
                >
                  <ArrowLeft size={18} />
                  Back to Consultant
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                    <ShieldCheck size={14} />
                    Analysis Complete
                  </div>
                </div>
              </div>

              {isEvaluating ? (
                <div className="h-96 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-zinc-100 border-t-indigo-600 animate-spin" />
                    <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={32} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-zinc-900">Synthesizing Market Intelligence</h3>
                    <p className="text-zinc-500 max-w-xs mx-auto">Our AI is analyzing thousands of data points to evaluate your startup venture...</p>
                  </div>
                </div>
              ) : evaluation ? (
                <EvaluationReport 
                  data={evaluation} 
                  onExport={handleExport}
                  onSpeak={handleSpeak}
                />
              ) : (
                <div className="text-center py-24">
                  <p className="text-zinc-500">Something went wrong during evaluation.</p>
                  <button 
                    onClick={handleEvaluate}
                    className="mt-4 text-indigo-600 font-bold hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center text-white text-[10px] font-bold">
              S
            </div>
            <span className="font-serif font-bold text-zinc-900">SmartStartupAdvisor</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-500 font-medium">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">API</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-zinc-400">© 2026 SmartStartupAdvisor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
