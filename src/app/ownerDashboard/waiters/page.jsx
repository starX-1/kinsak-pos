'use client'
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Plus,
    Search,
    Download,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    Mail,
    X,
    Save,
    User,
    Users,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Lock,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    EyeOff
} from 'lucide-react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import AdminAPi from '../../api/admin/routes'
import { toast } from 'react-toastify';

// Mock toast for demo
// const toast = {
//     success: (msg) => console.log('Success:', msg),
//     error: (msg) => console.log('Error:', msg)
// };

// Mock AdminAPi for demo
// const AdminAPi = {
//     registerWaiter: async (waiter) => {
//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 500));
//         return { success: true };
//     }
// };

// ActionDropdown component defined outside main component to prevent recreation
const ActionDropdown = React.memo(({ waiter, onEdit, onDelete, onView }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleView = useCallback(() => {
        onView(waiter);
        setIsOpen(false);
    }, [waiter, onView]);

    const handleEdit = useCallback(() => {
        onEdit(waiter);
        setIsOpen(false);
    }, [waiter, onEdit]);

    const handleDelete = useCallback(() => {
        onDelete(waiter);
        setIsOpen(false);
    }, [waiter, onDelete]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
                <MoreVertical size={16} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={handleClose} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-40">
                        <div className="py-1">
                            <button
                                onClick={handleView}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors text-left"
                            >
                                <Eye size={16} />
                                <span>View Details</span>
                            </button>
                            <button
                                onClick={handleEdit}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors text-left"
                            >
                                <Edit2 size={16} />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                            >
                                <Trash2 size={16} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});

// Modal Component defined outside main component
const Modal = React.memo(({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl'
    };

    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/75 transition-opacity" />

            {/* Modal content */}
            <div className={`relative w-full ${sizeClasses[size]} max-h-[90vh] transform rounded-2xl bg-slate-800 shadow-2xl transition-all flex flex-col overflow-hidden`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-600 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
});

const WaitersManagementPage = () => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedWaiter, setSelectedWaiter] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    // Simplified waiter data structure matching your backend
    const [waitersData, setWaitersData] = useState([]);

    const fetchWaiter = async () => {
        setLoading(true);
        const response = await AdminAPi.getAllWaiters();
        if (response.error) {
            toast.error(response.error);
            return;
        }
        setWaitersData(response.data);
        setLoading(false);
    }

    useEffect(() => {
        fetchWaiter();
    }, []);

    const [newWaiter, setNewWaiter] = useState({
        name: '',
        email: '',
        password: ''
    });

    // Memoized event handlers to prevent recreation on each render
    const handleNewWaiterChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewWaiter(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSelectedWaiterChange = useCallback((e) => {
        const { name, value } = e.target;
        setSelectedWaiter(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSelectedWaiterStatusChange = useCallback((e) => {
        setSelectedWaiter(prev => ({
            ...prev,
            isActive: e.target.value === 'true'
        }));
    }, []);

    // Modal handlers
    const handleCloseAddModal = useCallback(() => {
        setNewWaiter({
            name: '',
            email: '',
            password: ''
        });
        setShowAddModal(false);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setSelectedWaiter(null);
        setShowEditModal(false);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setShowViewModal(false);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
    }, []);

    // Action handlers
    const handleViewWaiter = useCallback((waiter) => {
        setSelectedWaiter(waiter);
        setShowViewModal(true);
    }, []);

    const handleEditWaiterOpen = useCallback((waiter) => {
        setSelectedWaiter(waiter);
        setShowEditModal(true);
    }, []);

    const handleDeleteWaiterOpen = useCallback((waiter) => {
        setSelectedWaiter(waiter);
        setShowDeleteModal(true);
    }, []);

    const handleAddWaiter = useCallback(async () => {
        try {
            const id = Math.max(...waitersData.map(w => w.id)) + 1;
            const response = await AdminAPi.registerWaiter(newWaiter);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            toast.success('Waiter added successfully');
            const waiter = {
                ...newWaiter,
                id,
                createdAt: new Date().toISOString().split('T')[0],
                isActive: true
            };

            setWaitersData(prev => [...prev, waiter]);
            setNewWaiter({
                name: '',
                email: '',
                password: ''
            });
            setShowAddModal(false);
        } catch (error) {
            toast.error('Failed to add waiter');
            console.error('Error adding waiter:', error);
        }
    }, [newWaiter, waitersData]);

    const handleEditWaiter = useCallback(() => {
        setWaitersData(prev => prev.map(waiter =>
            waiter.id === selectedWaiter.id ? selectedWaiter : waiter
        ));
        setShowEditModal(false);
        setSelectedWaiter(null);
        toast.success('Waiter updated successfully');
    }, [selectedWaiter]);

    const handleDeleteWaiter = useCallback(() => {
        setWaitersData(prev => prev.filter(waiter => waiter.id !== selectedWaiter.id));
        setShowDeleteModal(false);
        setSelectedWaiter(null);
        toast.success('Waiter deleted successfully');
    }, [selectedWaiter]);

    // Column helper for TanStack Table - memoized
    const columnHelper = useMemo(() => createColumnHelper(), []);

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Name</span>
                    <ArrowUpDown size={14} />
                </button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-medium truncate">{row.original.name}</p>
                        <p className="text-gray-400 text-sm">ID: #{row.original.id}</p>
                    </div>
                </div>
            )
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2 min-w-0">
                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-300 truncate">{row.original.email}</span>
                </div>
            )
        }),
        columnHelper.accessor('isActive', {
            header: 'Status',
            cell: ({ row }) => (
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${row.original.isActive
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                    {row.original.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>{row.original.isActive ? 'Active' : 'Inactive'}</span>
                </span>
            )
        }),
        columnHelper.accessor('createdAt', {
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Created Date</span>
                    <ArrowUpDown size={14} />
                </button>
            ),
            cell: ({ row }) => (
                <span className="text-gray-300 whitespace-nowrap">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </span>
            )
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <ActionDropdown
                    waiter={row.original}
                    onView={handleViewWaiter}
                    onEdit={handleEditWaiterOpen}
                    onDelete={handleDeleteWaiterOpen}
                />
            )
        })
    ], [columnHelper, handleViewWaiter, handleEditWaiterOpen, handleDeleteWaiterOpen]);

    const table = useReactTable({
        data: waitersData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 6,
            },
        },
    });

    // Computed values - memoized
    const activeWaiters = useMemo(() => waitersData.filter(w => w.isActive).length, [waitersData]);
    const inactiveWaiters = useMemo(() => waitersData.filter(w => w.isActive === false).length, [waitersData]);
    const activeRate = useMemo(() =>
        waitersData.length > 0 ? ((activeWaiters / waitersData.length) * 100).toFixed(0) : 0,
        [activeWaiters, waitersData.length]
    );

    // Button click handlers
    const handleShowAddModal = useCallback(() => setShowAddModal(true), []);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Waiters Management</h1>
                        <p className="text-gray-400">Manage your restaurant staff accounts</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleShowAddModal}
                            className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus size={16} />
                            <span>Add Waiter</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{waitersData.length}</p>
                                <p className="text-gray-400 text-sm">Total Waiters</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{activeWaiters}</p>
                                <p className="text-gray-400 text-sm">Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-red-500/20 rounded-lg">
                                <XCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{inactiveWaiters}</p>
                                <p className="text-gray-400 text-sm">Inactive</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                                <User className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{activeRate}%</p>
                                <p className="text-gray-400 text-sm">Active Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search waiters..."
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10 pr-4 py-3 w-full bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white transition-colors">
                                <Download size={16} />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50 border-b border-white/10">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className="text-left py-4 px-6 font-medium whitespace-nowrap">
                                                {header.isPlaceholder ? null : (
                                                    flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row, index) => (
                                    <tr key={row.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="py-4 px-6">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                            </div>
                        )}

                        {!loading && table.getRowModel().rows.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No waiters found</p>
                                <p className="text-gray-500 text-sm">Try adjusting your search</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-800/30">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>
                                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getPrePaginationRowModel().rows.length)}{' '}
                                of {table.getPrePaginationRowModel().rows.length} results
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-white text-sm px-2">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </span>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Waiter Modal */}
                <Modal isOpen={showAddModal} onClose={handleCloseAddModal} title="Add New Waiter">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input
                                name='name'
                                type="text"
                                value={newWaiter.name}
                                onChange={handleNewWaiterChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                name='email'
                                type="email"
                                value={newWaiter.email}
                                onChange={handleNewWaiterChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                placeholder="Enter email address"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={newWaiter.password}
                                onChange={handleNewWaiterChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 pr-10"
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-10 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-600">
                            <button
                                onClick={handleCloseAddModal}
                                className="px-6 py-2 text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddWaiter}
                                disabled={!newWaiter.name || !newWaiter.email || !newWaiter.password}
                                className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Save size={16} />
                                <span>Add Waiter</span>
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* View Waiter Modal */}
                <Modal isOpen={showViewModal} onClose={handleCloseViewModal} title="Waiter Details">
                    {selectedWaiter && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{selectedWaiter.name}</h3>
                                    <p className="text-gray-400">ID: #{selectedWaiter.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-300 text-sm">Email</span>
                                    </div>
                                    <p className="text-white">{selectedWaiter.email}</p>
                                </div>

                                <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <CheckCircle className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-300 text-sm">Status</span>
                                    </div>
                                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${selectedWaiter.isActive
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                                        }`}>
                                        {selectedWaiter.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                        <span>{selectedWaiter.isActive ? 'Active' : 'Inactive'}</span>
                                    </span>
                                </div>

                                <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 md:col-span-2">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Lock className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-300 text-sm">Created Date</span>
                                    </div>
                                    <p className="text-white">{new Date(selectedWaiter.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Edit Waiter Modal */}
                <Modal isOpen={showEditModal} onClose={handleCloseEditModal} title="Edit Waiter">
                    {selectedWaiter && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    name='name'
                                    type="text"
                                    value={selectedWaiter.name}
                                    onChange={handleSelectedWaiterChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    name='email'
                                    value={selectedWaiter.email}
                                    onChange={handleSelectedWaiterChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input
                                    name='password'
                                    type="password"
                                    value={selectedWaiter.password}
                                    onChange={handleSelectedWaiterChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                <select
                                    name='isActive'
                                    value={selectedWaiter.isActive ? 'true' : 'false'}
                                    onChange={handleSelectedWaiterStatusChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-600">
                                <button
                                    onClick={handleCloseEditModal}
                                    className="px-6 py-2 text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditWaiter}
                                    className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <Save size={16} />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal isOpen={showDeleteModal} onClose={handleCloseDeleteModal} title="Delete Waiter" size="sm">
                    {selectedWaiter && (
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-red-500/20 rounded-full flex-shrink-0">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg mb-2">Are you sure?</h3>
                                    <p className="text-gray-400 text-sm">This action cannot be undone. This will permanently delete the waiter's account and remove all associated data.</p>
                                </div>
                            </div>

                            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-white font-medium">{selectedWaiter.name}</p>
                                        <p className="text-gray-400 text-sm truncate">{selectedWaiter.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-600">
                                <button
                                    onClick={handleCloseDeleteModal}
                                    className="px-6 py-2 text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteWaiter}
                                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete Waiter</span>
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default WaitersManagementPage;