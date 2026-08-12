"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Loader2, Maximize2, ExternalLink } from 'lucide-react';
import TopNavigation from './TopNavigation';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

interface WorkspaceShellProps {
   activeDocument: any | null;
   documents: any[];
   folders: any[];
   isLoading: boolean;
   isSaving: boolean;
   clients: any[];
   onCreateFolder: () => void;
   onCreateDocument: (type: 'doc' | 'sheet' | 'slide') => void;
   onSelectDocument: (doc: any) => void;
   onUpdateTitle: (title: string) => void;
   onShareClick: () => void;
   renderEditor: () => React.ReactNode;
}

export default function WorkspaceShell({
   activeDocument,
   documents,
   folders,
   isLoading,
   isSaving,
   clients,
   onCreateFolder,
   onCreateDocument,
   onSelectDocument,
   onUpdateTitle,
   onShareClick,
   renderEditor
}: WorkspaceShellProps) {
   const [isFullScreen, setIsFullScreen] = useState(false);
   const isMock = activeDocument?.google_drive_id?.startsWith('mock_') || activeDocument?.link?.includes('mock_');

   return (
      <div className="h-screen bg-card text-white flex flex-col relative overflow-hidden">
         {!isFullScreen && activeDocument && (
            <TopNavigation 
               documentType={activeDocument.type} 
               documentTitle={activeDocument.title}
               isSaving={isSaving}
               onTitleChange={onUpdateTitle}
               onShareClick={onShareClick}
            />
         )}

         <main className="flex-1 flex overflow-hidden">
            {!isFullScreen && (
               <LeftSidebar 
                  isLoading={isLoading}
                  folders={folders}
                  documents={documents}
                  activeDocumentId={activeDocument?.id}
                  onCreateFolder={onCreateFolder}
                  onCreateDocument={onCreateDocument}
                  onSelectDocument={onSelectDocument}
               />
            )}

            <div className="flex-1 relative flex flex-col bg-card">
               <AnimatePresence mode="wait">
                  {activeDocument ? (
                     <motion.div
                        key={activeDocument.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col overflow-hidden"
                     >
                        {(() => {
                           const isPreviewableFile = activeDocument.type === 'pdf' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pptx', 'ppt'].includes(activeDocument.type);
                           const isGoogleNative = activeDocument.documentSource?.startsWith('google_') || ((activeDocument.link || activeDocument.webViewLink) && (activeDocument.link?.includes('docs.google.com') || activeDocument.webViewLink?.includes('docs.google.com')));
                           const isGenericFile = activeDocument.type === 'file' && !['docx', 'doc', 'xlsx', 'xls'].includes(activeDocument.title?.split('.').pop()?.toLowerCase() || '');
                           const usePreviewPane = isGoogleNative || isPreviewableFile || isGenericFile || (!isMock && activeDocument.type === 'file');
                           
                           return usePreviewPane ? (
                           <div className="flex-1 bg-card flex flex-col relative">
                              <div className="h-10 border-b border-white/10 flex items-center justify-between px-6 bg-white/[0.02]">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${activeDocument.type === 'pdf' || (activeDocument.content?.startsWith('data:application/pdf') || activeDocument.title?.toLowerCase().endsWith('.pdf')) ? 'bg-red-500' : (activeDocument.type === 'docx' || activeDocument.type === 'xlsx' || activeDocument.type === 'pptx' || activeDocument.title?.toLowerCase().endsWith('.docx') || activeDocument.title?.toLowerCase().endsWith('.xlsx') || activeDocument.title?.toLowerCase().endsWith('.pptx')) ? 'bg-blue-400' : 'bg-green-500'}`} />
                                    <span className="text-xs font-semibold text-slate-400">
                                       {(activeDocument.type === 'pdf' || activeDocument.content?.startsWith('data:application/pdf') || activeDocument.title?.toLowerCase().endsWith('.pdf')) ? 'PDF Viewer' : (activeDocument.documentSource?.startsWith('google_')) ? 'Live Google Sync' : (activeDocument.content?.startsWith('data:image/')) ? 'Image Viewer' : 'Office Preview'}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    {(activeDocument.link || activeDocument.webViewLink) && (
                                       <a
                                          href={activeDocument.link || activeDocument.webViewLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                       >
                                          Open in new tab <ExternalLink size={12} />
                                       </a>
                                    )}
                                 </div>
                              </div>
                              {(() => {
                                 const link = activeDocument.link || activeDocument.webViewLink;
                                 const isDataUrl = activeDocument.content?.startsWith('data:');
                                 const isPdf = activeDocument.type === 'pdf' || activeDocument.content?.startsWith('data:application/pdf') || activeDocument.title?.toLowerCase().endsWith('.pdf');
                                 const isImage = activeDocument.content?.startsWith('data:image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(activeDocument.type);
                                 
                                 // Render image viewer
                                 if (isImage) {
                                    return (
                                       <div className="flex-1 flex items-center justify-center bg-slate-900/50 p-4">
                                          <img src={activeDocument.content} alt={activeDocument.title} className="max-w-full max-h-full object-contain rounded-lg" />
                                       </div>
                                    );
                                 }

                                 // Render PDF directly
                                 if (isPdf && (isDataUrl || link)) {
                                    return (
                                       <iframe src={isDataUrl ? activeDocument.content : link} className="flex-1 w-full border-none bg-slate-900" title={activeDocument.title} />
                                    );
                                 }

                                 if (isDataUrl && !link) {
                                    // Fallback for Office documents as data URLs (can't be iframed without a public URL)
                                    return (
                                       <div className="flex-1 flex flex-col items-center justify-center bg-card text-center p-8 space-y-4">
                                          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 shadow-sm">
                                             <FileText size={32} />
                                          </div>
                                          <h3 className="text-xl font-bold text-white">{activeDocument.title}</h3>
                                          <p className="text-slate-400 text-sm max-w-md">Office Preview requires a public link. Click below to download and view this file.</p>
                                          <button 
                                             onClick={() => {
                                                const a = document.createElement('a');
                                                a.href = activeDocument.content;
                                                a.download = activeDocument.title;
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                             }}
                                             className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-xl hover:bg-lemon transition-colors"
                                          >
                                             Download File
                                          </button>
                                       </div>
                                    );
                                 }
                                 
                                 // Original Link Logic
                                 const isGoogleNative = activeDocument.documentSource?.startsWith('google_') || (link && link.includes('docs.google.com'));

                                 if (activeDocument.type === 'pdf') return <iframe src={link} className="flex-1 w-full border-none bg-white" title={activeDocument.title} />;
                                 if (isGoogleNative) return <iframe src={link} className="flex-1 w-full border-none bg-white" title={activeDocument.title} />;
                                 if (['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'].includes(activeDocument.type)) {
                                    if (link.includes('localhost') || link.includes('127.0.0.1')) {
                                       return (
                                          <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 border-none w-full h-full p-8 text-center">
                                             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 shadow-sm mb-4">
                                                <FileText size={32} />
                                             </div>
                                             <h3 className="text-xl font-bold text-white mb-2">{activeDocument.title}</h3>
                                             <p className="text-slate-400 text-sm max-w-md text-center mb-6">
                                                Google Docs Preview requires a public URL. Since you are running on localhost, preview is disabled. Click below to download and view this file.
                                             </p>
                                             <a 
                                                href={link}
                                                download={activeDocument.title}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-lemon transition-colors"
                                             >
                                                Download to View
                                             </a>
                                          </div>
                                       );
                                    }
                                    return <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(link)}`} className="flex-1 w-full border-none bg-white" title={activeDocument.title} />;
                                 }
                                 return <iframe src={link} className="flex-1 w-full border-none bg-white" title={activeDocument.title} />;
                              })()}
                           </div>
                        ) : (
                           renderEditor()
                        );
                        })()}
                     </motion.div>
                  ) : (
                     <div className="flex-1 flex items-center justify-center bg-card">
                        <div className="text-center space-y-4 max-w-sm">
                           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mx-auto">
                              <FileText size={32} />
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-xl font-normal text-white">Welcome to Document Studio</h3>
                              <p className="text-slate-400 text-sm">Select a file from the sidebar or create a new one to get started.</p>
                           </div>
                        </div>
                     </div>
                  )}
               </AnimatePresence>

               {/* Editor Footer Tools */}
               {activeDocument && (
                  <div className="h-8 border-t border-white/10 bg-white/[0.02] flex items-center justify-between px-4 text-slate-500 text-xs z-10 shrink-0">
                     <div className="flex items-center gap-4">
                        <button
                           onClick={() => setIsFullScreen(!isFullScreen)}
                           className={`flex items-center gap-1 transition-colors hover:text-white`}
                        >
                           <Maximize2 size={12} />
                           <span>{isFullScreen ? 'Exit full screen' : 'Full screen'}</span>
                        </button>
                     </div>
                     <div className="flex items-center gap-4">
                        <span>Last edited recently</span>
                     </div>
                  </div>
               )}
            </div>

            {!isFullScreen && activeDocument && (
               <RightSidebar 
                  key={activeDocument.id || activeDocument.title}
                  documentTitle={activeDocument.title} 
                  documentContent={activeDocument.description || activeDocument.content}
                  documentType={activeDocument.type}
               />
            )}
         </main>
      </div>
   );
}
