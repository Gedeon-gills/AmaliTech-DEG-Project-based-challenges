# SecureVault Dashboard

A high-performance, enterprise-grade **File Explorer UI** built for SecureVault Inc. — a cloud storage platform serving law firms and financial institutions. The interface provides a recursive, keyboard-accessible tree explorer with a contextual properties panel, search, filters, and audit logging, all wrapped in a cyber-secure dark-mode design system.

---

## Live Demo

> **[https://secure-vault-dashboard.vercel.app](https://secure-vault-dashboard.vercel.app)**
> _(Replace with your actual deployed link before submission)_

---

## Design File

> **[Figma Design – SecureVault Dashboard](https://www.figma.com/your-link-here)**
> _(Replace with your Figma link — set to "Anyone with the link can view")_

The design file includes a **Design System** page defining:
- **Typography Scale** — Inter (body/UI) + JetBrains Mono (data/code)
- **Color Palette** — Dark navy background (`#0A0F1C`), surface (`#121A2B`), cyan accent (`#00D4FF`), purple highlight (`#7C3AED`)
- **Spacing Grid** — 4px base unit
- **Component States** — Default, hover, selected, focused, disabled
- **Brand Guidelines** — Cyber-secure dark mode: precise, fast, encrypted aesthetic

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/<your-username>/AmaliTech-DEG-Project-based-challenges.git
cd fullstack/secure-vault

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v3 (custom component architecture — no component libraries) |
| Routing | React Router v6 |
| Language | JavaScript (JSX) |

> **No Bootstrap, Material UI, Chakra UI, or Ant Design.** All components are built from scratch.

---

## Recursive Strategy

The file tree is a recursive data structure where every node is either:
- A **folder** — has an `id`, `name`, `type: "folder"`, and a `children` array (which can itself contain folders and files at any depth)
- A **file** — has an `id`, `name`, `type: "file"`, `size`, and optional metadata

### How the recursion works

**`TreeNode.jsx`** is the core recursive component:

```jsx
function TreeNode({ node, depth }) {
  // Renders the current node (folder or file)
  // If it's an open folder, maps its children and renders TreeNode for each
  return (
    <div>
      <div style={{ paddingLeft: depth * 12 }}>
        {/* Icon + name */}
      </div>
      {isFolder && isOpen && node.children?.map(child => (
        <TreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}
```

This handles **2 or 20 levels of nesting** identically — no artificial depth limit. The `depth` prop controls indentation via inline `paddingLeft`, creating the visual hierarchy.

### Keyboard navigation

`TreePanel.jsx` maintains a **flattened visible list** of all currently rendered nodes (respecting collapsed folders). Arrow key events walk this flat list:

```
↑ / ↓  → move focusedId to prev/next in visible list
→      → expand the focused folder (if collapsed)
←      → collapse the focused folder (if expanded)
Enter  → select file or toggle folder
```

### Search with auto-expand

When a search term is typed, `hasMatchingDescendant()` recursively checks every node. Folders that contain matching descendants are **forced open** (overriding `expandedIds`), so results deep in the tree surface automatically.

---

## Wildcard Feature — Starred Files

**What it is:** A persistent "Starred Files" quick-access section in the left sidebar.

**Why it matters for the business:** Law firm associates and bank analysts work daily with the same handful of high-priority documents (active case summaries, live covenant trackers, compliance checklists). Without starred files, they must re-navigate the full folder tree on every session — expensive friction on deep 6-level structures.

**What it does:**
- Click the ⭐ icon in the Properties Panel or the file list to star any file
- The sidebar shows a live count badge of starred files
- Clicking "Starred" opens a filtered view of all starred files across the entire vault
- Stars persist in React state for the session

**Business value:** Reduces average file access time from ~12 clicks (navigating a deep tree) to 2 clicks (sidebar → starred item), directly improving billable-hour efficiency for legal and financial users.

---

## Additional Features Implemented

Beyond the required stories, the following were added to demonstrate engineering depth:

| Feature | Description |
|---|---|
| **Audit Log** | Every open, upload, delete, download, and star action is logged with timestamp and user |
| **Version History** | Simulated version history modal per file with restore capability |
| **File Preview** | Modal preview panel per file type |
| **Drag-and-Drop Upload** | Drop files onto any folder pane to upload |
| **Bulk Select** | Ctrl+click to multi-select; bulk delete and bulk download |
| **Context Menu** | Right-click any file for a contextual action menu |
| **Metadata Expansion** | Expand any file row in list view to see full metadata inline |
| **Grid / List View** | Toggle between grid and list layout |
| **Type / Date / Tag Filters** | Filter the file list by extension, modified date, or tag |
| **Tag Management** | Add/remove tags per file from the Properties Panel |
| **Recent Files** | Last 5 opened files shown at the top of the file list |
| **Settings Panel** | Keyboard shortcut reference and view mode toggle |
| **Toast Notifications** | Non-blocking feedback for every user action |

---

## Project Structure

```
src/
├── components/
│   ├── Tree/
│   │   ├── TreeNode.jsx       # Recursive tree node (core algorithm)
│   │   └── TreePanel.jsx      # Panel with keyboard nav + sidebar shortcuts
│   ├── fileList/
│   │   ├── fileList.jsx       # List/grid view with filters, context menu, bulk ops
│   │   └── RecentFiles.jsx    # Recently opened files strip
│   ├── PropertiesPanel/
│   │   └── PropertiesPanel.jsx # File metadata, tags, AI suggestions
│   ├── Toolbar/
│   │   └── Toolbar.jsx        # Search, upload, view toggle, settings
│   ├── AuditLog.jsx
│   ├── FilePreview.jsx
│   ├── VersionHistory.jsx
│   ├── Toast.jsx
│   └── settingsPanel.jsx
├── pages/
│   └── Dashboard.jsx          # Main file explorer (all state lives here)
└── App.jsx
public/
└── data.json                  # Exact spec data from the challenge brief
```

---

## Data

`public/data.json` — the exact dataset provided in the challenge brief. The app fetches this at runtime via `fetch('/data.json')`, simulating a real backend API response.

---

## License

MIT
