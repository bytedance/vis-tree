/**
 * Copyright (c) 2021 Bytedance Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

enum TREE_TYPE {
  CENTER_TREE = 'CENTER_TREE',
  ASIDE_TREE = 'ASIDE_TREE',
}

export enum LAYOUT_STRATEGY {
  // TREE_TYPE.CENTER_TREE
  TOP_CENTER = 'TOP_CENTER',
  BOTTOM_CENTER = 'BOTTOM_CENTER',
  CENTER_LEFT = 'CENTER_LEFT',
  CENTER_RIGHT = 'CENTER_RIGHT',

  // TREE_TYPE.ASIDE_TREE
  TOP_LEFT_ALIGN_LEFT = 'TOP_LEFT_ALIGN_LEFT',
  TOP_LEFT_ALIGN_TOP = 'TOP_LEFT_ALIGN_TOP',
}

type TypeGeneralNumber = string | number;

type TypeDirectionAttr = 'top' | 'bottom' | 'left' | 'right';

export type TypeLineType = 'straight' | 'none';

export type TypeIdentifier = string | number;

export type TypeLevelArray = Array<Array<TypeIdentifier>>;

export interface IPointPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface IStyle extends IPointPosition {
  width: number;
  height: number;
  transform?: string;
  backgroundColor?: string;
}

export interface IOriginNode {
  [key: string]: any;
}

export interface INode {
  origin: {
    [key: string]: any;
  };
  key: TypeIdentifier;
  parentKey?: TypeIdentifier;
  children: Array<INode>;
  expanded: boolean;
  preVisible: boolean;
  visible: boolean;
  level: number;
  relative?: number;
  modifier?: number;
  absolute?: number;
  final?: number;
  styleCollection?: IStyleCollection;
  preStyleCollection?: IStyleCollection;
  animation?: {
    begin: IStyleCollection;
    end: IStyleCollection;
  };
  visitedIndex?: number;
}
export interface INodeMap {
  [key: string]: INode;
}

export interface IStyleCollection {
  nodeStyle?: IStyle;
  headLineStyle?: IStyle;
  tailLineStyle?: IStyle;
  junctionLineStyle?: IStyle;
  headPointPosition?: IPointPosition;
  tailPointPosition?: IPointPosition;
  customLineStyle?: IStyle;
  startPointCoordinate?: Array<number>;
  stopPointCoordinate?: Array<number>;
}

export interface INodeExpandedMap {
  [key: string]: boolean;
}

export interface IAnchorStyle {
  top: number;
  left: number;
}

export interface IScrollInfo {
  key?: TypeIdentifier;
  top?: TypeGeneralNumber;
  left?: TypeGeneralNumber;
}

interface IOptions {
  defaultExpandAll: boolean;
  defaultExpandRoot: boolean;
  defaultExpandedKeys: Array<TypeIdentifier>;
  customKeyField: string;
  customChildrenField: string;
  layoutStrategy: LAYOUT_STRATEGY;
  nodeWidth: number;
  nodeHeight: number;
  siblingInterval: number;
  levelInterval: number;
  lineSize: number;
  lineColor: string;
  lineType: TypeLineType;
  treeType: TREE_TYPE;
  finalNodeSize: number;
  levelNodeSize: number;
  finalDirectionAttr: TypeDirectionAttr;
  levelDirectionAttr: TypeDirectionAttr;
  xDirectionAttr: TypeDirectionAttr;
  yDirectionAttr: TypeDirectionAttr;
  headLineLevelAttr: TypeDirectionAttr;
  headLineStyle: IStyle;
  tailLineStyle: IStyle;
}

export interface IVisTreePropsOptions {
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

export interface IVisTreeProps {
  options?: IVisTreePropsOptions;
  scaleRatio?: number;
}

/**
 * different treeType correspond different algorithm
 */
function genTreeType(options: IOptions) {
  const { layoutStrategy } = options;

  if (
    [
      LAYOUT_STRATEGY.TOP_CENTER,
      LAYOUT_STRATEGY.BOTTOM_CENTER,
      LAYOUT_STRATEGY.CENTER_LEFT,
      LAYOUT_STRATEGY.CENTER_RIGHT,
    ].indexOf(layoutStrategy) !== -1
  ) {
    options.treeType = TREE_TYPE.CENTER_TREE;
    return;
  }

  if (
    [
      LAYOUT_STRATEGY.TOP_LEFT_ALIGN_LEFT,
      LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP,
    ].indexOf(layoutStrategy) !== -1
  ) {
    options.treeType = TREE_TYPE.ASIDE_TREE;
  }
}

/**
 * when calculate the coordinate of a node
 * one direction depends on level
 * another direction depends on algorithm
 * so we can say a node has two size for different directions
 */
function genNodeSize(options: IOptions) {
  const { layoutStrategy, nodeWidth, nodeHeight } = options;

  if (
    [
      LAYOUT_STRATEGY.TOP_CENTER,
      LAYOUT_STRATEGY.BOTTOM_CENTER,
      LAYOUT_STRATEGY.TOP_LEFT_ALIGN_LEFT,
    ].indexOf(layoutStrategy) !== -1
  ) {
    options.finalNodeSize = nodeWidth;
    options.levelNodeSize = nodeHeight;
    return;
  }

  if (
    [
      LAYOUT_STRATEGY.CENTER_LEFT,
      LAYOUT_STRATEGY.CENTER_RIGHT,
      LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP,
    ].indexOf(layoutStrategy) !== -1
  ) {
    options.finalNodeSize = nodeHeight;
    options.levelNodeSize = nodeWidth;
    return;
  }

  options.finalNodeSize = 0;
  options.levelNodeSize = 0;
}

function genDirectionAttr(options: IOptions) {
  const { layoutStrategy } = options;

  if (
    layoutStrategy === LAYOUT_STRATEGY.TOP_CENTER ||
    layoutStrategy === LAYOUT_STRATEGY.TOP_LEFT_ALIGN_LEFT
  ) {
    options.finalDirectionAttr = 'left';
    options.levelDirectionAttr = 'top';
    options.xDirectionAttr = 'left';
    options.yDirectionAttr = 'top';
  }

  if (layoutStrategy === LAYOUT_STRATEGY.BOTTOM_CENTER) {
    options.finalDirectionAttr = 'left';
    options.levelDirectionAttr = 'bottom';
    options.xDirectionAttr = 'left';
    options.yDirectionAttr = 'bottom';
  }

  if (
    layoutStrategy === LAYOUT_STRATEGY.CENTER_LEFT ||
    layoutStrategy === LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP
  ) {
    options.finalDirectionAttr = 'top';
    options.levelDirectionAttr = 'left';
    options.yDirectionAttr = 'top';
    options.xDirectionAttr = 'left';
  }

  if (layoutStrategy === LAYOUT_STRATEGY.CENTER_RIGHT) {
    options.finalDirectionAttr = 'top';
    options.levelDirectionAttr = 'right';
    options.yDirectionAttr = 'top';
    options.xDirectionAttr = 'right';
  }
}

function genHeadLineLevelAttr(options: IOptions) {
  const { levelDirectionAttr } = options;

  if (levelDirectionAttr === 'top') {
    options.headLineLevelAttr = 'bottom';
  }
  if (levelDirectionAttr === 'bottom') {
    options.headLineLevelAttr = 'top';
  }
  if (levelDirectionAttr === 'left') {
    options.headLineLevelAttr = 'right';
  }
  if (levelDirectionAttr === 'right') {
    options.headLineLevelAttr = 'left';
  }
}

function genHeadLineStyle(options: IOptions) {
  const {
    layoutStrategy,
    finalNodeSize,
    levelNodeSize,
    finalDirectionAttr,
    headLineLevelAttr,
    levelInterval,
    lineSize,
    lineColor,
  } = options;

  const style: IStyle = {
    width: 0,
    height: 0,
    backgroundColor: lineColor,
    [finalDirectionAttr]: finalNodeSize / 2,
    [headLineLevelAttr]: levelNodeSize,
  };

  if (
    layoutStrategy === LAYOUT_STRATEGY.TOP_CENTER ||
    layoutStrategy === LAYOUT_STRATEGY.TOP_LEFT_ALIGN_LEFT
  ) {
    style.width = lineSize;
    style.height = levelInterval / 2;
    style.transform = 'translate(-50%, 0)';
  }

  if (layoutStrategy === LAYOUT_STRATEGY.BOTTOM_CENTER) {
    style.width = lineSize;
    style.height = levelInterval / 2;
    style.transform = 'translate(-50%, 0)';
  }

  if (
    layoutStrategy === LAYOUT_STRATEGY.CENTER_LEFT ||
    layoutStrategy === LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP
  ) {
    style.width = levelInterval / 2;
    style.height = lineSize;
    style.transform = 'translate(0, -50%)';
  }

  if (layoutStrategy === LAYOUT_STRATEGY.CENTER_RIGHT) {
    style.width = levelInterval / 2;
    style.height = lineSize;
    style.transform = 'translate(0, -50%)';
  }

  options.headLineStyle = style;
}

