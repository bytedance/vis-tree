/**
 * Copyright (c) 2021 Bytedance Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState, useRef } from 'react';
import VisTree, { IVisTreeProps, IAnchorStyle } from '@vis-tree/core';

export interface IDragCallbacks {
  startCallback?: () => void;
  movingCallback?: (diffX: number, diffY: number) => void;
  endCallback?: () => void;
}

interface IMoveInfo {
  moving: boolean;
  startPageX: number;
  startPageY: number;
}

type TMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
type TTouchEvent = React.TouchEvent<HTMLDivElement>;

export interface IDragListeners {
  onMouseDown: (e: TMouseEvent) => void;
  onMouseMove: (e: TMouseEvent) => void;
  onMouseUp: () => void;
  onTouchStart: (e: TTouchEvent) => void;
  onTouchMove: (e: TTouchEvent) => void;
  onTouchEnd: () => void;
}

export function useConstructTree(
  constructorProps: IVisTreeProps,
): {
  treeInstance: VisTree;
  anchorStyle: IAnchorStyle;
  rerenderTree: () => void;
} {
  const [treeInstance] = useState<VisTree>(() => new VisTree(constructorProps));

  const [anchorStyle, setAnchorStyle] = useState<IAnchorStyle>(
    treeInstance.anchorStyle,
  );

  const rerenderTree = () => {
    setAnchorStyle({ ...treeInstance.anchorStyle });
  };

  return {
    treeInstance,
    anchorStyle,
    rerenderTree,
  };
}

export function useDragMove({
  startCallback,
  movingCallback,
  endCallback,
}: IDragCallbacks): IDragListeners {
  const moveInfoRef = useRef<IMoveInfo>({
    moving: false,
    startPageX: 0,
    startPageY: 0,
  });

  function startMove(event: TMouseEvent, eventType: 'mouse'): void;
  function startMove(event: TTouchEvent, eventType: 'touch'): void;
  function startMove(event: any, eventType: any) {
    let pageObj;
    let isMultipleFingerTouch;
    if (eventType === 'mouse') {
      pageObj = event as TMouseEvent;
    }
    if (eventType === 'touch') {
      pageObj = (event as TTouchEvent).changedTouches.item(0);
      isMultipleFingerTouch = event.touches.length > 1;
    }

    if (!pageObj || isMultipleFingerTouch) {
      moveInfoRef.current.moving = false;
      return;
    }

    const { pageX, pageY } = pageObj;

    moveInfoRef.current.moving = true;
    moveInfoRef.current.startPageX = pageX;
    moveInfoRef.current.startPageY = pageY;

    if (typeof startCallback === 'function') {
      startCallback();
    }
  }

  function dragMoving(event: TMouseEvent, eventType: 'mouse'): void;
  function dragMoving(event: TTouchEvent, eventType: 'touch'): void;
  function dragMoving(event: any, eventType: any) {
    let pageObj;
    if (eventType === 'mouse') {
      pageObj = event as TMouseEvent;
    }
    if (eventType === 'touch') {
      pageObj = (event as TTouchEvent).changedTouches.item(0);
    }

    if (!pageObj) {
      return;
    }

    const { pageX, pageY } = pageObj;
    const { moving, startPageX, startPageY } = moveInfoRef.current;

    if (moving) {
      const diffX = pageX - startPageX;
      const diffY = pageY - startPageY;

      if (typeof movingCallback === 'function') {
        movingCallback(diffX, diffY);
      }
    }
  }

  function stopMove() {
    moveInfoRef.current.moving = false;

    if (typeof endCallback === 'function') {
      endCallback();
    }
  }

  const eventListeners: IDragListeners = {
    onMouseDown: (event: TMouseEvent) => startMove(event, 'mouse'),
    onMouseMove: (event: TMouseEvent) => dragMoving(event, 'mouse'),
    onMouseUp: stopMove,
    onTouchStart: (event: TTouchEvent) => startMove(event, 'touch'),
    onTouchMove: (event: TTouchEvent) => dragMoving(event, 'touch'),
    onTouchEnd: stopMove,
  };

  return eventListeners;
}
