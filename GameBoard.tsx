import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import { Draft } from 'immer';
import { Text, StyleSheet, View } from 'react-native';
import './styles.css';

// TODO: Handled different sized puzzles
const nrows = 7;
const ncols = 7;

function itorc(i: number): [number, number] {
  return [Math.floor(i / ncols), i % ncols];
}

function rctoi(r: number, c: number): number {
  return r * ncols + c;
}

enum CellState {
  Empty, // 0
  Shaded, // 1
  Shaded0, // 2
  Shaded1, // 3
  Shaded2, // 4
  Shaded3, // 5
  Shaded4, // 6
  Xed, // 7
  Lightbulb, // 8
  Lit, // 9
  LitXed, // 10
}

const cellStateToContent = {
  [CellState.Empty]: '⬜️',
  [CellState.Shaded]: '⬛',
  [CellState.Shaded0]: '0️⃣',
  [CellState.Shaded1]: '1️⃣',
  [CellState.Shaded2]: '2️⃣',
  [CellState.Shaded3]: '3️⃣',
  [CellState.Shaded4]: '4️⃣',
  [CellState.Xed]: '❌',
  [CellState.Lightbulb]: '💡',
  [CellState.Lit]: '🟨',
  [CellState.LitXed]: '❎',
};

const charToCellState: Record<string, CellState> = {
  '.': CellState.Empty,
  '=': CellState.Shaded,
  '0': CellState.Shaded0,
  '1': CellState.Shaded1,
  '2': CellState.Shaded2,
  '3': CellState.Shaded3,
  '4': CellState.Shaded4,
};

type Cell = {
  id: number;
  state: CellState;
  isError?: boolean;
};

type PlacementMode = 'lightbulb' | 'x';

const puzzle1 = `
....10.
1......
0.=.=..
...=...
..0.3.=
......=
.0=....`;

function parsePuzzle(puzzle: string): Cell[] {
  const lines = puzzle.trim().split('\n');
  const cells = [];
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      const state = charToCellState[char];
      cells.push({ id: x + y * line.length, state });
    }
  }
  return cells;
}

const transparentStates = [CellState.Empty, CellState.Xed, CellState.Lit, CellState.LitXed];
function shineLight(cells: Cell[], lightbulbCell: Cell): Cell[] {
  const [r, c] = itorc(lightbulbCell.id);
  const litCells = [];
  // go up
  for (let i = r - 1; i >= 0; i--) {
    const cell = cells[rctoi(i, c)];
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell);
    } else {
      break;
    }
  }
  // go down
  for (let i = r + 1; i < nrows; i++) {
    const cell = cells[rctoi(i, c)];
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell);
    } else {
      break;
    }
  }
  // go left
  for (let i = c - 1; i >= 0; i--) {
    const cell = cells[rctoi(r, i)];
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell);
    } else {
      break;
    }
  }
  // go right
  for (let i = c + 1; i < ncols; i++) {
    const cell = cells[rctoi(r, i)];
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell);
    } else {
      break;
    }
  }
  return litCells;
}

function getAdjacentCells(cells: Cell[], cell: Cell): Cell[] {
  const [r, c] = itorc(cell.id);
  const adjacentCells = [];
  // go up
  if (r > 0) {
    adjacentCells.push(cells[rctoi(r - 1, c)]);
  }
  // go down
  if (r < nrows - 1) {
    adjacentCells.push(cells[rctoi(r + 1, c)]);
  }
  // go left
  if (c > 0) {
    adjacentCells.push(cells[rctoi(r, c - 1)]);
  }
  // go right
  if (c < ncols - 1) {
    adjacentCells.push(cells[rctoi(r, c + 1)]);
  }
  return adjacentCells;
}

// Returns the difference between the number of adjacent lightbulbs and the number of required adjacent lightbulbs
// 0 means the correct number of lightbulbs are adjacent
// >0 means there are too many lightbulbs adjacent, which is an error
// <0 means there are too few lightbulbs adjacent, so continue playing
function getNumAdjacentLightbulbsDiff(cells: Cell[], cell: Cell): number {
  const adjacentCells = getAdjacentCells(cells, cell);
  const numAdjacentLightbulbs = adjacentCells.filter(
    (cell) => cell.state === CellState.Lightbulb
  ).length;
  // A little hacky, but this'll work so long as we keep the shaded number states in order
  const numRequiredAdjacentLightbulbs = cell.state - CellState.Shaded0;
  return numAdjacentLightbulbs - numRequiredAdjacentLightbulbs;
}

function cellIsError(cells: Cell[], cell: Cell): boolean {
  if (
    ![
      CellState.Shaded0,
      CellState.Shaded1,
      CellState.Shaded2,
      CellState.Shaded3,
      CellState.Shaded4,
    ].includes(cell.state)
  ) {
    return false;
  }
  const numAdjacentLightbulbsDiff = getNumAdjacentLightbulbsDiff(cells, cell);
  return numAdjacentLightbulbsDiff > 0;
}

