/**
 * Copyright (c) 2021 Bytedance Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {
  useState,
  useEffect,
  Fragment,
  forwardRef,
  useImperativeHandle,
} from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import {
  LAYOUT_STRATEGY,
  TypeIdentifier,
  TypeLineType,
  IVisTreePropsOptions,
  IOriginNode,
  IScrollInfo,
  INodeExpandedMap,
} from '@vis-tree/core';

import { useConstructTree, useDragMove } from './hooks';
import './style.css';

interface IOptions extends IVisTreePropsOptions {
  useAnimation?: boolean;
  useVirtualRender?: boolean;
  useWheelScroll?: boolean;
  defaultScrollInfo?: IScrollInfo;
  defaultExpandAll?: boolean;
  defaultExpandRoot?: boolean;
  defaultExpandedKeys?: Array<TypeIdentifier>;
  customKeyField?: string;
  customChildrenField?: string;
  layoutStrategy?: LAYOUT_STRATEGY;
  nodeWidth?: number;
  nodeHeight?: number;
  siblingInterval?: number;
  levelInterval?: number;
  lineSize?: number;
  lineColor?: string;
  lineType?: TypeLineType;
}

interface IRenderNodeProps {
  node: IOriginNode;
  expanded: boolean;
  parentNode: IOriginNode | undefined;
}

interface IRenderLineProps {
  startNode: IOriginNode;
  stopNode: IOriginNode;
  containerWidth: number;
  containerHeight: number;
  startPointCoordinate: Array<number>;
  stopPointCoordinate: Array<number>;
}

interface IVisTreeReactRef {
  scrollIntoView?: (scrollInfo: IScrollInfo) => void;
  getExpandedKeys?: () => Array<TypeIdentifier>;
  toggleNodeExpanded?: (key: string | number) => void;
  updateNodesExpanded?: (nodeExpandedMap: INodeExpandedMap) => void;
}

interface IVisTreeReactProps {
  dataSource: IOriginNode;
  scaleRatio?: number;
  options?: IOptions;
  className?: string;
  style?: React.CSSProperties;
  renderNode?: (props: IRenderNodeProps) => React.ReactNode;
  renderLine?: (props: IRenderLineProps) => React.ReactNode;
}

const ANIMATION_DURATION = 250; // (ms)

const VisTreeReact = forwardRef<IVisTreeReactRef, IVisTreeReactProps>(
  (props, forwardedRef) => {
    const {
      className,
      style = {},
      dataSource,
      scaleRatio,
      options,
      renderNode = () => null,
      renderLine,
    } = props;

    const { treeInstance, anchorStyle, rerenderTree } = useConstructTree({
      scaleRatio,
      options,
    });

    const [treeCanvasEle, setTreeCanvasEle] = useState<HTMLDivElement | null>(
      null,
    );
    const [canvasWidth, setCanvasWidth] = useState<number>(0);
    const [canvasHeight, setCanvasHeight] = useState<number>(0);

    const [animating, setAnimating] = useState<boolean>(false);
    const [animationPercent, setAnimationPercent] = useState<number>(0);

    const disableVirtualRender = options && options.useVirtualRender === false;
    const disableAnimation =
      (options && options.useAnimation === false) || disableVirtualRender;

    const animationRender = () => {
      if (disableAnimation) {
        rerenderTree();
        return;
      }

      setAnimating(true);
      const start = Date.now();

      requestAnimationFrame(function animationCycle() {
        const interval = Date.now() - start;

        if (interval < ANIMATION_DURATION) {
          setAnimationPercent(interval / ANIMATION_DURATION);
          requestAnimationFrame(animationCycle);
        } else {
          setAnimating(false);
          setAnimationPercent(0);
        }
      });
    };

    const startMove = () => {
      treeInstance.startMove();
    };

    const handleMoving = (diffX: number, diffY: number): void => {
      treeInstance.handleMoving(diffX, diffY);
      rerenderTree();
    };

    const dragListeners = useDragMove({
      startCallback: startMove,
      movingCallback: handleMoving,
    });

    const handleMousewheelScroll = (e: WheelEvent): void => {
      if (options && options.useWheelScroll === false) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      const { deltaX, deltaY } = e;
      treeInstance.startMove();
      treeInstance.handleMoving(-deltaX, -deltaY);
      rerenderTree();
    };

    const handleScaleRatioChange = () => {
      const canOptimize = treeInstance.optimizeScale(scaleRatio as number);

      if (canOptimize) {
        rerenderTree();
      }
    };

    const scrollIntoView = (scrollInfo: IScrollInfo) => {
      if (!scrollInfo) {
        return;
      }

      const canScroll = treeInstance.scrollIntoView(scrollInfo);

      if (canScroll) {
        rerenderTree();
      }
    };

    const toggleNodeExpanded = (key: string | number): void => {
      const canToggle = treeInstance.toggleNodeExpanded(key);

      if (canToggle) {
        animationRender();
      }
    };

    const updateNodesExpanded = (nodeExpandedMap: INodeExpandedMap): void => {
      const canUpdate = treeInstance.updateNodesExpanded(nodeExpandedMap);

      if (canUpdate) {
        animationRender();
      }
    };

    const initialize = (root: IOriginNode) => {
      treeInstance.initialize(root);
      animationRender();
    };

    useEffect(() => {
      handleScaleRatioChange();
    }, [scaleRatio]);

    useEffect(() => {
      if (treeCanvasEle) {
        initialize(dataSource);
      }
    }, [dataSource]);

    useEffect(() => {
      if (treeCanvasEle) {
        initialize(dataSource);
        treeCanvasEle.addEventListener('wheel', handleMousewheelScroll, {
          passive: false,
        });
      }

      if (options && options.defaultScrollInfo) {
        scrollIntoView(options.defaultScrollInfo);
      }

      return () => {
        if (treeCanvasEle) {
          treeCanvasEle.removeEventListener('wheel', handleMousewheelScroll);
        }
      };
    }, [treeCanvasEle]);

    useImperativeHandle(
      forwardedRef,
      () => ({
        scrollIntoView,
        getExpandedKeys: treeInstance.getExpandedKeys.bind(treeInstance),
        toggleNodeExpanded,
        updateNodesExpanded,
      }),
      [treeCanvasEle],
    );

    const nodeList = treeInstance.getNodeList(animating);
    const { nodeMap } = treeInstance;

    return (
      <div
        className={className ? `tree-canvas ${className}` : 'tree-canvas'}
        style={style}
        ref={(ele) => {
          if (ele && !treeInstance.treeCanvasEle) {
            treeInstance.treeCanvasEle = ele;
            setTreeCanvasEle(ele);
          }
        }}
        {...dragListeners}
      >
        <AutoSizer>
          {(autoSizerProps: { width: number; height: number }) => {
            if (autoSizerProps.width !== canvasWidth) {
              setTimeout(() => {
                setCanvasWidth(autoSizerProps.width);
              }, 300);
            }
            if (autoSizerProps.height !== canvasHeight) {
              setTimeout(() => {
                setCanvasHeight(autoSizerProps.height);
              }, 300);
            }
          }}
        </AutoSizer>
        <div
          className="tree-anchor"
          style={{
            ...anchorStyle,
            transform: `scale(${scaleRatio})`,
            visibility: treeCanvasEle ? 'visible' : 'hidden',
          }}
        >
          {nodeList.map((node) => {
            let { styleCollection } = node;

            if (animating) {
              styleCollection = treeInstance.animationRender(
                node,
                animationPercent,
              );
            } else if (!disableVirtualRender) {
              styleCollection = treeInstance.virtualRender(styleCollection!);
            }

            const {
              nodeStyle,
              headLineStyle,
              tailLineStyle,
              junctionLineStyle,
              customLineStyle,
              startPointCoordinate,
              stopPointCoordinate,
            } = styleCollection!;

            return (
              <Fragment key={node.key}>
                {nodeStyle && (
                  <div
                    className="tree-node-wrapper"
                    style={nodeStyle}
                    data-node-key={node.key}
                  >
                    <div className="tree-node-content">
                      {renderNode({
                        node: node.origin,
                        expanded: node.expanded,
                        parentNode:
                          node.parentKey !== undefined
                            ? nodeMap[node.parentKey].origin
                            : undefined,
                      })}
                    </div>

                    {headLineStyle && (
                      <div
                        className="tree-node-head-line"
                        style={headLineStyle}
                      />
                    )}

                    {tailLineStyle && (
                      <div
                        className="tree-node-tail-line"
                        style={tailLineStyle}
                      />
                    )}
                  </div>
                )}

                {junctionLineStyle && (
                  <div
                    className="tree-junction-line"
                    style={junctionLineStyle}
                    data-junction-key={node.key}
                  />
                )}

                {customLineStyle && renderLine && (
                  <div
                    className="tree-custom-line"
                    style={customLineStyle}
                    data-custom-key={node.key}
                  >
                    {renderLine({
                      startNode: nodeMap[node.parentKey!].origin,
                      stopNode: node.origin,
                      containerWidth: customLineStyle.width,
                      containerHeight: customLineStyle.height,
                      startPointCoordinate: startPointCoordinate!,
                      stopPointCoordinate: stopPointCoordinate!,
                    })}
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  },
);

export {
  VisTreeReact as default,
  LAYOUT_STRATEGY,
  IOriginNode,
  IRenderNodeProps,
  IRenderLineProps,
  IVisTreeReactRef,
  IScrollInfo,
  IOptions,
  IVisTreeReactProps,
};
