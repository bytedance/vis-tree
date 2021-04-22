import { CSSProperties } from "vue";
import {
  LAYOUT_STRATEGY,
  TypeIdentifier,
  TypeLineType,
  IVisTreePropsOptions,
  IOriginNode,
  IScrollInfo,
} from "@vis-tree/core";

export interface IOptions extends IVisTreePropsOptions {
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

export interface IVisTreeVueProps {
  dataSource: IOriginNode;
  scaleRatio?: number;
  options?: IOptions;
  class?: string;
  style?: CSSProperties;
}

export interface IDragListeners {
  onMousedown: (e: MouseEvent) => void;
  onMousemove: (e: MouseEvent) => void;
  onMouseup: () => void;
  onTouchstart: (e: TouchEvent) => void;
  onTouchmove: (e: TouchEvent) => void;
  onTouchend: () => void;
}
