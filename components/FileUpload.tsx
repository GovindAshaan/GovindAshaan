
import React from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  label: string;
  accept: string;
  onFileSelect: (file: FileData | null) => void;
  selectedFile: FileData | null;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onFileSelect, selectedFile, required }) => {
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
            <p className="mb-1 text-sm text-slate-600 font-semibold">
              Drop your resume here
            </p>
            <p className="text-xs text-slate-400">PDF, Word, or Text (Max 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept={accept} 
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white animate-slide-up">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold truncate max-w-[180px]">
                {selectedFile.name}
              </span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase flex items-center">
                <CheckCircle className="w-2.5 h-2.5 mr-1" /> Document Loaded
              </span>
            </div>
          </div>
          <button 
            onClick={() => onFileSelect(null)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};
