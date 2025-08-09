"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";

export default function CodeEditor() {
  const [code, setCode] = useState("// Digite seu código aqui");

  return (
    <CodeMirror
      value={code}
      height="100%"
      extensions={[javascript({ jsx: true })]}
      onChange={(value) => setCode(value)}
      style={{
        height: "100%"
      }}
    />
  );
}