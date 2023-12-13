import { useImmer } from "use-immer";
import { Draft } from "immer";
import "./styles.css";

const nrows = 7;
const ncols = 7;

function itorc(i: number) {
  return [Math.floor(i / ncols), i % ncols];
}

function rctoi(r: number, c: number) {
  return r * ncols + c;
}

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
  LitXed,
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
  [CellState.LitXed]: "❎",
}

type Cell = {
  id: number
  state: CellState;
}

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

const transparentStates = [ CellState.Empty, CellState.Xed, CellState.Lit, CellState.LitXed ]
function shineLight(cells: Cell[], cell: Cell) {
  const [r, c] = itorc(cell.id)
  const litCells = []
  // go up
  for (let i = r - 1; i >= 0; i--) {
    const cell = cells[rctoi(i, c)]
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell)
    } else {
      break
    }
  }
  // go down
  for (let i = r + 1; i < nrows; i++) {
    const cell = cells[rctoi(i, c)]
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell)
    } else {
      break
    }
  }
  // go left
  for (let i = c - 1; i >= 0; i--) {
    const cell = cells[rctoi(r, i)]
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell)
    } else {
      break
    }
  }
  // go right
  for (let i = c + 1; i < ncols; i++) {
    const cell = cells[rctoi(r, i)]
    if (transparentStates.includes(cell.state)) {
      litCells.push(cell)
    } else {
      break
    }
  }
  return litCells
}

export default function GameBoard() {
  const [cells, setCells] = useImmer(parsePuzzle(puzzle1))

  const handleClick = (clickedCell: Cell) => {
    console.log(`You clicked on ${clickedCell.id}`)
    setCells((draftCells: Draft<Cell[]>) => {
      let newState = clickedCell.state
      switch (clickedCell.state) {
        case CellState.Shaded:
        case CellState.Shaded0:
        case CellState.Shaded1:
        case CellState.Shaded2:
        case CellState.Shaded3:
        case CellState.Shaded4:
          return
        case CellState.Lit:
          newState = CellState.LitXed
          break
        case CellState.Empty:
          newState = CellState.Lightbulb
          break
        case CellState.Lightbulb:
            newState = CellState.Xed
            break
        case CellState.Xed:
        case CellState.LitXed:
          newState = CellState.Empty
          break
      }
      draftCells[clickedCell.id].state = newState

      // Unlight all previously lit cells, since we may have just removed a lightbulb
      const prevLitCells = draftCells.filter(cell => cell.state === CellState.Lit)
      prevLitCells.forEach(cell => draftCells[cell.id].state = CellState.Empty)
      const prevLitXedCells = draftCells.filter(cell => cell.state === CellState.LitXed)
      prevLitXedCells.forEach(cell => draftCells[cell.id].state = CellState.Xed)
      // Light all cells that are now lit by lightbulbs
      const lightbulbCells = draftCells.filter(cell => cell.state === CellState.Lightbulb)
      const litCells = lightbulbCells.flatMap(cell => shineLight(cells, cell))
      litCells.forEach((cell) => {
        if ([CellState.Xed, CellState.LitXed].includes(cell.state)) {
          draftCells[cell.id].state = CellState.LitXed
        } else {
          draftCells[cell.id].state = CellState.Lit
        }
      })
    })

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
