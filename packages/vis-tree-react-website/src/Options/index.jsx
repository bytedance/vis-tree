/**
 * compact: true
 */

import React, { useRef, useState } from "react";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import VisTreeReact, { LAYOUT_STRATEGY } from "@vis-tree/react";
import { Select } from "antd";
import "antd/dist/antd.css";

const dataSource = {
  id: "O",
  items: [
    {
      id: "E",
      items: [
        {
          id: "A",
        },
        {
          id: "D",
          items: [
            {
              id: "B",
            },
            {
              id: "C",
            },
          ],
        },
      ],
    },
    {
      id: "F",
    },
    {
      id: "N",
      items: [
        {
          id: "G",
        },
        {
          id: "M",
          items: [
            {
              id: "H",
            },
            {
              id: "I",
            },
            {
              id: "J",
            },
            {
              id: "K",
            },
            {
              id: "L",
            },
          ],
        },
      ],
    },
  ],
};

const options = {
  defaultScrollInfo: {
    key: dataSource.id,
  },
  defaultExpandAll: true,
  customKeyField: "id",
  customChildrenField: "items",
  nodeWidth: 60,
  nodeHeight: 40,
  siblingInterval: 20,
  levelInterval: 20,
};

const Demo = () => {
  const treeRef = useRef();

  const [layoutStrategy, setLayoutStrategy] = useState(
    LAYOUT_STRATEGY.TOP_CENTER
  );

  const [scaleRatio, setScaleRatio] = useState(1);
  const handleScaleRatioChange = (e) => {
    setScaleRatio(e.target.value);
  };

  const renderNode = ({ node, expanded }) => {
    return (
      <div
        style={{
          height: "100%",
          boxSizing: "border-box",
          background: "#fff",
          border: "1px solid black",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {node.id}
        </div>
        {node.items && node.items.length > 0 && (
          <div
            style={{
              width: 14,
              height: 14,
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              background: "#fff",
              color: `${expanded ? "green" : "red"}`,
            }}
            onClick={() => {
              treeRef.current.toggleNodeExpanded(node.id);
            }}
          >
            {expanded ? (
              <MinusCircleOutlined style={{ display: "block" }} />
            ) : (
              <PlusCircleOutlined style={{ display: "block" }} />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: "8px",
          zIndex: 1,
          background: "#f2f5fa",
        }}
      >
        layoutStrategy:
        <Select
          style={{ marginLeft: "8px", width: "200px" }}
          value={layoutStrategy}
          onChange={setLayoutStrategy}
        >
          {Object.keys(LAYOUT_STRATEGY).map((key) => (
            <Select.Option key={key}>{key}</Select.Option>
          ))}
        </Select>
      </div>
      <input
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1,
        }}
        type="range"
        min={0.1}
        max={2}
        step={0.01}
        value={scaleRatio}
        onChange={handleScaleRatioChange}
      />
      <VisTreeReact
        key={layoutStrategy}
        style={{ width: "100%", height: "400px" }}
        ref={treeRef}
        dataSource={dataSource}
        scaleRatio={scaleRatio}
        renderNode={renderNode}
        options={{ ...options, layoutStrategy }}
      />
    </div>
  );
};

export default Demo;
