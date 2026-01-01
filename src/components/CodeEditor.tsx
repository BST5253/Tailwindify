"use client";

/**
 * Monaco Editor wrapper component
 * Provides a code editor with CSS/plain text syntax highlighting
 */

import Editor, { type OnMount, type Monaco } from "@monaco-editor/react";
import { useCallback, useRef } from "react";

// Get the editor type from Monaco
type IStandaloneCodeEditor = Parameters<OnMount>[0];

interface CodeEditorProps {
	/** Current editor value */
	value: string;
	/** Callback when value changes */
	onChange?: (value: string) => void;
	/** Editor language (css, plaintext) */
	language?: "css" | "plaintext";
	/** Whether the editor is read-only */
	readOnly?: boolean;
	/** Placeholder text when empty */
	placeholder?: string;
}

export function CodeEditor({
	value,
	onChange,
	language = "css",
	readOnly = false,
	placeholder,
}: CodeEditorProps) {
	const editorRef = useRef<IStandaloneCodeEditor | null>(null);

	const handleEditorMount: OnMount = useCallback((editor) => {
		editorRef.current = editor;
	}, []);

	const handleChange = useCallback(
		(newValue: string | undefined) => {
			if (onChange && newValue !== undefined) {
				onChange(newValue);
			}
		},
		[onChange]
	);

	return (
		<div className="relative h-full w-full rounded-lg overflow-hidden border border-gray-700/50 bg-gray-900">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50 h-[40px]">
				<span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
					{language === "css" ? "CSS Input" : "Tailwind Output"}
				</span>
				{readOnly && (
					<span className="text-xs text-gray-500">Read-only</span>
				)}
			</div>

			{/* Editor */}
			<div className="h-[calc(100vh-40px)]">
				<Editor
					height="100%"
					language={language}
					value={value}
					onChange={handleChange}
					onMount={handleEditorMount}
					theme="vs-dark"
					options={{
						readOnly,
						minimap: { enabled: false },
						fontSize: 14,
						fontFamily:
							"'JetBrains Mono', 'Fira Code', Consolas, monospace",
						lineNumbers: "on",
						lineNumbersMinChars: 3,
						scrollBeyondLastLine: false,
						wordWrap: "on",
						tabSize: 2,
						padding: { top: 16, bottom: 16 },
						automaticLayout: true,
						scrollbar: {
							vertical: "auto",
							horizontal: "auto",
							verticalScrollbarSize: 8,
							horizontalScrollbarSize: 8,
						},
						renderLineHighlight: readOnly ? "none" : "line",
						cursorStyle: readOnly ? "underline" : "line",
						placeholder: placeholder,
					}}
				/>
			</div>
		</div>
	);
}
