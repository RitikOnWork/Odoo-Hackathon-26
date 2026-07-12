import { useState } from 'react';
import { Bot } from 'lucide-react';
import AIChatPanel from './AIChatPanel';

const AIButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen((value) => !value)} className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-sky-200">
        <Bot size={18} />
        AI Assistant
      </button>
      <AIChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default AIButton;
