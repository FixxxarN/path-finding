const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

const floorButton = document.getElementById('floor-button');
const wallButton = document.getElementById('wall-button');
const startNodeButton = document.getElementById('start-node-button');
const endNodeButton = document.getElementById('end-node-button');
const drawModeText = document.getElementById('draw-mode-text');

const findPathButton = document.getElementById('find-path-button');

const amountOfNodes = 11;
const nodeSize = canvas.height / amountOfNodes;

let startNode = undefined;
let endNode = undefined;

let drawMode = 'startNode';

let rows = [];

let world = {};
let openNodes = {};
let closedNodes = {};
let currentNode = undefined;
let path = [];

const initializeRowsAndColumns = () => {
  for (let i = 0; i < amountOfNodes; i++) {
    const columns = [];
    for (let j = 0; j < amountOfNodes; j++) {
      columns.push({ y: i, x: j });
    }
    rows.push(columns);
  }
}

const initializeWorld = () => {
  rows.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      world[`${rowIndex},${columnIndex}`] = {
        y: rowIndex,
        x: columnIndex,
        parentCoordinates: undefined,
        gCost: 0,
        hCost: 0,
        fCost: 0,
        type: column.type === 'wall' ? 'wall' : 'floor',
      }
    })
  })
}

const calculateNodeValues = (node, parentNode, startNode, endNode) => {
  node.gCost = parentNode.gCost + 1;
  node.hCost = Math.abs(node.x - endNode.x) + Math.abs(node.y - endNode.y)
  node.fCost = node.gCost + node.hCost;

  if (!node.parentCoordinates) {
    const parentCoordinates = parentNode && `${parentNode.y},${parentNode.x}`;
    node.parentCoordinates = parentCoordinates;
  }

  if (!openNodes[`${node.y},${node.x}`]) {
    openNodes[`${node.y},${node.x}`] = node;
  }
  else {
    if (openNodes[`${node.y},${node.x}`].fCost > node.fCost) {
      openNodes[`${node.y},${node.x}`] = node;
    }
  }
}

checkNeighbourNodes = (node, startNode, endNode) => {
  if (world[`${node.y - 1},${node.x}`] && world[`${node.y - 1},${node.x}`].type === 'floor' && !closedNodes[`${node.y - 1},${node.x}`]) {
    calculateNodeValues(world[`${node.y - 1},${node.x}`], node, startNode, endNode);
  }
  if (world[`${node.y},${node.x + 1}`] && world[`${node.y},${node.x + 1}`].type === 'floor' && !closedNodes[`${node.y},${node.x + 1}`]) {
    calculateNodeValues(world[`${node.y},${node.x + 1}`], node, startNode, endNode);
  }
  if (world[`${node.y + 1},${node.x}`] && world[`${node.y + 1},${node.x}`].type === 'floor' && !closedNodes[`${node.y + 1},${node.x}`]) {
    calculateNodeValues(world[`${node.y + 1},${node.x}`], node, startNode, endNode);
  }
  if (world[`${node.y},${node.x - 1}`] && world[`${node.y},${node.x - 1}`].type === 'floor' && !closedNodes[`${node.y},${node.x - 1}`]) {
    calculateNodeValues(world[`${node.y},${node.x - 1}`], node, startNode, endNode);
  }

  closedNodes[`${node.y},${node.x}`] = node;
}

const visualizePath = (node) => {
  path.push(node);
  if (!node?.parentCoordinates) {
    path.slice(1, path.length - 1).reverse().forEach((node) => {
      rows[node.y][node.x].type = 'path';
    })
    drawWorld();
    return;
  }
  visualizePath(world[node.parentCoordinates])
}

const findPath = () => {
  if (!startNode && !endNode) return;

  openNodes[`${startNode.y},${startNode.x}`] = world[`${startNode.y},${startNode.x}`];

  while (Object.values(openNodes).length > 0) {
    const lowestFCostNodes = Object.values(openNodes).sort((a, b) => a.fCost - b.fCost);
    if (lowestFCostNodes.length > 1 && lowestFCostNodes.filter(x => x.fCost === lowestFCostNodes[0].fCost).length > 1) {
      currentNode = lowestFCostNodes.sort((a, b) => a.hCost - b.hCost).shift();
    }
    else {
      currentNode = lowestFCostNodes.shift();
    }

    delete openNodes[`${currentNode.y},${currentNode.x}`]

    if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
      visualizePath(currentNode);
      break;
    }

    checkNeighbourNodes(currentNode, startNode, endNode);
  }
}

const drawWorld = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < amountOfNodes; i++) {
    for (let j = 0; j < amountOfNodes; j++) {
      switch (rows[i][j].type) {
        case 'path': {
          ctx.fillStyle = 'blue';
          ctx.fillRect(j * nodeSize, i * nodeSize, nodeSize, nodeSize);
          break;
        }
        case 'wall': {
          ctx.fillStyle = 'black';
          ctx.fillRect(j * nodeSize, i * nodeSize, nodeSize, nodeSize);
          break;
        }
        case 'startNode': {
          ctx.fillStyle = 'red';
          ctx.fillRect(j * nodeSize, i * nodeSize, nodeSize, nodeSize);
          break;
        }
        case 'endNode': {
          ctx.fillStyle = 'green';
          ctx.fillRect(j * nodeSize, i * nodeSize, nodeSize, nodeSize);
          break;
        }
        default: {
          ctx.fillStyle = 'lightgrey';
          ctx.fillRect(j * nodeSize, i * nodeSize, nodeSize, nodeSize);
          break;
        }
      }
    }
  }
}

const drawNode = (e) => {
  if (drawMode === 'startNode') {
    if (startNode) {
      rows[startNode.y][startNode.x].type = undefined;
    }
    startNode = rows[Math.floor(e.offsetY / nodeSize)][Math.floor(e.offsetX / nodeSize)];
  }
  if (drawMode === 'endNode') {
    if (endNode) {
      rows[endNode.y][endNode.x].type = undefined;
    }
    endNode = rows[Math.floor(e.offsetY / nodeSize)][Math.floor(e.offsetX / nodeSize)];
  }
  rows[Math.floor(e.offsetY / nodeSize)][Math.floor(e.offsetX / nodeSize)].type = drawMode;
  drawWorld();
}

canvas.addEventListener('click', (e) => drawNode(e))
canvas.onselectstart = () => false;

floorButton.addEventListener('click', (e) => {
  drawMode = undefined;
  drawModeText.innerHTML = 'Draw mode: floor';
});

wallButton.addEventListener('click', (e) => {
  drawMode = 'wall';
  drawModeText.innerHTML = 'Draw mode: wall';
});

startNodeButton.addEventListener('click', (e) => {
  drawMode = 'startNode';
  drawModeText.innerHTML = 'Draw mode: start node';
});

endNodeButton.addEventListener('click', (e) => {
  drawMode = 'endNode';
  drawModeText.innerHTML = 'Draw mode: end node';
});

findPathButton.addEventListener('click', () => {
  initializeWorld();
  console.log(world);
  findPath();
  world = {};
  openNodes = {};
  closedNodes = {};
  path.slice(1, path.length - 1).forEach((node) => {
    rows[node.y][node.x].type = 'floor';
  })
  path = [];
})

initializeRowsAndColumns();
drawWorld();