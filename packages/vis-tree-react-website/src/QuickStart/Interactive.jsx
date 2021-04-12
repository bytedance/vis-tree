/**
 * compact: true
 */

import React, { useRef, useState, useEffect } from "react";
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

const Interactive = () => {
  const treeRef = useRef();
  const shouldExpandNodeKeyRef = useRef();

  const renderNode = ({ node, expanded, parentNode }) => {
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

  useEffect(() => {
    if (shouldExpandNodeKeyRef.current) {
      treeRef.current.toggleNodeExpanded(shouldExpandNodeKeyRef.current);
      shouldExpandNodeKeyRef.current = undefined;
    }
  }, [dataSource]);

  return (
    <VisTreeReact
      style={{ width: "100%", height: "400px" }}
      ref={treeRef}
      dataSource={dataSource}
      renderNode={renderNode}
      options={{
        defaultScrollInfo: {
          key: dataSource.key,
        },
      }}
    />
  );
};

export default Interactive;
