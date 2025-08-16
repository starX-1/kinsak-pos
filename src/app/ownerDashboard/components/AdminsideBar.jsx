'use client'
import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Menu,
    Users,
    ShoppingBag,
    CreditCard,
    BarChart3,
    Settings,
    Store,
    UserCheck,
    Package,
    ChevronRight,
    LogOut,
    Cloud,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminAPi from '@/app/api/admin/routes';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';

const AdminSidebar = ({
    activeItem = 'dashboard',
    onItemClick,
    isSidebarOpen = true,
    onCloseSidebar
}) => {
    const [expandedMenus, setExpandedMenus] = useState({});

    const router = useRouter();
    // Mock restaurant data - in real app this would come from props or context
const [loading, setLoading]= useState(false);
    const [restaurantData, setRestaurantData] = useState({});

    const fetchAdminRestaurant = async () => {
        setLoading (true)
        const response = await AdminAPi.getAdminRestaurant();
        if (response.error) {
            toast.error(response.error);
            return;
        }
        // console.log(response);
        setRestaurantData(response.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAdminRestaurant();
    }, []);

    const sidebarMenuItems = [
        {
            id: 'dashboard',
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            path: '/ownerDashboard',
        },
        {
            id: 'orders',
            icon: <ShoppingBag size={20} />,
            label: 'Orders',
            path: '/admin/orders',
            badge: '12',
            submenu: [
                { id: 'all-orders', label: 'All Orders', path: '/admin/orders/all' },
                { id: 'pending', label: 'Pending', path: '/admin/orders/pending', badge: '5' },
                { id: 'in-progress', label: 'In Progress', path: '/admin/orders/in-progress', badge: '3' },
                { id: 'completed', label: 'Completed', path: '/admin/orders/completed' },
                { id: 'cancelled', label: 'Cancelled', path: '/admin/orders/cancelled' }
            ]
        },
        {
            id: 'menu',
            icon: <Menu size={20} />,
            label: 'Menu Management',
            path: '/admin/menu',
            submenu: [
                { id: 'menu-items', label: 'Menu Items', path: '/admin/menu/items' },
                { id: 'categories', label: 'Categories', path: '/admin/menu/categories' },
                { id: 'modifiers', label: 'Modifiers', path: '/admin/menu/modifiers' },
                { id: 'pricing', label: 'Pricing', path: '/admin/menu/pricing' }
            ]
        },
        {
            id: 'inventory',
            icon: <Package size={20} />,
            label: 'Inventory',
            path: '/admin/inventory',
            submenu: [
                { id: 'stock-levels', label: 'Stock Levels', path: '/admin/inventory/stock' },
                { id: 'suppliers', label: 'Suppliers', path: '/admin/inventory/suppliers' },
                { id: 'purchase-orders', label: 'Purchase Orders', path: '/admin/inventory/purchase' },
                { id: 'low-stock', label: 'Low Stock Alerts', path: '/admin/inventory/alerts', badge: '3' }
            ]
        },
        {
            id: 'staff',
            icon: <Users size={20} />,
            label: 'Staff Management',
            path: '/admin/staff',
            submenu: [
                { id: 'waiters', label: 'Waiters', path: '/ownerDashboard/waiters' },
                { id: 'schedules', label: 'Schedules', path: '/admin/staff/schedules' },
                { id: 'payroll', label: 'Payroll', path: '/admin/staff/payroll' },
                { id: 'performance', label: 'Performance', path: '/admin/staff/performance' }
            ]
        },
        {
            id: 'customers',
            icon: <UserCheck size={20} />,
            label: 'Customers',
            path: '/admin/customers',
            submenu: [
                { id: 'customer-list', label: 'Customer List', path: '/admin/customers/list' },
                { id: 'loyalty', label: 'Loyalty Program', path: '/admin/customers/loyalty' },
                { id: 'feedback', label: 'Feedback', path: '/admin/customers/feedback' }
            ]
        },
        {
            id: 'analytics',
            icon: <BarChart3 size={20} />,
            label: 'Analytics & Reports',
            path: '/admin/analytics',
            submenu: [
                { id: 'sales-report', label: 'Sales Reports', path: '/admin/analytics/sales' },
                { id: 'performance', label: 'Performance', path: '/admin/analytics/performance' },
                { id: 'trends', label: 'Trends', path: '/admin/analytics/trends' },
                { id: 'custom-reports', label: 'Custom Reports', path: '/admin/analytics/custom' }
            ]
        },
        {
            id: 'payments',
            icon: <CreditCard size={20} />,
            label: 'Payments',
            path: '/admin/payments',
            submenu: [
                { id: 'transactions', label: 'Transactions', path: '/admin/payments/transactions' },
                { id: 'refunds', label: 'Refunds', path: '/admin/payments/refunds' },
                { id: 'payment-methods', label: 'Payment Methods', path: '/admin/payments/methods' }
            ]
        },
        {
            id: 'restaurant',
            icon: <Store size={20} />,
            label: 'Restaurant Settings',
            path: '/admin/restaurant',
            submenu: [
                { id: 'profile', label: 'Profile', path: '/admin/restaurant/profile' },
                { id: 'hours', label: 'Operating Hours', path: '/admin/restaurant/hours' },
                { id: 'tables', label: 'Table Management', path: '/admin/restaurant/tables' },
                { id: 'locations', label: 'Locations', path: '/admin/restaurant/locations' }
            ]
        },
        {
            id: 'settings',
            icon: <Settings size={20} />,
            label: 'System Settings',
            path: '/admin/settings',
            submenu: [
                { id: 'general', label: 'General', path: '/admin/settings/general' },
                { id: 'pos-settings', label: 'POS Settings', path: '/admin/settings/pos' },
                { id: 'integrations', label: 'Integrations', path: '/admin/settings/integrations' },
                { id: 'security', label: 'Security', path: '/admin/settings/security' }
            ]
        }
    ];

    const toggleSubmenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const handleItemClick = (itemId, hasSubmenu = false, path = null) => {
        if (hasSubmenu) {
            toggleSubmenu(itemId);
        } else {
            onItemClick?.(itemId, path);
            if (path) {
                router.push(path);
            }
            // Close sidebar on mobile after selection
            if (window.innerWidth < 1024) {
                onCloseSidebar?.();
            }
        }
    };

    const handleLogout = () => {
        signOut({ callbackUrl: '/auth/login' });
        // router.push('/auth/login')
    };
    return (
        <div className={`
      fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
      transform transition-transform duration-300 ease-in-out lg:translate-x-0
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      w-64 h-full bg-white/5 backdrop-blur-lg border-r border-white/10
      flex flex-col
    `}>
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-end p-4">
                <button
                    onClick={onCloseSidebar}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Logo Section */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                        <Cloud className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg">TicoTaco POS</h1>
                        <p className="text-yellow-400 text-xs font-medium">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-4 border-b border-white/10">
                <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-lg p-3 border border-yellow-400/20">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            {
                                loading ? (
                                    <p className="text-white font-medium text-sm">Loading...</p>
                                ) : (
                                    <p className="text-white font-medium text-sm">{restaurantData.name}</p>
                                )
                            }
                            {/* <p className="text-white font-medium text-sm truncate">{restaurantData.name}</p> */}
                            <p className="text-gray-300 text-xs">Owner Dashboard</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {sidebarMenuItems.map((item) => (
                        <li key={item.id}>
                            <div>
                                <button
                                    onClick={() => handleItemClick(item.id, !!item.submenu, item.path)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${activeItem === item.id || (item.submenu && expandedMenus[item.id])
                                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className={`${activeItem === item.id ? 'text-yellow-400' : 'text-white/70 group-hover:text-white'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {item.badge && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                                {item.badge}
                                            </span>
                                        )}
                                        {item.submenu && (
                                            <ChevronRight
                                                className={`w-4 h-4 transition-transform ${expandedMenus[item.id] ? 'rotate-90' : ''}`}
                                            />
                                        )}
                                    </div>
                                </button>

                                {/* Submenu */}
                                {item.submenu && expandedMenus[item.id] && (
                                    <ul className="mt-2 ml-6 space-y-1 border-l border-white/10 pl-4">
                                        {item.submenu.map((subItem) => (
                                            <li key={subItem.id}>
                                                <button
                                                    onClick={() => handleItemClick(subItem.id, false, subItem.path)}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-sm ${activeItem === subItem.id
                                                        ? 'bg-yellow-400/10 text-yellow-400'
                                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    <span>{subItem.label}</span>
                                                    {subItem.badge && (
                                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                                            {subItem.badge}
                                                        </span>
                                                    )}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <img
                        src='/assets/profile-pos.jpg'
                        alt={restaurantData.owner}
                        className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400/30"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{restaurantData.owner}</p>
                        <p className="text-gray-300 text-xs">Restaurant Owner</p>
                    </div>
                    <LogOut 
                    onClick={handleLogout}
                    className="w-4 h-4 text-white/70 hover:text-red-400 transition-colors" />
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;