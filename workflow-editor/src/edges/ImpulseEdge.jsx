import { useReactFlow } from 'reactflow';

// Utility: Perpendicular step-style path with clean turns
const getSmartPerpendicularPath = ({
  sourceX,
  sourceY,
  sourcePosition = 'right',
  targetX,
  targetY,
  targetPosition = 'left',
  offset = 0
}) => {
  let path = `M${sourceX},${sourceY}`;

  // Exit source node
  switch (sourcePosition) {
    case 'top':
      path += ` L${sourceX},${sourceY - offset}`;
      break;
    case 'bottom':
      path += ` L${sourceX},${sourceY + offset}`;
      break;
    case 'left':
      path += ` L${sourceX - offset},${sourceY}`;
      break;
    case 'right':
    default:
      path += ` L${sourceX + offset},${sourceY}`;
      break;
  }

  // Midway path (H/V step)
  if (sourcePosition === 'left' || sourcePosition === 'right') {
    const midX = (sourceX + targetX) / 2;
    path += ` L${midX},${sourceY} L${midX},${targetY}`;
  } else {
    const midY = (sourceY + targetY) / 2;
    path += ` L${sourceX},${midY} L${targetX},${midY}`;
  }

  // Enter target node
  switch (targetPosition) {
    case 'top':
      path += ` L${targetX},${targetY - offset} L${targetX},${targetY}`;
      break;
    case 'bottom':
      path += ` L${targetX},${targetY + offset} L${targetX},${targetY}`;
      break;
    case 'left':
      path += ` L${targetX - offset},${targetY} L${targetX},${targetY}`;
      break;
    case 'right':
    default:
      path += ` L${targetX + offset},${targetY} L${targetX},${targetY}`;
      break;
  }

  return path;
};

const ImpulseEdge = ({
  id,
  source,
  sourceX,
  sourceY,
  sourcePosition = 'right',
  target,
  targetX,
  targetY,
  targetPosition = 'left',
  markerEnd,
  label
}) => {
  const { getNodes } = useReactFlow();
  const nodes = getNodes();
  const sourceNode = nodes.find((n) => n.id === source);
  const strokeColor = sourceNode?.data?.color || '#555';
  const edgeLabel = label || '';

  const edgePath = getSmartPerpendicularPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <g>
      {/* Main path */}
      <text
        x={(sourceX + targetX) / 2}
        y={(sourceY + targetY) / 2 - 10}
        fill="black"
        fontSize={12}
        textAnchor="middle"
      >
        {edgeLabel}
      </text>
      <path
        id={id}
        d={edgePath}
        stroke={strokeColor}
        strokeWidth={2}
        fill="none"
      />

      {/* Animated pulse */}
      <circle r="5" fill={strokeColor}>
        <animateMotion dur="1.5s" repeatCount="indefinite">
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>
    </g>
  );
};

export default ImpulseEdge;
