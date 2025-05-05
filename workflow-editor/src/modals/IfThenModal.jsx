import React from "react";

const IfThenModal = ({ node, updateLabel, updateConfig, onClose, variables }) => {
  const updateConditionRow = (index, field, value) => {
    const updated = [...(node.data.config.conditions || [])];
    if (!updated[index]) updated[index] = { andOr: "", lhs: "", operator: "", rhs: "" };
    updated[index][field] = value;
    updateConfig("conditions", updated);
  };

  const addConditionRow = () => {
    const current = node.data.config.conditions || [];
    updateConfig("conditions", [...current, { andOr: "", lhs: "", operator: "", rhs: "" }]);
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
        width: 600
      }}
    >
      <h3>If...Then Condition</h3>

      <label>
        Workflow item name:
        <input
          value={node.data.label}
          onChange={(e) => updateLabel(e.target.value)}
        />
      </label>

      <table style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>And/Or</th>
            <th>Expression LHS</th>
            <th>Condition</th>
            <th>Expression RHS</th>
          </tr>
        </thead>
        <tbody>
          {(node.data.config.conditions || []).map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  value={row.andOr}
                  onChange={(e) => updateConditionRow(i, "andOr", e.target.value)}
                />
              </td>
              <td>
                <input list="variable-options" value={row.lhs} onChange={(e) => updateConditionRow(i, "lhs", e.target.value)} />
              </td>
              <td>
                <input
                  value={row.operator}
                  onChange={(e) => updateConditionRow(i, "operator", e.target.value)}
                />
              </td>
              <td>
                <input list="variable-options" value={row.rhs} onChange={(e) => updateConditionRow(i, "rhs", e.target.value)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addConditionRow}>+ Add Condition</button>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <button onClick={onClose}>OK</button>
      </div>

      <datalist id="variable-options">
        {variables && variables.map((v, idx) => (
          <option key={idx} value={v.name} />
        ))}
      </datalist>
    </div>
  );
};

export default IfThenModal;
