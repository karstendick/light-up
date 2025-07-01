import { CellState, Cell, Difficulty, PuzzleConfig } from './types';

// Cell state mapping
export const cellStateToContent = {
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

export const charToCellState: Record<string, CellState> = {
  '.': CellState.Empty,
  '=': CellState.Shaded,
  '0': CellState.Shaded0,
  '1': CellState.Shaded1,
  '2': CellState.Shaded2,
  '3': CellState.Shaded3,
  '4': CellState.Shaded4,
};

// Puzzle data
export const puzzles: Record<Difficulty, PuzzleConfig> = {
  beginner: {
    rows: 5,
    cols: 5,
    puzzle: `
..1..
.....
1.=.1
.....
..1..
`,
  },
  intermediate: {
    rows: 7,
    cols: 7,
    puzzle: `
....10.
1......
0.=.=..
...=...
..0.3.=
......=
.=....1
`,
  },
  expert: {
    rows: 9,
    cols: 9,
    puzzle: `
...2.1...
.=.....=.
....=....
1.=...=.1
.........
2.=...=.0
....=....
.=.....=.
...0.3...
`,
  },
};

// Grid utility functions
export function itorc(i: number, cols: number): [number, number] {
  return [Math.floor(i / cols), i % cols];
}

export function rctoi(r: number, c: number, cols: number): number {
  return r * cols + c;
}

export function parsePuzzle(puzzle: string, rows: number, cols: number): Cell[] {
  const lines = puzzle.trim().split('\n');
  const cells = [];
  for (let y = 0; y < rows; y++) {
    const line = lines[y];
    for (let x = 0; x < cols; x++) {
      const char = line[x];
      const state = charToCellState[char];
      cells.push({ id: x + y * cols, state });
    }
  }
  return cells;
}

// Game logic functions
const transparentStates = [CellState.Empty, CellState.Xed, CellState.Lit, CellState.LitXed];

export function shineLight(cells: Cell[], lightbulbCell: Cell, rows: number, cols: number): Cell[] {
  const [r, c] = itorc(lightbulbCell.id, cols);
  const litCells = [];
  // go up
  for (let i = r - 1; i >= 0; i--) {
    const cell = cells[rctoi(i, c, cols)];
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell);
    } else {
      break;
    }
  }
  // go down
  for (let i = r + 1; i < rows; i++) {
    const cell = cells[rctoi(i, c, cols)];
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell);
    } else {
      break;
    }
  }
  // go left
  for (let i = c - 1; i >= 0; i--) {
    const cell = cells[rctoi(r, i, cols)];
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell);
    } else {
      break;
    }
  }
  // go right
  for (let i = c + 1; i < cols; i++) {
    const cell = cells[rctoi(r, i, cols)];
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell);
    } else {
      break;
    }
  }
  return litCells;
}

export function getAdjacentCells(cells: Cell[], cell: Cell, rows: number, cols: number): Cell[] {
  const [r, c] = itorc(cell.id, cols);
  const adjacentCells = [];
  // go up
  if (r > 0) {
    adjacentCells.push(cells[rctoi(r - 1, c, cols)]);
  }
  // go down
  if (r < rows - 1) {
    adjacentCells.push(cells[rctoi(r + 1, c, cols)]);
  }
  // go left
  if (c > 0) {
    adjacentCells.push(cells[rctoi(r, c - 1, cols)]);
  }
  // go right
  if (c < cols - 1) {
    adjacentCells.push(cells[rctoi(r, c + 1, cols)]);
  }
  return adjacentCells;
}

// Returns the difference between the number of adjacent lightbulbs and the number of required adjacent lightbulbs
// 0 means the correct number of lightbulbs are adjacent
// >0 means there are too many lightbulbs adjacent, which is an error
// <0 means there are too few lightbulbs adjacent, so continue playing
export function getNumAdjacentLightbulbsDiff(
  cells: Cell[],
  cell: Cell,
  rows: number,
  cols: number
): number {
  const adjacentCells = getAdjacentCells(cells, cell, rows, cols);
  const numAdjacentLightbulbs = adjacentCells.filter(
    (cell) => cell.state === CellState.Lightbulb
  ).length;
  // A little hacky, but this'll work so long as we keep the shaded number states in order
  const numRequiredAdjacentLightbulbs = cell.state - CellState.Shaded0;
  return numAdjacentLightbulbs - numRequiredAdjacentLightbulbs;
}

export function cellIsError(cells: Cell[], cell: Cell, rows: number, cols: number): boolean {
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
  const numAdjacentLightbulbsDiff = getNumAdjacentLightbulbsDiff(cells, cell, rows, cols);
  return numAdjacentLightbulbsDiff > 0;
}

export function checkIsGameWon(cells: Cell[], rows: number, cols: number): boolean {
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
    getNumAdjacentLightbulbsDiff(cells, cell, rows, cols)
  );
  if (numAdjacentLightbulbsDiffs.some((diff) => diff !== 0)) {
    return false;
  }

  return true;
}
