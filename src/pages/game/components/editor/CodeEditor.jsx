import PropTypes from 'prop-types';
import Editor from '@monaco-editor/react';
import './CodeEditor.scss';

export function CodeEditor({ value, onChange, readOnly = false }) {
  return (
    <div className="code-editor">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        theme="vs-dark"
        onChange={(val) => onChange(val ?? '')}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          readOnly,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          wordWrap: 'on',
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          renderLineHighlight: 'all',
          smoothScrolling: true,
          cursorBlinking: 'smooth'
        }}
      />
    </div>
  );
}

CodeEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
};
