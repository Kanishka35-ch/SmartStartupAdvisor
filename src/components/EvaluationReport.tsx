import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  ShieldCheck, 
  Target, 
  ArrowRight,
  BarChart3,
  Rocket,
  Download,
  Volume2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { motion } from 'motion/react';
import { EvaluationResult, RiskLevel } from '../services/geminiService';
import { cn } from '../lib/utils';

interface EvaluationReportProps {
  data: EvaluationResult;
  onExport: () => void;
  onSpeak: (text: string) => void;
}

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const colors = {
    [RiskLevel.LOW]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [RiskLevel.MEDIUM]: "bg-amber-100 text-amber-700 border-amber-200",
    [RiskLevel.MEDIUM_HIGH]: "bg-orange-100 text-orange-700 border-orange-200",
    [RiskLevel.HIGH]: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", colors[level])}>
      {level}
    </span>
  );
};

export const EvaluationReport: React.FC<EvaluationReportProps> = ({ data, onExport, onSpeak }) => {
  const handleSpeakSummary = () => {
    onSpeak(data.summary);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-zinc-900">Evaluation Report</h2>
          <p className="text-zinc-500 mt-1">Comprehensive analysis of your startup venture.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSpeakSummary}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors text-sm font-medium"
          >
            <Volume2 size={16} />
            Listen
          </button>
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Score & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-zinc-100"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * data.investmentReadinessScore) / 100}
                className="text-indigo-600 transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-3xl font-bold text-zinc-900">{data.investmentReadinessScore}</span>
          </div>
          <h3 className="mt-4 font-semibold text-zinc-900">Investment Readiness</h3>
          <p className="text-xs text-zinc-500 mt-1">Proprietary scoring based on market fit, scalability, and risk.</p>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 mb-3">
            <Target className="text-indigo-600" size={20} />
            Executive Summary
          </h3>
          <p className="text-zinc-600 leading-relaxed italic">
            "{data.summary}"
          </p>
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
          <h4 className="font-bold text-emerald-900 flex items-center gap-2 mb-4">
            <ShieldCheck size={18} /> Strengths
          </h4>
          <ul className="space-y-2">
            {data.swot.strengths.map((s, i) => (
              <li key={i} className="text-sm text-emerald-800 flex gap-2">
                <span className="text-emerald-400">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
          <h4 className="font-bold text-red-900 flex items-center gap-2 mb-4">
            <AlertTriangle size={18} /> Weaknesses
          </h4>
          <ul className="space-y-2">
            {data.swot.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-red-800 flex gap-2">
                <span className="text-red-400">•</span> {w}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-4">
            <TrendingUp size={18} /> Opportunities
          </h4>
          <ul className="space-y-2">
            {data.swot.opportunities.map((o, i) => (
              <li key={i} className="text-sm text-blue-800 flex gap-2">
                <span className="text-blue-400">•</span> {o}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
          <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-4">
            <Target size={18} /> Threats
          </h4>
          <ul className="space-y-2">
            {data.swot.threats.map((t, i) => (
              <li key={i} className="text-sm text-amber-800 flex gap-2">
                <span className="text-amber-400">•</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={20} />
          Risk Assessment
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(data.riskAssessment).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <RiskBadge level={value as RiskLevel} />
            </div>
          ))}
        </div>
      </div>

      {/* Market Trends Chart */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" size={20} />
          Market Growth Trends
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.marketTrends}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#71717a' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#71717a' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4f46e5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Benchmarking */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
          <Target className="text-indigo-600" size={20} />
          Industry Benchmarking
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {data.industryBenchmarking.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-zinc-400 shrink-0">
                {i + 1}
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900">{item.competitorName}</h4>
                <p className="text-sm text-zinc-600 mt-1">
                  <span className="font-medium text-indigo-600">Your Edge:</span> {item.advantage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Suggestions */}
      <div className="bg-zinc-900 text-white p-8 rounded-3xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Lightbulb className="text-amber-400" size={24} />
          Strategic Roadmap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-widest text-zinc-400 font-bold">Key Suggestions</h4>
            <ul className="space-y-4">
              {data.strategicSuggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-zinc-300 text-sm">
                  <ArrowRight size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest text-zinc-400 font-bold">MVP Roadmap</h4>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
              {data.mvpRoadmap.map((phase, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <h5 className="font-semibold text-white">{phase.phase}</h5>
                  <ul className="mt-2 space-y-1">
                    {phase.tasks.map((task, j) => (
                      <li key={j} className="text-xs text-zinc-400">• {task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
