class AStar {
  constructor() {
    this.world = undefined;
    this.openNodes = {};
    this.closedNodes = {};
    this.currentNode = undefined;
    this.visualizedPath = '';
    this.worldArray = undefined;
    this.path = [];
  }

  initializeWorld(world) {
    const map = {};
    const arr = world.split('\n').map((row) => row.split(''));
    this.worldArray = arr;

    arr.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        map[`${rowIndex},${columnIndex}`] = {
          y: rowIndex,
          x: columnIndex,
          parentCoordinates: undefined,
          gCost: 0,
          hCost: 0,
          fCost: 0,
          symbol: column,
        }
      })
    })

    return map;
  }

  calculateNodeValues(node, parentNode, startNode, endNode) {
    node.gCost = parentNode.gCost + 1;
    node.hCost = Math.abs(node.x - endNode.x) + Math.abs(node.y - endNode.y)
    node.fCost = node.gCost + node.hCost;

    const parentCoordinates = parentNode && `${parentNode.y},${parentNode.x}`;
    node.parentCoordinates = parentCoordinates;

    if (!this.openNodes[`${node.y},${node.x}`]) {
      this.openNodes[`${node.y},${node.x}`] = node;
    }
    else {
      if (this.openNodes[`${node.y},${node.x}`].fCost > node.fCost) {
        this.openNodes[`${node.y},${node.x}`] = node;
      }
    }
  }

  checkNeighbourNodes(node, startNode, endNode) {
    if (this.world[`${node.y - 1},${node.x}`] && this.world[`${node.y - 1},${node.x}`].symbol === '.' && !this.closedNodes[`${node.y - 1},${node.x}`]) {
      this.calculateNodeValues(this.world[`${node.y - 1},${node.x}`], node, startNode, endNode);
    }
    if (this.world[`${node.y},${node.x + 1}`] && this.world[`${node.y},${node.x + 1}`].symbol === '.' && !this.closedNodes[`${node.y},${node.x + 1}`]) {
      this.calculateNodeValues(this.world[`${node.y},${node.x + 1}`], node, startNode, endNode);
    }
    if (this.world[`${node.y + 1},${node.x}`] && this.world[`${node.y + 1},${node.x}`].symbol === '.' && !this.closedNodes[`${node.y + 1},${node.x}`]) {
      this.calculateNodeValues(this.world[`${node.y + 1},${node.x}`], node, startNode, endNode);
    }
    if (this.world[`${node.y},${node.x - 1}`] && this.world[`${node.y},${node.x - 1}`].symbol === '.' && !this.closedNodes[`${node.y},${node.x - 1}`]) {
      this.calculateNodeValues(this.world[`${node.y},${node.x - 1}`], node, startNode, endNode);
    }

    this.closedNodes[`${node.y},${node.x}`] = node;
  }

  visualizePath(node) {
    this.worldArray[node.y][node.x] = 'x'
    this.path.push(node);
    if (!node?.parentCoordinates) {
      this.visualizedPath = this.worldArray.map(e => e.join('')).join('\n');
      return;
    }
    this.visualizePath(this.world[node.parentCoordinates])
  }

  findPath(world, startNode, endNode) {
    this.world = this.initializeWorld(world);
    this.openNodes[`${startNode.y},${startNode.x}`] = this.world[`${startNode.y},${startNode.x}`];

    while (Object.values(this.openNodes).length > 0) {
      const lowestFCostNodes = Object.values(this.openNodes).sort((a, b) => a.fCost - b.fCost);
      if (lowestFCostNodes.length > 1 && lowestFCostNodes.filter(x => x.fCost === lowestFCostNodes[0].fCost).length > 1) {
        this.currentNode = lowestFCostNodes.sort((a, b) => a.hCost - b.hCost).shift();
      }
      else {
        this.currentNode = lowestFCostNodes.shift();
      }

      delete this.openNodes[`${this.currentNode.y},${this.currentNode.x}`]

      if (this.currentNode.x === endNode.x && this.currentNode.y === endNode.y) {
        this.visualizePath(this.currentNode);
        break;
      }

      this.checkNeighbourNodes(this.currentNode, startNode, endNode);
    }

    console.log([...this.path.reverse()]);
    console.log(this.visualizedPath);
    return { visualizedPath: this.visualizedPath }
  }
}

module.exports = {
  AStar
};