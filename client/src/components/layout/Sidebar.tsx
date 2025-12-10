import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
  { name: 'Products', path: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'Customers', path: '/admin/customers', icon: UserGroupIcon },
  { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-admin-sidebar text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-admin-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

