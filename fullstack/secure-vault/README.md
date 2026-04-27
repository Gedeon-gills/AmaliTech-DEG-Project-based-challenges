# SecureVault Dashboard

A high-performance, enterprise-grade file explorer UI built for SecureVault Inc. — a cloud storage platform serving law firms and financial institutions. The interface delivers a recursive, keyboard-accessible tree explorer with a contextual properties panel, smart search, filters, audit logging, and drag-and-drop uploads, all wrapped in a cyber-secure dark-mode design system.

---

## Live Demo

**[https://secure-vault-dashboard.vercel.app](https://secure-vault-dashboard.vercel.app)**

---

## Design File

**[Figma — SecureVault Design System & UI](https://www.figma.com/your-link-here)**

The design file includes a dedicated **Design System** page defining:

| Token | Value |
|---|---|
| Background | `#0A0F1C` |
| Surface | `#121A2B` |
| Cyan Accent | `#00D4FF` |
| Purple Highlight | `#7C3AED` |
| Body Font | Inter |
| Mono Font | JetBrains Mono |
| Spacing Base | 4px grid |

Component states covered: Default, Hover, Selected, Focused, Disabled.

---

## Setup

**Prerequisites:** Node.js 18+ and npm

```bash
git clone https://github.com/<your-username>/AmaliTech-DEG-Project-based-challenges.git
cd fullstack/secure-vault
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Production build
npm run build
npm run preview
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Language | JavaScript (JSX) |

No Bootstrap, Material UI, Chakra UI, or Ant Design. Every component is built from scratch.

---

## Recursive Strategy

Every node in the tree is either a **folder** (`id`, `name`, `type: "folder"`, `children[]`) or a **file** (`id`, `name`, `type: "file"`, `size`). The `children` array can contain folders and files at any depth.

`TreeNode.jsx` is the core recursive component:

```jsx
function TreeNode({ node, depth }) {
  return (
    <div>
      <div style={{ paddingLeft: depth * 12 }}>
        {/* icon + name */}
      </div>
      {isFolder && isOpen && node.children?.map(child => (
        <TreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}
```

The `depth` prop drives indentation — 2 levels or 20 levels render identically with no artificial limit.

**Keyboard navigation** — `TreePanel.jsx` builds a flattened list of all visible nodes (respecting collapsed folders) and walks it on arrow key events:

```
↑ / ↓   move focus to previous / next visible node
→       expand focused folder
←       collapse focused folder
Enter   select file or toggle folder
```

**Search with auto-expand** — `hasMatchingDescendant()` recursively checks every node. Folders containing matches are forced open so results deep in the tree surface automatically.

---

## Wildcard Feature — Starred Files

Law firm associates and bank analysts return daily to the same handful of high-priority documents — active case summaries, covenant trackers, compliance checklists. Without a shortcut, every session requires re-navigating a deep folder tree.

**What it does:**
- Star any file from the Properties Panel or the file list
- The sidebar shows a live count badge of starred files
- Clicking Starred opens a filtered view of all starred files across the entire vault

**Business value:** Reduces average file access from ~12 clicks (navigating a deep tree) to 2 clicks (sidebar → starred item), directly improving billable-hour efficiency for legal and financial users.

---

## Additional Features

| Feature | Description |
|---|---|
| Audit Log | Every open, upload, delete, download, and star action logged with timestamp and user |
| Version History | Simulated version history modal per file with restore capability |
| File Preview | Modal preview panel per file type (PDF, image, spreadsheet, text) |
| Drag-and-Drop Upload | Drop files onto any folder pane to upload |
| Bulk Select | Ctrl+click to multi-select; bulk delete and bulk download |
| Context Menu | Right-click any file for a contextual action menu |
| Metadata Expansion | Expand any file row in list view to see full metadata inline |
| Grid / List View | Toggle between grid and list layout |
| Type / Date / Tag Filters | Filter the file list by extension, modified date, or tag |
| Tag Management | Add and remove tags per file from the Properties Panel |
| Recent Files | Last 5 opened files shown at the top of the file list |
| Settings Panel | Keyboard shortcut reference and view mode toggle |
| Toast Notifications | Non-blocking feedback for every user action |

---

## Project Structure

```
src/
├── components/
│   ├── Tree/
│   │   ├── TreeNode.jsx        # Recursive tree node — core algorithm
│   │   └── TreePanel.jsx       # Keyboard nav, sidebar shortcuts
│   ├── fileList/
│   │   ├── fileList.jsx        # List/grid view, filters, context menu, bulk ops
│   │   └── RecentFiles.jsx     # Recently opened files strip
│   ├── PropertiesPanel/
│   │   └── PropertiesPanel.jsx # File metadata, tags, security status
│   ├── Toolbar/
│   │   └── Toolbar.jsx         # Search, upload, view toggle, settings
│   ├── AuditLog.jsx
│   ├── FilePreview.jsx
│   ├── VersionHistory.jsx
│   ├── Toast.jsx
│   └── settingsPanel.jsx
├── pages/
│   └── Dashboard.jsx           # Root page — all application state lives here
└── App.jsx
public/
└── data.json                   # Spec dataset from the challenge brief
```

---

## Data

`public/data.json` is the exact dataset provided in the challenge brief. The app fetches it at runtime via `fetch('/data.json')`, simulating a real backend API response. The JSON structure is unmodified.

---

## License

MIT
