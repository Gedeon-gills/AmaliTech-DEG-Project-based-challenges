import React, { useState, useEffect } from 'react';
import flowData from '../../data/flow_data.json';

export default function ChatPreview() {
  const [history, setHistory] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);

  useEffect(() => {
    // Find start node
    const startNode = flowData.nodes.find(n => n.type === 'start');
    if (startNode) {
      setCurrentNode(startNode);
      setHistory([{ type: 'bot', text: startNode.text }]);
    }
  }, []);

  const handleOptionClick = (option) => {
    // Add user response to history
    setHistory(prev => [...prev, { type: 'user', text: option.label }]);
    
    // Find next node
    const nextNode = flowData.nodes.find(n => n.id === option.nextId);
    if (nextNode) {
      setCurrentNode(nextNode);
      // Simulate typing delay
      setTimeout(() => {
        setHistory(prev => [...prev, { type: 'bot', text: nextNode.text }]);
      }, 500);
    } else {
      setCurrentNode(null);
    }
  };

  const resetFlow = () => {
    const startNode = flowData.nodes.find(n => n.type === 'start');
    setCurrentNode(startNode);
    setHistory([{ type: 'bot', text: startNode.text }]);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 items-center overflow-y-auto">
      <div className="w-full max-w-2xl bg-white min-h-full shadow-sm border-x border-slate-200 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              SF
            </div>
            <div>
              <h2 className="font-h2 text-body-lg">SupportFlow Bot</h2>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
              </p>
            </div>
          </div>
          <button onClick={resetFlow} className="text-slate-400 hover:text-primary text-sm font-medium">
            Reset Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.type === 'user' 
                  ? 'bg-primary text-white rounded-tr-sm' 
                  : 'bg-surface-container-low text-on-surface rounded-tl-sm border border-slate-100'
              }`}>
                <p className="text-body-md">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Current Options */}
        {currentNode && currentNode.options && currentNode.options.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100">
            <p className="text-xs text-slate-500 font-label-caps mb-3 text-center">Select an option</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {currentNode.options.map((opt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleOptionClick(opt)}
                  className="px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors font-medium text-sm"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {(!currentNode || !currentNode.options || currentNode.options.length === 0) && (
          <div className="p-6 bg-white border-t border-slate-100 text-center flex flex-col items-center gap-3">
            <p className="text-sm text-slate-500 font-medium">Conversation ended.</p>
            <button
              onClick={resetFlow}
              className="px-6 py-2.5 bg-primary text-white rounded-full font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
            >
              Restart Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
