// components/Layout/Sidebar.tsx
'use client'
import React, { useState } from 'react';
import {
    Home,
    Menu,
    CreditCard,
    FileText,
    Settings,
    ArrowLeft,
    Cloud,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SidebarItem {
    id: string;
    icon: (size: number) => React.ReactElement;
    label: string;
    path?: string; // Optional path for navigation
    isActive?: boolean;
}

interface SidebarProps {
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    const [activeItem, setActiveItem] = useState('home');
    const router = useRouter();


    const sidebarItems: SidebarItem[] = [
        {
            id: 'home',
            icon: (size: number) => <Home size={size} />,
            label: 'Home',
            path: '/dashboard',
            isActive: activeItem === 'home'
        },
        // {
        //     id: 'menu',
        //     icon: (size: number) => <Menu size={size} />,
        //     label: 'Menu'
        // },
        {
            id: 'payments',
            icon: (size: number) => <CreditCard size={size} />,
            path: '/dashboard/payments',
            label: 'Payments'
        },
        {
            id: 'receipts',
            icon: (size: number) => <FileText size={size} />,
            path: '/receipts',
            label: 'Receipts'
        },
        // {
        //     id: 'delivery',
        //     icon: (size: number) => <Settings size={size} />,
        //     label: 'Delivery & Settlement'
        // }
    ];

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
        // Navigate to the item's path if defined
        const item = sidebarItems.find(i => i.id === itemId);
        if (item && item.path) {
            router.push(item.path);
        }
        // Close sidebar on mobile after selection
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="w-20  sm:w-24 h-full z-1000 bg-indigo-800/30 backdrop-blur-sm border-r border-indigo-700/30 flex flex-col items-center py-4 sm:py-6">
            {/* Mobile Close Button */}
            <div className="lg:hidden w-full flex justify-end px-2 mb-4">
                <button
                    onClick={onClose}
                    className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Logo/Brand */}
            <div className="mb-6 sm:mb-8 p-2 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Cloud className="text-white" size={24} />
            </div>

            {/* POS Label */}
            <div className="mb-6 sm:mb-8">
                <span className="text-white text-xs font-bold bg-white/20 px-2 py-1 rounded">
                    POS
                </span>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 w-full">
                <ul className="space-y-3 sm:space-y-4 px-1 sm:px-2">
                    {sidebarItems.map((item) => (
                        <li key={item.id}>

                            <button
                                onClick={() => handleItemClick(item.id)}
                                className={`w-full flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-200 group ${item.isActive || activeItem === item.id
                                    ? 'bg-yellow-400 text-gray-800'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <div className="mb-1">
                                    {/* dont use window inner width */}
                                    {
                                        item.icon(24)
                                    }
                                </div>
                                <span className="text-[10px] font-medium text-center leading-tight">
                                    {item.label}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Back Office Button */}
            {/* <div className="mt-4 px-1 sm:px-2 w-full">
                <button
                    onClick={() => handleItemClick('back-office')}
                    className="w-full flex flex-col items-center p-2 sm:p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                    <ArrowLeft size={window.innerWidth < 640 ? 20 : 24} className="mb-1" />
                    <span className="text-[10px] font-medium text-center leading-tight">
                        Back Office
                    </span>
                </button>
            </div> */}
        </div>
    );
};

export default Sidebar;