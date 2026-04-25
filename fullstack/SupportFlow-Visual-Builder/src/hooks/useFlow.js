import { useCallback } from 'react';
import { useFlowStore } from '../store/flowStore';

export const useFlow = () => {
  const store = useFlowStore();

  const findRootNode = useCallback(() => {
    // The first node with type "start" or the one with no incoming connections
    return store.nodes.find(node => node.type === 'start') || store.nodes[0];
  }, [store.nodes]);

  const getNodeById = useCallback((id) => {
    return store.nodes.find(node => node.id === id);
  }, [store.nodes]);

  const getChildren = useCallback((nodeId) => {
    const node = getNodeById(nodeId);
    if (!node || !node.options) return [];
    
    return node.options.map(opt => ({
      ...opt,
      node: getNodeById(opt.nextId)
    })).filter(item => item.node);
  }, [getNodeById]);

  // Graph traversal helper for preview
  const traverseTo = useCallback((nextId) => {
    store.goToNextNode(nextId);
  }, [store]);

  return {
    findRootNode,
    getNodeById,
    getChildren,
    traverseTo,
    ...store // spread all store actions and state
  };
};