import { useEffect } from 'react';
import Header from './components/header';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/propertiesPanel';
import { useFlowStore } from './store/flowStore';

export default function App() {
  const { loadFlow, mode } = useFlowStore();

  useEffect(() => {
    loadFlow();
  }, [loadFlow]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <Canvas />
        </div>
        
        {mode === 'editor' && <PropertiesPanel />}
      </div>
    </div>
  );
}