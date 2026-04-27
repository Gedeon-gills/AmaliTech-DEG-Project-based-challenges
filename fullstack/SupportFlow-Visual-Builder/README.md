# SupportFlow Visual Builder

SupportFlow Visual Builder is a modern, responsive, and robust React application designed to help customer support teams easily build, visualize, and test automated "Help Bots" without needing to fiddle with messy spreadsheets. It features a fully custom Node rendering and Bezier curve connection engine.

## Features

- **Visual Graph**: See your conversation logic as a highly connected flowchart.
- **Real-Time Editor**: Clicking a Node opens an editing properties panel. Edit question text and options on-the-fly and see them instantly update on the canvas.
- **Preview Mode**: Test the bot experience instantly! Toggle the "Preview" mode from the top right to start a chat and traverse the nodes you've configured.
- **Custom Connectors (Constraint Met)**: SVG connection logic using cubic Bezier curves was completely custom built from scratch to calculate anchor positions between parent and child nodes. No external graphing libraries (like react-flow or jsPlumb) were used.
- **Custom UI (Constraint Met)**: The user interface components (Node Cards, Sidebars, Modals) were entirely built using Tailwind CSS v4 to exactly match the specific design tokens. No pre-built component libraries (like MUI or Bootstrap) were utilized.

## Wildcard Feature: Dynamic Workspace (Drag & Scroll)

To make this tool truly indispensable, I implemented an enhanced **Dynamic Workspace**. 
- **Draggable Nodes**: Users can click the drag-handle on any node to reposition it freely across the canvas. The Bezier connectors recalculate and redraw in real-time as the node is moved. 
- **Infinite Scrolling**: The canvas is no longer constrained to a single screen view. Users can pan/scroll across a massive `3000x3000px` workspace to accommodate huge decision trees.

**Why this adds value:** A visual builder is only useful if it can grow with the user's needs. As Support flowcharts expand to handle dozens of edge cases, being able to physically reorganize clusters of nodes and scroll around a larger canvas prevents the UI from becoming cluttered, reducing cognitive load for the non-technical managers using the tool.

## Technical Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Using custom design tokens via PostCSS)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Data Source**: Local `flow_data.json`

## Setup Instructions

1. Ensure you have Node.js installed.
2. Clone this repository and navigate to the root directory.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the local URL (usually `http://localhost:5173`).

## Project Structure

- `/src/components/Editor`: Contains the Editor Canvas, Node Cards, SideNav, PropertiesPanel, and the custom SVGConnectionEngine.
- `/src/components/Preview`: Contains the Chat Preview simulator.
- `/src/data`: Holds the `flow_data.json` local configuration file.
- `tailwind.config.js`: Contains all the extracted design tokens used to style the application.
