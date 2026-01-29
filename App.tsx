
import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultCard } from './components/ResultCard';
import { analyzeCompensation } from './services/geminiService';
import { NegotiationResult, FileData } from './types';
import { BrainCircuit, Loader2, Sparkles, AlertCircle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [resume, setResume] = useState<FileData | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NegotiationResult | null>(null);

  const handleAnalyze = async () => {
    if (!resume) {
      setError('Resume is mandatory for analysis.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCompensation(resume, jobDescription);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Ashan AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
              Career Domination
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-12">
        {/* Intro */}
        <div className="text-center mb-12 space-y-4 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Ashan Career <span className="text-indigo-600">Domination AI</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
            Strategic salary negotiation intel for the Indian market. Upload your resume to dominate your next compensation discussion.
          </p>
        </div>

        {/* Action Panel */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <FileUpload 
            label="Resume (Mandatory)" 
            accept=".pdf,.docx,.txt" 
            onFileSelect={setResume} 
            selectedFile={resume}
            required
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-700">
                Job Description (Optional)
              </label>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded border">Alignment Tool</span>
            </div>
            <textarea 
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all text-sm outline-none resize-none font-medium"
              placeholder="Paste the target JD to identify specific leverage points and required skills for a higher bracket..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleAnalyze}
              disabled={loading || !resume}
              className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center space-x-2 transition-all shadow-xl ${
                loading || !resume 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Calculating Market Value...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze My Power</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center space-x-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && (
            <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-2xl text-indigo-700/80 text-xs">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Ashan AI uses local Indian market benchmarks (CTC, Fixed vs Variable, ESOP norms) to calculate your negotiation score.</p>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Your Domination Report</h2>
              <button 
                onClick={() => window.print()} 
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Download PDF
              </button>
            </div>
            <ResultCard result={result} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-slate-300">
            <BrainCircuit className="w-5 h-5" />
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-sm font-bold tracking-tighter text-slate-400">Ashan Career Domination</span>
          </div>
          <div className="text-slate-400 text-xs space-y-1 font-medium">
            <p>© 2024 Ashan AI • Precision Negotiation Agent</p>
            <p>Tailored for the Indian Corporate and Tech Ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
