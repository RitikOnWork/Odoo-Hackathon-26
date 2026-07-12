import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { assistantResponses } from '../../data/assistantResponses';

const AIChatPanel = ({ open, onClose }) => {
  const [selectedPrompt, setSelectedPrompt] = useState(assistantResponses[0].prompt);

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-md rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">TransitOps AI Assistant</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Always on for operations help</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400">Close</button>
      </div>

      <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
          <Sparkles size={14} />
          <span className="font-medium">Live transport insight</span>
        </div>
        <p className="mt-2">{assistantResponses.find((item) => item.prompt === selectedPrompt)?.response}</p>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {assistantResponses.slice(0, 4).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedPrompt(item.prompt)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${selectedPrompt === item.prompt ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
          >
            {item.prompt}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-300">User: {selectedPrompt}</p>
        <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">AI: {assistantResponses.find((item) => item.prompt === selectedPrompt)?.response}</p>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
        <input type="text" defaultValue={selectedPrompt} className="w-full bg-transparent text-sm outline-none" readOnly />
        <button type="button" className="rounded-full bg-sky-600 p-2 text-white">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIChatPanel;
