const { AStar } = require('../index');

describe('A*', () => {
  it('should find closest path from startNode to endNode', () => {
    const startNode = {
      y: 0,
      x: 0,
    }

    const endNode = {
      y: 7,
      x: 7,
    }

    const aStar = new AStar();
    const result = aStar.findPath('...W...W\n...WW..W\n........\n..WW.W..\n.W..W.W.\nWW...W..\nW..W....\n..W.W.W.', startNode, endNode);
    expect(result.visualizedPath).toEqual('x##xx\nxx#x.\n.xxx.');
  });
});