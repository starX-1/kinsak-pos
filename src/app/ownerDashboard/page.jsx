'use client'
import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Package,
  CreditCard,
  Calendar,
  Filter,
  Download,
  ChevronRight
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Mock data for the dashboard
  const dashboardStats = {
    revenue: {
      current: 2450.75,
      previous: 2180.50,
      change: 12.4,
      trend: 'up'
    },
    orders: {
      current: 47,
      previous: 41,
      change: 14.6,
      trend: 'up'
    },
    customers: {
      current: 32,
      previous: 28,
      change: 14.3,
      trend: 'up'
    },
    avgOrder: {
      current: 52.14,
      previous: 48.90,
      change: 6.6,
      trend: 'up'
    }
  };

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Martinez',
      table: 'Table 5',
      items: 'Tacos Al Pastor x2, Quesadilla',
      amount: 28.50,
      status: 'completed',
      time: '2 min ago',
      paymentMethod: 'card'
    },
    {
      id: '#ORD-002',
      customer: 'Sarah Johnson',
      table: 'Table 12',
      items: 'Burrito Bowl, Chips & Guac',
      amount: 18.75,
      status: 'in-progress',
      time: '5 min ago',
      paymentMethod: 'cash'
    },
    {
      id: '#ORD-003',
      customer: 'Mike Chen',
      table: 'Takeout',
      items: 'Combo Meal x3, Nachos',
      amount: 45.20,
      status: 'pending',
      time: '8 min ago',
      paymentMethod: 'card'
    },
    {
      id: '#ORD-004',
      customer: 'Emma Davis',
      table: 'Table 8',
      items: 'Fish Tacos x2, Agua Fresca',
      amount: 22.00,
      status: 'completed',
      time: '12 min ago',
      paymentMethod: 'card'
    },
    {
      id: '#ORD-005',
      customer: 'Carlos Rodriguez',
      table: 'Table 3',
      items: 'Carnitas Platter, Beer x2',
      amount: 34.50,
      status: 'in-progress',
      time: '15 min ago',
      paymentMethod: 'cash'
    }
  ];

  const topMenuItems = [
    {
      name: 'Tacos Al Pastor',
      orders: 18,
      revenue: 324.00,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=60&h=60&fit=crop&crop=center'
    },
    {
      name: 'Burrito Bowl',
      orders: 15,
      revenue: 281.25,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=60&h=60&fit=crop&crop=center'
    },
    {
      name: 'Quesadilla Grande',
      orders: 12,
      revenue: 204.00,
      image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=60&h=60&fit=crop&crop=center'
    },
    {
      name: 'Fish Tacos',
      orders: 10,
      revenue: 180.00,
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=60&h=60&fit=crop&crop=center'
    },
    {
      name: 'Nachos Supreme',
      orders: 8,
      revenue: 136.00,
      image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=60&h=60&fit=crop&crop=center'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Chicken Wings - Only 5 portions left',
      time: '5 min ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'Peak Hour Approaching',
      message: 'Lunch rush expected in 30 minutes',
      time: '10 min ago'
    },
    {
      id: 3,
      type: 'success',
      title: 'Payment Processed',
      message: 'Daily settlement completed successfully',
      time: '1 hour ago'
    }
  ];

  const salesData = [
    { time: '6:00', orders: 2, revenue: 45 },
    { time: '7:00', orders: 5, revenue: 125 },
    { time: '8:00', orders: 8, revenue: 220 },
    { time: '9:00', orders: 12, revenue: 350 },
    { time: '10:00', orders: 15, revenue: 485 },
    { time: '11:00', orders: 22, revenue: 680 },
    { time: '12:00', orders: 35, revenue: 980 },
    { time: '13:00', orders: 28, revenue: 820 },
    { time: '14:00', orders: 18, revenue: 580 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-400" />;
      default:
        return <Package size={16} className="text-blue-400" />;
    }
  };

  const StatCard = ({ title, value, change, trend, icon, color }) => (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-2xl font-bold mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {change}%
            </span>
            <span className="text-gray-400 text-sm">vs yesterday</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening at your restaurant today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={`$${dashboardStats.revenue.current}`}
          change={dashboardStats.revenue.change}
          trend={dashboardStats.revenue.trend}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500/20"
        />
        <StatCard
          title="Total Orders"
          value={dashboardStats.orders.current}
          change={dashboardStats.orders.change}
          trend={dashboardStats.orders.trend}
          icon={<ShoppingBag className="w-6 h-6 text-white" />}
          color="bg-blue-500/20"
        />
        <StatCard
          title="Customers Served"
          value={dashboardStats.customers.current}
          change={dashboardStats.customers.change}
          trend={dashboardStats.customers.trend}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-500/20"
        />
        <StatCard
          title="Avg Order Value"
          value={`$${dashboardStats.avgOrder.current}`}
          change={dashboardStats.avgOrder.change}
          trend={dashboardStats.avgOrder.trend}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-yellow-500/20"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
              <button className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors">
                <span>View All</span>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-white font-medium">{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">{order.customer} • {order.table}</p>
                      <p className="text-gray-300 text-sm">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${order.amount}</p>
                      <p className="text-gray-400 text-xs">{order.time}</p>
                      <p className="text-gray-500 text-xs capitalize">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Top Menu Items */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Menu Items</h3>
            <div className="space-y-4">
              {topMenuItems.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-3">
                  <div className="text-gray-400 font-medium w-6 text-center">#{index + 1}</div>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-gray-400 text-xs">{item.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">${item.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Alerts & Notifications</h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{alert.title}</p>
                      <p className="text-gray-400 text-xs mt-1">{alert.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Sales Overview</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-400 text-sm">Orders</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-400 text-sm">Revenue</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-9 gap-4 h-48">
          {salesData.map((data, index) => (
            <div key={index} className="flex flex-col items-center justify-end space-y-2">
              <div className="flex flex-col items-center space-y-1 flex-1 justify-end">
                <div 
                  className="w-4 bg-green-400/30 rounded-t"
                  style={{ height: `${(data.revenue / 1000) * 100}%` }}
                ></div>
                <div 
                  className="w-4 bg-yellow-400/30 rounded-t"
                  style={{ height: `${(data.orders / 35) * 80}%` }}
                ></div>
              </div>
              <span className="text-gray-400 text-xs">{data.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">New Order</h4>
              <p className="text-gray-300 text-sm">Create a new order</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 hover:from-blue-500/30 hover:to-purple-500/30 transition-all cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Manage Tables</h4>
              <p className="text-gray-300 text-sm">View table status</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 hover:from-green-500/30 hover:to-emerald-500/30 transition-all cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Process Payment</h4>
              <p className="text-gray-300 text-sm">Handle transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;