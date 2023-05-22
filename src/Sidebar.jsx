import React, { useEffect, useState } from "react";
import { TbMessage } from "react-icons/tb";
import { BsArrowLeftShort } from "react-icons/bs";
import "./styles/sidebar.css";

export default ({
  nodeClicked,
  setNodeClicked,
  nodeId,
  clickToggle,
  nodes,
  setNodes,
  setValueChange,
  valueChange,
}) => {
  const [fltData, setFltData] = useState([]);
  const [textInp, setTextInp] = useState("");
  const [otherData, setOtherData] = useState([]);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const hanleNodeData = () => {
    nodes.forEach((item) => {
      if (item?.id === nodeId) {
        setFltData(item);
        setTextInp(item?.data?.label);
      }
    });
    nodes.forEach((item) => {
      if (item?.id !== nodeId) {
        setOtherData(item);
      }
    });
  };

  const handleNodeText = () => {
    fltData.data.label = textInp;

    nodes.forEach((node, index) => {
      if (node?.id === fltData?.id) {
        nodes.splice(index, 1);
      }
    });
    setNodes([...nodes, fltData]);
    setValueChange(!valueChange);
  };

  useEffect(() => {
    hanleNodeData();
  }, [clickToggle]);

  return (
    <aside>
      {nodeClicked === false && (
        <div
          className="node"
          onDragStart={(event) => onDragStart(event, "default")}
          draggable
        >
          <TbMessage className="msgIcon" />
          <p>Message</p>
        </div>
      )}
      {nodeClicked === true && (
        <>
          <div className="inpCont-header">
            <BsArrowLeftShort onClick={() => setNodeClicked(false)} />
            <p>Message</p>
          </div>
          <div className="inpCont">
            <span>Text</span>
            <textarea
              value={textInp}
              onChange={(e) => setTextInp(e.target.value)}
            />
          </div>
          <button
            className="btn"
            onClick={() => {
              handleNodeText();
            }}
          >
            Replace Text
          </button>
        </>
      )}
    </aside>
  );
};
