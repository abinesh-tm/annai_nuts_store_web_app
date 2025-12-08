import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-admin-bg">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

