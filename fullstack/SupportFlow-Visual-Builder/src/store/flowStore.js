import { create } from 'zustand';

const STORAGE_KEY = 'supportflow_positions';

export const useFlowStore = create((set, get) => ({
  nodes: [],
  mode: 'editor', // 'editor' | 'preview'
  selectedId: null,
  currentPreviewId: null,
  previewPath: [],

  loadFlow: async () => {
    const res = await fetch('/flow_data.json');
    const data = await res.json();
    let nodes = data.nodes;

    // Load saved positions
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const posMap = JSON.parse(saved);
      nodes = nodes.map(n => ({
        ...n,
        position: posMap[n.id] || n.position
      }));
    }
    set({ nodes });
  },

  updateNodeText: (id, text) => {
    set(state => ({
      nodes: state.nodes.map(n => n.id === id ? { ...n, text } : n)
    }));
  },

  updateNodePosition: (id, x, y) => {
    set(state => {
      const newNodes = state.nodes.map(n =>
        n.id === id ? { ...n, position: { x, y } } : n
      );
      // Persist to localStorage
      const posMap = {};
      newNodes.forEach(n => { posMap[n.id] = n.position; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posMap));
      return { nodes: newNodes };
    });
  },

  setSelected: (id) => set({ selectedId: id }),
  setMode: (mode) => set({
    mode,
    currentPreviewId: mode === 'preview' ? '1' : null,
    previewPath: mode === 'preview' ? ['1'] : []
  }),

  goToNextNode: (nextId) => {
    set(state => ({
      currentPreviewId: nextId,
      previewPath: [...state.previewPath, nextId]
    }));
  },

  restartPreview: () => set({
    currentPreviewId: '1',
    previewPath: ['1']
  })
}));