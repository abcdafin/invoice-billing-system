import { useAuthStore } from '../stores/authStore';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex sm:items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-brand-navy">Settings</h2>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Profile Configuration</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Update your account settings and preferences here.</p>
          </div>
          
          <form className="mt-5 sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={user?.name || ''}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-orange sm:text-sm sm:leading-6 px-3"
                placeholder="Your Name"
              />
            </div>
            <div className="w-full sm:max-w-xs">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={user?.email || ''}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-orange sm:text-sm sm:leading-6 px-3"
                placeholder="you@example.com"
                disabled
              />
            </div>
            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-brand-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e65c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange sm:mt-0 sm:w-auto"
            >
              Save Settings
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-red-200 sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-red-600">Danger Zone</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>Sign out of your account on this device.</p>
          </div>
          <div className="mt-5">
            <button
              onClick={handleLogout}
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
