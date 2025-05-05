import { getStraightPath, EdgeLabelRenderer } from 'reactflow';

const CenterArrowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // Manually compute midpoint
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            left: `${labelX}px`,
            top: `${labelY}px`,
            pointerEvents: 'none',
            fontSize: 16,
            fontWeight: 'bold',
            color: '#d55',
          }}
        >
          ➤
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CenterArrowEdge;
