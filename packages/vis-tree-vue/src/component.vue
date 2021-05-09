<!--
Copyright (c) 2021 Bytedance Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
-->
<template>
  <div class="tree-canvas" :style="style" v-on="dragEventListeners">
    <div class="tree-anchor" :style="formatStyle(anchorStyle)">
      <template v-for="node in nodeList" :key="node.key">
        <div
          v-if="node.curStyleCollection.nodeStyle"
          class="tree-node-wrapper"
          :style="formatStyle(node.curStyleCollection.nodeStyle)"
          :data-node-key="node.key"
        >
          <div class="tree-node-content">
            <slot
              name="node"
              :node="node.origin"
              :expanded="node.expanded"
              :parent-node="
                node.parentKey !== undefined
                  ? treeInstance.nodeMap[node.parentKey].origin
                  : undefined
              "
            ></slot>
          </div>

          <div
            v-if="node.curStyleCollection.headLineStyle"
            class="tree-node-head-line"
            :style="formatStyle(node.curStyleCollection.headLineStyle)"
          />

          <div
            v-if="node.curStyleCollection.tailLineStyle"
            class="tree-node-tail-line"
            :style="formatStyle(node.curStyleCollection.tailLineStyle)"
          />
        </div>

        <div
          v-if="node.curStyleCollection.junctionLineStyle"
          class="tree-junction-line"
          :style="formatStyle(node.curStyleCollection.junctionLineStyle)"
          :data-junction-key="node.key"
        />

        <div
          v-if="node.curStyleCollection.customLineStyle"
          class="tree-custom-line"
          :style="formatStyle(node.curStyleCollection.customLineStyle)"
          :data-custom-key="node.key"
        >
          <slot
            name="line"
            :start-node="treeInstance.nodeMap[node.parentKey].origin"
            :stop-node="node.origin"
            :container-width="node.curStyleCollection.customLineStyle.width"
            :container-height="node.curStyleCollection.customLineStyle.height"
            :start-point-coordinate="
              node.curStyleCollection.startPointCoordinate
            "
            :stop-point-coordinate="node.curStyleCollection.stopPointCoordinate"
          ></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, CSSProperties } from "vue";
import VisTree from "@vis-tree/core";

import {
  IOriginNode,
  IScrollInfo,
  INodeExpandedMap,
  IVisTreeVueProps,
  IDragListeners,
  IEnhancedNode,
} from "./types";

const ANIMATION_DURATION = 250; // (ms)

export default defineComponent({
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
    style: {
      type: Object as PropType<IVisTreeVueProps["style"]>,
    },
  },
  data() {
    const treeInstance = new VisTree({
      scaleRatio: this.scaleRatio,
      options: this.options,
    });
    const anchorStyle = {
      ...treeInstance.anchorStyle,
      transform: `scale(${this.scaleRatio})`,
      visiblity: "hidden",
    };

    return {
      disableVirtualRender:
        this.options && this.options.useVirtualRender === false,
      disableAnimation:
        (this.options && this.options.useAnimation === false) ||
        (this.options && this.options.useVirtualRender === false),
      disableWheelScroll: this.options && this.options.useWheelScroll === false,
      treeInstance,
      anchorStyle,
      animating: false,
      animationPercent: 0,
      moveInfo: {
        moving: false,
        startPageX: 0,
        startPageY: 0,
      },
      dragEventListeners: {
        mousedown: (event: MouseEvent) => this.startMove(event, "mouse"),
        mousemove: (event: MouseEvent) => this.handleMoving(event, "mouse"),
        mouseup: this.stopMove,
        touchstart: (event: TouchEvent) => this.startMove(event, "touch"),
        touchmove: (event: TouchEvent) => this.handleMoving(event, "touch"),
        touchend: this.stopMove,
      } as IDragListeners,
      nodeList: [] as IEnhancedNode[],
    };
  },
  mounted() {
    this.treeInstance.treeCanvasEle = this.$el;
    this.initialize(this.dataSource);

    if (this.options && this.options.defaultScrollInfo) {
      this.scrollIntoView(this.options.defaultScrollInfo);
    }
    if (this.treeInstance.treeCanvasEle) {
      this.treeInstance.treeCanvasEle.addEventListener(
        "wheel",
        this.handleMousewheelScroll,
        {
          passive: false,
        }
      );
    }
  },
  unmounted() {
    if (this.treeInstance.treeCanvasEle) {
      this.treeInstance.treeCanvasEle.removeEventListener(
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
      if (this.treeInstance.treeCanvasEle) {
        this.initialize(this.dataSource);
      }
    },
  },
  methods: {
    formatStyle(styleCollection?: CSSProperties): CSSProperties {
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
    },

    rerenderTree(): void {
      this.anchorStyle = {
        ...this.treeInstance.anchorStyle,
        transform: `scale(${this.scaleRatio})`,
        visiblity: this.treeInstance.treeCanvasEle ? "visible" : "hidden",
      };

      this.nodeList = this.treeInstance
        .getNodeList(this.animating)
        .map((node) => {
          let { styleCollection } = node;

          if (this.animating) {
            styleCollection = this.treeInstance.animationRender(
              node,
              this.animationPercent
            );
          } else if (!this.disableVirtualRender) {
            styleCollection = this.treeInstance.virtualRender(styleCollection!);
          }

          return {
            ...node,
            curStyleCollection: styleCollection,
          } as IEnhancedNode;
        });
    },

    animationRender() {
      if (this.disableAnimation) {
        this.rerenderTree();
        return;
      }

      this.animating = true;
      const start = Date.now();

      const animationCycle = () => {
        const interval = Date.now() - start;

        if (interval < ANIMATION_DURATION) {
          this.animationPercent = interval / ANIMATION_DURATION;
          this.rerenderTree();
          requestAnimationFrame(animationCycle);
        } else {
          this.animating = false;
          this.animationPercent = 0;
          this.rerenderTree();
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
      if (this.disableWheelScroll) {
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

    getExpandedKeys() {
      return this.treeInstance.getExpandedKeys();
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
});
</script>

<style>
.tree-canvas {
  position: relative;
  overflow: hidden;
  cursor: move;
}

.tree-anchor {
  position: absolute;
  top: 0;
  left: 0;
}

.tree-node-wrapper {
  position: absolute;
  cursor: auto;
}

.tree-node-content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.tree-node-head-line,
.tree-node-tail-line,
.tree-junction-line,
.tree-custom-line {
  position: absolute;
  cursor: auto;
}
</style>