function checkIsGameWon(cells: Cell[]): boolean {
  // Check that all cells are lit
  const disallowedStates = [CellState.Empty, CellState.Xed];
  const cellsWithDisallowedStates = cells.filter((cell) => disallowedStates.includes(cell.state));
  if (cellsWithDisallowedStates.length > 0) {
    return false;
  }
  // Check that all numbered cells have exactly that many lightbulbs adjacent to it
  const numberedCells = cells.filter((cell) =>
    [
      CellState.Shaded0,
      CellState.Shaded1,
      CellState.Shaded2,
      CellState.Shaded3,
      CellState.Shaded4,
    ].includes(cell.state)
  );
  const numAdjacentLightbulbsDiffs = numberedCells.map((cell) =>
    getNumAdjacentLightbulbsDiff(cells, cell)
  );
  if (numAdjacentLightbulbsDiffs.some((diff) => diff !== 0)) {
    return false;
  }

  return true;
}

export default function GameBoard() {
  const [cells, setCells] = useImmer(parsePuzzle(puzzle1));
  const [isGameWon, setIsGameWon] = useImmer(false);
  const [placementMode, setPlacementMode] = useState<PlacementMode>('lightbulb');

  function cellIsClickable(cell: Cell): boolean {
    if (isGameWon) {
      return false;
    } else if (
      [
        CellState.Shaded,
        CellState.Shaded0,
        CellState.Shaded1,
        CellState.Shaded2,
        CellState.Shaded3,
        CellState.Shaded4,
      ].includes(cell.state)
    ) {
      return false;
    } else {
      return true;
    }
  }

  const handleClick = (clickedCell: Cell) => {
    setCells((draftCells: Draft<Cell[]>) => {
      let newState = clickedCell.state;

      // Handle click based on placement mode
      if (placementMode === 'lightbulb') {
        switch (clickedCell.state) {
          case CellState.Shaded:
          case CellState.Shaded0:
          case CellState.Shaded1:
          case CellState.Shaded2:
          case CellState.Shaded3:
          case CellState.Shaded4:
            return;
          case CellState.Empty:
          case CellState.Lit:
            newState = CellState.Lightbulb;
            break;
          case CellState.Lightbulb:
            newState = CellState.Empty;
            break;
          case CellState.Xed:
          case CellState.LitXed:
            newState = CellState.Lightbulb;
            break;
        }
      } else {
        // placementMode === 'x'
        switch (clickedCell.state) {
          case CellState.Shaded:
          case CellState.Shaded0:
          case CellState.Shaded1:
          case CellState.Shaded2:
          case CellState.Shaded3:
          case CellState.Shaded4:
            return;
          case CellState.Empty:
            newState = CellState.Xed;
            break;
          case CellState.Lit:
            newState = CellState.LitXed;
            break;
          case CellState.Xed:
          case CellState.LitXed:
            newState = CellState.Empty;
            break;
          case CellState.Lightbulb:
            newState = CellState.Xed;
            break;
        }
      }
      draftCells[clickedCell.id].state = newState;

      // Unlight all previously lit cells, since we may have just removed a lightbulb
      const prevLitCells = draftCells.filter((cell) => cell.state === CellState.Lit);
      prevLitCells.forEach((cell) => (draftCells[cell.id].state = CellState.Empty));
      const prevLitXedCells = draftCells.filter((cell) => cell.state === CellState.LitXed);
      prevLitXedCells.forEach((cell) => (draftCells[cell.id].state = CellState.Xed));
      // Light all cells that are now lit by lightbulbs
      const lightbulbCells = draftCells.filter((cell) => cell.state === CellState.Lightbulb);
      const litCells = lightbulbCells.flatMap((cell) => shineLight(draftCells, cell));
      litCells.forEach((cell) => {
        if ([CellState.Xed, CellState.LitXed].includes(cell.state)) {
          draftCells[cell.id].state = CellState.LitXed;
        } else {
          draftCells[cell.id].state = CellState.Lit;
        }
      });

      // Check for errors
      draftCells.forEach((cell) => {
        draftCells[cell.id].isError = cellIsError(draftCells, cell);
      });

      // Check for win condition
      setIsGameWon(checkIsGameWon(draftCells));
    });
  };

  return (
    <React.Fragment>
      <div className="board_grid">
        {cells.map((cell) => (
          <button
            disabled={!cellIsClickable(cell)}
            className={'cell ' + (cell.isError ? 'cell_error' : '')}
            onClick={() => handleClick(cell)}
            key={cell.id}
            aria-label={`Cell at row ${Math.floor(cell.id / ncols) + 1}, column ${(cell.id % ncols) + 1}`}
            type="button"
          >
            {cellStateToContent[cell.state]}
          </button>
        ))}
      </div>
      {isGameWon && <Text style={styles.winMessage}>🎉 You won! 🎉</Text>}

      {/* Mode selector */}
      <View style={styles.modeSelector}>
        <button
          className={`mode-button ${placementMode === 'lightbulb' ? 'active' : ''}`}
          onClick={() => setPlacementMode('lightbulb')}
          type="button"
          aria-label="Place light bulbs"
        >
          💡 Light
        </button>
        <button
          className={`mode-button ${placementMode === 'x' ? 'active' : ''}`}
          onClick={() => setPlacementMode('x')}
          type="button"
          aria-label="Place X marks"
        >
          ❌ Mark
        </button>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  winMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
});
