import { Cell, CellState, PuzzleConfig } from './types';
import { itorc, rctoi, shineLight, cellIsError } from './gameUtils';

export interface GeneratorOptions {
  rows: number;
  cols: number;
  blackCellDensity: number; // 0.0 to 1.0
  numberedCellRatio: number; // 0.0 to 1.0 - ratio of black cells that should be numbered
  symmetry: 'none' | 'rotational' | 'horizontal' | 'vertical';
}

export function generatePuzzle(options: GeneratorOptions): PuzzleConfig | null {
  const { rows, cols } = options;

  // Step 1: Create empty board
  const board = createEmptyBoard(rows, cols);

  // Step 2: Place black cells with symmetry
  placeBlackCells(board, options);

  // Step 3: Solve to find valid lightbulb positions
  const solution = solvePuzzle(board, rows, cols);
  if (!solution) {
    return null; // Unsolvable configuration
  }

  // Step 4: Add numbered constraints based on solution
  addNumberedConstraints(board, solution, options);

  // Step 5: Verify puzzle has unique solution
  if (!hasUniqueSolution(board, rows, cols)) {
    return null;
  }

  // Step 6: Convert to puzzle string format
  const puzzleString = boardToPuzzleString(board, rows, cols);

  return {
    puzzle: puzzleString,
    rows,
    cols,
  };
}

function createEmptyBoard(rows: number, cols: number): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < rows * cols; i++) {
    cells.push({ id: i, state: CellState.Empty });
  }
  return cells;
}

function placeBlackCells(board: Cell[], options: GeneratorOptions): void {
  const { rows, cols, blackCellDensity, symmetry } = options;
  const totalCells = rows * cols;
  const targetBlackCells = Math.floor(totalCells * blackCellDensity);

  let placedCells = 0;
  const usedPositions = new Set<number>();

  while (placedCells < targetBlackCells) {
    const pos = Math.floor(Math.random() * totalCells);

    if (usedPositions.has(pos)) continue;

    // Place black cell at position
    board[pos].state = CellState.Shaded;
    usedPositions.add(pos);
    placedCells++;

    // Handle symmetry
    if (symmetry !== 'none') {
      const symmetricPos = getSymmetricPosition(pos, rows, cols, symmetry);
      if (symmetricPos !== pos && !usedPositions.has(symmetricPos)) {
        board[symmetricPos].state = CellState.Shaded;
        usedPositions.add(symmetricPos);
        placedCells++;
      }
    }
  }
}

function getSymmetricPosition(pos: number, rows: number, cols: number, symmetry: string): number {
  const [row, col] = itorc(pos, cols);

  switch (symmetry) {
    case 'rotational':
      // 180-degree rotation
      return rctoi(rows - 1 - row, cols - 1 - col, cols);
    case 'horizontal':
      // Mirror across horizontal axis
      return rctoi(row, cols - 1 - col, cols);
    case 'vertical':
      // Mirror across vertical axis
      return rctoi(rows - 1 - row, col, cols);
    default:
      return pos;
  }
}

function solvePuzzle(board: Cell[], rows: number, cols: number): Cell[] | null {
  const solution = board.map((cell) => ({ ...cell }));

  // Implement backtracking solver
  if (solveRecursive(solution, 0, rows, cols)) {
    return solution;
  }

  return null;
}

function solveRecursive(board: Cell[], index: number, rows: number, cols: number): boolean {
  // Find next empty cell
  while (index < board.length && board[index].state !== CellState.Empty) {
    index++;
  }

  if (index >= board.length) {
    // Check if puzzle is solved
    return isValidSolution(board, rows, cols);
  }

  // Try placing lightbulb
  board[index].state = CellState.Lightbulb;
  const litCells = shineLight(board, board[index], rows, cols);

  if (isValidPlacement(board, index, rows, cols) && solveRecursive(board, index + 1, rows, cols)) {
    return true;
  }

  // Backtrack - remove lightbulb and unlight cells
  board[index].state = CellState.Empty;
  litCells.forEach((cell) => {
    if (board[cell.id].state === CellState.Lit) {
      board[cell.id].state = CellState.Empty;
    }
  });

  // Try leaving cell empty
  if (solveRecursive(board, index + 1, rows, cols)) {
    return true;
  }

  return false;
}

