
import React from 'react';
import { Upload, FileText, X } from 'lucide-react';
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
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {!selectedFile ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors bg-white">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-slate-400" />
            <p className="mb-2 text-sm text-slate-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400">PDF, DOCX, or TXT</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept={accept} 
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
              {selectedFile.name}
            </span>
          </div>
          <button 
            onClick={() => onFileSelect(null)}
            className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      )}
    </div>
  );
};
