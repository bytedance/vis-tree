/**
 * Copyright (c) 2021 Bytedance Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable */
import { defineComponent, PropType, CSSProperties } from "vue";
import VisTree, {
  LAYOUT_STRATEGY,
  TypeIdentifier,
  TypeLineType,
  IVisTreePropsOptions,
  IOriginNode,
  IScrollInfo,
  INodeExpandedMap,
} from "@vis-tree/core";

import "./style.css";

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

type TTreeCanvasEle = null | HTMLDivElement;

interface IVisTreeVueProps {
  dataSource: IOriginNode;
  scaleRatio?: number;
  options?: IOptions;
  class?: string;
  style?: CSSProperties;
}

interface IDragListeners {
  onMousedown: (e: MouseEvent) => void;
  onMousemove: (e: MouseEvent) => void;
  onMouseup: () => void;
  onTouchstart: (e: TouchEvent) => void;
  onTouchmove: (e: TouchEvent) => void;
  onTouchend: () => void;
}

const ANIMATION_DURATION = 250; // (ms)

const formatStyle = (styleCollection?: CSSProperties): CSSProperties => {
  if (!styleCollection) {
    return {};
  }
  return Object.keys(styleCollection).reduce((pre, cur) => {
    if (typeof styleCollection[cur as keyof CSSProperties] === "number") {
      return {
        ...pre,
        [cur]: `${styleCollection[cur as keyof CSSProperties]}px`,
      };
    }
    return {
      ...pre,
      [cur]: styleCollection[cur as keyof CSSProperties],
    };
  }, {});
};

