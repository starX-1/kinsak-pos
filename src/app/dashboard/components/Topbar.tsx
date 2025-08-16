'use client';
import React, { useState, useEffect } from 'react';
import { Search, Menu as MenuIcon, Printer, X } from 'lucide-react';

interface TopBarProps {
    onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const update = () => {
            setCurrentTime(
                new Date().toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit', // show ticking seconds
                    hour12: true,
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })
            );
        };

        update(); // update immediately

        // wait until the top of the next second
        const timeout = setTimeout(() => {
            update();
            const timer = setInterval(update, 1000); // update every second after that
            // cleanup
            return () => clearInterval(timer);
        }, 1000 - (Date.now() % 1000));

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="bg-indigo-800/30 backdrop-blur-sm border-b border-indigo-700/30 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                >
                    <MenuIcon size={20} />
                </button>

                {/* Left Section - Restaurant Info */}
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-shrink-0">
                    <div className="min-w-0">
                        <h1 className="text-white text-lg sm:text-xl font-bold truncate">
                            Kinsak Restaurant
                        </h1>
                        <p className="text-indigo-200 text-xs sm:text-sm hidden sm:block">
                            {currentTime}
                        </p>
                    </div>
                </div>

                {/* Center Section - Search */}
                <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-indigo-700/30 border border-indigo-600/30 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Right Section - Bill Info and Actions */}
                <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    {/* Bill Info - Hidden on very small screens */}
                    <div className="text-right hidden sm:block">
                        <p className="text-white text-sm sm:text-lg font-bold">
                            Bill #45555
                        </p>
                        <p className="text-indigo-200 text-xs sm:text-sm">
                            Table • Customer
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <button className="p-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Printer size={18} />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Bill Info */}
            <div className="sm:hidden mt-2 pt-2 border-t border-indigo-700/30">
                <div className="flex justify-between items-center">
                    <p className="text-white text-sm font-bold">Bill #45555</p>
                    <p className="text-indigo-200 text-xs">Table • Customer</p>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