function genTailLineStyle(options: IOptions) {
  const {
    layoutStrategy,
    finalNodeSize,
    levelNodeSize,
    finalDirectionAttr,
    levelDirectionAttr,
    levelInterval,
    lineSize,
    lineColor,
  } = options;

  const style: IStyle = {
    width: 0,
    height: 0,
    backgroundColor: lineColor,
    [levelDirectionAttr]: levelNodeSize,
    [finalDirectionAttr]: finalNodeSize / 2,
  };

  if (
    layoutStrategy === LAYOUT_STRATEGY.TOP_CENTER ||
    layoutStrategy === LAYOUT_STRATEGY.TOP_LEFT_ALIGN_LEFT
  ) {
    style.width = lineSize;
    style.height = levelInterval / 2;
    style.transform = 'translate(-50%, 0)';
  }

  if (layoutStrategy === LAYOUT_STRATEGY.BOTTOM_CENTER) {
    style.width = lineSize;
    style.height = levelInterval / 2;
    style.transform = 'translate(-50%, 0)';
  }

  if (
    layoutStrategy === LAYOUT_STRATEGY.CENTER_LEFT ||
    layoutStrategy === LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP
  ) {
    style.width = levelInterval / 2;
    style.height = lineSize;
    style.transform = 'translate(0, -50%)';
  }

  if (layoutStrategy === LAYOUT_STRATEGY.CENTER_RIGHT) {
    style.width = levelInterval / 2;
    style.height = lineSize;
    style.transform = 'translate(0, -50%)';
  }

  options.tailLineStyle = style;
}

function nodeLegalityCheck(originNode: IOriginNode, options: IOptions) {
  const { customKeyField, customChildrenField } = options;

  if (!(typeof originNode === 'object' && originNode !== null)) {
    throw new Error(`node must be an object`);
  }

  if (['string', 'number'].indexOf(typeof originNode[customKeyField]) === -1) {
    throw new Error(`the identifier of a node must be a string or a number`);
  }

  if (
    originNode[customChildrenField] &&
    !Array.isArray(originNode[customChildrenField])
  ) {
    throw new Error(
      `the children of a node must be an array, the identifier is: ${originNode[customKeyField]}`,
    );
  }
}

/**
 * 1. iterate every node to generate a new node
 * 2. return a new root
 * 3. return a identifier-node map
 *    3.1 identifier is the value of the customKeyField attribute of a node
 *    3.2 node is the new node
 */
function processNodeData(
  originRoot: IOriginNode,
  options: IOptions,
  preRoot: INode | undefined,
  preNodeMap: INodeMap | undefined,
): { root: INode; nodeMap: INodeMap } {
  nodeLegalityCheck(originRoot, options);

  const {
    defaultExpandAll,
    defaultExpandRoot,
    defaultExpandedKeys,
    customKeyField,
    customChildrenField,
  } = options;

  const root: INode = {
    ...(preRoot || ({} as INode)),
    origin: originRoot,
    key: originRoot[customKeyField],
    children: [],
    expanded:
      (defaultExpandAll ||
        defaultExpandRoot ||
        defaultExpandedKeys.indexOf(originRoot[customKeyField]) !== -1) &&
      originRoot[customChildrenField] &&
      originRoot[customChildrenField].length > 0,
    visible: true,
    level: 0,
  };

  const nodeMap = {
    [root.key]: root,
  };

  let queue = [root];

  while (queue.length > 0) {
    const preLevelNodes = queue.slice();
    queue = [];

    preLevelNodes.forEach((node) => {
      const originChildren: Array<IOriginNode> =
        node.origin[customChildrenField];

      if (originChildren) {
        node.children = [];
        originChildren.forEach((originSubNode) => {
          nodeLegalityCheck(originSubNode, options);

          // if the identifier is not unique, ignore the node
          if (originSubNode[customKeyField] in nodeMap) {
            console.error(
              `different nodes have the same identifier: ${originSubNode[customKeyField]}`,
            );
            return null;
          }

          const preSubNode =
            preNodeMap && preNodeMap[originSubNode[customKeyField]];
          let visible;
          if (preNodeMap && preSubNode) {
            // eslint-disable-next-line prefer-destructuring
            visible = preSubNode.visible;
          } else {
            visible = false;
          }

          const subNode: INode = {
            ...((preSubNode || {}) as INode),
            origin: originSubNode,
            key: originSubNode[customKeyField],
            parentKey: node.key,
            children: [],
            expanded:
              (defaultExpandAll ||
                defaultExpandedKeys.indexOf(originSubNode[customKeyField]) !==
                  -1) &&
              Array.isArray(originSubNode[customChildrenField]) &&
              originSubNode[customChildrenField].length > 0,
            visible,
            level: node.level + 1,
          };

          nodeMap[subNode.key] = subNode;
          queue.push(subNode);

          node.children.push(subNode);
        });

        node.children = node.children.filter((item) => item);
      }
    });
  }

  return {
    root,
    nodeMap,
  };
}

/**
 * generate a two-dimensional array
 * in first dimension, every item is an array, the index represent its level
 * in second dimension, every item is an identifier of one node
 */
function genVisibleLevelArray(curRoot: INode): TypeLevelArray {
  const levelArray: TypeLevelArray = [];
  let queue = [curRoot];

  while (queue.length > 0) {
    const preLevelNodes = queue.slice();
    queue = [];

    preLevelNodes.forEach((node) => {
      if (!levelArray[node.level]) {
        levelArray[node.level] = [node.key];
      } else {
        levelArray[node.level].push(node.key);
      }

      if (node.expanded) {
        node.children.forEach((subNode) => {
          queue.push(subNode);
        });
      }
    });
  }

  return levelArray;
}

function getModifierDistance(node: INode, nodeMap: INodeMap): number {
  let modifierDistance = 0;
  let cur = node;
  let walking = true;

  while (walking) {
    const parent = cur.parentKey !== undefined && nodeMap[cur.parentKey];

    /**
     * 1. parent is not exist: cur is the root
     * 2. parent.modifier !== 'number': parent doesn't get its modifier yet
     */
    if (parent && typeof parent.modifier === 'number') {
      modifierDistance += parent.modifier;
      cur = parent;
    } else {
      walking = false;
    }
  }

  return modifierDistance;
}

function processOverlapForCenterAlign(
  node: INode,
  nodeMap: INodeMap,
  options: IOptions,
) {
  if (node.parentKey === undefined) {
    return;
  }

  const { finalNodeSize, siblingInterval } = options;

  let queue = [node];
  const parentNode = nodeMap[node.parentKey];
  const levelArrayFromParent = genVisibleLevelArray({
    ...parentNode,
    children: parentNode.children.slice(
      0,
      parentNode.children.findIndex((item) => item.key === node.key) + 1,
    ),
  });

  while (queue.length > 0) {
    const preLevelNodes = queue.slice();
    queue = [];

    preLevelNodes.forEach((item) => {
      if (item.children.length > 0 && item.expanded) {
        queue.push(...item.children);

        const leftMostNode = item.children[0];
        const leftMostNodeIndexOfLevel = levelArrayFromParent[
          leftMostNode.level
        ].indexOf(leftMostNode.key);
        const correspondRightMostNode =
          nodeMap[
            levelArrayFromParent[leftMostNode.level][
              leftMostNodeIndexOfLevel - 1
            ]
          ];

        if (correspondRightMostNode) {
          const overlapDistance =
            (correspondRightMostNode.relative || 0) +
            finalNodeSize +
            siblingInterval +
            getModifierDistance(correspondRightMostNode, nodeMap) -
            (leftMostNode.relative || 0) -
            getModifierDistance(leftMostNode, nodeMap);

          if (overlapDistance > 0) {
            let overlapStartNode = correspondRightMostNode;
            while (
              overlapStartNode.parentKey !== undefined &&
              overlapStartNode.level > node.level
            ) {
              overlapStartNode = nodeMap[overlapStartNode.parentKey];
            }

            node.relative = (node.relative || 0) + overlapDistance;
            node.modifier = (node.modifier || 0) + overlapDistance;

            const identifiersInCurrentLevel = levelArrayFromParent[node.level];
            const overlapStartNodeIndex = identifiersInCurrentLevel.findIndex(
              (key) => key === overlapStartNode.key,
            );
            const needDistributeArray = identifiersInCurrentLevel.slice(
              overlapStartNodeIndex + 1,
              identifiersInCurrentLevel.length - 1,
            );
            const len = needDistributeArray.length;
            const distributeDistance = overlapDistance / (len + 1);

            for (let i = 0; i < len; i += 1) {
              const needDistributeNode = nodeMap[needDistributeArray[i]];
              needDistributeNode.relative =
                (needDistributeNode.relative || 0) + distributeDistance;
              needDistributeNode.modifier =
                (needDistributeNode.modifier || 0) + distributeDistance;
            }
          }
        }
      }
    });
  }
}

