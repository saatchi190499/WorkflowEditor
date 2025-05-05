import React from "react";
import { Handle, Position } from "reactflow";

const IfThenNode = ({ data }) => (
  <div
    style={{
      padding: 10,
      border: "2px solid purple",
      borderRadius: 8,
      background: "#e6e6fa",
      position: "relative",
    }}
  >
    <strong>❓ {data.label}</strong>

    {/* Incoming logic path */}
    <Handle type="target" position={Position.Left} />

    {/* YES output on TOP, aligned left */}
    <Handle
      type="source"
      position={Position.Top}
      id="yes"
      style={{ left: '50%', transform: 'translateX(-50%)', background: "green" }}
    />

    <Handle
      type="source"
      position={Position.Bottom}
      id="no"
      style={{ left: '50%', transform: 'translateX(-50%)', background: "red" }}
    />

  </div>
);

export default IfThenNode;
