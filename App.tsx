
import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, FileText, Sparkles, 
  Loader2, AlertTriangle, 
  TrendingUp, Lock, ShieldCheck as ShieldIcon
} from 'lucide-react';
import { NegotiationResult, FileData } from './types';
import { analyzeNegotiation } from './geminiService';
import { FileUpload } from './components/FileUpload';
import { ResultCard } from './components/ResultCard';

const STUDENT_ACCESS_CODE = "ASHAN2025"; 

const App = () => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [accessCode, setAccessCode] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [resume, setResume] = useState<FileData | null>(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem('ashan_ai_authorized');
    if (isAuth === 'true') {
      setAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.toUpperCase() === STUDENT_ACCESS_CODE) {
      localStorage.setItem('ashan_ai_authorized', 'true');
      setAuthorized(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleAnalyze = async () => {
    if (!resume) return setError("Resume is mandatory.");
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeNegotiation(resume, jd);
      setResult(data);
    } catch (err: any) {
      console.error("DOMINATION ERROR:", err);
      const msg = err.message || "Unknown error occurred";
      setError(`Analysis failed: ${msg}.`);
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-slide-up">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-500/20 mb-4">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Ashan <span className="text-indigo-500">AI</span></h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Career Domination Engine</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center space-x-2 text-indigo-400 mb-6 bg-indigo-400/5 p-3 rounded-xl border border-indigo-400/10">
              <Lock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Authorized Access Only</span>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Elite Access Code</label>
                <input 
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter Student Code"
                  className={`w-full bg-slate-800 border ${loginError ? 'border-rose-500' : 'border-slate-700'} p-4 rounded-2xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold tracking-widest text-center`}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Initialize Session</span>
                <TrendingUp className="w-4 h-4" />
              </button>
            </form>
            
            {loginError && (
              <p className="text-rose-500 text-[10px] font-black uppercase text-center mt-4 tracking-widest animate-pulse">Invalid Credentials</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <nav className="h-16 sticky top-0 z-50 flex items-center justify-between px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">Ashan <span className="text-indigo-600">AI</span></span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
          <ShieldIcon className="w-3 h-3 text-emerald-600" />
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Student Access Active</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Maximize Your Market Value
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Upload your resume and the target job description. Our AI will analyze your negotiation leverage and provide a strategy for the highest possible offer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <FileUpload
              label="Resume (Required)"
              accept=".pdf,.doc,.docx,.txt"
              onFileSelect={setResume}
              selectedFile={resume}
              required
            />

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">
                Job Description (Optional)
              </label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the JD here for targeted analysis..."
                className="w-full h-48 p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !resume}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center space-x-3 ${
                loading || !resume 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-200 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Leverage...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Strategy</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-rose-600 leading-relaxed">{error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {result ? (
              <ResultCard result={result} />
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center bg-white/50">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-400">Ready for Analysis</h3>
                <p className="text-sm text-slate-300 mt-2 max-w-xs">
                  Upload your documents to see your market worth and negotiation strategy.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
