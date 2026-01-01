'use client';

/**
 * Main converter layout component
 * Side-by-side editors with convert and copy functionality
 */

import { useState, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { convertCssToTailwindDetailed } from '@/lib/converter';
import { copyToClipboard } from '@/lib/utils';

// Example CSS for initial state
const EXAMPLE_CSS = `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin: 8px;
  background-color: #1a1a2e;
  border-radius: 8px;
}

.button {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  background-color: #6366f1;
  padding: 12px;
  border-radius: 6px;
}`;

export function ConverterLayout() {
  const [cssInput, setCssInput] = useState(EXAMPLE_CSS);
  const [tailwindOutput, setTailwindOutput] = useState('');
  const [unsupportedProps, setUnsupportedProps] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    setIsConverting(true);
    
    // Small delay for visual feedback
    setTimeout(() => {
      const result = convertCssToTailwindDetailed(cssInput);
      setTailwindOutput(result.classes.join(' '));
      setUnsupportedProps(result.unsupported);
      setIsConverting(false);
    }, 100);
  }, [cssInput]);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(tailwindOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [tailwindOutput]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-4 px-6 bg-gray-900/50 border-b border-gray-800">
        <button
          onClick={handleConvert}
          disabled={isConverting || !cssInput.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 
                     hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600
                     text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20
                     transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30
                     disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isConverting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Converting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Convert to Tailwind
            </>
          )}
        </button>

        <button
          onClick={handleCopy}
          disabled={!tailwindOutput}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 
                     disabled:bg-gray-800 disabled:text-gray-500
                     text-white font-medium rounded-lg transition-all duration-200
                     disabled:cursor-not-allowed"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Output
            </>
          )}
        </button>
      </div>

      {/* Editors Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0">
        {/* CSS Input Editor */}
        <div className="h-full min-h-[300px] lg:min-h-0">
          <CodeEditor
            value={cssInput}
            onChange={setCssInput}
            language="css"
            placeholder="Paste your CSS here..."
          />
        </div>

        {/* Tailwind Output Editor */}
        <div className="h-full min-h-[300px] lg:min-h-0">
          <CodeEditor
            value={tailwindOutput}
            language="plaintext"
            readOnly
            placeholder="Tailwind classes will appear here..."
          />
        </div>
      </div>

      {/* Unsupported Properties Warning */}
      {unsupportedProps.length > 0 && (
        <div className="mx-4 mb-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-400">Unsupported Properties</h4>
              <p className="mt-1 text-xs text-gray-400">
                {unsupportedProps.slice(0, 5).join(' • ')}
                {unsupportedProps.length > 5 && ` • +${unsupportedProps.length - 5} more`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
