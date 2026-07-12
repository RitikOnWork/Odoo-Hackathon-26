import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import AuthCard from '../components/auth/AuthCard';
import AuthTabs from '../components/auth/AuthTabs';
import InputField from '../components/auth/InputField';
import PasswordInput from '../components/auth/PasswordInput';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 900);
  };

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  return (
    <AuthCard
      accentText="Welcome back"
      title="Sign in to TransitOps"
      subtitle="Access your operations dashboard and fleet intelligence."
    >
      <div className="auth-fade-in">
        <AuthTabs active="signin" />

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            placeholder="you@company.com"
            error={errors.email}
            icon={FiMail}
            autoComplete="email"
          />

          <PasswordInput
            label="Password"
            id="password"
            value={formData.password}
            onChange={(event) => handleChange('password', event.target.value)}
            placeholder="Enter your password"
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((value) => !value)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              Remember me
            </label>
            <a href="#" className="font-medium text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading ? <FiArrowRight /> : null}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          New to TransitOps?{' '}
          <button type="button" onClick={() => navigate('/signup')} className="font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
            Create Account
          </button>
        </p>
      </div>
    </AuthCard>
  );
};

export default Login;
