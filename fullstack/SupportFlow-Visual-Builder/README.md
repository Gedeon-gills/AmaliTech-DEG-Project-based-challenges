# SupportFlow Visual Builder

A modern visual decision tree editor for customer support chatbots. Built to replace messy Excel configurations with an intuitive flowchart interface.

## Features

- **Visual Flowchart** — Nodes positioned exactly from JSON with manual SVG connections
- **Real-time Editing** — Click any node → edit text in the properties panel (updates instantly)
- **Drag & Drop Nodes** — Reorganize the flow visually (positions saved automatically)
- **Live Preview Mode** — Test the entire conversation as a real customer would see it
- **Execution Path** — See the traversal history in preview sidebar
- **Clean Design System** — Matches modern support tool aesthetics (blue primary, clean cards)

## Wildcard Feature: Drag & Drop with Persistence

**Why?** Non-technical managers (the main users) frequently need to reorganize conversation flows. Allowing them to simply drag nodes makes the tool dramatically more usable and turns it from a viewer into a true builder.

Positions are automatically saved to `localStorage` so changes survive page refreshes.

## Tech Stack

- React + Vite
- Tailwind CSS (custom components only)
- Zustand for state management
- Pure DOM + SVG (no graph libraries — fully manual coordinate calculation)

## Getting Started

```bash
npm install
npm run dev