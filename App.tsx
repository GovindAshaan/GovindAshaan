
import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultCard } from './components/ResultCard';
import { analyzeCompensation } from './services/geminiService';
import { NegotiationResult, FileData } from './types';
import { BrainCircuit, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [resume, setResume] = useState<FileData | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NegotiationResult | null>(null);

  const handleAnalyze = async () => {
    if (!resume) {
      setError('Resume is mandatory.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCompensation(resume, jobDescription);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Ashan AI</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            <span>Career Domination</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-12">
        {/* Intro Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Ashan Career <span className="text-indigo-600">Domination AI</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Evaluate your market leverage, identify negotiation strengths, and secure the compensation you deserve in the Indian market.
          </p>
        </div>

        {/* Input Controls */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
          <FileUpload 
            label="Upload Resume" 
            accept=".pdf,.docx,.txt" 
            onFileSelect={setResume} 
            selectedFile={resume}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Job Description (Optional)
            </label>
            <textarea 
              className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none resize-none"
              placeholder="Paste the target job description to analyze specific leverage points..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !resume}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${
              loading || !resume 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Dominating Market Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Negotiation Power</span>
              </>
            )}
          </button>

          {error && (
            <div className="flex items-start space-x-3 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Domination Strategy</h2>
              <button 
                onClick={() => window.print()} 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Download Report
              </button>
            </div>
            <ResultCard result={result} />
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-20 py-10 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm space-y-2">
          <p>© 2024 Ashan Career Domination AI • Empowering Professionals in India</p>
          <p>Strategic negotiation advice tailored for top-tier Indian corporate and tech landscape.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
