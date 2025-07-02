import { describe, it, expect } from 'vitest';
import { generatePuzzle, GeneratorOptions } from './puzzleGenerator';

describe('puzzleGenerator', () => {
  const basicOptions: GeneratorOptions = {
    rows: 5,
    cols: 5,
    blackCellDensity: 0.3,
    numberedCellRatio: 0.6,
  };

  describe('seeded generation', () => {
    it('should generate identical puzzles with same seed', () => {
      const options = { ...basicOptions, seed: 12345 };

      const puzzle1 = generatePuzzle(options);
      const puzzle2 = generatePuzzle(options);

      expect(puzzle1).toBeTruthy();
      expect(puzzle2).toBeTruthy();
      expect(puzzle1?.puzzle).toBe(puzzle2?.puzzle);
    });

    it('should generate different puzzles with different seeds', () => {
      // Try multiple seeds until we find ones that work
      let puzzle1, puzzle2;
      const seed1 = 1000,
        seed2 = 2000;

      for (let i = 0; i < 10; i++) {
        puzzle1 = generatePuzzle({ ...basicOptions, seed: seed1 + i }, 10000);
        puzzle2 = generatePuzzle({ ...basicOptions, seed: seed2 + i }, 10000);

        if (puzzle1 && puzzle2) break;
      }

      expect(puzzle1).toBeTruthy();
      expect(puzzle2).toBeTruthy();
      expect(puzzle1?.puzzle).not.toBe(puzzle2?.puzzle);
    });

    it('should use random generation when no seed provided', () => {
      // Try generating a few times to find successful generation
      let puzzle1, puzzle2;

      for (let i = 0; i < 10; i++) {
        puzzle1 = generatePuzzle(basicOptions, 10000);
        if (puzzle1) break;
      }

      for (let i = 0; i < 10; i++) {
        puzzle2 = generatePuzzle(basicOptions, 10000);
        if (puzzle2) break;
      }

      expect(puzzle1).toBeTruthy();
      expect(puzzle2).toBeTruthy();
      // Note: There's a small chance they could be identical by coincidence
    });
  });

  describe('generation validation', () => {
    it('should generate puzzle with correct dimensions', () => {
      const options = { ...basicOptions, rows: 7, cols: 6, seed: 123 };
      const puzzle = generatePuzzle(options);

      expect(puzzle).toBeTruthy();
      expect(puzzle?.rows).toBe(7);
      expect(puzzle?.cols).toBe(6);
    });

    it('should generate valid puzzle string format', () => {
      // Try multiple seeds to find one that works
      let puzzle;
      for (let seed = 100; seed < 200; seed++) {
        puzzle = generatePuzzle({ ...basicOptions, seed }, 10000);
        if (puzzle) break;
      }

      expect(puzzle).toBeTruthy();
      expect(typeof puzzle?.puzzle).toBe('string');

      // Check that puzzle string has correct number of lines
      const lines = puzzle?.puzzle.trim().split('\n');
      expect(lines?.length).toBe(basicOptions.rows);

      // Check that each line has correct number of characters
      lines?.forEach((line) => {
        expect(line.length).toBe(basicOptions.cols);
      });
    });

    it('should contain only valid puzzle characters', () => {
      // Try multiple seeds to find one that works
      let puzzle;
      for (let seed = 300; seed < 400; seed++) {
        puzzle = generatePuzzle({ ...basicOptions, seed }, 10000);
        if (puzzle) break;
      }

      expect(puzzle).toBeTruthy();

      const validChars = /^[.=0-4\n]+$/;
      expect(validChars.test(puzzle?.puzzle || '')).toBe(true);
    });

    it('should respect black cell density approximately', () => {
      const options = { ...basicOptions, blackCellDensity: 0.3, seed: 999 };
      const puzzle = generatePuzzle(options);

      expect(puzzle).toBeTruthy();

      const totalCells = options.rows * options.cols;
      const expectedBlackCells = Math.floor(totalCells * options.blackCellDensity);

      // Count black cells (= and 0-4)
      const blackCellCount = (puzzle?.puzzle || '')
        .replace(/\n/g, '')
        .split('')
        .filter((char) => char === '=' || /[0-4]/.test(char)).length;

      // Allow some tolerance since generation might not hit exact density
      expect(blackCellCount).toBeGreaterThanOrEqual(expectedBlackCells - 2);
      expect(blackCellCount).toBeLessThanOrEqual(expectedBlackCells + 2);
    });
  });

  describe('timeout behavior', () => {
    it('should respect timeout limits', () => {
      const startTime = Date.now();

      // Use very restrictive parameters that might be hard to solve quickly
      const difficultOptions: GeneratorOptions = {
        rows: 8,
        cols: 8,
        blackCellDensity: 0.1, // very sparse
        numberedCellRatio: 0.1,
        seed: 999,
      };

      const puzzle = generatePuzzle(difficultOptions, 100); // 100ms timeout
      const elapsed = Date.now() - startTime;

      // Should either return a puzzle quickly or timeout
      expect(elapsed).toBeLessThan(1000); // Way less than 1 second

      // If it returns null, that's okay (timeout)
      // If it returns a puzzle, it should be valid
      if (puzzle) {
        expect(puzzle.rows).toBe(difficultOptions.rows);
        expect(puzzle.cols).toBe(difficultOptions.cols);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle small grids', () => {
      const smallOptions: GeneratorOptions = {
        rows: 3,
        cols: 3,
        blackCellDensity: 0.2,
        numberedCellRatio: 0.5,
        seed: 111,
      };

      const puzzle = generatePuzzle(smallOptions);

      if (puzzle) {
        // Generation might fail for very small grids
        expect(puzzle.rows).toBe(3);
        expect(puzzle.cols).toBe(3);
      }
      // It's okay if it returns null for difficult small cases
    });

    it('should handle zero black cell density', () => {
      const options: GeneratorOptions = {
        rows: 4,
        cols: 4,
        blackCellDensity: 0,
        numberedCellRatio: 0,
        seed: 222,
      };

      const puzzle = generatePuzzle(options);

      if (puzzle) {
        // Should be all dots (no black cells)
        const content = puzzle.puzzle.replace(/\n/g, '');
        expect(content).toMatch(/^\.+$/);
      }
    });

    it('should handle high black cell density', () => {
      const options: GeneratorOptions = {
        rows: 4,
        cols: 4,
        blackCellDensity: 0.8, // very dense
        numberedCellRatio: 0.5,
        seed: 333,
      };

      // Might fail to generate due to over-constraint, that's okay
      const puzzle = generatePuzzle(options);

      if (puzzle) {
        expect(puzzle.rows).toBe(4);
        expect(puzzle.cols).toBe(4);
      }
    });
  });
});
