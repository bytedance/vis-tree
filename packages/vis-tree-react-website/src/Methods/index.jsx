/**
 * compact: true
 */

import React, { useRef, useState } from "react";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import VisTreeReact, { LAYOUT_STRATEGY } from "@vis-tree/react";
import { Cascader } from "antd";
import "antd/dist/antd.css";

import dataSource from "./districts.json";

const options = {
  defaultScrollInfo: {
    key: dataSource.id,
    top: 80,
    left: "20%",
  },
  layoutStrategy: LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP,
  customKeyField: "id",
  nodeWidth: 120,
};

const Demo = () => {
  const treeRef = useRef();

  const [scaleRatio, setScaleRatio] = useState(1);
  const handleScaleRatioChange = (e) => {
    setScaleRatio(e.target.value);
  };

  const handleSearch = (list) => {
    if (list.length > 0) {
      const shouldExpandKeys = list.slice();
      const lastId = shouldExpandKeys.pop();
      const visibleExpandedKeys = treeRef.current.getExpandedKeys();
      const nodeExpandedMap = shouldExpandKeys.reduce(
        (pre, cur) => ({ ...pre, [cur]: true }),
        visibleExpandedKeys.reduce(
          (pre, cur) => ({ ...pre, [cur]: cur === dataSource.id }),
          {}
        )
      );

      treeRef.current.updateNodesExpanded(nodeExpandedMap);
      treeRef.current.scrollIntoView({
        key: lastId,
      });
    }
  };

  const filter = (inputValue, path) => {
    return path.some(
      (option) =>
        option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  };

  const renderNode = ({ node, parentNode, expanded }) => {
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
          {node.name}
        </div>
        {node.children && node.children.length > 0 && (
          <div
            style={{
              width: 14,
              height: 14,
              position: "absolute",
              top: "50%",
              left: "100%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              background: "#fff",
              color: `${expanded ? "green" : "red"}`,
            }}
            onClick={() => {
              const visibleExpandedKeys = treeRef.current.getExpandedKeys();
              const sameLevelKeys = visibleExpandedKeys.filter(
                (item) =>
                  parentNode &&
                  parentNode.children.find((subNode) => subNode.id === item)
              );

              if (sameLevelKeys.length > 0 && !expanded) {
                treeRef.current.updateNodesExpanded(
                  sameLevelKeys.reduce(
                    (pre, cur) => {
                      return {
                        ...pre,
                        [cur]: cur === node.id,
                      };
                    },
                    { [node.id]: true }
                  )
                );
              } else {
                treeRef.current.toggleNodeExpanded(node.id);
              }
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
        search:
        <Cascader
          style={{ marginLeft: "8px", width: "250px" }}
          placeholder="请输入想要搜索的地区名称"
          expandTrigger="hover"
          fieldNames={{ label: "name", value: "id" }}
          showSearch={{ filter }}
          changeOnSelect
          options={dataSource.children}
          onChange={handleSearch}
        />
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
        style={{ width: "100%", height: "500px" }}
        ref={treeRef}
        dataSource={dataSource}
        scaleRatio={scaleRatio}
        renderNode={renderNode}
        options={options}
      />
    </div>
  );
};

export default Demo;