/**
 * 1. node has no left sibling in current subtree:
 *    1.1 node is a leaf node:
 *        modifier = 0
 *        relative = 0
 *
 *    1.2 node is not a leaf node:
 *        modifier = 0
 *        relative = total length of children divide 2
 *
 *  2. node has left sibling in current subtree:
 *    2.1 node is a leaf node:
 *        relative = depend on relative of left sibling
 *        modifier = 0
 *
 *    2.2 node is not a leaf node:
 *        relative = depend on relative of left sibling
 *        modifier = total length of children divide 2
 *        !!!need extra overlap check!!!
 */
function calcInitialPositionForCenterAlign(
  node: INode,
  nodeMap: INodeMap,
  options: IOptions,
) {
  const { finalNodeSize, siblingInterval } = options;
  const nodeChildren = node.children;

  let nodeIndex;
  if (node.level === 0 || node.parentKey === undefined) {
    nodeIndex = -1;
  } else {
    nodeIndex = nodeMap[node.parentKey].children.findIndex(
      (item) => item.key === node.key,
    );
  }

  if (nodeIndex <= 0 || node.parentKey === undefined) {
    node.modifier = 0;

    if (nodeChildren.length === 0 || !node.expanded) {
      node.relative = 0;
    } else {
      node.relative =
        ((nodeChildren[0].relative || 0) +
          (nodeChildren[nodeChildren.length - 1].relative || 0)) /
        2;
    }

    return;
  }

  const leftNode = nodeMap[node.parentKey].children[nodeIndex - 1];
  node.relative = (leftNode.relative || 0) + finalNodeSize + siblingInterval;

  if (nodeChildren.length === 0 || !node.expanded) {
    node.modifier = 0;
  } else {
    node.modifier =
      node.relative -
      ((nodeChildren[0].relative || 0) +
        (nodeChildren[nodeChildren.length - 1].relative || 0)) /
        2;

    processOverlapForCenterAlign(node, nodeMap, options);
  }
}

function accumlateRelative(node: INode, nodeMap: INodeMap): number {
  let accumlated = node.relative || 0;
  let cur = node;
  let walking = true;

  while (walking) {
    const parent = cur.parentKey !== undefined && nodeMap[cur.parentKey];

    /**
     * 1. parent is not exist: cur is the root
     * 2. parent.relative !== 'number': parent doesn't get its relative yet
     */
    if (parent && typeof parent.relative === 'number') {
      accumlated += parent.relative;
      cur = parent;
    } else {
      walking = false;
    }
  }

  return accumlated;
}

function processOverlapForAsideAlign(
  node: INode,
  nodeMap: INodeMap,
  options: IOptions,
) {
  if (node.parentKey === undefined) {
    return;
  }

  const { finalNodeSize, siblingInterval } = options;

  let queue = [node];
  const parentNode = nodeMap[node.parentKey];
  const levelArray = genVisibleLevelArray({
    ...parentNode,
    children: parentNode.children.slice(
      0,
      parentNode.children.findIndex((item) => item.key === node.key) + 1,
    ),
  });

  while (queue.length > 0) {
    const preLevelNodes = queue.slice();
    queue = [];

    preLevelNodes.forEach((item) => {
      if (item.children.length > 0 && item.expanded) {
        queue.push(...item.children);

        const leftMostNode = item.children[0];
        const leftMostNodeIndexOfLevel = levelArray[leftMostNode.level].indexOf(
          leftMostNode.key,
        );
        const correspondRightMostNode =
          nodeMap[levelArray[leftMostNode.level][leftMostNodeIndexOfLevel - 1]];

        if (correspondRightMostNode) {
          const overlapDistance =
            accumlateRelative(correspondRightMostNode, nodeMap) +
            finalNodeSize +
            siblingInterval -
            accumlateRelative(leftMostNode, nodeMap);

          if (overlapDistance > 0) {
            node.relative = (node.relative || 0) + overlapDistance;
          }
        }
      }
    });
  }
}

/**
 * 1. node has no left sibling in current subtree:
 *    relative = 0
 *
 * 2. node has left sibling in current subtree:
 *    2.1 node is a leaf node:
 *        relative = depend on relative of left sibling
 *
 *    2.2 node is not a leaf node:
 *        relative = depend on relative of left sibling
 *        !!!need extra overlap check!!!
 */
function calcInitialPositionForAsideAlign(
  node: INode,
  nodeMap: INodeMap,
  options: IOptions,
) {
  const { finalNodeSize, siblingInterval } = options;

  let nodeIndex;
  if (node.level === 0 || node.parentKey === undefined) {
    nodeIndex = -1;
  } else {
    nodeIndex = nodeMap[node.parentKey].children.findIndex(
      (item) => item.key === node.key,
    );
  }

  if (nodeIndex <= 0 || node.parentKey === undefined) {
    node.relative = 0;
    return;
  }

  const leftNode = nodeMap[node.parentKey].children[nodeIndex - 1];
  node.relative = (leftNode.relative || 0) + finalNodeSize + siblingInterval;

  if (node.children.length > 0 && node.expanded) {
    processOverlapForAsideAlign(node, nodeMap, options);
  }
}

function genRelativePosition(
  node: INode,
  nodeMap: INodeMap,
  options: IOptions,
) {
  const { treeType } = options;

  if (node.expanded) {
    node.children.forEach((subNode) => {
      genRelativePosition(subNode, nodeMap, options);
    });
  }

  if (treeType === TREE_TYPE.CENTER_TREE) {
    calcInitialPositionForCenterAlign(node, nodeMap, options);
  }

  if (treeType === TREE_TYPE.ASIDE_TREE) {
    calcInitialPositionForAsideAlign(node, nodeMap, options);
  }
}

function genNodeStyle(node: INode, options: IOptions) {
  const {
    nodeWidth,
    nodeHeight,
    levelNodeSize,
    finalDirectionAttr,
    levelDirectionAttr,
    xDirectionAttr,
    yDirectionAttr,
    levelInterval,
  } = options;

  const style: IStyle = {
    width: nodeWidth,
    height: nodeHeight,
    [finalDirectionAttr]: node.final || 0,
    [levelDirectionAttr]:
      node.level * (levelNodeSize + levelInterval) - levelNodeSize / 2,
  };

  if (!node.styleCollection) {
    node.styleCollection = {};
  }

  node.styleCollection.nodeStyle = style;

  if (xDirectionAttr === finalDirectionAttr) {
    node.styleCollection.headPointPosition = {
      [xDirectionAttr]: (style[xDirectionAttr] || 0) + nodeWidth / 2,
      [yDirectionAttr]: style[yDirectionAttr] || 0,
    };
    node.styleCollection.tailPointPosition = {
      [xDirectionAttr]: (style[xDirectionAttr] || 0) + nodeWidth / 2,
      [yDirectionAttr]: (style[yDirectionAttr] || 0) + nodeHeight,
    };
  } else {
    node.styleCollection.headPointPosition = {
      [xDirectionAttr]: style[xDirectionAttr] || 0,
      [yDirectionAttr]: (style[yDirectionAttr] || 0) + nodeHeight / 2,
    };
    node.styleCollection.tailPointPosition = {
      [xDirectionAttr]: (style[xDirectionAttr] || 0) + nodeWidth,
      [yDirectionAttr]: (style[yDirectionAttr] || 0) + nodeHeight / 2,
    };
  }
}

