"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
      <CodeMirror
        value={value}
        height="100%"
        extensions={[javascript({ jsx: true })]}
        onChange={(value) => onChange(value)}
        style={{
          height: "100%"
        }}
      />
  );
}