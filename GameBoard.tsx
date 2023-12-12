import { useState } from "react";
import "./styles.css";

// States
// empty/white/unknown
// shaded/black
// shaded: 0, 1, 2, 3, 4
// Xed: red X on white
// lightbulb
// lit up/yellow
// lit up Xed: red X on yellow
enum CellState {
  Empty,
  Shaded,
  Shaded0,
  Shaded1,
  Shaded2,
  Shaded3,
  Shaded4,
  Xed,
  Lightbulb,
  Lit,
  // LitXed,
}

const cellStateToContent = {
  [CellState.Empty]: "⬜️",
  [CellState.Shaded]: "⬛",
  [CellState.Shaded0]: "0️⃣",
  [CellState.Shaded1]: "1️⃣",
  [CellState.Shaded2]: "2️⃣",
  [CellState.Shaded3]: "3️⃣",
  [CellState.Shaded4]: "4️⃣",
  [CellState.Xed]: "❌",
  [CellState.Lightbulb]: "💡",
  [CellState.Lit]: "🟨",
  // [CellState.LitXed]: "X",
}

type Cell = {
  id: number
  state: CellState;
}

const initialCells: Cell[] = [
  { id: 1, state: CellState.Empty },
  { id: 2, state: CellState.Shaded },
  { id: 3, state: CellState.Shaded0 },
  { id: 4, state: CellState.Shaded1 },
  { id: 5, state: CellState.Shaded2 },
  { id: 6, state: CellState.Shaded3 },
  { id: 7, state: CellState.Shaded4 },
  { id: 8, state: CellState.Xed },
  { id: 9, state: CellState.Lightbulb },
  { id: 10, state: CellState.Lit },
  { id: 11, state: CellState.Empty },
  { id: 12, state: CellState.Empty },
  { id: 13, state: CellState.Empty },
  { id: 14, state: CellState.Empty },
  { id: 15, state: CellState.Empty },
  { id: 16, state: CellState.Empty },
]

export default function GameBoard() {
  // const [cells, setCells] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
  const [cells, setCells] = useState(initialCells)

  const handleClick = (cell: Cell) => {
    console.log(`You clicked on ${cell.id}`)
  }

  return (
    <>
      <div className='board_grid'>
        {cells.map((cell, index) => (
          <button
            onClick={() => handleClick(cell)}
            key={cell.id}>{cellStateToContent[cell.state]}</button>
        ))}
      </div>
    </>
  )
}
