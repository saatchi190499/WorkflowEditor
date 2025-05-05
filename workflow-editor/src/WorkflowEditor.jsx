// React Workflow Editor UI (with variable checks and execution highlight)

import React, { useCallback, useState } from "react";
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Panel,
    MarkerType,
    ConnectionLineType
} from "reactflow";
import "reactflow/dist/style.css";

import ImpulseEdge from "./edges/ImpulseEdge";
import LoopNode from "./nodes/LoopNode";
import IfThenNode from "./nodes/IfThenNode";
import OperationNode from "./nodes/OperationNode";
import AssignmentNode from "./nodes/AssignmentNode";
import StartNode from './nodes/StartNode';
import EndNode from './nodes/EndNode';

import AssignmentModal from "./modals/AssignmentModal";
import LoopModal from "./modals/LoopModal";
import IfThenModal from "./modals/IfThenModal";
import VariableManagerModal from "./modals/VariableManagerModal";
import OperationModal from "./modals/OperationalModal";

const evaluate = (expression, variablesMap = {}) => {
    if (typeof expression !== 'string') return expression;
    const expr = expression.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, match => {
        return variablesMap.hasOwnProperty(match) ? variablesMap[match] : match;
    });
    try {
        return eval(expr);
    } catch {
        return expression;
    }
};


const edgeTypes = {
    impulse: ImpulseEdge
};


const nodeTypes = {
    loop: LoopNode,
    ifThen: IfThenNode,
    operation: OperationNode,
    assignment: AssignmentNode,
    start: StartNode,
    end: EndNode
};

const initialNodes = [
    {
        id: "1",
        type: "loop",
        position: { x: 100, y: 100 },
        data: {
            label: "Row Loop",
            color: "#ff0000",
            config: {
                variable: "r",
                start: "0",
                end: "boundary_pressure_count-1",
                increment: "1"
            }
        }
    },
    {
        id: "2",
        type: "ifThen",
        position: { x: 400, y: 100 },
        data: {
            label: "LogCond-1",
            config: {
                conditions: [
                    { andOr: "", lhs: "r", operator: "<", rhs: "boundary_pressure_count" }
                ]
            }
        }
    },
    {
        id: "3",
        type: "operation",
        position: { x: 700, y: 100 },
        data: { label: "Flashing off", config: { expression: "flash = true" } }
    },
    {
        id: 'start',
        type: 'start',
        position: { x: 50, y: 100 },
        data: { label: 'Start', color: '#4caf50' }, // green
        style: { border: '2px solid #4caf50' }
    },
    {
        id: 'end',
        type: 'end',
        position: { x: 700, y: 100 },
        data: { label: 'End', color: '#f44336' }, // red
        style: { border: '2px solid #f44336' }
    }
];

const initialEdges = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'impulse',
        label: 'Loop',
        labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
        labelStyle: { fontWeight: 'bold' }
    },
    {
        id: 'e2-3',
        source: '2',
        target: '3',
        type: 'impulse',
        label: 'Yes',
        labelBgStyle: { fill: 'green', fillOpacity: 0.1 },
        labelStyle: { fill: 'green', fontWeight: 'bold' }
    },
    {
        id: 'e2-4',
        source: '2',
        target: '1',
        type: 'impulse',
        label: 'No',
        labelBgStyle: { fill: 'red', fillOpacity: 0.1 },
        labelStyle: { fill: 'red', fontWeight: 'bold' }
    },
];


let id = 4;
const getId = () => `${id++}`;

