import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiBriefcase, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import AuthCard from '../components/auth/AuthCard';
import AuthTabs from '../components/auth/AuthTabs';
import InputField from '../components/auth/InputField';
import PasswordInput from '../components/auth/PasswordInput';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    role: 'Fleet Manager',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required';
    if (!formData.company.trim()) nextErrors.company = 'Organization name is required';
    if (!formData.password.trim()) nextErrors.password = 'Password is required';
    if (!formData.confirmPassword.trim()) nextErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      setSuccessMessage('');
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Account created successfully. Please sign in.');
      setErrors({});
    }, 900);
  };

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    if (successMessage) setSuccessMessage('');
  };

  return (
    <AuthCard
      accentText="Launch your fleet workspace"
      title="Create your TransitOps account"
      subtitle="Set up your operations profile in a few quick steps."
    >
      <AuthTabs active="signup" />

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <InputField
          label="Full Name"
          id="fullName"
          value={formData.fullName}
          onChange={(event) => handleChange('fullName', event.target.value)}
          placeholder="Jordan Rivera"
          error={errors.fullName}
          icon={FiUser}
          autoComplete="name"
        />

        <div className="grid gap-4 sm:grid-cols-2">
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

          <InputField
            label="Phone Number"
            id="phone"
            value={formData.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            placeholder="+1 555 0123"
            error={errors.phone}
            icon={FiPhone}
            autoComplete="tel"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Organization / Company"
            id="company"
            value={formData.company}
            onChange={(event) => handleChange('company', event.target.value)}
            placeholder="Northstar Transport"
            error={errors.company}
            icon={FiBriefcase}
            autoComplete="organization"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="role">Role</label>
            <select
              id="role"
              value={formData.role}
              onChange={(event) => handleChange('role', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:bg-slate-900"
            >
              <option>Fleet Manager</option>
              <option>Transport Administrator</option>
              <option>Operations Manager</option>
              <option>Driver</option>
            </select>
          </div>
        </div>

        <PasswordInput
          label="Password"
          id="password"
          value={formData.password}
          onChange={(event) => handleChange('password', event.target.value)}
          placeholder="Create a strong password"
          error={errors.password}
          autoComplete="new-password"
        />

        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={(event) => handleChange('confirmPassword', event.target.value)}
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-80"
        >
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading ? <FiArrowRight /> : null}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <button type="button" onClick={() => navigate('/login')} className="font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
          Sign in
        </button>
      </p>
    </AuthCard>
  );
};

export default Signup;
