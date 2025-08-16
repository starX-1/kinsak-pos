'use client'
import React, { useState } from 'react';
import AdminSidebar from './components/AdminsideBar';
import AdminTopbar from './components/adminTopBar';

const AdminLayout = ({ children, activeItem = 'dashboard' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentActiveItem, setCurrentActiveItem] = useState(activeItem);

  // Menu items for navigation consistency
  const sidebarMenuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Orders' },
    { id: 'menu', label: 'Menu Management' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'staff', label: 'Staff Management' },
    { id: 'customers', label: 'Customers' },
    { id: 'analytics', label: 'Analytics & Reports' },
    { id: 'payments', label: 'Payments' },
    { id: 'restaurant', label: 'Restaurant Settings' },
    { id: 'settings', label: 'System Settings' }
  ];

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleItemClick = (itemId, path) => {
    setCurrentActiveItem(itemId);
    // Here you can handle navigation logic
    // For example, if using React Router:
    // navigate(path);
    console.log('Navigate to:', path, 'Item:', itemId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar
          activeItem={currentActiveItem}
          onItemClick={handleItemClick}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={handleCloseSidebar}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Topbar */}
          <AdminTopbar
            activeItem={currentActiveItem}
            onMenuToggle={handleMenuToggle}
            sidebarMenuItems={sidebarMenuItems}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;