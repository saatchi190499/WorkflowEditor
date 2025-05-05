import React, { useState } from 'react';

const predefinedOps = [
  { label: "Sum Two Numbers", code: "result = a + b" },
  { label: "Multiply", code: "result = a * b" },
  { label: "Square Root", code: "import math\nresult = math.sqrt(x)" },
  { label: "Custom Python", code: "" }
];

const OperationModal = ({ node, updateConfig, onClose }) => {
  const [mode, setMode] = useState(node?.data?.config?.mode || "predefined");
  const [selectedOp, setSelectedOp] = useState(node?.data?.config?.selectedOp || "");
  const [pythonScript, setPythonScript] = useState(node?.data?.config?.pythonScript || "");

  const handleSave = () => {
    updateConfig("mode", mode);
    updateConfig("selectedOp", selectedOp);
    updateConfig("pythonScript", pythonScript);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: "10%", left: "30%", right: "30%",
      background: "#fff", padding: 20, border: "2px solid #333", borderRadius: 10,
      zIndex: 1000
    }}>
      <h3>🛠 Operation Configuration</h3>

      <label><strong>Mode:</strong></label><br />
      <select value={mode} onChange={e => setMode(e.target.value)} style={{ width: "100%", marginBottom: 10 }}>
        <option value="predefined">Use Predefined Operation</option>
        <option value="script">Write Custom Python Script</option>
      </select>

      {mode === "predefined" && (
        <>
          <label><strong>Select Operation:</strong></label><br />
          <select
            value={selectedOp}
            onChange={(e) => {
              setSelectedOp(e.target.value);
              setPythonScript(predefinedOps.find(op => op.label === e.target.value)?.code || "");
            }}
            style={{ width: "100%", marginBottom: 10 }}
          >
            {predefinedOps.map(op => (
              <option key={op.label} value={op.label}>{op.label}</option>
            ))}
          </select>
        </>
      )}

      {mode === "script" && (
        <>
          <label><strong>Python Script:</strong></label><br />
          <textarea
            value={pythonScript}
            onChange={e => setPythonScript(e.target.value)}
            rows={10}
            style={{ width: "100%", fontFamily: "monospace" }}
          />
        </>
      )}

      <div style={{ marginTop: 10, textAlign: "right" }}>
        <button onClick={handleSave} style={{ marginRight: 10 }}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default OperationModal;