const WorkflowEditor = () => {
    const checkAndAddVariables = (node) => {
        const usedVars = new Set();
        const valueMap = {};

        if (node.type === "loop" && node.data.config?.variable && isNaN(node.data.config.variable)) {
            usedVars.add(node.data.config.variable);
            valueMap[node.data.config.variable] = node.data.config.start;
        }
        if (node.type === "assignment") {
            (node.data.config.assignments || []).forEach(a => {
                usedVars.add(a.variable);
                valueMap[a.variable] = a.value;
            });
        }
        // if (node.type === "ifThen") {
        //   (node.data.config.conditions || []).forEach(c => {
        //     if (isNaN(c.lhs)) usedVars.add(c.lhs);
        //     if (isNaN(c.rhs)) usedVars.add(c.rhs);
        //     if (isNaN(c.lhs)) valueMap[c.lhs] = c.lhs;
        //     if (isNaN(c.rhs)) valueMap[c.rhs] = c.rhs;
        //   });
        // }

        const existingVarNames = variables.map(v => v.name);
        usedVars.forEach(name => {
            if (name && !existingVarNames.includes(name)) {
                const shouldAdd = window.confirm(`Variable "${name}" not found. Do you want to add it?`);
                if (shouldAdd) {
                    const rawValue = valueMap[name] ?? "";
                    const inferredType = inferType(String(rawValue).trim());
                    setVariables(prev => [...prev, { name, type: inferredType, value: rawValue, category: "<Globals>" }]);
                }
            }
        });
    };

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showVariableManager, setShowVariableManager] = useState(false);
    const [variables, setVariables] = useState([
        { name: "boundary_pressure_count", type: "integer", value: 0, category: "<Globals>" },
        { name: "calc_status", type: "integer", value: 0, category: "<Globals>" }
    ]);
    const [currentStep, setCurrentStep] = useState(null);
    const [runVariables, setRunVariables] = useState({});
    const [executionLog, setExecutionLog] = useState([]);

    const inferType = (val) => {
        if (/^\[.*\]$/.test(val)) return "array";
        if (/^-?\d+$/.test(val)) return "integer";
        if (/^-?\d+\.\d+$/.test(val)) return "double";
        if (val === "true" || val === "false") return "boolean";
        return "string";
    };

    const onConnect = useCallback((params) => {
        const label = params.sourceHandle === 'yes' ? 'Yes' :
            params.sourceHandle === 'no' ? 'No' : '';

        setEdges((eds) =>
            addEdge({
                ...params,
                type: 'impulse',
                label,
                labelStyle: { fontWeight: 'bold' }
            }, eds)
        );
    }, []);





    const handleAddNode = (type) => {
        const configDefaults = {
            loop: { start: "0", end: "10", variable: "i", increment: "1" },
            ifThen: { conditions: [{ andOr: "", lhs: "", operator: "", rhs: "" }] },
            operation: { expression: "x = y + 1" },
            assignment: { assignments: [{ variable: "", value: "" }] }
        };

        const newNode = {
            id: getId(),
            type,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: {
                label: `${type} node`,
                config: configDefaults[type] || {}
            }
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const handleNodeDoubleClick = (_, node) => {
        setSelectedNode(node);
    };

    const updateNodeLabel = (label) => {
        setNodes((nds) =>
            nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, label } } : n))
        );
        setSelectedNode((n) => ({ ...n, data: { ...n.data, label } }));
    };

    const updateNodeConfig = (key, value) => {
        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNode.id
                    ? {
                        ...n,
                        data: {
                            ...n.data,
                            config: { ...n.data.config, [key]: value }
                        }
                    }
                    : n
            )
        );
        setSelectedNode((n) => ({
            ...n,
            data: {
                ...n.data,
                config: { ...n.data.config, [key]: value }
            }
        }));
    };

    const startExecution = () => {
        if (nodes.length > 0) {
            const vars = {};
            variables.forEach(v => { vars[v.name] = v.value; });
            setRunVariables(vars);
            setExecutionLog([]);
            const startNode = nodes.find((n) => n.type === 'start');
            if (startNode) {
                setCurrentStep(startNode.id);
            } else {
                console.warn("Start node not found.");
            }

        }
    };

    const runNextStep = () => {
        if (!currentStep) return;
        const currentNode = nodes.find(n => n.id === currentStep);
        if (!currentNode) {
            console.warn("Current step node not found");
            return;
        }
        const log = [];
        const updatedVars = { ...runVariables };

        if (currentNode.type === "start") {
            const next = edges.find(e => e.source === currentNode.id);
            if (next) {
                setCurrentStep(next.target);
            } else {
                console.warn("No outgoing edge from Start node.");
                setCurrentStep(null);
            }
            return;
        }

        if (currentNode.type === "assignment") {
            for (const a of currentNode.data.config.assignments || []) {
                const val = a.value;
                updatedVars[a.variable] = isNaN(val) ? val : Number(val);
                log.push(`Set ${a.variable} = ${val}`);
            }
        }

        if (currentNode.type === "operation") {
            const { mode, selectedOp, pythonScript } = currentNode.data.config;
          
            if (mode === "script" && pythonScript.trim()) {
              log.push(`▶️ Running Python script...`);
          
              fetch("http://localhost:8000/api/run-script/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: pythonScript }),
              })
                .then(res => res.json())
                .then(data => {
                  if (data.stdout) log.push(`✅ Output: ${data.stdout}`);
                  if (data.stderr) log.push(`⚠️ Error: ${data.stderr}`);
                  if (data.error)  log.push(`❌ Exception: ${data.error}`);
          
                  setExecutionLog(prev => [...prev, ...log]);
                  setRunVariables(updatedVars);
                  const nextEdge = edges.find((e) => e.source === currentNode.id);
                  if (nextEdge) setCurrentStep(nextEdge.target);
                  else log.push("No next step.");
                })
                .catch(err => {
                  log.push(`❌ Failed to run script: ${err.message}`);
                  setExecutionLog(prev => [...prev, ...log]);
                });
          
              return; // Defer next step until fetch completes
            }
          
            // if predefined op
            log.push(`Predefined operation: ${selectedOp}`);
            // ...
          }
          


        if (currentNode.type === "loop") {
            const { variable, start, end, increment } = currentNode.data.config;
            const startVal = Number(evaluate(start, updatedVars));
            const endVal = Number(evaluate(end, updatedVars));
            const step = Number(increment) || 1;

            let current = updatedVars[variable];

            if (current === undefined || current === null || isNaN(Number(current))) {
                // First time entering loop: initialize variable
                current = startVal;
                updatedVars[variable] = current;
                log.push(`Loop initialized: ${variable} = ${current}`);

                // Go to first node in loop body
                const loopBodyEdge = edges.find(e => e.source === currentNode.id);
                if (loopBodyEdge) {
                    setCurrentStep(loopBodyEdge.target);
                } else {
                    log.push("No loop body to run");
                    setCurrentStep(null);
                }

            } else {
                // Increment and check condition
                current = Number(current) + step;
                updatedVars[variable] = current;
                log.push(`Loop incremented: ${variable} = ${current}`);

                const continueLoop = step > 0 ? current <= endVal : current >= endVal;

                if (continueLoop) {
                    // Repeat loop body
                    const loopBodyEdge = edges.find(e => e.source === currentNode.id);
                    if (loopBodyEdge) {
                        setCurrentStep(loopBodyEdge.target);
                    } else {
                        log.push("Loop body not found");
                        setCurrentStep(null);
                    }
                } else {
                    // Loop finished → go to next node after loop
                    const nextAfterLoop = edges.find(e => e.source === currentNode.id);
                    if (nextAfterLoop) {
                        setCurrentStep(nextAfterLoop.target);
                    } else {
                        log.push("Loop complete, no next step");
                        setCurrentStep(null);
                    }

                    // Clear the loop variable if you want to allow re-looping later
                    delete updatedVars[variable];
                }
            }

            setExecutionLog(prev => [...prev, ...log]);
            setRunVariables(updatedVars);
            return; // prevent further processing
        }





        if (currentNode.type === "ifThen") {
            const cond = currentNode.data.config.conditions?.[0];
            if (cond) {
                const lhs = updatedVars[cond.lhs] ?? cond.lhs;
                const rhs = updatedVars[cond.rhs] ?? cond.rhs;
                let conditionMet = false;

                switch (cond.operator) {
                    case "<": conditionMet = lhs < rhs; break;
                    case "<=": conditionMet = lhs <= rhs; break;
                    case "==": conditionMet = lhs == rhs; break;
                    case ">=": conditionMet = lhs >= rhs; break;
                    case ">": conditionMet = lhs > rhs; break;
                    default: conditionMet = false;
                }

                log.push(`IfThen: ${lhs} ${cond.operator} ${rhs} => ${conditionMet}`);

                const expected = conditionMet ? 'yes' : 'no';

                const path = edges.find(e =>
                    e.source === currentNode.id &&
                    (
                        e.sourceHandle?.toLowerCase() === expected ||
                        e.label?.toLowerCase() === expected
                    )
                );


                if (path) {
                    log.push(`Branch "${expected}" → ${path.target}`);
                    setCurrentStep(path.target);
                } else {
                    log.push(`❌ No '${expected}' path found from IfThen`);
                    setCurrentStep(null);
                }

                setExecutionLog((prev) => [...prev, ...log]);
                setRunVariables(updatedVars);
                return;
            }
        }




        if (currentNode.type === "assignment" || currentNode.type === "operation") {
            // ✅ Now it's safe to default to first outgoing edge
            const nextEdge = edges.find((e) => e.source === currentNode.id);
            if (nextEdge) {
                setCurrentStep(nextEdge.target);
            } else {
                setCurrentStep(null);
                log.push("Workflow completed");
            }
        }

        setExecutionLog((prev) => [...prev, ...log]);
        setRunVariables(updatedVars);

    };

    const highlightedNodes = nodes.map((node) =>
        node.id === currentStep ? { ...node, style: { ...node.style, border: '3px solid red' } } : node
    );

    return (
        <ReactFlowProvider>
            <div style={{ width: "100vw", height: "100vh" }}>
                <ReactFlow
                    nodes={highlightedNodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeDoubleClick={handleNodeDoubleClick}
                    nodeTypes={nodeTypes}
                    fitView
                    deleteKeyCode={"Backspace"}
                    connectionLineType={ConnectionLineType.Step}
                    edgeTypes={edgeTypes}
                    defaultEdgeOptions={{
                        type: 'impulse',
                        //animated: true, // ✅ enables animation globally
                        markerEnd: { type: MarkerType.ArrowClosed },
                        style: { stroke: '#d55', strokeWidth: 2 }
                    }}
                >
                    <MiniMap />
                    <Controls />
                    <Background gap={16} />

                    <Panel position="top-left">
                        <button onClick={() => handleAddNode("loop")}>+ Loop</button>
                        <button onClick={() => handleAddNode("ifThen")}>+ IfThen</button>
                        <button onClick={() => handleAddNode("operation")}>+ Operation</button>
                        <button onClick={() => handleAddNode("assignment")}>+ Assignment</button>
                        <button onClick={() => setShowVariableManager(true)}>⚙️ Manage Variables</button>
                        <button onClick={startExecution}>▶️ Run</button>
                        <button onClick={runNextStep}>⏭️ Next</button>
                    </Panel>
                    <div style={{ width: 300, background: "#f4f4f4", padding: 10, overflowY: "auto" }}>
                        <h4>Execution Log</h4>
                        <ul>
                            {executionLog.map((line, idx) => <li key={idx}>{line}</li>)}
                        </ul>
                        <h4>Variables</h4>
                        <ul>
                            {Object.entries(runVariables).map(([key, val]) => (
                                <li key={key}><strong>{key}</strong>: {val}</li>
                            ))}
                        </ul>
                    </div>
                    {selectedNode?.type === "assignment" && (
                        <AssignmentModal
                            node={selectedNode}
                            setNode={setSelectedNode}
                            updateConfig={updateNodeConfig}
                            variables={variables}  // <-- Pass variable options
                            setVariables={setVariables}
                            onClose={() => {
                                checkAndAddVariables(selectedNode);
                                setSelectedNode(null);
                            }}
                        />
                    )}

                    {selectedNode?.type === "loop" && (
                        <LoopModal
                            node={selectedNode}
                            updateLabel={updateNodeLabel}
                            updateConfig={updateNodeConfig}
                            variables={variables}
                            setVariables={setVariables}
                            onClose={() => {
                                checkAndAddVariables(selectedNode);
                                setSelectedNode(null);
                            }}
                        />
                    )}
                    {selectedNode?.type === "operation" && (
                        <OperationModal
                            node={selectedNode}
                            updateConfig={updateNodeConfig}
                            onClose={() => setSelectedNode(null)}
                        />
                    )}

                    {selectedNode?.type === "ifThen" && (
                        <IfThenModal
                            node={selectedNode}
                            updateLabel={updateNodeLabel}
                            updateConfig={updateNodeConfig}
                            variables={variables}
                            setVariables={setVariables}
                            onClose={() => {
                                checkAndAddVariables(selectedNode);
                                setSelectedNode(null);
                            }}
                        />
                    )}

                    {showVariableManager && (
                        <VariableManagerModal
                            variables={variables}
                            setVariables={setVariables}
                            onClose={() => setShowVariableManager(false)}
                        />
                    )}
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};

export default WorkflowEditor;
