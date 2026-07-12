import { useNavigate } from 'react-router-dom';

const AuthTabs = ({ active }) => {
  const navigate = useNavigate();

  const tabs = [
    { id: 'signin', label: 'Sign In', path: '/login' },
    { id: 'signup', label: 'Sign Up', path: '/signup' },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-lg shadow-sky-200' : 'bg-transparent text-slate-600 hover:text-slate-900'}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default AuthTabs;