function isValidPlacement(
  board: Cell[],
  lightbulbPos: number,
  rows: number,
  cols: number
): boolean {
  const [row, col] = itorc(lightbulbPos, cols);

  // Check if lightbulb lights up another lightbulb
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < rows && c >= 0 && c < cols) {
      const pos = rctoi(r, c, cols);
      const state = board[pos].state;

      if (
        state === CellState.Shaded ||
        (state >= CellState.Shaded0 && state <= CellState.Shaded4)
      ) {
        break;
      }

      if (state === CellState.Lightbulb) {
        return false; // Lightbulb would light up another lightbulb
      }

      r += dr;
      c += dc;
    }
  }

  // Check numbered cell constraints aren't violated
  for (let i = 0; i < board.length; i++) {
    if (cellIsError(board, board[i], rows, cols)) {
      return false;
    }
  }

  return true;
}

function isValidSolution(board: Cell[], rows: number, cols: number): boolean {
  // All cells must be lit or black
  for (const cell of board) {
    if (cell.state === CellState.Empty) {
      return false;
    }
  }

  // Check all numbered constraints are satisfied
  for (let i = 0; i < board.length; i++) {
    const state = board[i].state;
    if (state >= CellState.Shaded0 && state <= CellState.Shaded4) {
      const requiredBulbs = state - CellState.Shaded0;
      const adjacentBulbs = countAdjacentLightbulbs(board, i, rows, cols);
      if (adjacentBulbs !== requiredBulbs) {
        return false;
      }
    }
  }

  return true;
}

function countAdjacentLightbulbs(board: Cell[], pos: number, rows: number, cols: number): number {
  const [row, col] = itorc(pos, cols);
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  let count = 0;
  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;

    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      const adjacentPos = rctoi(r, c, cols);
      if (board[adjacentPos].state === CellState.Lightbulb) {
        count++;
      }
    }
  }

  return count;
}

function addNumberedConstraints(board: Cell[], solution: Cell[], options: GeneratorOptions): void {
  const { numberedCellRatio, rows, cols } = options;

  // Find all black cells
  const blackCells: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i].state === CellState.Shaded) {
      blackCells.push(i);
    }
  }

  // Randomly select which black cells to number
  const numToAdd = Math.floor(blackCells.length * numberedCellRatio);
  const shuffled = [...blackCells].sort(() => Math.random() - 0.5);

  for (let i = 0; i < numToAdd && i < shuffled.length; i++) {
    const pos = shuffled[i];
    const adjacentBulbs = countAdjacentLightbulbs(solution, pos, rows, cols);

    // Set the numbered constraint
    board[pos].state = CellState.Shaded0 + adjacentBulbs;
  }
}

function hasUniqueSolution(board: Cell[], rows: number, cols: number): boolean {
  // Count number of solutions (stop at 2)
  const solutionCount = countSolutions(
    board.map((cell) => ({ ...cell })),
    0,
    0,
    2,
    rows,
    cols
  );
  return solutionCount === 1;
}

function countSolutions(
  board: Cell[],
  index: number,
  count: number,
  maxCount: number,
  rows: number,
  cols: number
): number {
  if (count >= maxCount) return count;

  // Find next empty cell
  while (index < board.length && board[index].state !== CellState.Empty) {
    index++;
  }

  if (index >= board.length) {
    return isValidSolution(board, rows, cols) ? count + 1 : count;
  }

  // Try placing lightbulb
  board[index].state = CellState.Lightbulb;
  const litCells = shineLight(board, board[index], rows, cols);

  if (isValidPlacement(board, index, rows, cols)) {
    count = countSolutions(board, index + 1, count, maxCount, rows, cols);
  }

  // Backtrack
  board[index].state = CellState.Empty;
  litCells.forEach((cell) => {
    if (board[cell.id].state === CellState.Lit) {
      board[cell.id].state = CellState.Empty;
    }
  });

  // Try leaving empty
  count = countSolutions(board, index + 1, count, maxCount, rows, cols);

  return count;
}

function boardToPuzzleString(board: Cell[], _rows: number, cols: number): string {
  let result = '';

  for (let i = 0; i < board.length; i++) {
    const state = board[i].state;

    if (state === CellState.Empty) {
      result += '.';
    } else if (state === CellState.Shaded) {
      result += '=';
    } else if (state >= CellState.Shaded0 && state <= CellState.Shaded4) {
      result += String(state - CellState.Shaded0);
    }

    if ((i + 1) % cols === 0 && i < board.length - 1) {
      result += '\n';
    }
  }

  return result;
}
