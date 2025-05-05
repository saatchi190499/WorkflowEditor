import React from 'react';
import { Handle, Position } from 'reactflow';

const EndNode = ({ data }) => (
  <div style={{
    padding: 10,
    borderRadius: 20,
    border: `2px solid ${data.color || '#f44336'}`,
    background: '#ffebee',
    width: 80,
    textAlign: 'center'
  }}>
    <strong>⏹ {data.label}</strong>
    <Handle type="target" position={Position.Left} style={{ background: data.color || '#f44336' }} />
  </div>
);

export default EndNode;
  