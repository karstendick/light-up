import { useImmer } from "use-immer";
import { Draft } from "immer";
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

const puzzle1 = `
....10.
1......
0.=.=..
...=...
..0.3.=
......=
.0=....`

function parsePuzzle(puzzle: string) {
  const lines = puzzle.trim().split("\n")
  const cells = []
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y]
    for (let x = 0; x < line.length; x++) {
      const char = line[x]
      if (char === ".") {
        cells.push({ id: x + y * line.length, state: CellState.Empty })
      } else if (char === "=") {
        cells.push({ id: x + y * line.length, state: CellState.Shaded })
      } else if (char === "0") {
        cells.push({ id: x + y * line.length, state: CellState.Shaded0 })
      } else if (char === "1") {
        cells.push({ id: x + y * line.length, state: CellState.Shaded1 })
      } else if (char === "2") {
        cells.push({ id: x + y * line.length, state: CellState.Shaded2 })
      } else if (char === "3") {
        cells.push({ id: x + y * line.length, state: CellState.Shaded3 })
      } else if (char === "4") {
        cells.push({ id: x + y * line.length, state: CellState.Shaded4 })
      } else if (char === "X") {
        cells.push({ id: x + y * line.length, state: CellState.Xed })
      } else if (char === "L") {
        cells.push({ id: x + y * line.length, state: CellState.Lightbulb })
      } else if (char === "l") {
        cells.push({ id: x + y * line.length, state: CellState.Lit })
      }
    }
  }
  return cells
}

export default function GameBoard() {
  const [cells, setCells] = useImmer(parsePuzzle(puzzle1))

  const handleClick = (cell: Cell) => {
    let newState = cell.state
    switch (cell.state) {
      case CellState.Shaded:
      case CellState.Shaded0:
      case CellState.Shaded1:
      case CellState.Shaded2:
      case CellState.Shaded3:
      case CellState.Shaded4:
      case CellState.Lit:
        return
      case CellState.Empty:
        newState = CellState.Lightbulb
        break
      case CellState.Lightbulb:
          newState = CellState.Xed
          break
      case CellState.Xed:
        newState = CellState.Empty
        break
    }
    setCells((draft: Draft<Cell[]>) => {
      draft[cell.id].state = newState
    })
    console.log(`You clicked on ${cell.id}`)
  }

  // console.log(parsePuzzle(puzzle1))

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
