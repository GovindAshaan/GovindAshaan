
import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, FileText, Sparkles, 
  Loader2, AlertTriangle, CheckCircle2,
  TrendingUp, Lock, ShieldCheck as ShieldIcon,
  Upload, X, Zap, Target, Star, ShieldCheck
} from 'lucide-react';
import { NegotiationResult, FileData } from './types.ts';
import { analyzeNegotiation } from './geminiService.ts';

// --- Sub-component: FileUpload ---
interface FileUploadProps {
  label: string;
  accept: string;
  onFileSelect: (file: FileData | null) => void;
  selectedFile: FileData | null;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onFileSelect, selectedFile, required }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        onFileSelect({
          name: file.name,
          data: base64Data,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
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
            <p className="text-xs text-slate-400">PDF, Word, or Text (Max 5MB)</p>
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
              <span className="text-sm font-bold truncate">
                {selectedFile.name}
              </span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase flex items-center">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Loaded
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

// --- Sub-component: ResultCard ---
const ResultCard: React.FC<{ result: NegotiationResult }> = ({ result }) => {
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
      case 'No':
      case 'High Risk': return 'text-rose-700 bg-rose-100 border border-rose-200';
      default: return 'text-slate-700 bg-slate-100';
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
          <p className="text-sm text-slate-500 font-medium">Estimated Range: <span className="text-indigo-600 font-bold">{result.estimatedRange}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-5">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h4 className="font-bold text-slate-800">Negotiation Strengths</h4>
          </div>
          <ul className="space-y-4">
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
            <h4 className="font-bold text-slate-800">Comp Risks</h4>
          </div>
          <ul className="space-y-4">
            {result.risks.map((r, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm font-medium text-slate-600">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-slate-300 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-indigo-600" />
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Market Context</h4>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-wrap">
          {result.marketAlignment}
        </p>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
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
                <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-black shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm font-bold text-slate-200 pt-1 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
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
      const msg = err.message || "Request failed. Check your API key.";
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
              <span className="text-[10px] font-black uppercase tracking-widest text-center w-full">Authorized Access Only</span>
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
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Access Active</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 mt-12">
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
                className="w-full h-48 p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium resize-none"
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
                <p className="text-sm text-slate-300 mt-2 max-w-xs mx-auto">
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
