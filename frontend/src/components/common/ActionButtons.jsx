import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ActionButtons = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onView} className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" aria-label="View item">
        <FiEye />
      </button>
      <button type="button" onClick={onEdit} className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" aria-label="Edit item">
        <FiEdit2 />
      </button>
      <button type="button" onClick={onDelete} className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" aria-label="Delete item">
        <FiTrash2 />
      </button>
    </div>
  );
};

export default ActionButtons;
