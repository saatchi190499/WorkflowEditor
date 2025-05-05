import React from "react";
import { Handle } from "reactflow";

const OperationNode = ({ data }) => {
  const mode = data?.config?.mode || 'predefined';
  const label = data?.label || 'Operation';
  const selectedOp = data?.config?.selectedOp || '';
  const pythonScript = data?.config?.pythonScript || '';

  return (
    <div style={{ padding: 10, border: "2px solid teal", borderRadius: 8, background: "#d0f0f0", minWidth: 160 }}>
      <strong>⚙️ {label}</strong>
      <div style={{ fontSize: '0.75rem', marginTop: 5, color: '#333' }}>
        {mode === 'predefined' && selectedOp ? `🧩 ${selectedOp}` : '🐍 Python Script'}
      </div>

      <Handle type="source" position="right" id="a" style={{ top: '50%', background: '#555' }} />
      <Handle type="target" position="left" id="b" style={{ top: '50%', background: '#555' }} />
    </div>
  );
};

export default OperationNode;