function genJunctionLineStyle(node: INode, options: IOptions) {
  const {
    layoutStrategy,
    finalNodeSize,
    levelNodeSize,
    finalDirectionAttr,
    levelDirectionAttr,
    levelInterval,
    lineSize,
    lineColor,
  } = options;
  const { styleCollection = {} as IStyleCollection } = node;
  const { nodeStyle = {} as IStyle } = styleCollection;

  const length =
    (node.children[node.children.length - 1].final || 0) -
    (node.children[0].final || 0);

  const style = { backgroundColor: lineColor } as IStyle;

  if (layoutStrategy === LAYOUT_STRATEGY.TOP_CENTER) {
    style.width = length;
    style.height = lineSize;
    style[finalDirectionAttr] =
      (nodeStyle[finalDirectionAttr] || 0) + finalNodeSize / 2 - length / 2;
    style[levelDirectionAttr] =
      (nodeStyle[levelDirectionAttr] || 0) + levelNodeSize + levelInterval / 2;
  }

  if (layoutStrategy === LAYOUT_STRATEGY.BOTTOM_CENTER) {
    style.width = length;
    style.height = lineSize;
    style[finalDirectionAttr] =
      (nodeStyle[finalDirectionAttr] || 0) + finalNodeSize / 2 - length / 2;
    style[levelDirectionAttr] =
      (nodeStyle[levelDirectionAttr] || 0) + levelNodeSize + levelInterval / 2;
  }

  if (layoutStrategy === LAYOUT_STRATEGY.CENTER_LEFT) {
    style.width = lineSize;
    style.height = length;
    style[finalDirectionAttr] =
      (nodeStyle[finalDirectionAttr] || 0) + finalNodeSize / 2 - length / 2;
    style[levelDirectionAttr] =
      (nodeStyle[levelDirectionAttr] || 0) + levelNodeSize + levelInterval / 2;
  }

  if (layoutStrategy === LAYOUT_STRATEGY.CENTER_RIGHT) {
    style.width = lineSize;
    style.height = length;
    style[finalDirectionAttr] =
      (nodeStyle[finalDirectionAttr] || 0) + finalNodeSize / 2 - length / 2;
    style[levelDirectionAttr] =
      (nodeStyle[levelDirectionAttr] || 0) + levelNodeSize + levelInterval / 2;
  }

  if (layoutStrategy === LAYOUT_STRATEGY.TOP_LEFT_ALIGN_LEFT) {
    style.width = length;
    style.height = lineSize;
    style[finalDirectionAttr] =
      (nodeStyle[finalDirectionAttr] || 0) + finalNodeSize / 2;
    style[levelDirectionAttr] =
      (nodeStyle[levelDirectionAttr] || 0) + levelNodeSize + levelInterval / 2;
  }

  if (layoutStrategy === LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP) {
    style.width = lineSize;
    style.height = length;
    style[finalDirectionAttr] =
      (nodeStyle[finalDirectionAttr] || 0) + finalNodeSize / 2;
    style[levelDirectionAttr] =
      (nodeStyle[levelDirectionAttr] || 0) + levelNodeSize + levelInterval / 2;
  }

  if (node.styleCollection) {
    node.styleCollection.junctionLineStyle = style;
  } else {
    node.styleCollection = {
      junctionLineStyle: style,
    };
  }
}

function genCustomLineStyle(
  startPointPosition: IPointPosition,
  endPointPosition: IPointPosition,
  options: IOptions,
): IStyle {
  const { xDirectionAttr, yDirectionAttr } = options;

  return {
    width: Math.abs(
      (startPointPosition[xDirectionAttr] || 0) -
        (endPointPosition[xDirectionAttr] || 0),
    ),
    height: Math.abs(
      (startPointPosition[yDirectionAttr] || 0) -
        (endPointPosition[yDirectionAttr] || 0),
    ),
    [xDirectionAttr]: Math.min(
      startPointPosition[xDirectionAttr] || 0,
      endPointPosition[xDirectionAttr] || 0,
    ),
    [yDirectionAttr]: Math.min(
      startPointPosition[yDirectionAttr] || 0,
      endPointPosition[yDirectionAttr] || 0,
    ),
  };
}

function genStartAndStopPointCoordinate(
  startPointAbsolutePosition: IPointPosition,
  stopPointAbsolutePosition: IPointPosition,
  customLineStyle: IStyle,
  options: IOptions,
): { startPointCoordinate: Array<number>; stopPointCoordinate: Array<number> } {
  const { layoutStrategy } = options;
  const { width, height } = customLineStyle;

  if (
    [LAYOUT_STRATEGY.TOP_CENTER, LAYOUT_STRATEGY.TOP_LEFT_ALIGN_LEFT].indexOf(
      layoutStrategy,
    ) !== -1
  ) {
    const startPointCoordinate = [
      startPointAbsolutePosition.left! < stopPointAbsolutePosition.left!
        ? 0
        : width,
      0,
    ];
    return {
      startPointCoordinate,
      stopPointCoordinate: [width - startPointCoordinate[0], height],
    };
  }

  if (layoutStrategy === LAYOUT_STRATEGY.BOTTOM_CENTER) {
    const startPointCoordinate = [
      startPointAbsolutePosition.left! < stopPointAbsolutePosition.left!
        ? 0
        : width,
      height,
    ];
    return {
      startPointCoordinate,
      stopPointCoordinate: [width - startPointCoordinate[0], 0],
    };
  }

  if (
    [LAYOUT_STRATEGY.CENTER_LEFT, LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP].indexOf(
      layoutStrategy,
    ) !== -1
  ) {
    const startPointCoordinate = [
      0,
      startPointAbsolutePosition.top! < stopPointAbsolutePosition.top!
        ? 0
        : height,
    ];
    return {
      startPointCoordinate,
      stopPointCoordinate: [width, height - startPointCoordinate[1]],
    };
  }

  if (layoutStrategy === LAYOUT_STRATEGY.CENTER_RIGHT) {
    const startPointCoordinate = [
      width,
      startPointAbsolutePosition.top! < stopPointAbsolutePosition.top!
        ? 0
        : height,
    ];
    return {
      startPointCoordinate,
      stopPointCoordinate: [0, height - startPointCoordinate[1]],
    };
  }

  return { startPointCoordinate: [0, 0], stopPointCoordinate: [0, 0] };
}

function deleteNodeAttr(node: INode, attrList: Array<keyof INode>): void {
  attrList.forEach((attr) => {
    if (attr in node) {
      delete node[attr as keyof INode];
    }
  });
}

function genEmptyJunctionLineStyle(
  nodeStyle: IStyle = {} as IStyle,
  options: IOptions,
): IStyle {
  const {
    finalNodeSize,
    finalDirectionAttr,
    levelDirectionAttr,
    levelNodeSize,
  } = options;
  return {
    width: 0,
    height: 0,
    [finalDirectionAttr]:
      (nodeStyle[finalDirectionAttr] || 0) + finalNodeSize / 2,
    [levelDirectionAttr]: (nodeStyle[levelDirectionAttr] || 0) + levelNodeSize,
  };
}

function processJustAppear(node: INode, nodeMap: INodeMap, options: IOptions) {
  const {
    lineType,
    headLineLevelAttr,
    xDirectionAttr,
    yDirectionAttr,
    headLineStyle,
    tailLineStyle,
  } = options;

  let firstPreVisibleAncestor = node;
  let cur = node;
  let walking = true;

  while (walking) {
    const parent = cur.parentKey !== undefined && nodeMap[cur.parentKey];

    if (parent && !parent.preVisible) {
      cur = parent;
    } else {
      firstPreVisibleAncestor = parent || cur;
      walking = false;
    }
  }

  // if the node is root, "firstPreVisibleAncestor.preStyleCollection" maybe "undefined"
  let firstPreVisibleAncestorStyleCollection;
  if (firstPreVisibleAncestor.preStyleCollection) {
    firstPreVisibleAncestorStyleCollection =
      firstPreVisibleAncestor.preStyleCollection;
  } else {
    firstPreVisibleAncestorStyleCollection =
      firstPreVisibleAncestor.styleCollection || {};
  }

  node.animation = {
    begin: {
      nodeStyle: firstPreVisibleAncestorStyleCollection.nodeStyle,
      headPointPosition:
        firstPreVisibleAncestorStyleCollection.tailPointPosition,
      tailPointPosition:
        firstPreVisibleAncestorStyleCollection.tailPointPosition,
      customLineStyle: {
        width: 0,
        height: 0,
        [xDirectionAttr]: firstPreVisibleAncestorStyleCollection.headPointPosition
          ? firstPreVisibleAncestorStyleCollection.headPointPosition[
              xDirectionAttr
            ]
          : 0,
        [yDirectionAttr]: firstPreVisibleAncestorStyleCollection.headPointPosition
          ? firstPreVisibleAncestorStyleCollection.headPointPosition[
              yDirectionAttr
            ]
          : 0,
      },
    },
    end: node.styleCollection || {},
  };

  if (lineType === 'straight') {
    node.animation.begin.headLineStyle = {
      ...headLineStyle,
      [headLineLevelAttr]: 0,
      width: 0,
      height: 0,
    };
    node.animation.begin.tailLineStyle = (node.styleCollection || {})
      .tailLineStyle && {
      ...tailLineStyle,
      width: 0,
      height: 0,
    };
    node.animation.begin.junctionLineStyle = node.expanded
      ? genEmptyJunctionLineStyle(
          firstPreVisibleAncestorStyleCollection.nodeStyle,
          options,
        )
      : undefined;
  }
}

