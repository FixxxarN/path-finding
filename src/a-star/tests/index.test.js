const { AStar } = require('../index');

describe('A*', () => {
  it('should find closest path from startNode to endNode', () => {
    const startNode = {
      y: 0,
      x: 0,
    }

    const endNode = {
      y: 0,
      x: 4,
    }

    const aStar = new AStar();
    const result = aStar.findPath('o##oo\noo#oo\nooooo', startNode, endNode);
    expect(result.visualizedPath).toEqual('x##xx\nxx#xo\noxxxo');
  });
});