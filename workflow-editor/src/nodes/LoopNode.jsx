import React from "react";
import { Handle, Position } from "reactflow";

const LoopNode = ({ data }) => {
  const { sourceSide = 'right', targetSide = 'left' } = data;

  const getPosition = (side) => {
    switch (side) {
      case 'top': return Position.Top;
      case 'bottom': return Position.Bottom;
      case 'left': return Position.Left;
      case 'right': return Position.Right;
      default: return Position.Right;
    }
  };

  return (
    <div style={{
      padding: 10,
      border: "2px solid orange",
      borderRadius: 8,
      background: "#fffacd",
      position: "relative",
    }}>
      <strong>🔁 {data.label}</strong>

      {/* Render only one handle per side dynamically */}
      <Handle
        type="source"
        position={getPosition(sourceSide)}
        id="dynamic-source"
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={getPosition(targetSide)}
        id="dynamic-target"
        style={{ background: '#555' }}
      />
    </div>
  );
};


export default LoopNode;