function processPositionMaybeMove(node: INode, options: IOptions) {
  const { lineType, tailLineStyle } = options;

  // if the node is root, "node.preStyleCollection" maybe "undefined"
  if (node.level === 0 && !node.preStyleCollection) {
    node.preStyleCollection = {
      nodeStyle: (node.styleCollection || {}).nodeStyle,
      headPointPosition: (node.styleCollection || {}).headPointPosition,
      tailPointPosition: (node.styleCollection || {}).tailPointPosition,
    };
  }

  const {
    nodeStyle: preNodeStyle,
    headLineStyle: preHeadLineStyle,
    tailLineStyle: preTailLineStyle,
    junctionLineStyle: preJunctionLineStyle,
    headPointPosition: preHeadPointPosition,
    tailPointPosition: preTailPointPosition,
    customLineStyle: preCustomLineStyle,
  } = node.preStyleCollection || {};

  let beginTailLineStyle;
  let beginJunctionLineStyle;
  let endTailLineStyle;
  let endJunctionLineStyle;

  if (lineType === 'straight') {
    if (preTailLineStyle && (node.styleCollection || {}).tailLineStyle) {
      beginTailLineStyle = preTailLineStyle;
      beginJunctionLineStyle = preJunctionLineStyle;
      endTailLineStyle = (node.styleCollection || {}).tailLineStyle;
      endJunctionLineStyle = (node.styleCollection || {}).junctionLineStyle;
    } else if (preTailLineStyle) {
      beginTailLineStyle = preTailLineStyle;
      beginJunctionLineStyle = preJunctionLineStyle;
      endTailLineStyle = {
        ...tailLineStyle,
        width: 0,
        height: 0,
      };
      endJunctionLineStyle = genEmptyJunctionLineStyle(
        (node.styleCollection || {}).nodeStyle,
        options,
      );
    } else if ((node.styleCollection || {}).tailLineStyle) {
      beginTailLineStyle = {
        ...tailLineStyle,
        width: 0,
        height: 0,
      };
      beginJunctionLineStyle = genEmptyJunctionLineStyle(preNodeStyle, options);
      endTailLineStyle = (node.styleCollection || {}).tailLineStyle;
      endJunctionLineStyle = (node.styleCollection || {}).junctionLineStyle;
    }
  }

  node.animation = {
    begin: {
      nodeStyle: preNodeStyle,
      headLineStyle: preHeadLineStyle,
      tailLineStyle: beginTailLineStyle,
      junctionLineStyle: beginJunctionLineStyle,
      headPointPosition: preHeadPointPosition,
      tailPointPosition: preTailPointPosition,
      customLineStyle: preCustomLineStyle,
    },
    end: {
      ...node.styleCollection,
      tailLineStyle: endTailLineStyle,
      junctionLineStyle: endJunctionLineStyle,
    },
  };
}

function processJustDisappear(
  node: INode,
  nodeMap: INodeMap,
  options: IOptions,
) {
  const {
    nodeStyle: preNodeStyle,
    headLineStyle: preHeadLineStyle,
    tailLineStyle: preTailLineStyle,
    junctionLineStyle: preJunctionLineStyle,
    headPointPosition: preHeadPointPosition,
    tailPointPosition: preTailPointPosition,
    customLineStyle: preCustomLineStyle,
  } = node.preStyleCollection || {};

  const {
    headLineLevelAttr,
    xDirectionAttr,
    yDirectionAttr,
    headLineStyle,
    tailLineStyle,
  } = options;

  let firstVisibleAncestor = node;
  let cur = node;
  let walking = true;

  while (walking) {
    const parent = cur.parentKey !== undefined && nodeMap[cur.parentKey];

    if (parent && !parent.visible) {
      cur = parent;
    } else {
      firstVisibleAncestor = parent || cur;
      walking = false;
    }
  }

  node.animation = {
    begin: {
      nodeStyle: preNodeStyle,
      headLineStyle: preHeadLineStyle,
      tailLineStyle: preTailLineStyle,
      junctionLineStyle: preJunctionLineStyle,
      headPointPosition: preHeadPointPosition,
      tailPointPosition: preTailPointPosition,
      customLineStyle: preCustomLineStyle,
    },
    end: {
      nodeStyle: (firstVisibleAncestor.styleCollection || {}).nodeStyle,
      headLineStyle: preHeadLineStyle && {
        ...headLineStyle,
        [headLineLevelAttr]: 0,
        width: 0,
        height: 0,
      },
      tailLineStyle: preTailLineStyle && {
        ...tailLineStyle,
        width: 0,
        height: 0,
      },
      junctionLineStyle:
        preJunctionLineStyle &&
        genEmptyJunctionLineStyle(
          (firstVisibleAncestor.styleCollection || {}).nodeStyle,
          options,
        ),
      headPointPosition: (firstVisibleAncestor.styleCollection || {})
        .tailPointPosition,
      tailPointPosition: (firstVisibleAncestor.styleCollection || {})
        .tailPointPosition,
      customLineStyle: {
        width: 0,
        height: 0,
        [xDirectionAttr]: ((firstVisibleAncestor.styleCollection || {})
          .headPointPosition || {})[xDirectionAttr],
        [yDirectionAttr]: ((firstVisibleAncestor.styleCollection || {})
          .headPointPosition || {})[yDirectionAttr],
      },
    },
  };
}

function genAnimation(root: INode, nodeMap: INodeMap, options: IOptions) {
  const stack = [];
  let cur: INode | null = root;

  while (cur || stack.length > 0) {
    while (cur) {
      if (cur.visible) {
        if (!cur.preVisible) {
          processJustAppear(cur, nodeMap, options);
        } else {
          processPositionMaybeMove(cur, options);
        }
      } else if (cur.preVisible) {
        processJustDisappear(cur, nodeMap, options);
      } else {
        if (cur.parentKey !== undefined) {
          nodeMap[cur.parentKey].visitedIndex! += 1;
        }
        cur = null;
      }

      if (cur) {
        stack.push(cur);

        cur.visitedIndex = -1;

        if (cur.children.length > 0) {
          cur.visitedIndex += 1;
          cur = cur.children[cur.visitedIndex];
        } else {
          cur = null;
        }
      }
    }

    if (stack.length > 0) {
      const topNode = stack[stack.length - 1] as INode;

      if (
        typeof topNode.visitedIndex === 'number' &&
        topNode.children.length - 1 > topNode.visitedIndex
      ) {
        topNode.visitedIndex += 1;
        cur = topNode.children[topNode.visitedIndex];
      } else {
        stack.pop();
        delete topNode.visitedIndex;
        cur = null;
      }
    }
  }
}

function cleanNode(
  node: INode,
  nodeMap: INodeMap,
  visibleKeys: Array<TypeIdentifier>,
  options: IOptions,
) {
  node.preVisible = node.visible;
  if (visibleKeys.indexOf(node.key) === -1) {
    node.visible = false;
  } else {
    node.visible = true;
  }

  if (!node.visible) {
    deleteNodeAttr(node, ['relative', 'modifier', 'absolute', 'final']);
    return;
  }

  const { treeType } = options;

  let absolute = 0;
  if (treeType === TREE_TYPE.CENTER_TREE) {
    absolute = (node.relative || 0) + getModifierDistance(node, nodeMap);
  }

  if (treeType === TREE_TYPE.ASIDE_TREE) {
    absolute = accumlateRelative(node, nodeMap);
  }

  node.absolute = absolute;
}

function genNodeFinal(root: INode, node: INode, options: IOptions) {
  const { finalNodeSize } = options;

  if (root.key === node.key) {
    root.final = -finalNodeSize / 2;
  } else if (node.visible) {
    node.final =
      (node.absolute || 0) - (root.absolute || 0) - finalNodeSize / 2;
  }
}

