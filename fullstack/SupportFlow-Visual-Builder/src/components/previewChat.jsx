import { useFlowStore } from '../store/flowStore';
import ExecutionPath from './executionPath';

export default function PreviewChat() {
  const { nodes, currentPreviewId, previewPath, goToNextNode, restartPreview } = useFlowStore();

  const currentNode = nodes.find(n => n.id === currentPreviewId);
  if (!currentNode) return <div>Loading...</div>;

  const isEnd = currentNode.type === 'end';

  return (
    <div className="flex h-full bg-[#E0E7FF] p-8 gap-8 overflow-hidden">
      {/* Chat Window */}
      <div className="flex-1 max-w-[440px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl">🤖</div>
          <div>
            <div className="font-semibold text-lg">Support Assistant</div>
            <div className="text-emerald-600 text-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> LIVE PREVIEW
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto bg-[#F8FAFC]">
          <div className="flex gap-4">
            <div className="max-w-[75%] bg-white rounded-3xl rounded-tl-none px-5 py-4 shadow text-on-surface">
              {currentNode.text}
            </div>
          </div>

          {!isEnd && currentNode.options && (
            <div className="pl-12 flex flex-wrap gap-3">
              {currentNode.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => goToNextNode(opt.nextId)}
                  className="border-2 border-primary text-primary hover:bg-primary/5 font-medium px-6 py-3 rounded-3xl text-sm transition"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {isEnd && (
            <div className="pl-12">
              <button onClick={restartPreview} className="bg-primary text-white px-8 py-3 rounded-3xl font-semibold">
                Restart Conversation
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="bg-surface-container rounded-full px-5 py-3 text-slate-400 flex items-center">
            Type a message...
            <div className="ml-auto bg-primary w-9 h-9 rounded-full flex items-center justify-center text-white text-xl">➤</div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 flex flex-col gap-6">
        <ExecutionPath />
        <div className="bg-white rounded-3xl p-6 shadow">
          <h3 className="font-semibold mb-4">Context Variables</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-surface-container-low px-4 py-3 rounded-2xl flex justify-between">
              <span>user_id</span> <span className="font-mono">9421-XB</span>
            </div>
            <div className="bg-surface-container-low px-4 py-3 rounded-2xl flex justify-between">
              <span>last_interaction</span> <span className="font-mono">10:01:42</span>
            </div>
            <div className="bg-surface-container-low px-4 py-3 rounded-2xl flex justify-between">
              <span>intent</span> <span className="text-primary">"tech_support"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}