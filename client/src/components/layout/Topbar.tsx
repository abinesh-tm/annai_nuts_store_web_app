import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/features/auth/authSlice';
import Avatar from '../common/Avatar';

const Topbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <div className="bg-gray-100 h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <BellIcon className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'Admin'} />
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

