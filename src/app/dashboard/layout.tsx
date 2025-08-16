// / components/Layout / Layout.tsx
'use client';
import React, { ReactNode, useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/Topbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
                transform transition-transform duration-300 ease-in-out lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={closeSidebar} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Top Bar */}
                <TopBar onMenuClick={toggleSidebar} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="h-full p-4 sm:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;