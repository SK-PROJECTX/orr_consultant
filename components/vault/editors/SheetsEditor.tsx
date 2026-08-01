"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, X, Activity, Send, Loader2, Bot, User } from 'lucide-react';
import '@fortune-sheet/react/dist/index.css';
import { vaultApi } from '@/lib/vault-api';

interface SheetsEditorProps {
   content: string;
   onChange: (content: string) => void;
   title: string;
   onTitleChange: (title: string) => void;
}

// FortuneSheet uses window/document extensively, so it must be dynamically imported with SSR disabled.
const Workbook = dynamic(() => import('@fortune-sheet/react').then(mod => mod.Workbook), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full w-full bg-gray-50 text-gray-400">Loading spreadsheet engine...</div>
});

export default function SheetsEditor({ content, onChange, title, onTitleChange }: SheetsEditorProps) {
    const [data, setData] = useState<any[]>(() => {
        try {
            if (content && content.startsWith('{')) {
                const parsed = JSON.parse(content);
                // Check if it's the old flat map format (A1: value)
                if (!Array.isArray(parsed) && Object.keys(parsed).some(k => k.match(/^[A-Z]\d+$/))) {
                    const celldata: any[] = [];
                    for (const key in parsed) {
                        const match = key.match(/^([A-Z])(\d+)$/);
                        if (match) {
                            const c = match[1].charCodeAt(0) - 65;
                            const r = parseInt(match[2], 10) - 1;
                            celldata.push({
                                r, c, v: { m: parsed[key], v: parsed[key] }
                            });
                        }
                    }
                    return [{ name: "Sheet1", celldata }];
                }
            } else if (content && content.startsWith('[')) {
                // FortuneSheet native array format
                const parsedSheets = JSON.parse(content);
                // FortuneSheet requires 'celldata' (1D array) for initialization. 
                // If it was saved with 'data' (2D array), we must convert it back.
                return parsedSheets.map((sheet: any) => {
                    if (sheet.data && (!sheet.celldata || sheet.celldata.length === 0)) {
                        const celldata: any[] = [];
                        for (let r = 0; r < sheet.data.length; r++) {
                            const row = sheet.data[r];
                            if (!row) continue;
                            for (let c = 0; c < row.length; c++) {
                                const cell = row[c];
                                if (cell !== null && cell !== undefined) {
                                    celldata.push({ r, c, v: cell });
                                }
                            }
                        }
                        return { ...sheet, celldata, data: undefined };
                    }
                    return sheet;
                });
            }
        } catch (e) {
            console.error("Failed to parse sheet data", e);
        }
        return [{ name: "Sheet1", celldata: [] }];
    });

    const [isParsingExcel, setIsParsingExcel] = useState(false);

    useEffect(() => {
        if (content && content.startsWith('data:') && (content.includes('excel') || content.includes('spreadsheetml') || title?.toLowerCase().endsWith('.xlsx') || title?.toLowerCase().endsWith('.xls'))) {
            setIsParsingExcel(true);
            try {
                const bstr = atob(content.split(',')[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const file = new File([u8arr], title || "file.xlsx", {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                
                // @ts-ignore
                import('luckyexcel').then((LuckyExcel) => {
                    LuckyExcel.default.transformExcelToLucky(file, (exportJson: any) => {
                        if (exportJson.sheets && exportJson.sheets.length > 0) {
                            setData(exportJson.sheets);
                            // Auto-save the parsed json back so next load is faster and editable
                            const newContent = JSON.stringify(exportJson.sheets);
                            onChange(newContent);
                        }
                        setIsParsingExcel(false);
                    }, (err: any) => {
                        console.error("Failed to parse Excel file", err);
                        setIsParsingExcel(false);
                    });
                });
            } catch (err) {
                console.error(err);
                setIsParsingExcel(false);
            }
        }
    }, []);

    const sheetRef = useRef<any>(null);
    const contentRef = useRef(content);
    
    // Fallback to polling the ref to capture all cell edits reliably, as FortuneSheet's onChange can be sparse
    useEffect(() => {
        const interval = setInterval(() => {
            if (sheetRef.current && typeof sheetRef.current.getAllSheets === 'function') {
                const currentData = sheetRef.current.getAllSheets();
                const newContent = JSON.stringify(currentData);
                if (newContent !== contentRef.current) {
                    contentRef.current = newContent;
                    onChange(newContent);
                }
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [onChange]);

    // Keep handleChange for structural updates just in case
    const handleChange = useCallback((d: any[]) => {
        const newContent = JSON.stringify(d);
        if (newContent !== contentRef.current) {
            contentRef.current = newContent;
            onChange(newContent);
        }
    }, [onChange]);

    return (
        <div className="flex-1 bg-white overflow-hidden flex flex-col w-full h-full relative" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="h-14 border-b border-gray-200 bg-white flex items-center px-4 shrink-0 z-30 justify-between">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="flex-1 min-w-[100px] max-w-[200px] sm:max-w-[400px] bg-transparent border-none focus:outline-none text-lg sm:text-xl text-gray-900 font-normal px-2 py-1 hover:bg-gray-50 rounded transition-colors truncate"
                    placeholder="Untitled spreadsheet"
                />
            </div>
            
            <div className="flex-1 relative w-full overflow-hidden flex">
                <div className="flex-1 relative">
                    {isParsingExcel ? (
                        <div className="flex flex-col items-center justify-center h-full w-full bg-white text-gray-500">
                            <Loader2 className="animate-spin mb-4 text-primary" size={40} />
                            <h3 className="text-lg font-medium text-gray-800">Parsing Excel File...</h3>
                            <p className="text-sm mt-2">Loading sheets and formatting. This may take a moment for larger files.</p>
                        </div>
                    ) : (
                        <Workbook 
                            ref={sheetRef}
                            data={data} 
                            onChange={handleChange} 
                            lang="en"
                        />
                    )}
                </div>
                
            </div>

            {/* Custom Styles overrides for FortuneSheet to match our design system */}
            <style>{`
                .fortune-sheet-container {
                    font-family: inherit !important;
                }
                .fortune-sheet-container .luckysheet-stat-area {
                    background-color: #f8f9fa;
                    border-top: 1px solid #e5e7eb;
                }
                .fortune-sheet-container .luckysheet-wa-editor {
                    font-family: monospace;
                }
            `}</style>
        </div>
    );
}
