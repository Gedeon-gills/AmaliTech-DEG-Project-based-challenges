import { useState, useEffect, useRef } from 'react';
import flowData from '../../data/flow_data.json';
import NodeCard from './NodeCard';
import SVGConnectionEngine from './SVGConnectionEngine';
import SideNav from './SideNav';
import PropertiesPanel from './PropertiesPanel';

export default function EditorCanvas() {
  const [nodes, setNodes] = useState(flowData.nodes);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Handle Dragging Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingNodeId || !canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      // Calculate mouse position relative to the scrollable canvas container
      const mouseX = e.clientX - canvasRect.left + canvasRef.current.scrollLeft;
      const mouseY = e.clientY - canvasRect.top + canvasRef.current.scrollTop;
      
      setNodes(prev => prev.map(n => {
        if (n.id === draggingNodeId) {
          return {
            ...n,
            position: {
              x: mouseX - dragOffset.x,
              y: mouseY - dragOffset.y
            }
          };
        }
        return n;
      }));
    };

    const handleMouseUp = () => {
      setDraggingNodeId(null);
    };

    if (draggingNodeId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNodeId, dragOffset]);

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);
    
    // Calculate where inside the node the user clicked to prevent jumping
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left + canvasRef.current.scrollLeft;
      const mouseY = e.clientY - canvasRect.top + canvasRef.current.scrollTop;
      
      setDragOffset({
        x: mouseX - node.position.x,
        y: mouseY - node.position.y
      });
    }
  };

  const handleUpdateNode = (updatedNode) => {
    setNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n));
  };

  const handleAddNode = () => {
    const newNode = {
      id: Math.random().toString(36).substr(2, 9),
      type: "question",
      text: "New Question",
      position: { x: 500, y: 300 },
      options: []
    };
    setNodes(prev => [...prev, newNode]);
  };

  return (
    <>
      <SideNav onAddNode={handleAddNode} />
      {/* Changed overflow-hidden to overflow-auto to allow scrolling */}
      <main 
        ref={canvasRef}
        className="flex-1 relative overflow-auto bg-background"
        onClick={() => setSelectedNodeId(null)}
      >
        {/* A large inner container to give room to scroll around */}
        <div className="canvas-grid relative" style={{ width: '3000px', height: '3000px' }}>
          <SVGConnectionEngine nodes={nodes} />
          
          {nodes.map(node => (
            <NodeCard 
              key={node.id} 
              node={node} 
              selected={selectedNodeId === node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              onUpdateNode={handleUpdateNode}
            />
          ))}
        </div>


      </main>

      {/* Right Properties Panel */}
      {selectedNode && (
         <PropertiesPanel 
           node={selectedNode} 
           onClose={() => setSelectedNodeId(null)}
           onUpdateNode={handleUpdateNode}
         />
      )}

    </>
  );
}