function genStyleCollection(node: INode, options: IOptions) {
  const { lineType, headLineStyle, tailLineStyle } = options;

  if (node.styleCollection) {
    node.preStyleCollection = { ...node.styleCollection };
  } else {
    deleteNodeAttr(node, ['preStyleCollection']);
  }

  if (node.visible) {
    node.styleCollection = {};

    genNodeStyle(node, options);

    if (node.level > 0) {
      if (lineType === 'straight') {
        node.styleCollection.headLineStyle = headLineStyle;
      }
    }

    if (node.expanded) {
      if (lineType === 'straight') {
        node.styleCollection.tailLineStyle = tailLineStyle;
        genJunctionLineStyle(node, options);
      }

      node.children.forEach((subNode) => {
        if (subNode.styleCollection) {
          subNode.styleCollection.customLineStyle = genCustomLineStyle(
            node.styleCollection!.tailPointPosition!,
            subNode.styleCollection.headPointPosition!,
            options,
          );

          const {
            startPointCoordinate,
            stopPointCoordinate,
          } = genStartAndStopPointCoordinate(
            node.styleCollection!.tailPointPosition!,
            subNode.styleCollection.headPointPosition!,
            subNode.styleCollection.customLineStyle,
            options,
          );

          subNode.styleCollection.startPointCoordinate = startPointCoordinate;
          subNode.styleCollection.stopPointCoordinate = stopPointCoordinate;
        }
      });
    } else {
      delete node.styleCollection.tailLineStyle;
      delete node.styleCollection.junctionLineStyle;
    }
  } else if (node.preVisible) {
    deleteNodeAttr(node, ['styleCollection']);
  } else {
    deleteNodeAttr(node, ['styleCollection', 'animation']);
  }
}

function genFinalPosition(
  root: INode,
  nodeMap: INodeMap,
  visibleKeys: Array<TypeIdentifier>,
  options: IOptions,
) {
  const stack = [];
  let cur: INode | null = root;

  while (cur || stack.length > 0) {
    while (cur) {
      cleanNode(cur, nodeMap, visibleKeys, options);

      stack.push(cur);

      cur.visitedIndex = -1;

      if (cur.children.length > 0) {
        cur.visitedIndex += 1;
        cur = cur.children[cur.visitedIndex];
      } else {
        cur = null;
      }
    }

    if (stack.length > 0) {
      const topNode = stack[stack.length - 1] as INode;

      if (topNode.children.length - 1 > topNode.visitedIndex!) {
        topNode.visitedIndex! += 1;
        cur = topNode.children[topNode.visitedIndex!];
      } else {
        genNodeFinal(root, topNode, options);
        genStyleCollection(topNode, options);

        stack.pop();
        delete topNode.visitedIndex;
        cur = null;
      }
    }
  }
}

function distanceFormatter(key: string, canvasSize: number): number {
  if (!key.trim()) {
    return 0;
  }
  if (key.indexOf('%') !== -1) {
    return (canvasSize * (parseFloat(key) || 0)) / 100;
  }
  return parseFloat(key) || 0;
}

function distanceAdapter(
  targetDistance: TypeGeneralNumber,
  canvasSize: number,
): number {
  const arr = `${targetDistance}`.split(/([+-])/);

  if (arr.length === 0) {
    return 0;
  }

  let converted = distanceFormatter(arr[0], canvasSize);

  for (let i = 1; i < arr.length; i += 2) {
    if (arr[i] === '+') {
      converted += distanceFormatter(arr[i + 1], canvasSize);
    } else {
      converted -= distanceFormatter(arr[i + 1], canvasSize);
    }
  }

  return converted;
}

function animationValueFormat(
  begin: number,
  end: number,
  percent: number,
): number {
  if (begin === end) {
    return begin;
  }

  return begin + (end - begin) * percent;
}

function genAnimatingStyle(
  beginStyle: IStyle,
  endStyle: IStyle,
  directionAttr1: keyof IPointPosition,
  directionAttr2: keyof IPointPosition,
  percent: number,
): IStyle {
  return {
    ...beginStyle,
    width: animationValueFormat(beginStyle.width, endStyle.width, percent),
    height: animationValueFormat(beginStyle.height, endStyle.height, percent),
    [directionAttr1]: animationValueFormat(
      beginStyle[directionAttr1] || 0,
      endStyle[directionAttr1] || 0,
      percent,
    ),
    [directionAttr2]: animationValueFormat(
      beginStyle[directionAttr2] || 0,
      endStyle[directionAttr2] || 0,
      percent,
    ),
  };
}

function genAnimatingPointPosition(
  beginPosition: IPointPosition,
  endPosition: IPointPosition,
  directionAttr1: keyof IPointPosition,
  directionAttr2: keyof IPointPosition,
  percent: number,
): IPointPosition {
  return {
    [directionAttr1]: animationValueFormat(
      beginPosition[directionAttr1] || 0,
      endPosition[directionAttr1] || 0,
      percent,
    ),
    [directionAttr2]: animationValueFormat(
      beginPosition[directionAttr2] || 0,
      endPosition[directionAttr2] || 0,
      percent,
    ),
  };
}

export default class VisTree {
  root!: INode;

  scaleRatio: number;

  options: IOptions;

  treeCanvasEle!: HTMLElement;

  nodeMap: INodeMap;

  visibleLevelArray: TypeLevelArray;

  visibleKeys: Array<TypeIdentifier>;

  visibleExpandedKeys: Array<TypeIdentifier>;

  anchorStyle: IAnchorStyle;

  anchorMoveInfo: {
    startTop: number;
    startLeft: number;
  };

  constructor(props: IVisTreeProps = {}) {
    const options = props.options || {};

    this.options = {} as IOptions;

    this.options.defaultExpandAll = options.defaultExpandAll || false;
    if (options.defaultExpandRoot !== false) {
      this.options.defaultExpandRoot = true;
    } else {
      this.options.defaultExpandRoot = false;
    }

    // defaultExpandedKeys > defaultExpandAll > defaultExpandRoot
    if (options.defaultExpandAll) {
      this.options.defaultExpandRoot = false;
    }
    if (options.defaultExpandedKeys) {
      this.options.defaultExpandAll = false;
      this.options.defaultExpandRoot = false;
    }

    this.options.defaultExpandedKeys = options.defaultExpandedKeys || [];
    this.options.layoutStrategy =
      options.layoutStrategy || LAYOUT_STRATEGY.TOP_CENTER;
    this.options.customKeyField = options.customKeyField || 'key';
    this.options.customChildrenField =
      options.customChildrenField || 'children';
    this.options.nodeWidth = options.nodeWidth || 60;
    this.options.nodeHeight = options.nodeHeight || 30;
    this.options.siblingInterval = options.siblingInterval || 30;
    this.options.levelInterval = options.levelInterval || 60;
    this.options.lineSize = options.lineSize || 1;
    this.options.lineColor = options.lineColor || 'black';
    this.options.lineType =
      ['straight', 'none'].indexOf(options.lineType!) !== -1
        ? options.lineType!
        : 'straight';

    genTreeType(this.options);
    genNodeSize(this.options);
    genDirectionAttr(this.options);

    if (this.options.lineType === 'straight') {
      genHeadLineLevelAttr(this.options);
      genHeadLineStyle(this.options);
      genTailLineStyle(this.options);
    }

    this.nodeMap = {};
    this.scaleRatio = props.scaleRatio || 1;
    this.visibleLevelArray = [];
    this.visibleKeys = [];
    this.visibleExpandedKeys = [];
    this.anchorStyle = { top: 0, left: 0 };
    this.anchorMoveInfo = {
      startTop: 0,
      startLeft: 0,
    };
  }

  initialize(dataSource: IOriginNode) {
    const { root: preRoot, nodeMap: preNodeMap, options } = this;
    const {
      defaultExpandAll,
      defaultExpandRoot,
      defaultExpandedKeys,
    } = options;

    const { root, nodeMap } = processNodeData(
      dataSource,
      {
        ...options,
        defaultExpandAll: preRoot ? false : defaultExpandAll,
        defaultExpandRoot: preRoot ? false : defaultExpandRoot,
        defaultExpandedKeys: preRoot
          ? this.getExpandedKeys()
          : defaultExpandedKeys,
      },
      preRoot,
      preNodeMap,
    );

    this.root = root;
    this.nodeMap = nodeMap;

    this.genPosition();
  }

