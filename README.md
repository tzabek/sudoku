# 🧠 Sudoku Game (React + TypeScript)

A full-featured, modern Sudoku game built with **Vite**, **React**, **TypeScript**, and **Material UI**. Designed with a focus on performance, accessibility, and user experience — including powerful features like auto-solver, notes mode, mistake tracking, undo/redo, and victory stats.

---

## 🚀 Features

### 🎮 Core Gameplay

- ✅ Fully interactive Sudoku board
- ✅ Keyboard & mouse input support
- ✅ Real-time validation and mistake tracking
- ✅ Difficulty levels with pre-filled puzzles
- ✅ Timer and game duration tracking
- ✅ Save/load progress (via `localStorage`)

### 🔁 Game Actions

- 🔁 Undo/Redo system with batched changes
- ♻️ Clear board functionality (with undo support)
- ✨ Restart game or load a new one with ease

### 🧠 Mistakes

- ❌ Mistake Counter: Tracks the number of mistakes made
- 📌 Mistake History: Logs cell, entered value, correct value, and timestamp
- 📊 Stats available in victory modal

### 🧩 Notes Mode (Candidate Mode)

- ✍️ Toggle between value and candidate input
- 📐 Display small 1–9 candidate numbers in cells
- ⛔ Prevent duplicate candidates per cell
- 🧼 Auto-clear notes on value entry

### 🧮 Number Tracker

- ✅ Visual tracker showing usage of 1–9
- 🎯 Icons for completed numbers
- 📊 Progress bars and tooltips
- 👁️ Click to highlight where a number is used on the board

### 🏁 Victory Detection

- 🎉 Detect when board is fully and correctly completed
- 🏆 Victory modal with:
  - ⏱️ Time elapsed
  - ❌ Mistake count
  - 💯 Score based on performance
  - 🔁 Play Again / Suggest next difficulty

### 🧪 Tech Stack

- ⚛️ React + TypeScript
- 🎨 Material UI for sleek and responsive components
- 🧠 Custom hooks and context for game logic
- 📦 Local storage for game persistence
- 📏 CSS Grid for Sudoku layout

---

## 📂 Project Structure

```
src/
├── components/
│   ├── SudokuBoard.tsx
│   ├── Cell.tsx
│   ├── VictoryModal.tsx
│   └── NumberTracker.tsx
├── context/
│   └── GameContext.tsx
├── hooks/
│   ├── useGameTimer.ts
│   ├── useUndoRedo.ts
│   └── useCandidates.ts
├── utils/
│   ├── boardUtils.ts
│   ├── solver.ts
│   └── score.ts
├── types/
│   └── types.ts
└── App.tsx
```

---

## 🧩 Gameplay UX Details

| Feature           | UX Detail                                                      |
| ----------------- | -------------------------------------------------------------- |
| Value Input       | Only accepts digits 1–9, ignores 0                             |
| Notes Mode        | Tap a number to add/remove candidate; shown in 3x3 grid        |
| Mistake Logging   | Only logs user-typed mistakes (not undo/redo)                  |
| Undo/Redo         | Includes batched changes (e.g., clear all, mass notes)         |
| Victory Detection | Uses a solved board for strict comparison and group validation |
| Timer             | Uses `useGameTimer` with pause/resume and preserved start time |
| Score Calculation | Based on time and mistake count with performance scoring logic |

---

## 📈 Scoring Formula

```js
Score = 1000 - (mistakes * 25 + timeInSeconds / 5);
```

- Mistakes are penalized heavily
- Time has a moderate effect
- Minimum score is `0`

---

## ⏱️ Time Format

Time is displayed as:  
`HH:mm:ss` — formatted using the browser’s locale and time zone.

---

## 🛠️ Future Features (Planned)

- ✅ Notes Mode (Done)
- 🔄 Auto remove candidates from peers on correct value input
- 📈 Leaderboard (local / online)
- 🎨 Theme support (day/night mode)
- 🌳 Family tree integration (for ancestry puzzle mode)

---

## 🧑‍💻 Development

### Install & Run

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

---

## 🙏 Credits

- Built with ❤️ using Vite, React, TypeScript, and MUI
