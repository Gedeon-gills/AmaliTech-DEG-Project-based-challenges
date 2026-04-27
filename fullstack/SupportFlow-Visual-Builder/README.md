# SupportFlow Visual Builder

Design, visualize, and test automated customer support conversation flows through an interactive canvas — no spreadsheets, no backend required.

---

## 🌐 Live Demo

👉 [https://your-app.vercel.app](https://your-app.vercel.app)

---

## 🛠 Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Framework | React 19 + Vite        |
| Styling   | Tailwind CSS v4        |
| Rendering | SVG (custom engine)    |
| State     | In-memory (no backend) |

---

## ✨ Features

### 🔹 Visual Graph
- Renders conversation logic as an interactive flowchart
- Nodes positioned using absolute coordinates from JSON
- Parent-child relationships connected with smooth SVG curves

### 🔹 Real-Time Editor
- Click any node to edit its content instantly
- Changes reflect immediately on the canvas — no reloads

### 🔹 Preview Mode (Flow Runner)
- Simulates real chatbot interaction starting from the root node
- Traverses the flow dynamically based on user choices
- Includes a restart option at the end of the flow

### 🔹 Custom Connection Engine *(Constraint Met)*
- Built from scratch using SVG cubic Bézier curves
- Connector positions recalculate dynamically as nodes move
- No external libraries — no react-flow, jsPlumb, or similar

### 🔹 Custom UI Components *(Constraint Met)*
- Every component built from scratch: Node Cards, Sidebar, Canvas, Modals
- Styled with Tailwind CSS v4 and custom design tokens
- No Bootstrap, Material UI, or any third-party UI library

### 🌟 Wildcard: Dynamic Workspace
- Freely draggable nodes for organizing complex flows
- Connectors redraw in real time as nodes are repositioned
- Infinite scrollable canvas (3000×3000px) supports large decision trees

---

## 🧠 Graph & Traversal Logic

The conversation flow is modeled as a **directed graph**. Each node contains:

```json
{
  "id": "node_1",
  "question": "How can we help you?",
  "options": [
    { "label": "Billing", "target": "node_2" },
    { "label": "Technical", "target": "node_3" }
  ]
}
```

Nodes are stored in a flat map for O(1) lookup:

```js
{ [id]: node }
```

**Preview Mode traversal:**
1. Start at the root node
2. Display its question and options
3. On option select, resolve the next node via `target` ID
4. Repeat until a leaf node (no options) is reached

---

## 🎨 Design System

👉 [Figma File](https://your-figma-link)

Designed before implementation to ensure visual consistency.

| Token     | Purpose                 |
|-----------|-------------------------|
| Primary   | Actions & focus states  |
| Secondary | Background layers       |
| Accent    | Active / selected state |
| Error     | Validation feedback     |

Philosophy: clean, minimal, high-contrast — built for non-technical users.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
