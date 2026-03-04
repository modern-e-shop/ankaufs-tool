import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, ArrowLeft } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Anfragen', icon: ShoppingCart },
  { to: '/admin/products', label: 'Produkte', icon: Package },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <nav className="border-b border-white/5 bg-[rgba(10,10,15,0.8)] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <NavLink to="/" className="text-slate-500 hover:text-slate-300 flex items-center gap-1 text-sm">
                <ArrowLeft className="w-4 h-4" /> Zurück zum Portal
              </NavLink>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-sm font-semibold text-indigo-400 tracking-wide">ADMIN</span>
            </div>
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-300'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
