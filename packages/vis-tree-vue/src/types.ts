import { CSSProperties } from "vue";
import {
  LAYOUT_STRATEGY,
  TypeIdentifier,
  TypeLineType,
  IVisTreePropsOptions,
  INode,
  IStyleCollection,
  IOriginNode,
  IScrollInfo,
  INodeExpandedMap,
} from "@vis-tree/core";

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

interface IVisTreeVueProps {
  dataSource: IOriginNode;
  scaleRatio?: number;
  options?: IOptions;
  class?: string;
  style?: CSSProperties;
}

interface IDragListeners {
  mousedown: (e: MouseEvent) => void;
  mousemove: (e: MouseEvent) => void;
  mouseup: () => void;
  touchstart: (e: TouchEvent) => void;
  touchmove: (e: TouchEvent) => void;
  touchend: () => void;
}

interface IEnhancedNode extends INode {
  curStyleCollection: IStyleCollection;
}

export {
  LAYOUT_STRATEGY,
  TypeIdentifier,
  TypeLineType,
  IVisTreePropsOptions,
  INode,
  IStyleCollection,
  IOriginNode,
  IScrollInfo,
  INodeExpandedMap,
  IOptions,
  IVisTreeVueProps,
  IDragListeners,
  IEnhancedNode,
};
