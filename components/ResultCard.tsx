
import React from 'react';
import { NegotiationResult } from '../types';
import { CheckCircle2, AlertTriangle, Target, Zap, Star, ShieldCheck } from 'lucide-react';

interface ResultCardProps {
  result: NegotiationResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 5) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Yes': return 'text-emerald-700 bg-emerald-100 border border-emerald-200';
      case 'Borderline': return 'text-amber-700 bg-amber-100 border border-amber-200';
      case 'No': return 'text-rose-700 bg-rose-100 border border-rose-200';
      default: return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${getScoreColor(result.score)}`}>
          <span className="text-3xl font-black">{result.score}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Power</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Market Leverage Factor</h3>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${getSignalColor(result.hireSignal)}`}>
              {result.hireSignal} Signal
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Evaluation by {result.agent}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-5">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h4 className="font-bold text-slate-800">Negotiation Strengths</h4>
          </div>
          <ul className="space-y-4">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm font-medium text-slate-600 leading-tight">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h4 className="font-bold text-slate-800">Compensation Risks</h4>
          </div>
          <ul className="space-y-4">
            {result.risks.map((r, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm font-medium text-slate-600 leading-tight">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-slate-300 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Alignment */}
      <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-indigo-600" />
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Market Context</h4>
        </div>
        <p className="text-slate-600 text-base leading-relaxed font-medium whitespace-pre-wrap">
          {result.marketAlignment}
        </p>
      </div>

      {/* Domination Moves */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl -mr-32 -mt-32 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-indigo-500 rounded-xl">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <h4 className="font-black text-xl tracking-tight">Domination Strategy</h4>
          </div>
          <div className="space-y-4">
            {result.advice.map((step, i) => (
              <div key={i} className="flex items-start space-x-4 bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-black shrink-0 group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                <p className="text-sm font-bold text-slate-200 pt-1 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
