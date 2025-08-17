'use client'
import React, { useState, useMemo, useCallback } from 'react';
import {
    Plus,
    Search,
    Download,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    DollarSign,
    X,
    Save,
    ChefHat,
    Utensils,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    Tag
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
import { toast } from 'react-toastify';
import AdminAPi from '@/app/api/admin/routes';
// Mock toast for demo
// const toast = {
//     success: (msg) => console.log('Success:', msg),
//     error: (msg) => console.log('Error:', msg)
// };

// Mock AdminAPi for demo
// const AdminAPi = {
//     addFood: async (food) => {
//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 500));
//         return { success: true };
//     },
//     updateFood: async (food) => {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         return { success: true };
//     },
//     deleteFood: async (id) => {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         return { success: true };
//     }
// };

// ActionDropdown component
const ActionDropdown = React.memo(({ food, onEdit, onDelete, onView }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleView = useCallback(() => {
        onView(food);
        setIsOpen(false);
    }, [food, onView]);

    const handleEdit = useCallback(() => {
        onEdit(food);
        setIsOpen(false);
    }, [food, onEdit]);

    const handleDelete = useCallback(() => {
        onDelete(food);
        setIsOpen(false);
    }, [food, onDelete]);

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

// Modal Component
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

const FoodManagementPage = () => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Food categories
    // const categories = [
    //     'Appetizers', 'Main Course', 'Desserts', 'Beverages',
    //     'Salads', 'Soups', 'Pasta', 'Pizza', 'Burgers', 'Seafood'
    // ];

    // Sample food data - conforming to backend structure
    const [foodsData, setFoodsData] = useState([
        {
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil',
            price: '12.99',
            category: 'Pizza',
            image: 'https://via.placeholder.com/300x200/1f2937/ffffff?text=Margherita+Pizza'
        },
        {
            name: 'Grilled Chicken Caesar Salad',
            description: 'Fresh romaine lettuce with grilled chicken, croutons, and Caesar dressing',
            price: '14.50',
            category: 'Salads',
            image: 'https://via.placeholder.com/300x200/1f2937/ffffff?text=Caesar+Salad'
        },
        {
            name: 'Beef Burger Deluxe',
            description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce',
            price: '16.75',
            category: 'Burgers',
            image: 'https://via.placeholder.com/300x200/1f2937/ffffff?text=Beef+Burger'
        },
        {
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with molten chocolate center, served with vanilla ice cream',
            price: '8.99',
            category: 'Desserts',
            image: 'https://via.placeholder.com/300x200/1f2937/ffffff?text=Lava+Cake'
        },
        {
            name: 'Tomato Basil Soup',
            description: 'Creamy tomato soup with fresh basil and a touch of cream',
            price: '7.50',
            category: 'Soups',
            image: 'https://via.placeholder.com/300x200/1f2937/ffffff?text=Tomato+Soup'
        },
        {
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon with lemon herb seasoning and roasted vegetables',
            price: '22.95',
            category: 'Seafood',
            image: 'https://via.placeholder.com/300x200/1f2937/ffffff?text=Grilled+Salmon'
        }
    ]);

    const [newFood, setNewFood] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: ''
    });

    // Generate unique ID for local operations
    const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

    // Memoized event handlers
    const handleNewFoodChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewFood(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSelectedFoodChange = useCallback((e) => {
        const { name, value } = e.target;
        setSelectedFood(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Modal handlers
    const handleCloseAddModal = useCallback(() => {
        setNewFood({
            name: '',
            description: '',
            price: '',
            category: '',
            image: ''
        });
        setShowAddModal(false);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setSelectedFood(null);
        setShowEditModal(false);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setShowViewModal(false);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
    }, []);

    // Action handlers
    const handleViewFood = useCallback((food) => {
        setSelectedFood(food);
        setShowViewModal(true);
    }, []);

    const handleEditFoodOpen = useCallback((food) => {
        setSelectedFood(food);
        setShowEditModal(true);
    }, []);

    const handleDeleteFoodOpen = useCallback((food) => {
        setSelectedFood(food);
        setShowDeleteModal(true);
    }, []);

    const handleAddFood = useCallback(async () => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', newFood.name);
            data.append('description', newFood.description);
            data.append('price', newFood.price);
            data.append('category', newFood.category);
            data.append('image', newFood.image);

            
            const response = await AdminAPi.createFood(data);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            toast.success('Food item added successfully');

            // Add temporary ID for local operations
            const food = {
                ...newFood,
                _tempId: generateId() // Temporary ID for frontend operations
            };

            setFoodsData(prev => [...prev, food]);
            setNewFood({
                name: '',
                description: '',
                price: '',
                category: '',
                image: ''
            });
            setShowAddModal(false);
        } catch (error) {
            toast.error('Failed to add food item');
            console.error('Error adding food:', error);
        } finally {
            setLoading(false);
        }
    }, [newFood]);

    const handleEditFood = useCallback(async () => {
        setLoading(true);
        try {
            const response = await AdminAPi.updateFood(selectedFood);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            setFoodsData(prev => prev.map(food =>
                (food._tempId === selectedFood._tempId || food.name === selectedFood.name) ? selectedFood : food
            ));
            setShowEditModal(false);
            setSelectedFood(null);
            toast.success('Food item updated successfully');
        } catch (error) {
            toast.error('Failed to update food item');
            console.error('Error updating food:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedFood]);

    const handleDeleteFood = useCallback(async () => {
        setLoading(true);
        try {
            const response = await AdminAPi.deleteFood(selectedFood._tempId || selectedFood.name);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            setFoodsData(prev => prev.filter(food =>
                food._tempId !== selectedFood._tempId && food.name !== selectedFood.name
            ));
            setShowDeleteModal(false);
            setSelectedFood(null);
            toast.success('Food item deleted successfully');
        } catch (error) {
            toast.error('Failed to delete food item');
            console.error('Error deleting food:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedFood]);

    // Column helper for TanStack Table - memoized
    const columnHelper = useMemo(() => createColumnHelper(), []);

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Food Item</span>
                    <ArrowUpDown size={14} />
                </button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {row.original.image ? (
                            <img
                                src={row.original.image}
                                alt={row.original.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                        ) : null}
                        <ChefHat className="w-6 h-6 text-white" style={{ display: row.original.image ? 'none' : 'block' }} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-medium truncate">{row.original.name}</p>
                        <p className="text-gray-400 text-sm truncate">{row.original.category}</p>
                    </div>
                </div>
            )
        }),
        columnHelper.accessor('price', {
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Price</span>
                    <ArrowUpDown size={14} />
                </button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <DollarSign size={14} className="text-green-400" />
                    <span className="text-green-400 font-medium">${parseFloat(row.original.price || 0).toFixed(2)}</span>
                </div>
            )
        }),
        columnHelper.accessor('category', {
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Category</span>
                    <ArrowUpDown size={14} />
                </button>
            ),
            cell: ({ row }) => (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 whitespace-nowrap">
                    <Tag size={12} />
                    <span>{row.original.category}</span>
                </span>
            )
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <ActionDropdown
                    food={row.original}
                    onView={handleViewFood}
                    onEdit={handleEditFoodOpen}
                    onDelete={handleDeleteFoodOpen}
                />
            )
        })
    ], [columnHelper, handleViewFood, handleEditFoodOpen, handleDeleteFoodOpen]);

    const table = useReactTable({
        data: foodsData,
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
                pageSize: 8,
            },
        },
    });

    // Computed values - memoized
    const totalItems = useMemo(() => foodsData.length, [foodsData]);
    const averagePrice = useMemo(() => {
        if (foodsData.length === 0) return 0;
        const sum = foodsData.reduce((sum, food) => sum + parseFloat(food.price || 0), 0);
        return (sum / foodsData.length).toFixed(2);
    }, [foodsData]);

    const categoryCounts = useMemo(() => {
        const counts = {};
        foodsData.forEach(food => {
            counts[food.category] = (counts[food.category] || 0) + 1;
        });
        return Object.keys(counts).length;
    }, [foodsData]);

    // Button click handlers
    const handleShowAddModal = useCallback(() => setShowAddModal(true), []);



    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Food Management</h1>
                        <p className="text-gray-400">Manage your restaurant menu items</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleShowAddModal}
                            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus size={16} />
                            <span>Add Food Item</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-orange-500/20 rounded-lg">
                                <Utensils className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalItems}</p>
                                <p className="text-gray-400 text-sm">Total Items</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Tag className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{categoryCounts}</p>
                                <p className="text-gray-400 text-sm">Categories</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">${averagePrice}</p>
                                <p className="text-gray-400 text-sm">Avg Price</p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                                <ChefHat className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{categories.length}</p>
                                <p className="text-gray-400 text-sm">Menu Types</p>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Search and Filters */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search food items..."
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10 pr-4 py-3 w-full bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white transition-colors">
                                <Download size={16} />
                                <span>Export Menu</span>
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
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                            </div>
                        )}

                        {!loading && table.getRowModel().rows.length === 0 && (
                            <div className="text-center py-12">
                                <ChefHat className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No food items found</p>
                                <p className="text-gray-500 text-sm">Try adjusting your search or add new items</p>
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

                {/* Add Food Modal */}
                <Modal isOpen={showAddModal} onClose={handleCloseAddModal} title="Add New Food Item" size="lg">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>Food Name</label>
                                <input
                                    name='name'
                                    type="text"
                                    value={newFood.name}
                                    onChange={handleNewFoodChange}
                                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400'
                                    placeholder='Food Name'
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                <input
                                    name='category'
                                    type="text"
                                    // step="0.01"
                                    value={newFood.category}
                                    onChange={handleNewFoodChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    placeholder="eg. Burger"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Price (Ksh)</label>
                                <input
                                    name='price'
                                    type="number"
                                    step="0.01"
                                    value={newFood.price}
                                    onChange={handleNewFoodChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Food Picture</label>
                                <input
                                    name='image'
                                    type="file"
                                    // value={newFood.image}
                                    onChange={(e) => setNewFood({ ...newFood, image: e.target.files[0] })}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                // placeholder="https://example.com/food-image.jpg"
                                />
                            </div>
                        </div>
                        {/* description input  */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                name='description'
                                value={newFood.description}
                                onChange={handleNewFoodChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                placeholder="Description"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-600">
                            <button
                                onClick={handleCloseAddModal}
                                className="px-6 py-2 text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddFood}
                                disabled={!newFood.name || !newFood.category || !newFood.price || loading}
                                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Save size={16} />
                                )}
                                <span>{loading ? 'Adding...' : 'Add Food Item'}</span>
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* View Food Modal */}
                <Modal isOpen={showViewModal} onClose={handleCloseViewModal} title="Food Item Details" size="lg">
                    {selectedFood && (
                        <div className="space-y-6">
                            <div className="flex items-start space-x-6">
                                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {selectedFood.image ? (
                                        <img
                                            src={selectedFood.image}
                                            alt={selectedFood.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    <ChefHat className="w-16 h-16 text-white" style={{ display: selectedFood.image ? 'none' : 'block' }} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-2">{selectedFood.name}</h3>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                            <Tag size={14} />
                                            <span>{selectedFood.category}</span>
                                        </span>
                                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                            <DollarSign size={14} />
                                            <span>${parseFloat(selectedFood.price || 0).toFixed(2)}</span>
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{selectedFood.description}</p>
                                </div>
                            </div>

                            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                <h4 className="text-white font-medium mb-3">Food Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-gray-400 text-sm">Name:</span>
                                        <p className="text-white font-medium">{selectedFood.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Category:</span>
                                        <p className="text-white font-medium">{selectedFood.category}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Price:</span>
                                        <p className="text-white font-medium">${parseFloat(selectedFood.price || 0).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Has Image:</span>
                                        <p className="text-white font-medium">{selectedFood.image ? 'Yes' : 'No'}</p>
                                    </div>
                                </div>
                                {selectedFood.description && (
                                    <div className="mt-4">
                                        <span className="text-gray-400 text-sm">Description:</span>
                                        <p className="text-white font-medium mt-1">{selectedFood.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Edit Food Modal */}
                <Modal isOpen={showEditModal} onClose={handleCloseEditModal} title="Edit Food Item" size="lg">
                    {selectedFood && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Food Name</label>
                                    <input
                                        name='name'
                                        type="text"
                                        value={selectedFood.name}
                                        onChange={handleSelectedFoodChange}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <input
                                        name='category'
                                        type="text"
                                        value={selectedFood.category}
                                        onChange={handleSelectedFoodChange}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    />

                                </div>
                            </div>



                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                                    <input
                                        name='price'
                                        type="number"
                                        step="0.01"
                                        value={selectedFood.price}
                                        onChange={handleSelectedFoodChange}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                    <input
                                        name='image'
                                        type="url"
                                        value={selectedFood.image}
                                        onChange={handleSelectedFoodChange}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    name='description'
                                    value={selectedFood.description}
                                    onChange={handleSelectedFoodChange}
                                    rows={3}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-600">
                                <button
                                    onClick={handleCloseEditModal}
                                    className="px-6 py-2 text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditFood}
                                    className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal isOpen={showDeleteModal} onClose={handleCloseDeleteModal} title="Delete Food Item" size="sm">
                    {selectedFood && (
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-red-500/20 rounded-full flex-shrink-0">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg mb-2">Are you sure?</h3>
                                    <p className="text-gray-400 text-sm">This action cannot be undone. This will permanently delete the food item from your menu.</p>
                                </div>
                            </div>

                            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {selectedFood.image ? (
                                            <img
                                                src={selectedFood.image}
                                                alt={selectedFood.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : null}
                                        <ChefHat className="w-6 h-6 text-white" style={{ display: selectedFood.image ? 'none' : 'block' }} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-white font-medium">{selectedFood.name}</p>
                                        <p className="text-gray-400 text-sm truncate">{selectedFood.category} • ${parseFloat(selectedFood.price || 0).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-600">
                                <button
                                    onClick={handleCloseDeleteModal}
                                    className="px-6 py-2 text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteFood}
                                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    <span>{loading ? 'Deleting...' : 'Delete Food Item'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default FoodManagementPage;