  getNodeList(useAnimation?: boolean): Array<INode> {
    const { root, nodeMap, visibleKeys } = this;

    if (!useAnimation) {
      return visibleKeys.map((key) => nodeMap[key]);
    }

    const list = [] as Array<INode>;
    let queue = [root];

    while (queue.length > 0) {
      const preLevelNodes = queue.slice();
      queue = [];

      preLevelNodes.forEach((node) => {
        if (node.animation) {
          list.push(node);
        }

        node.children.forEach((subNode) => {
          queue.push(subNode);
        });
      });
    }

    return list;
  }

  /**
   * please read "A Node-Positioning Algorithm for General Trees"
   */
  genPosition() {
    const { root, nodeMap, options } = this;

    this.visibleLevelArray = genVisibleLevelArray(root);

    this.visibleKeys = this.visibleLevelArray.reduce(
      (prev, cur) => [...prev, ...cur],
      [],
    );

    const visibleExpandedKeys = [] as Array<TypeIdentifier>;
    this.visibleKeys.forEach((key) => {
      if (nodeMap[key].expanded) {
        visibleExpandedKeys.push(key);
      }
    });
    this.visibleExpandedKeys = visibleExpandedKeys;

    genRelativePosition(root, nodeMap, options);
    genFinalPosition(root, nodeMap, this.visibleKeys, options);
    genAnimation(root, nodeMap, options);
  }

  optimizeScale(scaleRatio: number): boolean {
    const { scaleRatio: preScaleRatio, anchorStyle, treeCanvasEle } = this;

    if (!treeCanvasEle || !parseFloat(`${scaleRatio}`)) {
      return false;
    }

    this.scaleRatio = scaleRatio;

    const canvasHeight = treeCanvasEle.offsetHeight;
    const canvasWidth = treeCanvasEle.offsetWidth;

    const preVerticalDistance = canvasHeight / 2 - anchorStyle.top;
    const preHorizontalDistance = canvasWidth / 2 - anchorStyle.left;

    const curVerticalDistance =
      (preVerticalDistance * scaleRatio) / preScaleRatio;
    const curHorizontalDistance =
      (preHorizontalDistance * scaleRatio) / preScaleRatio;

    anchorStyle.top = canvasHeight / 2 - curVerticalDistance;
    anchorStyle.left = canvasWidth / 2 - curHorizontalDistance;

    return true;
  }

  // if the node has no child, it's expanded must be "false"
  getExpandedKeys(containInvisible?: boolean): Array<TypeIdentifier> {
    if (!containInvisible) {
      return [...this.visibleExpandedKeys];
    }

    const { nodeMap } = this;
    const allExpandedKeys = [] as Array<TypeIdentifier>;
    Object.keys(nodeMap).forEach((key) => {
      if (nodeMap[key].expanded) {
        allExpandedKeys.push(nodeMap[key].key);
      }
    });
    return allExpandedKeys;
  }

  toggleNodeExpanded(key: TypeIdentifier): boolean {
    const { nodeMap } = this;
    const node = nodeMap[key];

    if (!node || node.children.length === 0) {
      return false;
    }

    node.expanded = !node.expanded;

    this.genPosition();

    return true;
  }

  updateNodesExpanded(nodeExpandedMap: INodeExpandedMap): boolean {
    const { nodeMap } = this;
    let shouldRerender = false;

    Object.keys(nodeExpandedMap).forEach((key) => {
      const node = nodeMap[key];
      if (node && node.children.length > 0) {
        shouldRerender = true;

        node.expanded = !!nodeExpandedMap[key];
      }
    });

    if (!shouldRerender) {
      return false;
    }

    this.genPosition();

    return true;
  }

  startMove() {
    const { anchorStyle, anchorMoveInfo } = this;

    anchorMoveInfo.startTop = anchorStyle.top;
    anchorMoveInfo.startLeft = anchorStyle.left;
  }

  handleMoving(diffX: number, diffY: number) {
    const { anchorStyle, anchorMoveInfo } = this;

    const { startTop, startLeft } = anchorMoveInfo;

    anchorStyle.top = startTop + diffY;
    anchorStyle.left = startLeft + diffX;
  }

  scrollIntoView({ key, top, left }: IScrollInfo): boolean {
    const { nodeMap, scaleRatio, treeCanvasEle, options } = this;
    const { nodeWidth, nodeHeight } = options;

    const targetNode = key !== undefined && nodeMap[key];

    if (
      !targetNode ||
      !targetNode.visible ||
      !targetNode.styleCollection ||
      !treeCanvasEle
    ) {
      return false;
    }

    const canvasWidth = treeCanvasEle.offsetWidth;
    const canvasHeight = treeCanvasEle.offsetHeight;

    const nodeTopInCanvas = top
      ? distanceAdapter(top, canvasHeight)
      : distanceAdapter(`50% - ${(nodeHeight * scaleRatio) / 2}`, canvasHeight);
    const nodeLeftInCanvas = left
      ? distanceAdapter(left, canvasWidth)
      : distanceAdapter(`50% - ${(nodeWidth * scaleRatio) / 2}`, canvasWidth);

    this.anchorStyle = this.getTopLeftInCanvas(
      'anchor',
      targetNode.styleCollection,
      nodeTopInCanvas,
      nodeLeftInCanvas,
    );

    return true;
  }

  virtualRender(styleCollection: IStyleCollection): IStyleCollection {
    const { treeCanvasEle, scaleRatio, options } = this;
    const {
      nodeStyle,
      headLineStyle,
      tailLineStyle,
      junctionLineStyle,
      customLineStyle,
      headPointPosition,
      tailPointPosition,
      startPointCoordinate,
      stopPointCoordinate,
    } = styleCollection;
    const { nodeWidth, nodeHeight, siblingInterval, levelInterval } = options;

    const result: IStyleCollection = {
      nodeStyle,
      headLineStyle,
      tailLineStyle,
      junctionLineStyle,
      customLineStyle,
      headPointPosition,
      tailPointPosition,
      startPointCoordinate,
      stopPointCoordinate,
    };

    if (!treeCanvasEle) {
      return result;
    }

    let skipNodeRender = !nodeStyle;
    let skipJunctionLineRender = !junctionLineStyle;
    let skipCustomLineRender = !customLineStyle;

    /**
     * strickly speaking, there should use siblingInterval or levelInterval
     * but i am a little lazy, i use the max
     */
    const MAX_INTERVAL = Math.max(siblingInterval, levelInterval);
    const BUFFER = 20;

    const canvasWidth = treeCanvasEle.offsetWidth;
    const canvasHeight = treeCanvasEle.offsetHeight;

    /**
     * whether we can skip render node, headLine and tailLine
     */
    if (!skipNodeRender) {
      const {
        top: nodeTopInCanvas,
        left: nodeLeftInCanvas,
      } = this.getTopLeftInCanvas('node', result);
      if (
        nodeTopInCanvas + (nodeHeight + MAX_INTERVAL + BUFFER) * scaleRatio <=
        0
      ) {
        skipNodeRender = true;
      }

      if (
        nodeLeftInCanvas + (nodeWidth + MAX_INTERVAL + BUFFER) * scaleRatio <=
        0
      ) {
        skipNodeRender = true;
      }

      if (
        nodeTopInCanvas -
          (canvasHeight + (nodeHeight + MAX_INTERVAL + BUFFER) * scaleRatio) >=
        0
      ) {
        skipNodeRender = true;
      }

      if (
        nodeLeftInCanvas -
          (canvasWidth + (nodeWidth + MAX_INTERVAL + BUFFER) * scaleRatio) >=
        0
      ) {
        skipNodeRender = true;
      }
    }

    /**
     * whether we can skip render juncutionLine
     */
    if (!skipJunctionLineRender && junctionLineStyle) {
      const {
        top: junctionLineTopInCanvas,
        left: junctionLineLeftInCanvas,
      } = this.getTopLeftInCanvas('junctionLine', result);
      const {
        width: junctionLineWidth,
        height: junctionLineHeight,
      } = junctionLineStyle;

      if (
        junctionLineTopInCanvas + (junctionLineHeight + BUFFER) * scaleRatio <=
        0
      ) {
        skipJunctionLineRender = true;
      }

      if (
        junctionLineLeftInCanvas + (junctionLineWidth + BUFFER) * scaleRatio <=
        0
      ) {
        skipJunctionLineRender = true;
      }

      if (
        junctionLineTopInCanvas -
          (canvasHeight + (junctionLineHeight + BUFFER) * scaleRatio) >=
        0
      ) {
        skipJunctionLineRender = true;
      }

      if (
        junctionLineLeftInCanvas -
          (canvasWidth + (junctionLineWidth + BUFFER) * scaleRatio) >=
        0
      ) {
        skipJunctionLineRender = true;
      }
    }

    /**
     * whether we can skip render custom line
     */
    if (!skipCustomLineRender && customLineStyle) {
      const {
        top: customLineTopInCanvas,
        left: customLineLeftInCanvas,
      } = this.getTopLeftInCanvas('customLine', result);
      const {
        width: customLineWidth,
        height: customLineHeight,
      } = customLineStyle;

      if (
        customLineTopInCanvas + (customLineHeight + BUFFER) * scaleRatio <=
        0
      ) {
        skipCustomLineRender = true;
      }

      if (
        customLineLeftInCanvas + (customLineWidth + BUFFER) * scaleRatio <=
        0
      ) {
        skipCustomLineRender = true;
      }

      if (
        customLineTopInCanvas -
          (canvasHeight + (customLineHeight + BUFFER) * scaleRatio) >=
        0
      ) {
        skipCustomLineRender = true;
      }

      if (
        customLineLeftInCanvas -
          (canvasWidth + (customLineWidth + BUFFER) * scaleRatio) >=
        0
      ) {
        skipCustomLineRender = true;
      }
    }

    if (skipNodeRender) {
      delete result.nodeStyle;
    }

    if (skipJunctionLineRender) {
      delete result.junctionLineStyle;
    }

    if (skipCustomLineRender) {
      delete result.customLineStyle;
      delete result.headPointPosition;
      delete result.tailPointPosition;
      delete result.startPointCoordinate;
      delete result.stopPointCoordinate;
    }

    return result;
  }

