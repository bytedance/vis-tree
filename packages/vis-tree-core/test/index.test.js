import VisTree, { LAYOUT_STRATEGY } from '../src';

const dataSource = {
  key: 'O',
  children: [
    {
      key: 'E',
      children: [
        {
          key: 'A',
        },
        {
          key: 'D',
          children: [
            {
              key: 'B',
            },
            {
              key: 'C',
            },
          ],
        },
      ],
    },
    {
      key: 'F',
    },
    {
      key: 'N',
      children: [
        {
          key: 'G',
        },
        {
          key: 'M',
          children: [
            {
              key: 'H',
            },
            {
              key: 'I',
            },
            {
              key: 'J',
            },
            {
              key: 'K',
            },
            {
              key: 'L',
            },
          ],
        },
      ],
    },
  ],
};

// getNodeList() return all visible nodes
// getNodeList(true) return all visible nodes that involved in the animation process
describe('===getNodeList() test===', () => {
  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const treeInstance = new VisTree(); // 默认展开 dataSource，即默认展示第一、第二层级节点

    test(layoutKey, () => {
      treeInstance.initialize(dataSource);
      treeInstance.toggleNodeExpanded(dataSource.key);
      expect(treeInstance.getNodeList().length).toBe(1);
      expect(treeInstance.getNodeList(true).length).toBe(
        1 + dataSource.children.length,
      );
    });
  });
});

// Whether there is overlap in position between nodes
describe('===genPosition() - tree layout test===', () => {
  const nodeWidth = 50;
  const nodeHeight = 25;

  const checkPositionOverlap = (nodeList, finalNodeSize) => {
    const levelList = [];
    let hasOverlap = false;

    try {
      nodeList.forEach((node) => {
        const { level, final } = node;

        let negativeRange;
        let positiveRange;

        if (final + finalNodeSize < 0) {
          negativeRange = [final, final + finalNodeSize];
        } else if (final < 0 && final + finalNodeSize >= 0) {
          negativeRange = [final, 0];
          positiveRange = [0, final + finalNodeSize];
        } else {
          positiveRange = [0, final + finalNodeSize];
        }

        if (levelList[level]) {
          Object.keys(levelList[level]).forEach((alreadyKey) => {
            const already = levelList[level][alreadyKey];
            if (negativeRange && already.negativeRange) {
              if (
                negativeRange[0] < alreadyKey.negativeRange[1] &&
                negativeRange[1] > alreadyKey.negativeRange[0]
              ) {
                throw new Error('overlap happen');
              }
            }
            if (positiveRange && already.positiveRange) {
              if (
                positiveRange[0] < alreadyKey.positiveRange[1] &&
                positiveRange[1] > alreadyKey.positiveRange[0]
              ) {
                throw new Error('overlap happen');
              }
            }
          });

          levelList[level][node.key] = {
            positiveRange,
            negativeRange,
          };
        } else {
          levelList[level] = {
            [node.key]: {
              positiveRange,
              negativeRange,
            },
          };
        }
      });
    } catch (err) {
      hasOverlap = true;
    }

    return hasOverlap;
  };

  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const treeInstance = new VisTree({
      options: {
        defaultExpandAll: true,
        layoutStrategy: LAYOUT_STRATEGY[layoutKey],
        nodeWidth,
        nodeHeight,
      },
    });

    test(layoutKey, () => {
      treeInstance.initialize(dataSource);
      const visibleNodeList = treeInstance.getNodeList();
      expect(
        checkPositionOverlap(visibleNodeList, treeInstance.finalNodeSize),
      ).toBe(true);
    });
  });
});

// All visible nodes can be rendered normally, that is, they all have the "styleCollection" property
describe('===genPosition() - normal render test===', () => {
  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const treeInstance = new VisTree({
      options: {
        defaultExpandAll: true,
      },
    });

    treeInstance.initialize(dataSource);
    const visibleNodeList = treeInstance.getNodeList();

    test(layoutKey, () => {
      expect(visibleNodeList.every((node) => node.styleCollection)).toBe(true);
    });
  });
});

// The nodes involved in the animation process can be rendered normally, that is, they all have the "animation" property
describe('===genPosition() - animation render test===', () => {
  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const treeInstance = new VisTree({
      options: {
        defaultExpandAll: true,
      },
    });

    test(layoutKey, () => {
      treeInstance.initialize(dataSource);
      const visibleNodeList = treeInstance.getNodeList(true);

      expect(visibleNodeList.every((node) => node.animation)).toBe(true);
    });
  });
});

// During zooming, the distance between the root node and the center of the canvas is scaled proportionally
describe('===optimizeScale() test===', () => {
  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const treeInstance = new VisTree();
    treeInstance.treeCanvasEle = {
      offsetHeight: 100,
      offsetWidth: 100,
    };

    treeInstance.anchorStyle = {
      top: 20,
      left: 60,
    };

    treeInstance.optimizeScale(0.5);
    test(layoutKey, () => {
      expect(
        (treeInstance.treeCanvasEle.offsetHeight / 2 -
          treeInstance.anchorStyle.top) /
          treeInstance.scaleRatio,
      ).toBe(treeInstance.treeCanvasEle.offsetHeight / 2 - 20);
      expect(
        (treeInstance.treeCanvasEle.offsetWidth / 2 -
          treeInstance.anchorStyle.left) /
          treeInstance.scaleRatio,
      ).toBe(treeInstance.treeCanvasEle.offsetWidth / 2 - 60);
    });
  });
});

