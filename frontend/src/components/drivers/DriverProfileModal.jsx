import { FiX } from 'react-icons/fi';

const DriverProfileModal = ({ driver, isOpen, onClose }) => {
  if (!isOpen || !driver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Driver Profile</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{driver.name}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
            <FiX />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-6 md:flex-row">
          <img src={driver.photo} alt={driver.name} className="h-28 w-28 rounded-2xl object-cover" />
          <div className="grid flex-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <p className="text-slate-500">Contact</p>
              <p className="mt-1 font-semibold text-slate-900">{driver.contact}</p>
            </div>
            <div>
              <p className="text-slate-500">Assigned Vehicle</p>
              <p className="mt-1 font-semibold text-slate-900">{driver.vehicle}</p>
            </div>
            <div>
              <p className="text-slate-500">License Number</p>
              <p className="mt-1 font-semibold text-slate-900">{driver.licenseNumber}</p>
            </div>
            <div>
              <p className="text-slate-500">Experience</p>
              <p className="mt-1 font-semibold text-slate-900">{driver.experience}</p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <p className="mt-1 font-semibold text-slate-900">{driver.status}</p>
            </div>
            <div>
              <p className="text-slate-500">License Type</p>
              <p className="mt-1 font-semibold text-slate-900">{driver.licenseType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfileModal;
