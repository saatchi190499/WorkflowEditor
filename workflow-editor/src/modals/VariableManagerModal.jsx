import React from "react";

const VariableManagerModal = ({ variables, setVariables, onClose }) => {
  const handleChange = (index, field, value) => {
    const updated = [...variables];
    updated[index][field] = value;
    setVariables(updated);
  };

  const addVariable = () => {
    setVariables([...variables, { name: "", type: "string", value: "", category: "<Globals>" }]);
  };

  const removeVariable = (index) => {
    const updated = [...variables];
    updated.splice(index, 1);
    setVariables(updated);
  };

  return (
    <div style={{
      position: "absolute",
      top: 50,
      left: 50,
      width: 700,
      padding: 20,
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: 8,
      zIndex: 100
    }}>
      <h3>Variable Manager</h3>
      <table style={{ width: "100%", marginBottom: 10 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Initial Value</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {variables.map((v, i) => (
            <tr key={i}>
              <td><input value={v.name} onChange={(e) => handleChange(i, "name", e.target.value)} /></td>
              <td>
                <select value={v.type} onChange={(e) => handleChange(i, "type", e.target.value)}>
                  <option value="string">string</option>
                  <option value="integer">integer</option>
                  <option value="double">double precision</option>
                  <option value="array">array</option>
                </select>
              </td>
              <td><input value={v.value} onChange={(e) => handleChange(i, "value", e.target.value)} /></td>
              <td><input value={v.category} onChange={(e) => handleChange(i, "category", e.target.value)} /></td>
              <td><button onClick={() => removeVariable(i)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addVariable}>+ Add Variable</button>
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default VariableManagerModal;
