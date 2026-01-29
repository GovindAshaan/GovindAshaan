
import React from 'react';
import { NegotiationResult } from '../types';
import { CheckCircle2, AlertTriangle, Target, Briefcase, Zap, Star } from 'lucide-react';

interface ResultCardProps {
  result: NegotiationResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 5) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Yes': return 'text-emerald-700 bg-emerald-100';
      case 'Borderline': return 'text-amber-700 bg-amber-100';
      case 'No': return 'text-rose-700 bg-rose-100';
      default: return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${getScoreColor(result.score)}`}>
            {result.score}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Negotiation Score</h3>
            <p className="text-sm text-slate-500">Agent: {result.agent}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Hire Signal:</span>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getSignalColor(result.hireSignal)}`}>
            {result.hireSignal}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-4 text-emerald-600">
            <Zap className="w-5 h-5" />
            <h4 className="font-bold text-slate-800">Negotiation Strengths</h4>
          </div>
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-4 text-rose-500">
            <AlertTriangle className="w-5 h-5" />
            <h4 className="font-bold text-slate-800">Compensation Risks</h4>
          </div>
          <ul className="space-y-3">
            {result.risks.map((r, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm text-slate-600">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2 mb-4 text-indigo-600">
          <Target className="w-5 h-5" />
          <h4 className="font-bold text-slate-800">Market Alignment</h4>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
          {result.marketAlignment}
        </p>
      </div>

      <div className="p-6 bg-indigo-600 rounded-2xl shadow-lg text-white">
        <div className="flex items-center space-x-2 mb-6">
          <Star className="w-5 h-5 text-indigo-200" />
          <h4 className="font-bold text-lg">Actionable Advice</h4>
        </div>
        <div className="space-y-4">
          {result.advice.map((step, i) => (
            <div key={i} className="flex items-start space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </div>
              <p className="text-sm font-medium pt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
