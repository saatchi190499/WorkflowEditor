import React from 'react';
import { Handle, Position } from 'reactflow';

const StartNode = ({ data }) => (
  <div style={{
    padding: 10,
    borderRadius: 20,
    border: `2px solid ${data.color || '#4caf50'}`,
    background: '#e8f5e9',
    width: 80,
    textAlign: 'center'
  }}>
    <strong>▶ {data.label}</strong>
    <Handle type="source" position={Position.Right} style={{ background: data.color || '#4caf50' }} />
  </div>
);

export default StartNode;

