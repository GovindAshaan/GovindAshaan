
import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, FileText, Sparkles, 
  Loader2, AlertTriangle, CheckCircle2,
  TrendingUp, Lock, ShieldCheck as ShieldIcon,
  Upload, X, Zap, Target, Star, ShieldCheck
} from 'lucide-react';
import { NegotiationResult, FileData } from './types.ts';
import { analyzeNegotiation } from './geminiService.ts';

// --- Internal Sub-component: FileUpload ---
const FileUpload = ({ label, accept, onFileSelect, selectedFile, required }: any) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isText = file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md');
      const reader = new FileReader();
      
      if (isText) {
        reader.onload = (event) => {
          onFileSelect({
            name: file.name,
            data: event.target?.result as string,
            mimeType: 'text/plain',
            isText: true
          });
        };
        reader.readAsText(file);
      } else {
        reader.onload = (event) => {
          const base64Data = (event.target?.result as string).split(',')[1];
          onFileSelect({
            name: file.name,
            data: base64Data,
            mimeType: file.type,
            isText: false
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {!selectedFile ? (
        <label className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-400 transition-all bg-slate-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <p className="mb-1 text-sm text-slate-600 font-semibold text-center px-4">
              Drop your resume here
            </p>
            <p className="text-xs text-slate-400 font-bold text-indigo-600">PDF or Text Only</p>
          </div>
          <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-indigo-600 rounded-2xl shadow-lg text-white animate-slide-up">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 bg-white/20 rounded-lg shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">{selectedFile.name}</span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase flex items-center">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Ready
              </span>
            </div>
          </div>
          <button onClick={() => onFileSelect(null)} className="p-1.5 hover:bg-white/10 rounded-full shrink-0">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

// --- Internal Sub-component: ResultCard ---
const ResultCard = ({ result }: { result: NegotiationResult }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 5) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Strong Yes':
      case 'Yes': return 'text-emerald-700 bg-emerald-100 border border-emerald-200';
      case 'Borderline': return 'text-amber-700 bg-amber-100 border border-amber-200';
      default: return 'text-rose-700 bg-rose-100 border border-rose-200';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${getScoreColor(result.score)} shrink-0`}>
          <span className="text-3xl font-black">{result.score}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Power</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Market Leverage</h3>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${getSignalColor(result.hireSignal)}`}>
              {result.hireSignal}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Evaluation: <span className="text-indigo-600 font-bold">{result.estimatedRange}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-5">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h4 className="font-bold text-slate-800">Strengths</h4>
          </div>
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h4 className="font-bold text-slate-800">Risks</h4>
          </div>
          <ul className="space-y-3">
            {result.risks.map((r, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm font-medium text-slate-600">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-slate-300 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-500 rounded-xl">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <h4 className="font-black text-xl tracking-tight">Domination Strategy</h4>
        </div>
        <div className="space-y-3">
          {result.advice.map((step, i) => (
            <div key={i} className="flex items-start space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-black shrink-0 text-xs">
                {i + 1}
              </div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [authorized, setAuthorized] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [resume, setResume] = useState<FileData | null>(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('ashan_ai_authorized') === 'true') setAuthorized(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.toUpperCase() === "ASHAN2025") {
      localStorage.setItem('ashan_ai_authorized', 'true');
      setAuthorized(true);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleAnalyze = async () => {
    if (!resume) return setError("Resume is required.");
    
    if (resume.mimeType.includes('msword') || resume.mimeType.includes('officedocument')) {
      setError("Word documents (.doc, .docx) are not supported. Please export your resume as a PDF or copy the text into a .txt file.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await analyzeNegotiation(resume, jd);
      setResult(data);
    } catch (err: any) {
      console.error("ANALYSIS_ERROR:", err);
      setError(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl text-center">
          <BrainCircuit className="w-12 h-12 text-indigo-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-white mb-8">Ashan <span className="text-indigo-500">AI</span> Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter Access Code"
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl text-white text-center outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl text-white font-black hover:bg-indigo-500 transition-all">
              Login
            </button>
            {loginError && <p className="text-rose-500 text-xs font-bold uppercase mt-2">Invalid Code</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="h-16 sticky top-0 z-50 px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-2 font-black text-xl">
          <BrainCircuit className="w-6 h-6 text-indigo-600" />
          <span>Ashan <span className="text-indigo-600">AI</span></span>
        </div>
        <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
          Active Session
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <FileUpload label="Resume" accept=".pdf,.txt" onFileSelect={setResume} selectedFile={resume} required />
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Job Description (Optional)</label>
            <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste JD here for better alignment..." className="w-full h-40 p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 transition-all text-sm resize-none" />
          </div>
          <button onClick={handleAnalyze} disabled={loading || !resume} className="w-full py-4 bg-indigo-600 rounded-2xl text-white font-black shadow-xl hover:bg-indigo-500 disabled:bg-slate-300 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "Analyzing..." : "Get Strategy"}
          </button>
          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100 flex gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          {result ? <ResultCard result={result} /> : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center bg-white/50">
              <FileText className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">Awaiting Analysis</p>
              <p className="text-xs text-slate-300 mt-2">Upload a PDF or Text resume to begin</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
