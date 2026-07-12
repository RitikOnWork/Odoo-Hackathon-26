import { FiAlertCircle } from 'react-icons/fi';

const InputField = ({ label, id, type = 'text', value, onChange, placeholder, error, icon: Icon, autoComplete }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`w-full rounded-2xl border bg-slate-50 py-3 text-sm text-slate-700 outline-none transition focus:bg-white ${Icon ? 'pl-10 pr-4' : 'px-4'} ${error ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-sky-400'}`}
          placeholder={placeholder}
        />
      </div>
      {error ? (
        <div className="mt-2 flex items-center gap-2 text-sm text-rose-500">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  );
};

export default InputField;
