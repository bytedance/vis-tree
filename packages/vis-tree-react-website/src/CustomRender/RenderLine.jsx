/**
 * compact: true
 */

import React, { useRef, useState } from "react";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import VisTreeReact from "@vis-tree/react";

const dataSource = {
  key: "O",
  children: [
    {
      key: "E",
      children: [
        {
          key: "A",
        },
        {
          key: "D",
          children: [
            {
              key: "B",
            },
            {
              key: "C",
            },
          ],
        },
      ],
    },
    {
      key: "F",
    },
    {
      key: "N",
      children: [
        {
          key: "G",
        },
        {
          key: "M",
          children: [
            {
              key: "H",
            },
            {
              key: "I",
            },
            {
              key: "J",
            },
            {
              key: "K",
            },
            {
              key: "L",
            },
          ],
        },
      ],
    },
  ],
};

const Demo = () => {
  const treeRef = useRef();

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
          {node.key}
        </div>
        {node.children && node.children.length > 0 && (
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
              treeRef.current.toggleNodeExpanded(node.key);
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

  const renderLine = ({
    containerWidth,
    containerHeight,
    startPointCoordinate,
    stopPointCoordinate,
  }) => {
    if (containerWidth === 0) {
      return (
        <div
          style={{ width: 1, height: containerHeight, background: "black" }}
        />
      );
    }

    if (containerHeight === 0) {
      return (
        <div
          style={{ width: containerWidth, height: 1, background: "black" }}
        />
      );
    }

    return (
      <>
        <svg width={`${containerWidth}`} height={`${containerHeight}`}>
          <path
            d={`M ${startPointCoordinate[0]} ${startPointCoordinate[1]}, L ${stopPointCoordinate[0]} ${stopPointCoordinate[1]}`}
            strokeWidth={1}
            fill="none"
            stroke="black"
          />
        </svg>
      </>
    );
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
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
        style={{ width: "100%", height: "400px" }}
        ref={treeRef}
        dataSource={dataSource}
        scaleRatio={scaleRatio}
        renderNode={renderNode}
        renderLine={renderLine}
        options={{
          defaultScrollInfo: {
            key: dataSource.key,
            top: 40,
          },
          defaultExpandAll: true,
          lineType: "none",
        }}
      />
    </div>
  );
};

export default Demo;
