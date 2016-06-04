import * as gameApi from '../src/game';
import chai from 'chai';
import { expect } from 'chai';
import * as R from 'ramda';

describe('game', () => {
  it('can initializeGame', () => {
    const game = gameApi.init();
    expect(game.get('currentPlayerTurn')).to.equal(1);
    expect(game.get('winningPlayer')).to.not.be.ok;
    expect(game.get('remainingTurns')).to.equal(1);
    expect(game.get('isInit')).to.be.ok;
    expect(game.get('size')).to.deep.equal({ maxRowIndex: 0, maxColumnIndex: 0 });
  });

  it('can create game', ()=> {
      const rows = 6;
      const columns = 7;
      const game = gameApi.createNew(6, 7);
      const board = game.get('board');
      const allColumnsInitialized = R.all(column => !column);
      const hasAllColumns = R.all(row => row.length === columns && allColumnsInitialized(row));

      expect(game.get('currentPlayerTurn')).to.equal(1);
      expect(game.get('winningPlayer')).to.not.be.ok;
      expect(board.length).to.equal(rows);
      expect(hasAllColumns(board)).to.equal(true);
    });

  it('can take turn with no winning move', () => {
    const game = gameApi.createNew(6, 7);
    const [row, column, playerId] = [4, 4, 1];
    const state = gameApi.takeTurn(game, row, column, playerId);

    expect(state).to.be.ok;
    expect(state.get('currentPlayerTurn')).to.equal(2);
    expect(state.get('board')[row][column]).to.equal(playerId);
    expect(state.get('winningPlayer')).to.not.be.ok;
  });

  it('can take turn with winning move', () => {
    let game = gameApi.createNew(6, 7);
    game = gameApi.takeTurn(game, 0, 0);
    game = gameApi.takeTurn(game, 0, 1);
    game = gameApi.takeTurn(game, 1, 0);
    game = gameApi.takeTurn(game, 0, 2);
    game = gameApi.takeTurn(game, 2, 0);
    game = gameApi.takeTurn(game, 0, 3);
    game = gameApi.takeTurn(game, 3, 0);

    expect(game).to.be.ok;
    expect(game.get('currentPlayerTurn')).to.equal(2);
    expect(game.get('winningPlayer')).to.equal(1);
  });

  /*
  	TODO:
  	Refactor so that assert doesn't rely on array element order
	or modify data structure of getWinningPositions	*/
  it('can determine winning positions', ()=> {
    const game = gameApi.createNew(6, 7);
    const [row, column] = [2, 3];
    const expectedPositions = {
      vertical: [
       { row: 2, column: 3 },
       { row: 1, column: 3 },
       { row: 3, column: 3 },
       { row: 0, column: 3 },
       { row: 4, column: 3 },
       { row: 5, column: 3 },
      ],
      horizontal: [
       { row: 2, column: 3 },
       { row: 2, column: 2 },
       { row: 2, column: 4 },
       { row: 2, column: 1 },
       { row: 2, column: 5 },
       { row: 2, column: 0 },
       { row: 2, column: 6 },
      ],
      diagonal: [
       { row: 2, column: 3 },
       { row: 1, column: 2 },
       { row: 3, column: 4 },
       { row: 0, column: 1 },
       { row: 4, column: 5 },
       { row: 5, column: 6 },
      ],
    };

    const positions = gameApi.getWinningPositions(game.get('size'), row, column);
    expect(positions).to.deep.equal(expectedPositions);
  });

  it('can determine somewhat realistic vertical win', () => {
    let game = gameApi.createNew(6, 7);
    game = gameApi.takeTurn(game, 0, 0);
    game = gameApi.takeTurn(game, 0, 1);
    game = gameApi.takeTurn(game, 1, 0);
    game = gameApi.takeTurn(game, 0, 2);
    game = gameApi.takeTurn(game, 2, 0);
    game = gameApi.takeTurn(game, 0, 3);
    game = gameApi.takeTurn(game, 3, 0);

    expect(game.get('winningPlayer')).to.equal(1);
  });

  it('can determine somewhat realistic horizontal win', ()=> {
    let game = gameApi.createNew(6, 7);
    game = gameApi.takeTurn(game, 0, 0);
    game = gameApi.takeTurn(game, 1, 0);
    game = gameApi.takeTurn(game, 0, 1);
    game = gameApi.takeTurn(game, 1, 1);
    game = gameApi.takeTurn(game, 0, 2);
    game = gameApi.takeTurn(game, 1, 2);
    game = gameApi.takeTurn(game, 0, 3);

    expect(game.get('winningPlayer')).to.equal(1);
  });

  it('can determine somewhat realistic diagonal win', ()=> {
    let game = gameApi.createNew(6, 7);
    game = gameApi.takeTurn(game, 0, 0);
    game = gameApi.takeTurn(game, 0, 1);
    game = gameApi.takeTurn(game, 1, 1);
    game = gameApi.takeTurn(game, 0, 2);
    game = gameApi.takeTurn(game, 2, 2);
    game = gameApi.takeTurn(game, 0, 3);
    game = gameApi.takeTurn(game, 3, 3);

    expect(game.get('winningPlayer')).to.equal(1);
  });
});
