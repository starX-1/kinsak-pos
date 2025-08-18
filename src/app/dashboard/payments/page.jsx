'use client'
import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { Eye, Download, Filter } from 'lucide-react';

// Mock data - replace with your API call
const mockPayments = [
    {
        id: "ORD001",
        date: "2024-01-15",
        time: "14:30",
        customer: "Table 5",
        items: ["Burger", "Fries", "Coke"],
        amount: 25.50,
        paymentMethod: "mpesa",
        status: "completed",
        phoneNumber: "254712345678"
    },
    {
        id: "ORD002",
        date: "2024-01-15",
        time: "15:45",
        customer: "Table 2",
        items: ["Pizza", "Salad"],
        amount: 32.00,
        paymentMethod: "cash",
        status: "completed"
    },
    {
        id: "ORD003",
        date: "2024-01-15",
        time: "16:20",
        customer: "Table 8",
        items: ["Pasta", "Wine"],
        amount: 28.75,
        paymentMethod: "mpesa",
        status: "pending",
        phoneNumber: "254798765432"
    }
];

const PaymentHistory = () => {
    const [data] = useState(mockPayments);
    const [filter, setFilter] = useState('all');

    const columnHelper = createColumnHelper();

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'Order ID',
            cell: info => (
                <span className="font-mono text-sm">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor('date', {
            header: 'Date & Time',
            cell: info => (
                <div>
                    <div className="font-medium">{info.getValue()}</div>
                    <div className="text-sm text-gray-500">{info.row.original.time}</div>
                </div>
            )
        }),
        columnHelper.accessor('customer', {
            header: 'Customer',
            cell: info => info.getValue()
        }),
        columnHelper.accessor('amount', {
            header: 'Amount',
            cell: info => (
                <span className="font-semibold">${info.getValue().toFixed(2)}</span>
            )
        }),
        columnHelper.accessor('paymentMethod', {
            header: 'Payment',
            cell: info => {
                const method = info.getValue();
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${method === 'mpesa'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {method === 'mpesa' ? 'M-Pesa' : 'Cash'}
                    </span>
                );
            }
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: info => {
                const status = info.getValue();
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {status}
                    </span>
                );
            }
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: () => (
                <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye size={16} />
                    </button>
                    <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                        <Download size={16} />
                    </button>
                </div>
            )
        })
    ], []);

    const filteredData = useMemo(() => {
        if (filter === 'all') return data;
        return data.filter(payment => payment.paymentMethod === filter);
    }, [data, filter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const totalAmount = filteredData.reduce((sum, payment) => sum + payment.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Payment History</h1>
                    <p className="text-indigo-300">Track all your completed transactions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-indigo-300 text-sm">Total Orders</h3>
                        <p className="text-2xl font-bold text-white">{filteredData.length}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-indigo-300 text-sm">Total Revenue</h3>
                        <p className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-indigo-300 text-sm">M-Pesa Orders</h3>
                        <p className="text-2xl font-bold text-white">
                            {filteredData.filter(p => p.paymentMethod === 'mpesa').length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4 mb-6">
                    <Filter className="text-white" size={20} />
                    <div className="flex space-x-2">
                        {['all', 'mpesa', 'cash'].map(filterType => (
                            <button
                                key={filterType}
                                onClick={() => setFilter(filterType)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === filterType
                                    ? 'bg-yellow-400 text-gray-800'
                                    : 'bg-indigo-700/30 text-white hover:bg-indigo-600/40'
                                    }`}
                            >
                                {filterType === 'all' ? 'All' : filterType === 'mpesa' ? 'M-Pesa' : 'Cash'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-indigo-800/50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className="px-6 py-4 text-left text-white font-medium">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-indigo-700/30">
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-indigo-700/20 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4 text-white">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;