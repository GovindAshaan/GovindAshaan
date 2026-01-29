
import React, { useState } from 'react';
import { 
  BrainCircuit, Upload, FileText, X, Sparkles, 
  Loader2, Zap, AlertTriangle, Target, Star, 
  ShieldCheck, ArrowRight, TrendingUp 
} from 'lucide-react';
import { NegotiationResult, FileData } from './types';
import { analyzeNegotiation } from './geminiService';

const App = () => {
  const [resume, setResume] = useState<FileData | null>(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setResume({ name: file.name, data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resume) return setError("Resume is mandatory.");
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeNegotiation(resume, jd);
      setResult(data);
    } catch (err: any) {
      setError("Analysis failed. Please check your connection and try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="h-16 glass sticky top-0 z-50 flex items-center justify-between px-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">Ashan <span className="text-indigo-600">AI</span></span>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Negotiation Engine Active</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Career <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-4">Domination</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium max-w-2xl mx-auto">
            Stop guessing your worth. Our AI uses real-time Indian market data to arm you with leverage for your next compensation talk.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200 border border-slate-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resume Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">Your Resume (Mandatory)</label>
              {!resume ? (
                <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-400 transition-all bg-slate-50">
                  <Upload className="w-8 h-8 text-slate-300 group-hover:text-indigo-500 group-hover:scale-110 transition-all mb-3" />
                  <p className="text-sm font-bold text-slate-600">Drop PDF here</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Max 5MB</p>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                </label>
              ) : (
                <div className="flex items-center justify-between p-5 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FileText className="w-6 h-6 shrink-0" />
                    <span className="font-bold truncate text-sm">{resume.name}</span>
                  </div>
                  <button onClick={() => setResume(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                </div>
              )}
            </div>

            {/* JD Input */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">Target Job Description (Optional)</label>
              <textarea 
                className="w-full h-48 p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-sm font-medium outline-none resize-none"
                placeholder="Paste the JD to align your leverage strategy..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !resume}
            className={`w-full mt-10 py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-2xl ${
              loading || !resume ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /><span>Calculating Market Power...</span></>
            ) : (
              <><Sparkles className="w-6 h-6" /><span>Analyze Negotiation Power</span></>
            )}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-700 text-sm font-bold">
              <X className="w-5 h-5" /><span>{error}</span>
            </div>
          )}
        </div>

        {/* Results View */}
        {result && (
          <div className="mt-16 space-y-8 animate-slide-up">
            {/* Result Header */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-8">
                <div className="w-32 h-32 rounded-full score-gradient flex flex-col items-center justify-center shadow-2xl shadow-indigo-200 shrink-0">
                  <span className="text-4xl font-black text-white">{result.score}</span>
                  <span className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Power</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Negotiation Score</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-bold text-slate-400">Hire Signal:</span>
                    <span className="px-3 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full border border-indigo-100">
                      {result.hireSignal}
                    </span>
                  </div>
                  <p className="mt-4 text-slate-500 text-sm leading-relaxed font-medium">{result.marketAlignment}</p>
                </div>
              </div>
              
              <div className="md:w-64 bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center">
                <TrendingUp className="w-8 h-8 text-indigo-400 mb-2" />
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Est. Market Value</h4>
                <p className="text-xl font-black mt-1">{result.estimatedRange}</p>
              </div>
            </div>

            {/* Strengths & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="w-6 h-6 text-amber-500" />
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-tight">Your Leverage</h4>
                </div>
                <div className="space-y-4">
                  {result.strengths.map((s, i) => (
                    <div key={i} className="flex items-start space-x-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                      <p className="text-sm font-bold text-slate-600 leading-snug">{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-tight">Recruiter Risks</h4>
                </div>
                <div className="space-y-4">
                  {result.risks.map((r, i) => (
                    <div key={i} className="flex items-start space-x-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                      <p className="text-sm font-bold text-slate-600 leading-snug">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Domination Steps */}
            <div className="bg-indigo-600 rounded-[3rem] p-10 sm:p-14 text-white shadow-2xl shadow-indigo-300 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
               <div className="relative z-10">
                 <div className="flex items-center space-x-4 mb-10">
                   <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                     <Star className="w-8 h-8 text-white fill-white" />
                   </div>
                   <h3 className="text-3xl font-black tracking-tight">Domination Strategy</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {result.advice.map((step, i) => (
                      <div key={i} className="flex items-center space-x-6 bg-white/10 p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all group">
                        <div className="w-10 h-10 rounded-2xl bg-white text-indigo-600 flex items-center justify-center font-black text-xl shrink-0 group-hover:rotate-12 transition-transform">
                          {i + 1}
                        </div>
                        <p className="text-lg font-bold text-white tracking-tight">{step}</p>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 text-center text-slate-400 text-xs font-bold uppercase tracking-widest pb-12">
        © 2025 Ashan AI • Strategic Compensation Intel • India
      </footer>
    </div>
  );
};

export default App;
