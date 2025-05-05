import React from "react";
import { Handle } from "reactflow";

const AssignmentNode = ({ data }) => (
  <div style={{ padding: 10, border: "2px solid #007bff", borderRadius: 8, background: "#cce5ff" }}>
    <strong>📘 {data.label}</strong>
    
    <Handle type="source" position="right" id="a" style={{ top: '50%', background: '#555' }} />
    <Handle type="target" position="left" id="b" style={{ top: '50%', background: '#555' }} />
  </div>
);

export default AssignmentNode;
