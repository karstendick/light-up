export enum CellState {
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

export type Cell = {
  id: number;
  state: CellState;
  isError?: boolean;
};

export type PlacementMode = 'lightbulb' | 'x';

export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export type PuzzleConfig = {
  puzzle: string;
  rows: number;
  cols: number;
};
