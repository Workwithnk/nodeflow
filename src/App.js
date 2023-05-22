import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./Sidebar";

import "./styles/index.css";

const initialNodes = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeClicked, setNodeClicked] = useState(false);
  const [clickToggle, setClickToggle] = useState(false);
  const [nodeId, setNodeId] = useState("");
  const [nodeLabel, setNodeLabel] = useState("node");
  const [valueChange, setValueChange] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${nodeLabel}` },
      };
      setNodeId(newNode?.id);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  useEffect(() => {}, [valueChange === false]);

  return (
    <>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              onClick={(e) => {
                e.preventDefault();
                setNodeClicked(true);
                setClickToggle(!clickToggle);
                let selectedNodeId = e.target.getAttribute("data-id");
                setNodeId(selectedNodeId);
              }}
            />
          </div>
          <Sidebar
            nodes={nodes}
            setNodes={setNodes}
            clickToggle={clickToggle}
            nodeLabel={nodeLabel}
            setNodeLabel={setNodeLabel}
            setNodeId={setNodeId}
            nodeId={nodeId}
            nodeClicked={nodeClicked}
            setNodeClicked={setNodeClicked}
            setValueChange={setValueChange}
            valueChange={valueChange}
            onNodesChange={onNodesChange}
          />
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default DnDFlow;
