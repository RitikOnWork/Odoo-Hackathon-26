import { FiPlus } from 'react-icons/fi';

const SearchFilterBar = ({ searchTerm, setSearchTerm, filters = [], buttonLabel, onAddClick, buttonIcon: ButtonIcon = FiPlus }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </label>

          {filters.map((filter) => (
            <select
              key={filter.label}
              value={filter.value}
              onChange={filter.onChange}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            >
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? filter.placeholder || `All ${filter.label}` : option}
                </option>
              ))}
            </select>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <ButtonIcon />
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
