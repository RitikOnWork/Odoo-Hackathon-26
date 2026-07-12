import { useState } from 'react';
import { FiAlertCircle, FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

const PasswordInput = ({ label, id, value, onChange, placeholder, error, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`w-full rounded-2xl border bg-slate-50 py-3 pl-10 pr-12 text-sm text-slate-700 outline-none transition focus:bg-white ${error ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-sky-400'}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
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

export default PasswordInput;
