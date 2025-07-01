import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import { Draft } from 'immer';
import { Text, StyleSheet } from 'react-native';
import './styles.css';

// Import types
import { Cell, CellState, PlacementMode, Difficulty } from './types';

// Import utilities and data
import {
  puzzles,
  cellStateToContent,
  parsePuzzle,
  shineLight,
  cellIsError,
  checkIsGameWon,
} from './gameUtils';

// Import components
import { DifficultySelector } from './components/DifficultySelector';
import { ModeSelector } from './components/ModeSelector';

export default function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [currentPuzzle, setCurrentPuzzle] = useState(puzzles[difficulty]);
  const [cells, setCells] = useImmer(
    parsePuzzle(currentPuzzle.puzzle, currentPuzzle.rows, currentPuzzle.cols)
  );
  const [isGameWon, setIsGameWon] = useImmer(false);
  const [placementMode, setPlacementMode] = useState<PlacementMode>('lightbulb');

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    const newPuzzle = puzzles[newDifficulty];
    setDifficulty(newDifficulty);
    setCurrentPuzzle(newPuzzle);
    setCells(parsePuzzle(newPuzzle.puzzle, newPuzzle.rows, newPuzzle.cols));
    setIsGameWon(false);
  };

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
      const litCells = lightbulbCells.flatMap((cell) =>
        shineLight(draftCells, cell, currentPuzzle.rows, currentPuzzle.cols)
      );
      litCells.forEach((cell) => {
        if ([CellState.Xed, CellState.LitXed].includes(cell.state)) {
          draftCells[cell.id].state = CellState.LitXed;
        } else {
          draftCells[cell.id].state = CellState.Lit;
        }
      });

      // Check for errors
      draftCells.forEach((cell) => {
        draftCells[cell.id].isError = cellIsError(
          draftCells,
          cell,
          currentPuzzle.rows,
          currentPuzzle.cols
        );
      });

      // Check for win condition
      setIsGameWon(checkIsGameWon(draftCells, currentPuzzle.rows, currentPuzzle.cols));
    });
  };

  return (
    <>
      <DifficultySelector difficulty={difficulty} onDifficultyChange={handleDifficultyChange} />

      <div className="board_grid" data-size={currentPuzzle.rows}>
        {cells.map((cell) => (
          <button
            disabled={!cellIsClickable(cell)}
            className={'cell ' + (cell.isError ? 'cell_error' : '')}
            onClick={() => handleClick(cell)}
            key={cell.id}
            aria-label={`Cell at row ${Math.floor(cell.id / currentPuzzle.cols) + 1}, column ${(cell.id % currentPuzzle.cols) + 1}`}
            type="button"
          >
            {cellStateToContent[cell.state]}
          </button>
        ))}
      </div>

      {isGameWon && <Text style={styles.winMessage}>🎉 You won! 🎉</Text>}

      <ModeSelector placementMode={placementMode} onModeChange={setPlacementMode} />
    </>
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
});
