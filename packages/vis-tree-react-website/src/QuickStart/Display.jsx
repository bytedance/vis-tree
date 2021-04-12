/**
 * compact: true
 */
import React from "react";
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

const Display = () => {
  const renderNode = ({ node }) => (
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
    </div>
  );
  return (
    <VisTreeReact
      style={{ width: "100%", height: "400px" }}
      dataSource={dataSource}
      renderNode={renderNode}
      options={{
        defaultScrollInfo: {
          key: dataSource.key,
          top: 20,
        },
        defaultExpandAll: true,
      }}
    />
  );
};

export default Display;
