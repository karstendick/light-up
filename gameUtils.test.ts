import { describe, it, expect } from 'vitest';
import {
  shineLight,
  cellIsError,
  checkIsGameWon,
  getAdjacentCells,
  getNumAdjacentLightbulbsDiff,
} from './gameUtils';
import { Cell, CellState } from './types';

describe('gameUtils', () => {
  // Helper to create a cell
  const createCell = (id: number, state: CellState): Cell => ({ id, state });

  describe('shineLight', () => {
    it('should light cells in all four directions', () => {
      // 3x3 grid with lightbulb in center (index 4)
      const cells = [
        createCell(0, CellState.Empty), // row 0
        createCell(1, CellState.Empty),
        createCell(2, CellState.Empty),
        createCell(3, CellState.Empty), // row 1
        createCell(4, CellState.Lightbulb),
        createCell(5, CellState.Empty),
        createCell(6, CellState.Empty), // row 2
        createCell(7, CellState.Empty),
        createCell(8, CellState.Empty),
      ];

      const litCells = shineLight(cells, cells[4], 3, 3);
      const litIds = litCells.map((c) => c.id).sort();

      expect(litIds).toEqual([1, 3, 5, 7]); // up, left, right, down
    });

    it('should stop at black cells', () => {
      // 3x3 grid with lightbulb at (1,1) and black cell at (1,2)
      const cells = [
        createCell(0, CellState.Empty),
        createCell(1, CellState.Empty),
        createCell(2, CellState.Empty),
        createCell(3, CellState.Empty),
        createCell(4, CellState.Lightbulb),
        createCell(5, CellState.Shaded), // black cell blocks light
        createCell(6, CellState.Empty),
        createCell(7, CellState.Empty),
        createCell(8, CellState.Empty),
      ];

      const litCells = shineLight(cells, cells[4], 3, 3);
      const litIds = litCells.map((c) => c.id).sort();

      expect(litIds).toEqual([1, 3, 7]); // right is blocked by black cell
    });

    it('should stop at board boundaries', () => {
      // 3x3 grid with lightbulb in corner (index 0)
      const cells = [
        createCell(0, CellState.Lightbulb),
        createCell(1, CellState.Empty),
        createCell(2, CellState.Empty),
        createCell(3, CellState.Empty),
        createCell(4, CellState.Empty),
        createCell(5, CellState.Empty),
        createCell(6, CellState.Empty),
        createCell(7, CellState.Empty),
        createCell(8, CellState.Empty),
      ];

      const litCells = shineLight(cells, cells[0], 3, 3);
      const litIds = litCells.map((c) => c.id).sort();

      // Light goes right (1,2) and down (3,6)
      expect(litIds).toEqual([1, 2, 3, 6]);
    });
  });

  describe('getAdjacentCells', () => {
    it('should return all adjacent cells for center cell', () => {
      const cells = Array.from({ length: 9 }, (_, i) => createCell(i, CellState.Empty));

      const adjacent = getAdjacentCells(cells, cells[4], 3, 3); // center cell
      const adjacentIds = adjacent.map((c) => c.id).sort();

      expect(adjacentIds).toEqual([1, 3, 5, 7]); // up, left, right, down
    });

    it('should return fewer cells for corner cell', () => {
      const cells = Array.from({ length: 9 }, (_, i) => createCell(i, CellState.Empty));

      const adjacent = getAdjacentCells(cells, cells[0], 3, 3); // top-left corner
      const adjacentIds = adjacent.map((c) => c.id).sort();

      expect(adjacentIds).toEqual([1, 3]); // only right and down
    });

    it('should return fewer cells for edge cell', () => {
      const cells = Array.from({ length: 9 }, (_, i) => createCell(i, CellState.Empty));

      const adjacent = getAdjacentCells(cells, cells[1], 3, 3); // top edge
      const adjacentIds = adjacent.map((c) => c.id).sort();

      expect(adjacentIds).toEqual([0, 2, 4]); // left, right, down
    });
  });

  describe('getNumAdjacentLightbulbsDiff', () => {
    it('should return correct difference for numbered cell', () => {
      const cells = [
        createCell(0, CellState.Lightbulb),
        createCell(1, CellState.Shaded1), // needs 1 lightbulb
        createCell(2, CellState.Empty),
        createCell(3, CellState.Empty),
        createCell(4, CellState.Empty),
        createCell(5, CellState.Empty),
      ];

      const diff = getNumAdjacentLightbulbsDiff(cells, cells[1], 2, 3);
      expect(diff).toBe(0); // has exactly 1 adjacent lightbulb, needs 1
    });

    it('should return positive when too many lightbulbs', () => {
      const cells = [
        createCell(0, CellState.Lightbulb),
        createCell(1, CellState.Shaded1), // needs 1 lightbulb
        createCell(2, CellState.Lightbulb),
        createCell(3, CellState.Empty),
        createCell(4, CellState.Empty),
        createCell(5, CellState.Empty),
      ];

      const diff = getNumAdjacentLightbulbsDiff(cells, cells[1], 2, 3);
      expect(diff).toBe(1); // has 2 lightbulbs, needs 1
    });

    it('should return negative when too few lightbulbs', () => {
      const cells = [
        createCell(0, CellState.Empty),
        createCell(1, CellState.Shaded2), // needs 2 lightbulbs
        createCell(2, CellState.Lightbulb),
        createCell(3, CellState.Empty),
        createCell(4, CellState.Empty),
        createCell(5, CellState.Empty),
      ];

      const diff = getNumAdjacentLightbulbsDiff(cells, cells[1], 2, 3);
      expect(diff).toBe(-1); // has 1 lightbulb, needs 2
    });
  });

  describe('cellIsError', () => {
    it('should return false for non-numbered cells', () => {
      const cells = [createCell(0, CellState.Empty)];
      expect(cellIsError(cells, cells[0], 1, 1)).toBe(false);
    });

    it('should return true when numbered cell has too many adjacent lightbulbs', () => {
      const cells = [
        createCell(0, CellState.Lightbulb),
        createCell(1, CellState.Shaded1), // needs 1, has 2
        createCell(2, CellState.Lightbulb),
      ];

      expect(cellIsError(cells, cells[1], 1, 3)).toBe(true);
    });

    it('should return false when numbered cell has correct count', () => {
      const cells = [
        createCell(0, CellState.Lightbulb),
        createCell(1, CellState.Shaded1), // needs 1, has 1
        createCell(2, CellState.Empty),
      ];

      expect(cellIsError(cells, cells[1], 1, 3)).toBe(false);
    });

    it('should return false when numbered cell has too few lightbulbs', () => {
      const cells = [
        createCell(0, CellState.Empty),
        createCell(1, CellState.Shaded1), // needs 1, has 0
        createCell(2, CellState.Empty),
      ];

      expect(cellIsError(cells, cells[1], 1, 3)).toBe(false);
    });
  });

  describe('checkIsGameWon', () => {
    it('should return false when empty cells exist', () => {
      const cells = [
        createCell(0, CellState.Empty), // not lit
        createCell(1, CellState.Lightbulb),
        createCell(2, CellState.Lit),
      ];

      expect(checkIsGameWon(cells, 1, 3)).toBe(false);
    });

    it('should return false when numbered cell constraint is violated', () => {
      const cells = [
        createCell(0, CellState.Lightbulb),
        createCell(1, CellState.Shaded2), // needs 2 lightbulbs, has 1
        createCell(2, CellState.Lit),
      ];

      expect(checkIsGameWon(cells, 1, 3)).toBe(false);
    });

    it('should return true when all constraints satisfied', () => {
      const cells = [
        createCell(0, CellState.Lightbulb),
        createCell(1, CellState.Shaded1), // needs 1, has 1
        createCell(2, CellState.Lit),
      ];

      expect(checkIsGameWon(cells, 1, 3)).toBe(true);
    });

    it('should allow Xed cells in winning state', () => {
      const cells = [
        createCell(0, CellState.Lightbulb),
        createCell(1, CellState.Shaded0), // needs 0, has 0
        createCell(2, CellState.Xed), // X marks are okay if not needed
      ];

      expect(checkIsGameWon(cells, 1, 3)).toBe(false); // Xed cells prevent winning
    });
  });
});
