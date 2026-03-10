

import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Box, FileText, Settings, CreditCard, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Products', href: '/products', icon: Box },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 selection:bg-brand-orange/30">
      {/* Sidebar - Modern Floating Look */}
      <div className="hidden md:flex flex-col w-[280px] bg-brand-navy shadow-2xl relative z-20 transition-all duration-300">
        <div className="flex items-center justify-center h-24 bg-brand-navy/95 border-b border-slate-800 shrink-0 px-6 backdrop-blur-sm">
          <img className="h-12 w-auto object-contain drop-shadow-lg scale-110" src="/logo.png" alt="InvoiceFlow" />
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-6 pb-4 scrollbar-hide">
          <nav className="flex-1 px-4 space-y-2 text-white">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 min-h-[48px] text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-orange to-[#ff8c33] text-white shadow-md shadow-brand-orange/20 translate-x-1'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <item.icon
                    className={`mr-4 flex-shrink-0 h-5 w-5 transition-transform duration-300 ${
                      isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-white group-hover:scale-110'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User Mini Profile in Sidebar Bottom */}
        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 px-2 py-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-orange to-amber-300 text-white flex items-center justify-center font-bold shadow-glow">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">{user?.name}</span>
                <span className="text-xs text-slate-400 truncate">{user?.email}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden bg-slate-50">
        {/* Top Header - Glassmorphism */}
        <div className="relative z-10 flex-shrink-0 flex h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 transition-all">
          <div className="flex-1 px-4 flex justify-between sm:px-8">
            <div className="flex-1 flex items-center">
               <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 capitalize tracking-tight">
                {location.pathname.split('/')[1] || 'Dashboard'}
               </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 gap-2">
               {/* Optional Header Controls */}
               <Link to="/settings" className="p-2 text-slate-400 hover:text-brand-orange transition-colors rounded-full hover:bg-orange-50" title="Settings">
                  <Settings className="w-5 h-5" />
               </Link>
               <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50" title="Sign Out">
                  <LogOut className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none scroll-smooth">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

