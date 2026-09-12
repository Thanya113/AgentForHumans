import React, { useState, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  File, 
  Search, 
  ShieldCheck, 
  ExternalLink,
  Info,
  ChevronRight
} from 'lucide-react';
import { UploadedDocument } from '../../types';

interface DocumentsViewProps {
  documents: UploadedDocument[];
  onUpload: (file: { name: string; size: string; type: string }) => Promise<UploadedDocument>;
  onNavigateToAgent?: (docName: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onUpload,
  onNavigateToAgent
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    try {
      const doc = await onUpload({
        name: file.name,
        size: sizeStr,
        type: file.type || 'application/pdf'
      });
      setSelectedDocId(doc.id);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wide">
              Document Intake & OCR Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Operational Documents</h1>
          <p className="text-sm text-slate-400">
            Ingest vendor invoices, return claim photos, rate cards, and contracts for autonomous analysis.
          </p>
        </div>
      </div>

      {/* Production Disclaimer Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> Document analysis shown below uses local preview simulation. Real-world document processing requires connecting to <strong>AWS S3</strong> (staging bucket) and <strong>Amazon Textract / Bedrock Multimodal Claude</strong> in your AWS account.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="document-dropzone"
        className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-950/20' 
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
        }`}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg,.csv,.txt"
          onChange={handleFileChange}
        />
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-200">
            {isUploading ? 'Uploading & Simulating Ingestion...' : 'Click or Drag & Drop Operational Files'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supported formats: <strong className="text-slate-300">PDF, PNG, JPG, CSV, TXT</strong>
          </p>
        </div>
      </div>

      {/* Main Split: Documents List & Extracted Information / Agent Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Documents List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Staged Documents ({documents.length})
          </h2>

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-850 border-indigo-500 shadow-md shadow-indigo-950' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300">
                        {doc.format}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{doc.fileSize}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      {doc.uploadStatus}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-200 truncate">{doc.filename}</h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{doc.processingStatus}</span>
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Document Details, Extracted Information & Agent Analysis */}
        {selectedDoc ? (
          <div className="lg:col-span-7 space-y-6">
            {/* Document Header Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-indigo-400 font-bold">{selectedDoc.id}</span>
                  <h2 className="text-lg font-bold text-slate-100 mt-0.5">{selectedDoc.filename}</h2>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800 text-slate-300">
                  {selectedDoc.format} · {selectedDoc.fileSize}
                </span>
              </div>

              {/* Extracted Information */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Extracted Metadata & Key-Values</span>
                </h3>

                {selectedDoc.extractedInformation ? (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                    {selectedDoc.extractedInformation.documentType && (
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Document Type:</span>
                        <span className="font-semibold text-slate-200">{selectedDoc.extractedInformation.documentType}</span>
                      </div>
                    )}
                    {selectedDoc.extractedInformation.vendor && (
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Vendor / Party:</span>
                        <span className="font-semibold text-slate-200">{selectedDoc.extractedInformation.vendor}</span>
                      </div>
                    )}
                    {selectedDoc.extractedInformation.invoiceNumber && (
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Reference / Invoice #:</span>
                        <span className="font-mono font-semibold text-slate-200">{selectedDoc.extractedInformation.invoiceNumber}</span>
                      </div>
                    )}
                    {selectedDoc.extractedInformation.totalAmount && (
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Detected Total:</span>
                        <span className="font-mono font-bold text-emerald-400">{selectedDoc.extractedInformation.totalAmount}</span>
                      </div>
                    )}
                    {selectedDoc.extractedInformation.rawSummary && (
                      <div className="pt-2">
                        <span className="text-slate-400 block mb-1">OCR Analysis Summary:</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          {selectedDoc.extractedInformation.rawSummary}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No structured data extracted.</p>
                )}
              </div>

              {/* Agent Analysis & Policy Recommendations */}
              {selectedDoc.agentAnalysis && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>OpsPilot Agent Assessment</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {selectedDoc.agentAnalysis.confidenceScore}% Confidence
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Verification Flags
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDoc.agentAnalysis.flags.map((flag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedDoc.agentAnalysis.recommendedTask && (
                      <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
                        <span className="text-slate-300 font-bold block mb-1">Recommended Follow-Up Action:</span>
                        <p className="text-indigo-200 text-[11px]">{selectedDoc.agentAnalysis.recommendedTask}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
