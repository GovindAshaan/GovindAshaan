
import React, { useState } from 'react';
import { 
  BrainCircuit, Upload, FileText, X, Sparkles, 
  Loader2, Zap, AlertTriangle, Star, 
  ShieldCheck, TrendingUp, CheckCircle2
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
      if (file.size > 5 * 1024 * 1024) return setError("File too large (Max 5MB)");
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setResume({ name: file.name, data: base64, mimeType: file.type });
        setError(null);
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
      console.error(err);
      setError("Analysis failed. Ensure your API Key is set in Vercel Environment Variables.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <nav className="h-16 glass sticky top-0 z-50 flex items-center justify-between px-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">Ashan <span className="text-indigo-600">AI</span></span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Career <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-4">Domination</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium max-w-2xl mx-auto">
            Stop guessing your worth. Our AI uses real-time market data to arm you with leverage for your next compensation talk.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-slate-100 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Your Resume</label>
              {!resume ? (
                <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-400 transition-all bg-slate-50">
                  <Upload className="w-8 h-8 text-slate-300 group-hover:text-indigo-500 mb-3" />
                  <p className="text-sm font-bold text-slate-600">Drop PDF here</p>
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                </label>
              ) : (
                <div className="flex items-center justify-between p-5 bg-indigo-600 rounded-3xl text-white shadow-xl">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FileText className="w-6 h-6 shrink-0" />
                    <span className="font-bold truncate text-sm">{resume.name}</span>
                  </div>
                  <button onClick={() => setResume(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Target JD (Optional)</label>
              <textarea 
                className="w-full h-48 p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-medium resize-none transition-all"
                placeholder="Paste JD for tactical alignment..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !resume}
            className={`w-full mt-10 py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-xl ${
              loading || !resume ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /><span>Consulting Market Intel...</span></>
            ) : (
              <><Sparkles className="w-6 h-6" /><span>Analyze Negotiation Power</span></>
            )}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-700 text-sm font-bold animate-slide-up">
              <AlertTriangle className="w-5 h-5" /><span>{error}</span>
            </div>
          )}
        </div>

        {result && (
          <div className="mt-16 space-y-8 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-8">
                <div className="w-32 h-32 rounded-full score-gradient flex flex-col items-center justify-center shadow-2xl shrink-0 text-white">
                  <span className="text-4xl font-black">{result.score}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Power</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Negotiation Score</h3>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full mt-1 inline-block">
                    {result.hireSignal} Signal
                  </span>
                  <p className="mt-4 text-slate-500 text-sm leading-relaxed font-medium">{result.marketAlignment}</p>
                </div>
              </div>
              
              <div className="md:w-64 bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-xl">
                <TrendingUp className="w-8 h-8 text-indigo-400 mb-2" />
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Est. Market Value</h4>
                <p className="text-xl font-black mt-1">{result.estimatedRange}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="w-6 h-6 text-amber-500" />
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-tight">Your Leverage</h4>
                </div>
                <div className="space-y-4">
                  {result.strengths.map((s, i) => (
                    <div key={i} className="flex items-start space-x-3 group">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
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
                      <ShieldCheck className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" />
                      <p className="text-sm font-bold text-slate-600 leading-snug">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[3rem] p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                 <div className="flex items-center space-x-4 mb-10">
                   <Star className="w-8 h-8 text-white fill-white" />
                   <h3 className="text-3xl font-black tracking-tight">Domination Strategy</h3>
                 </div>
                 <div className="space-y-4">
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

      <footer className="mt-32 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest pb-12">
        © 2025 Ashan AI • Strategic Compensation Intel
      </footer>
    </div>
  );
};

export default App;
