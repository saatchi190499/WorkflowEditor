import React from "react";

const AssignmentModal = ({ node, setNode, updateConfig, onClose, variables }) => {
  const updateAssignmentConfig = (index, field, value) => {
    const updated = [...node.data.config.assignments];
    updated[index][field] = value;
    updateConfig("assignments", updated);
  };

  const addAssignmentRow = () => {
    updateConfig("assignments", [...node.data.config.assignments, { variable: "", value: "" }]);
  };

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
        width: 500
      }}
    >
      <h3>Assignment Settings</h3>
      {node.data.config.assignments.map((a, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <input
            list="variable-options"
            style={{ width: 150, marginRight: 10 }}
            placeholder="Variable"
            value={a.variable}
            onChange={(e) => updateAssignmentConfig(i, "variable", e.target.value)}
          />
          <datalist id="variable-options">
            {variables && variables.map((v, idx) => (
              <option key={idx} value={v.name} />
            ))}
          </datalist>
          =
          <input
            style={{ width: 250, marginLeft: 10 }}
            placeholder="Value"
            value={a.value}
            onChange={(e) => updateAssignmentConfig(i, "value", e.target.value)}
          />
        </div>
      ))}
      <button onClick={addAssignmentRow}>+ Add Assignment</button>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default AssignmentModal;