const VisTreeVue = defineComponent({
  name: "VisTreeVue",
  props: {
    dataSource: {
      type: Object as PropType<IVisTreeVueProps["dataSource"]>,
      required: true,
    },
    scaleRatio: {
      type: Number as PropType<IVisTreeVueProps["scaleRatio"]>,
    },
    options: {
      type: Object as PropType<IVisTreeVueProps["options"]>,
    },
    class: {
      type: String as PropType<IVisTreeVueProps["class"]>,
    },
    style: {
      type: Object as PropType<IVisTreeVueProps["style"]>,
    },
  },
  data() {
    const treeInstance = new VisTree({
      scaleRatio: this.scaleRatio,
      options: this.options,
    });
    const anchorStyle = treeInstance.anchorStyle;

    return {
      treeInstance,
      anchorStyle,
      treeCanvasEle: null as TTreeCanvasEle,
      animating: false,
      animationPercent: 0,
      moveInfo: {
        moving: false,
        startPageX: 0,
        startPageY: 0,
      },
      dragEventListeners: {
        onMousedown: (event: MouseEvent) => this.startMove(event, "mouse"),
        onMousemove: (event: MouseEvent) => this.handleMoving(event, "mouse"),
        onMouseup: this.stopMove,
        onTouchstart: (event: TouchEvent) => this.startMove(event, "touch"),
        onTouchmove: (event: TouchEvent) => this.handleMoving(event, "touch"),
        onTouchend: this.stopMove,
      } as IDragListeners,
    };
  },
  mounted() {
    this.initialize(this.dataSource);
    this.treeCanvasEle = this.$refs.treeCanvasEle as HTMLDivElement;
    this.treeInstance.treeCanvasEle = this.treeCanvasEle;
  },
  unmounted() {
    if (this.treeCanvasEle) {
      this.treeCanvasEle.removeEventListener(
        "wheel",
        this.handleMousewheelScroll
      );
    }
  },
  watch: {
    scaleRatio(): void {
      this.handleScaleRatioChange();
    },
    dataSource(): void {
      if (this.treeCanvasEle) {
        this.initialize(this.dataSource);
      }
    },
    treeCanvasEle(): void {
      if (this.options && this.options.defaultScrollInfo) {
        this.scrollIntoView(this.options.defaultScrollInfo);
      }
      if (this.treeCanvasEle) {
        this.treeCanvasEle.addEventListener(
          "wheel",
          this.handleMousewheelScroll,
          {
            passive: false,
          }
        );
      }
    },
  },
  methods: {
    rerenderTree(): void {
      this.anchorStyle = { ...this.treeInstance.anchorStyle };
    },

    animationRender() {
      const disableVirtualRender =
        this.options && this.options.useVirtualRender === false;
      const disableAnimation =
        (this.options && this.options.useAnimation === false) ||
        disableVirtualRender;

      if (disableAnimation) {
        this.rerenderTree();
        return;
      }

      this.animating = true;
      const start = Date.now();

      const animationCycle = () => {
        const interval = Date.now() - start;

        if (interval < ANIMATION_DURATION) {
          this.animationPercent = interval / ANIMATION_DURATION;
          requestAnimationFrame(animationCycle);
        } else {
          this.animating = false;
          this.animationPercent = 0;
        }
      };

      requestAnimationFrame(animationCycle);
    },

    startMove(
      event: MouseEvent | TouchEvent,
      eventType: "mouse" | "touch"
    ): void {
      let pageObj;
      let isMultipleFingerTouch;
      if (eventType === "mouse") {
        pageObj = event as MouseEvent;
      }
      if (eventType === "touch") {
        pageObj = (event as TouchEvent).changedTouches.item(0);
        isMultipleFingerTouch = (event as TouchEvent).touches.length > 1;
      }

      if (!pageObj || isMultipleFingerTouch) {
        this.moveInfo.moving = false;
        return;
      }

      const { pageX, pageY } = pageObj;

      this.moveInfo.moving = true;
      this.moveInfo.startPageX = pageX;
      this.moveInfo.startPageY = pageY;

      this.treeInstance.startMove();
    },

    handleMoving(
      event: MouseEvent | TouchEvent,
      eventType: "mouse" | "touch"
    ): void {
      let pageObj;
      if (eventType === "mouse") {
        pageObj = event as MouseEvent;
      }
      if (eventType === "touch") {
        pageObj = (event as TouchEvent).changedTouches.item(0);
      }

      if (!pageObj) {
        return;
      }

      const { pageX, pageY } = pageObj;
      const { moving, startPageX, startPageY } = this.moveInfo;

      if (moving) {
        const diffX = pageX - startPageX;
        const diffY = pageY - startPageY;

        this.treeInstance.handleMoving(diffX, diffY);
        this.rerenderTree();
      }
    },

    stopMove(): void {
      this.moveInfo.moving = false;
    },

    handleMousewheelScroll(e: WheelEvent): void {
      if (this.options && this.options.useWheelScroll === false) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      const { deltaX, deltaY } = e;
      this.treeInstance.startMove();
      this.treeInstance.handleMoving(-deltaX, -deltaY);
      this.rerenderTree();
    },

    handleScaleRatioChange(): void {
      const canOptimize = this.treeInstance.optimizeScale(
        this.scaleRatio as number
      );

      if (canOptimize) {
        this.rerenderTree();
      }
    },

    scrollIntoView(scrollInfo: IScrollInfo) {
      if (!scrollInfo) {
        return;
      }

      const canScroll = this.treeInstance.scrollIntoView(scrollInfo);

      if (canScroll) {
        this.rerenderTree();
      }
    },

    toggleNodeExpanded(key: string | number): void {
      const canToggle = this.treeInstance.toggleNodeExpanded(key);

      if (canToggle) {
        this.animationRender();
      }
    },

    updateNodesExpanded(nodeExpandedMap: INodeExpandedMap): void {
      const canUpdate = this.treeInstance.updateNodesExpanded(nodeExpandedMap);

      if (canUpdate) {
        this.animationRender();
      }
    },

    initialize(root: IOriginNode) {
      this.treeInstance.initialize(root);
      this.animationRender();
    },
  },
  render() {
    const nodeList = this.treeInstance.getNodeList(this.animating);
    const { nodeMap } = this.treeInstance;
    const disableVirtualRender =
      this.options && this.options.useVirtualRender === false;

    const nodeSlot = this.$slots.node;
    const lineSlot = this.$slots.line;

    return (
      <div
        // @ts-ignore
        class={this.class ? `tree-canvas ${this.class}` : "tree-canvas"}
        ref="treeCanvasEle"
        style={formatStyle(this.style)}
        {...this.dragEventListeners}
      >
        <div
          // @ts-ignore
          class="tree-anchor"
          style={formatStyle({
            ...this.anchorStyle,
            transform: `scale(${this.scaleRatio})`,
            visibility: this.treeCanvasEle ? "visible" : "hidden",
          })}
        >
          {nodeList.map((node) => {
            let { styleCollection } = node;

            if (this.animating) {
              styleCollection = this.treeInstance.animationRender(
                node,
                this.animationPercent
              );
            } else if (!disableVirtualRender) {
              styleCollection = this.treeInstance.virtualRender(
                styleCollection!
              );
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
              <div key={node.key}>
                {nodeStyle && (
                  <div
                    // @ts-ignore
                    class="tree-node-wrapper"
                    style={formatStyle(nodeStyle)}
                    data-node-key={node.key}
                  >
                    <div
                      // @ts-ignore
                      class="tree-node-content"
                    >
                      {nodeSlot &&
                        nodeSlot({
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
                        // @ts-ignore
                        class="tree-node-head-line"
                        style={formatStyle(headLineStyle)}
                      />
                    )}

                    {tailLineStyle && (
                      <div
                        // @ts-ignore
                        class="tree-node-tail-line"
                        style={formatStyle(tailLineStyle)}
                      />
                    )}
                  </div>
                )}

                {junctionLineStyle && (
                  <div
                    // @ts-ignore
                    class="tree-junction-line"
                    style={formatStyle(junctionLineStyle)}
                    data-junction-key={node.key}
                  />
                )}

                {customLineStyle && lineSlot && (
                  <div
                    // @ts-ignore
                    class="tree-custom-line"
                    style={formatStyle(customLineStyle)}
                    data-custom-key={node.key}
                  >
                    {lineSlot &&
                      lineSlot({
                        startNode: nodeMap[node.parentKey!].origin,
                        stopNode: node.origin,
                        containerWidth: customLineStyle.width,
                        containerHeight: customLineStyle.height,
                        startPointCoordinate: startPointCoordinate!,
                        stopPointCoordinate: stopPointCoordinate!,
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});

export {
  VisTreeVue as default,
  LAYOUT_STRATEGY,
  IOriginNode,
  IScrollInfo,
  IVisTreeVueProps,
};