  animationRender(node: INode, percent: number): IStyleCollection {
    const { nodeMap, options } = this;
    const {
      finalDirectionAttr,
      levelDirectionAttr,
      headLineLevelAttr,
    } = options;

    const styleCollection = {} as IStyleCollection;

    if (!node.animation) {
      return styleCollection;
    }

    const begin = this.virtualRender(node.animation.begin);
    const end = this.virtualRender(node.animation.end);

    if (begin.nodeStyle && end.nodeStyle) {
      styleCollection.nodeStyle = genAnimatingStyle(
        begin.nodeStyle,
        end.nodeStyle,
        finalDirectionAttr,
        levelDirectionAttr,
        percent,
      );
    }

    if (begin.headLineStyle && end.headLineStyle) {
      styleCollection.headLineStyle = genAnimatingStyle(
        begin.headLineStyle,
        end.headLineStyle,
        finalDirectionAttr,
        headLineLevelAttr,
        percent,
      );
    }

    if (begin.tailLineStyle && end.tailLineStyle) {
      styleCollection.tailLineStyle = genAnimatingStyle(
        begin.tailLineStyle,
        end.tailLineStyle,
        finalDirectionAttr,
        levelDirectionAttr,
        percent,
      );
    }

    if (begin.junctionLineStyle && end.junctionLineStyle) {
      styleCollection.junctionLineStyle = genAnimatingStyle(
        begin.junctionLineStyle,
        end.junctionLineStyle,
        finalDirectionAttr,
        levelDirectionAttr,
        percent,
      );
    }

    if (begin.customLineStyle && end.customLineStyle) {
      styleCollection.customLineStyle = genAnimatingStyle(
        begin.customLineStyle,
        end.customLineStyle,
        finalDirectionAttr,
        levelDirectionAttr,
        percent,
      );

      const {
        startPointCoordinate,
        stopPointCoordinate,
      } = genStartAndStopPointCoordinate(
        genAnimatingPointPosition(
          nodeMap[node.parentKey!].animation!.begin.tailPointPosition!,
          nodeMap[node.parentKey!].animation!.end.tailPointPosition!,
          finalDirectionAttr,
          levelDirectionAttr,
          percent,
        ),
        genAnimatingPointPosition(
          begin.headPointPosition!,
          end.headPointPosition!,
          finalDirectionAttr,
          levelDirectionAttr,
          percent,
        ),
        styleCollection.customLineStyle,
        options,
      );

      styleCollection.startPointCoordinate = startPointCoordinate;
      styleCollection.stopPointCoordinate = stopPointCoordinate;
    }

    return styleCollection;
  }

  getTopLeftInCanvas(
    whose: 'anchor' | 'node' | 'junctionLine' | 'customLine',
    styleCollection: IStyleCollection,
    targetNodeTopInCanvas: number = 0,
    targetNodeLeftInCanvas: number = 0,
  ): { top: number; left: number } {
    const { anchorStyle, scaleRatio, options } = this;
    const {
      nodeStyle = { top: 0, bottom: 0, left: 0, right: 0 },
      junctionLineStyle = {
        width: 0,
        height: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      customLineStyle = {
        width: 0,
        height: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    } = styleCollection;
    const { nodeWidth, nodeHeight } = options;

    if (whose === 'anchor') {
      let anchorTop = 0;
      if (typeof nodeStyle.top === 'number') {
        anchorTop = targetNodeTopInCanvas - nodeStyle.top * scaleRatio;
      } else {
        anchorTop =
          targetNodeTopInCanvas +
          (nodeHeight + (nodeStyle.bottom || 0)) * scaleRatio;
      }

      let anchorLeft = 0;
      if (typeof nodeStyle.left === 'number') {
        anchorLeft = targetNodeLeftInCanvas - nodeStyle.left * scaleRatio;
      } else {
        anchorLeft =
          targetNodeLeftInCanvas +
          (nodeWidth + (nodeStyle.right || 0)) * scaleRatio;
      }

      return {
        top: anchorTop,
        left: anchorLeft,
      };
    }

    if (whose === 'node') {
      let nodeTopInCanvas = 0;
      if (typeof nodeStyle.top === 'number') {
        nodeTopInCanvas = anchorStyle.top + nodeStyle.top * scaleRatio;
      } else {
        nodeTopInCanvas =
          anchorStyle.top - (nodeHeight + (nodeStyle.bottom || 0)) * scaleRatio;
      }

      let nodeLeftInCanvas = 0;
      if (typeof nodeStyle.left === 'number') {
        nodeLeftInCanvas = anchorStyle.left + nodeStyle.left * scaleRatio;
      } else {
        nodeLeftInCanvas =
          anchorStyle.left - (nodeWidth + (nodeStyle.right || 0)) * scaleRatio;
      }

      return {
        top: nodeTopInCanvas,
        left: nodeLeftInCanvas,
      };
    }

    if (whose === 'junctionLine') {
      const {
        width: junctionLineWidth,
        height: junctionLineHeight,
      } = junctionLineStyle;
      let junctionLineTopInCanvas = 0;
      if (typeof junctionLineStyle.top === 'number') {
        junctionLineTopInCanvas =
          anchorStyle.top + junctionLineStyle.top * scaleRatio;
      } else {
        junctionLineTopInCanvas =
          anchorStyle.top -
          (junctionLineHeight + (junctionLineStyle.bottom || 0)) * scaleRatio;
      }

      let junctionLineLeftInCanvas = 0;
      if (typeof junctionLineStyle.left === 'number') {
        junctionLineLeftInCanvas =
          anchorStyle.left + junctionLineStyle.left * scaleRatio;
      } else {
        junctionLineLeftInCanvas =
          anchorStyle.left -
          (junctionLineWidth + (junctionLineStyle.right || 0)) * scaleRatio;
      }

      return {
        top: junctionLineTopInCanvas,
        left: junctionLineLeftInCanvas,
      };
    }

    if (whose === 'customLine') {
      const {
        width: customLineWidth,
        height: customLineHeight,
      } = customLineStyle;
      let customLineTopInCanvas = 0;
      if (typeof customLineStyle.top === 'number') {
        customLineTopInCanvas =
          anchorStyle.top + customLineStyle.top * scaleRatio;
      } else {
        customLineTopInCanvas =
          anchorStyle.top -
          (customLineHeight + (customLineStyle.bottom || 0)) * scaleRatio;
      }

      let customLineLeftInCanvas = 0;
      if (typeof customLineStyle.left === 'number') {
        customLineLeftInCanvas =
          anchorStyle.left + customLineStyle.left * scaleRatio;
      } else {
        customLineLeftInCanvas =
          anchorStyle.left -
          (customLineWidth + (customLineStyle.right || 0)) * scaleRatio;
      }

      return {
        top: customLineTopInCanvas,
        left: customLineLeftInCanvas,
      };
    }

    return { top: 0, left: 0 };
  }
}