// getExpandedKeys() return the node with "expanded === true" among the visible nodes
// getExpandedKeys(true) return the node with "expanded === true" among all nodes
describe('===getExpandedKeys() test===', () => {
  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const defaultExpandedNodes = dataSource.children[0].children;

    const treeInstance = new VisTree({
      options: {
        defaultExpandedKeys: defaultExpandedNodes.map((item) => item.key),
      },
    });
    treeInstance.initialize(dataSource);

    test(layoutKey, () => {
      expect(treeInstance.getExpandedKeys().length).toBe(0);
      expect(treeInstance.getExpandedKeys(true).length).toBe(
        defaultExpandedNodes.filter((item) => item.children).length,
      );
    });
  });
});

// Since the third level, all nodes are hidden
// All visible nodes should have "preStyleCollection", "styleCollection" and "animation" properties at the same time
// All nodes that are collapsed should not have "styleCollection" properties, but also have "preStyleCollection" and "animation" properties
describe('===fold test===', () => {
  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const treeInstance = new VisTree({
      options: {
        defaultExpandAll: true,
      },
    });

    test(layoutKey, () => {
      treeInstance.initialize(dataSource);
      treeInstance.updateNodesExpanded(
        dataSource.children.reduce(
          (pre, cur) => ({ ...pre, [cur.key]: false }),
          {},
        ),
      );
      const visibleNodeList = treeInstance.getNodeList();
      const animationNodeList = treeInstance.getNodeList(true);

      expect(visibleNodeList.length).toBe(1 + dataSource.children.length);
      expect(
        animationNodeList.every((node) => {
          if (visibleNodeList.find((item) => item.key === node.key)) {
            return (
              node.preStyleCollection && node.styleCollection && node.animation
            );
          }
          return (
            node.preStyleCollection && !node.styleCollection && node.animation
          );
        }),
      ).toBe(true);
    });
  });
});

// Since the third level, all nodes have just appeared
// All visible nodes should have "preStyleCollection", "styleCollection" and "animation" properties at the same time
// All nodes that have just appeared should not have "preStyleCollection" properties, but also have "styleCollection" and "animation" properties
describe('===expand test===', () => {
  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const treeInstance = new VisTree();

    test(layoutKey, () => {
      treeInstance.initialize(dataSource);
      const preVisibleNodeList = treeInstance.getNodeList();

      treeInstance.updateNodesExpanded(
        dataSource.children.reduce(
          (pre, cur) => ({ ...pre, [cur.key]: true }),
          {},
        ),
      );
      const visibleNodeList = treeInstance.getNodeList();
      const animationNodeList = treeInstance.getNodeList(true);

      expect(visibleNodeList.length).toBe(animationNodeList.length);
      expect(
        visibleNodeList.every((node) => {
          if (preVisibleNodeList.find((item) => item.key === node.key)) {
            return (
              node.preStyleCollection && node.styleCollection && node.animation
            );
          }
          return (
            !node.preStyleCollection && node.styleCollection && node.animation
          );
        }),
      ).toBe(true);
    });
  });
});

// Under any zoom ratio, move the node to the specified position on the canvas (absolute position)
describe('===scrollIntoView()&getTopLeftInCanvas() test===', () => {
  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const treeInstance = new VisTree({
      options: {
        defaultExpandAll: true,
      },
    });

    test(layoutKey, () => {
      treeInstance.initialize(dataSource);
      treeInstance.treeCanvasEle = {
        offsetHeight: 100,
        offsetWidth: 100,
      };
      treeInstance.scaleRatio = Math.random();

      const targetNodeKey = dataSource.children[0].children[0].key;

      treeInstance.scrollIntoView({
        key: targetNodeKey,
        top: 30,
        left: '25% + 10',
      });

      expect(
        Math.round(
          treeInstance.getTopLeftInCanvas(
            'node',
            treeInstance.nodeMap[targetNodeKey].styleCollection,
          ).top,
        ),
      ).toBe(30);
      expect(
        Math.round(
          treeInstance.getTopLeftInCanvas(
            'node',
            treeInstance.nodeMap[targetNodeKey].styleCollection,
          ).left,
        ),
      ).toBe(100 * 0.25 + 10);
    });
  });
});

// When rendering for the first time, the root node is in the upper left corner of the canvas, so some nodes use virtual rendering
// After moving the root node to the middle of the canvas, all nodes can be actually rendered
describe('===virtualRender() test===', () => {
  Object.keys(LAYOUT_STRATEGY).forEach((layoutKey) => {
    const treeInstance = new VisTree({
      options: {
        defaultExpandAll: true,
      },
    });

    test(layoutKey, () => {
      treeInstance.initialize(dataSource);
      treeInstance.treeCanvasEle = {
        offsetHeight: 10000,
        offsetWidth: 10000,
      };
      const visibleNodeList = treeInstance.getNodeList();

      expect(
        visibleNodeList.some(
          (node) => !treeInstance.virtualRender(node.styleCollection).nodeStyle,
        ),
      ).toBe(true);

      treeInstance.scrollIntoView({ key: dataSource.key });
      expect(
        visibleNodeList.every(
          (node) => treeInstance.virtualRender(node.styleCollection).nodeStyle,
        ),
      ).toBe(true);
    });
  });
});
