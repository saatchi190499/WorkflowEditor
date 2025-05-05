import React from "react";

const LoopModal = ({ node, updateLabel, updateConfig, onClose, variables }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 100,
        padding: 20,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        zIndex: 10,
        width: 300
      }}
    >
      <h3>Loop Settings</h3>
      <label>
        Workflow item name:
        <input
          value={node.data.label}
          onChange={(e) => updateLabel(e.target.value)}
        />
      </label>
      <br /><br />
      <label>
        Variable:
        <input
          list="variable-options"
          value={node.data.config?.variable ?? ""}
          onChange={(e) => updateConfig("variable", e.target.value)}
        />
        <datalist id="variable-options">
          {variables && variables.map((v, idx) => (
            <option key={idx} value={v.name} />
          ))}
        </datalist>

      </label>
      <br /><br />
      <label>
        Starting value:
        <input
          value={node.data.config?.start ?? ""}
          onChange={(e) => updateConfig("start", e.target.value)}
        />
      </label>
      <br /><br />
      <label>
        End value:
        <input
          value={node.data.config?.end ?? ""}
          onChange={(e) => updateConfig("end", e.target.value)}
        />
      </label>
      <br /><br />
      <label>
        Loop increment:
        <input
          value={node.data.config?.increment ?? ""}
          onChange={(e) => updateConfig("increment", e.target.value)}
        />
      </label>
      <br /><br />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default LoopModal;
