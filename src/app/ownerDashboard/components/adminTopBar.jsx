import React, { useState } from 'react';
import {
    Menu,
    Users,
    ShoppingBag,
    TrendingUp,
    Bell,
    // Search,
    DollarSign,
    ChevronDown,
    LogOut,
    User,
    Shield,
    Store,
    RefreshCw,
    Printer,
    Download,
    // X,
    AlertTriangle,
    CheckCircle,
    Info
} from 'lucide-react';

const AdminTopbar = ({
    activeItem = 'dashboard',
    onMenuToggle,
    sidebarMenuItems = []
}) => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'success', message: 'New order received - Table 5', time: '2 min ago', unread: true },
        { id: 2, type: 'warning', message: 'Low stock alert: Chicken Wings', time: '5 min ago', unread: true },
        { id: 3, type: 'info', message: 'Daily report generated', time: '1 hour ago', unread: false },
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Mock restaurant data - in real app this would come from props or context
    const restaurantData = {
        name: "Tico Taco Restaurant",
        owner: "Maria Rodriguez",
        avatar: "/assets/profile-pos.jpg",
        todayStats: {
            revenue: 2450.75,
            orders: 47,
            customers: 32,
            avgOrder: 52.14
        }
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    // Default menu items if not provided
    const defaultMenuItems = [
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

    const menuItems = sidebarMenuItems.length > 0 ? sidebarMenuItems : defaultMenuItems;
    const currentPageTitle = menuItems.find(item => item.id === activeItem)?.label || 'Dashboard';

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        setShowProfile(false);
    };

    const handleProfileClick = () => {
        setShowProfile(!showProfile);
        setShowNotifications(false);
    };

    return (
        <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-4 lg:px-6 py-4 flex-shrink-0 relative z-30">
            <div className="flex items-center justify-between">
                {/* Left Section - Mobile Menu + Title */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Menu size={20} />
                    </button>

                    <div>
                        <h1 className="text-white text-xl font-bold capitalize">
                            {currentPageTitle}
                        </h1>
                        <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                </div>

                {/* Center Section - Quick Stats */}
                <div className="hidden xl:flex items-center space-x-6">
                    <div className="flex items-center space-x-4 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <DollarSign className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">${restaurantData.todayStats.revenue}</p>
                                <p className="text-gray-400 text-xs">Today's Revenue</p>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-white/20"></div>
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <ShoppingBag className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">{restaurantData.todayStats.orders}</p>
                                <p className="text-gray-400 text-xs">Orders</p>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-white/20"></div>
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Users className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">{restaurantData.todayStats.customers}</p>
                                <p className="text-gray-400 text-xs">Customers</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Search, Actions, Profile */}
                <div className="flex items-center space-x-3">
                    {/* Search */}
                    {/* <div className="hidden md:block relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 w-64 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                        />
                    </div> */}

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2">
                        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <RefreshCw size={18} />
                        </button>
                        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Printer size={18} />
                        </button>
                        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Download size={18} />
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="relative z-50">
                        <button
                            onClick={handleNotificationClick}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-[60]" onClick={() => setShowNotifications(false)} />
                                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-[70]">
                                    <div className="p-4 border-b border-white/10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-white font-semibold">Notifications</h3>
                                            <button className="text-gray-400 hover:text-white text-sm">Mark all read</button>
                                        </div>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div key={notification.id} className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${notification.unread ? 'bg-white/5' : ''}`}>
                                                <div className="flex items-start space-x-3">
                                                    <div className={`p-2 rounded-lg ${notification.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                                        notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {notification.type === 'success' ? <CheckCircle size={16} /> :
                                                            notification.type === 'warning' ? <AlertTriangle size={16} /> :
                                                                <Info size={16} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white text-sm">{notification.message}</p>
                                                        <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                                                    </div>
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 text-center">
                                        <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative z-50">
                        <button
                            onClick={handleProfileClick}
                            className="flex items-center space-x-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <img
                                src={restaurantData.avatar}
                                alt={restaurantData.owner}
                                className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400/30"
                            />
                            <ChevronDown className="w-4 h-4 text-white/70" />
                        </button>

                        {/* Profile Dropdown */}
                        {showProfile && (
                            <>
                                <div className="fixed inset-0 z-[60]" onClick={() => setShowProfile(false)} />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-[70]">
                                    <div className="p-4 border-b border-white/10">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={restaurantData.avatar}
                                                alt={restaurantData.owner}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/30"
                                            />
                                            <div>
                                                <p className="text-white font-semibold">{restaurantData.owner}</p>
                                                <p className="text-gray-400 text-sm">Restaurant Owner</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2">
                                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                            <User size={16} />
                                            <span>Profile Settings</span>
                                        </button>
                                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                            <Store size={16} />
                                            <span>Restaurant Settings</span>
                                        </button>
                                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                            <Shield size={16} />
                                            <span>Security</span>
                                        </button>
                                    </div>
                                    <div className="p-4 border-t border-white/10">
                                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <LogOut size={16} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Stats */}
            <div className="xl:hidden mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <div>
                            <p className="text-white font-semibold text-sm">${restaurantData.todayStats.revenue}</p>
                            <p className="text-gray-400 text-xs">Revenue</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-blue-400" />
                        <div>
                            <p className="text-white font-semibold text-sm">{restaurantData.todayStats.orders}</p>
                            <p className="text-gray-400 text-xs">Orders</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <div>
                            <p className="text-white font-semibold text-sm">{restaurantData.todayStats.customers}</p>
                            <p className="text-gray-400 text-xs">Customers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                        <div>
                            <p className="text-white font-semibold text-sm">${restaurantData.todayStats.avgOrder}</p>
                            <p className="text-gray-400 text-xs">Avg Order</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTopbar;