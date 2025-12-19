import React from 'react';
import { CVPreview } from './CVPreview';
import { LetterPreview } from './LetterPreview';
import { GeneratedContent } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GeneratedContent;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    // 1. Get the content HTML
    const content = document.getElementById('export-container');
    if (!content) return;

    // 2. Open a new window
    const printWindow = window.open('', '_blank', 'width=1000,height=1200');
    if (!printWindow) {
        alert("Veuillez autoriser les pop-ups pour imprimer.");
        return;
    }

    // 3. Write the document structure with Tailwind and CSS
    printWindow.document.write(`
      <html>
        <head>
          <title>Export Candidature - ${data.cv.fullName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
          <style>
             body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 0; background: white; }
             @page { size: A4; margin: 0; }
             .a4-page { width: 210mm; min-height: 297mm; margin: 0 auto; background: white; page-break-after: always; overflow: hidden; position: relative; }
             /* Hide generic scrollbars in print window */
             ::-webkit-scrollbar { display: none; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            // Wait for fonts and styles to load slightly
            setTimeout(() => {
                window.print();
                // Optional: window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      
      {/* Toolbar */}
      <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 text-white no-print">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-blue-600 w-2 h-6 rounded-sm"></span>
            Aperçu avant Export
        </h2>
        <div className="flex gap-4">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
                Fermer
            </button>
            <button 
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 001.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                </svg>
                Imprimer / PDF
            </button>
        </div>
      </div>

      {/* Printable Container (Hidden scrollbars for cleanliness, but scrollable for preview) */}
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col items-center pb-10">
          <div id="export-container" className="flex flex-col gap-8">
             {/* Page 1: CV */}
             <div className="a4-page shadow-2xl">
                <CVPreview data={data.cv} settings={data.design} />
             </div>
             
             {/* Page 2: Letter */}
             <div className="a4-page shadow-2xl">
                <LetterPreview content={data.coverLetter} cvData={data.cv} settings={data.design} />
             </div>
          </div>
      </div>

    </div>
  );
};