'use client'
import React, { useEffect, useState } from 'react';
import { Heart, Grid3X3, Plus, Minus, Percent, ShoppingCart, X, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import WaiterRoutes from '@/app/api/waiter/routes';

interface MenuItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    items: number;
}

interface CartItem extends MenuItem {
    quantity: number;
    extraSauce?: boolean;
}

interface Category {
    id: string;
    name: string;
    icon: string;
    isActive?: boolean;
}

const Home: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('burger');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showCart, setShowCart] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    // const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMenu = async () => {
        try {
            const response = await WaiterRoutes.getMenu();
            console.log("Fetched menu items:", response);
            setMenuItems(response.data);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
            toast.error('Failed to load menu');
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    // const categories: Category[] = [
    //     { id: 'burger', name: 'Burger', icon: '🍔', isActive: true },
    //     { id: 'noodles', name: 'Noodles', icon: '🍜' },
    //     { id: 'drinks', name: 'Drinks', icon: '🥤' },
    //     { id: 'desserts', name: 'Desserts', icon: '🍰' }
    // ];




    const filteredMenuItems = menuItems.filter(item => {
        if (!searchTerm.trim()) {
            return true; // Show all items when no search term
        }

        return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };


    const addToCart = (item: MenuItem) => {
        const existingItem = cart.find(cartItem => cartItem._id === item._id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem._id === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            setCart(cart.filter(item => item._id !== id));
        } else {
            setCart(cart.map(item =>
                item._id === id ? { ...item, quantity } : item
            ));
        }
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getServiceCharge = () => {
        return getTotal() * 0.1;
    };

    const getTax = () => {
        return getTotal() * 0.15;
    };

    const getGrandTotal = () => {
        return getTotal() + getServiceCharge() + getTax();
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-10 bg-indigo-900/90 backdrop-blur-sm border-b border-indigo-700/30 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-white text-xl font-bold">Menu</h1>
                    <button
                        onClick={() => setShowCart(!showCart)}
                        className="relative p-2 bg-indigo-600 rounded-lg text-white"
                    >
                        <ShoppingCart size={20} />
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                {getTotalItems()}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex h-full lg:h-screen">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
                    {/* Desktop Header Controls */}
                    <div className="hidden lg:flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-white text-lg font-semibold">Choose Items</h2>
                            <div className="flex items-center space-x-2">
                                <Heart className="text-white/60" size={20} />
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    <Grid3X3 size={20} />
                                </button>
                                {/* <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    <List size={20} />
                                </button> */}
                            </div>
                        </div>

                        {/* Order Type Buttons */}
                        <div className="flex space-x-3">
                            {/* Search bar with icons inside */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search food, category, or description..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="bg-indigo-800/50 border border-indigo-700/30 text-white rounded-lg px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-80"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" size={16} />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Order Type Buttons */}
                    <div className="lg:hidden mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search food..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="bg-indigo-800/50 border border-indigo-700/30 text-white rounded-lg px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" size={16} />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Tabs */}
                    {/* <div className="flex space-x-2 mb-4 lg:mb-6 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeCategory === category.id
                                    ? 'bg-yellow-400 text-gray-800'
                                    : 'bg-indigo-700/30 text-white hover:bg-indigo-600/40'
                                    }`}
                            >
                                <span className="text-lg">{category.icon}</span>
                                <span className="text-sm lg:text-base">{category.name}</span>
                            </button>
                        ))}
                    </div> */}

                    {/* Menu Grid */}
                    <div className="flex-1 overflow-y-auto">
                        <div className={`${viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4'
                            : 'space-y-3'
                            }`}>
                            {filteredMenuItems.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => addToCart(item)}
                                    className="bg-indigo-800/30 backdrop-blur-sm border border-indigo-700/30 rounded-xl overflow-hidden cursor-pointer hover:bg-indigo-700/40 transition-all active:scale-95"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-500 relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/80 to-red-500/80"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-orange-600/50 rounded-full flex items-center justify-center">
                                                <span className="text-2xl lg:text-3xl">🍔</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 lg:p-4">
                                        <h3 className="text-white font-semibold mb-2 text-sm lg:text-base">{item.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl lg:text-2xl font-bold text-white">Ksh{item.price}</span>
                                            {/* <span className="text-indigo-300 text-xs lg:text-sm">{item.items} Items</span> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Cart Sidebar */}
                <div className="hidden lg:flex w-96 bg-indigo-800/30 backdrop-blur-sm border-l border-indigo-700/30 flex-col">
                    <CartContent
                        cart={cart}
                        updateQuantity={updateQuantity}
                        getTotal={getTotal}
                        getServiceCharge={getServiceCharge}
                        getTax={getTax}
                        setCart={setCart}
                        // showCart={showCart}
                        getGrandTotal={getGrandTotal}
                    />
                </div>

                {/* Mobile Cart Modal */}
                {showCart && (
                    <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
                        <div className="absolute bottom-0 left-0 right-0 bg-indigo-900 rounded-t-2xl max-h-[80vh] flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-indigo-700/30">
                                <h3 className="text-white text-lg font-semibold">Current Order</h3>
                                <button
                                    onClick={() => setShowCart(false)}
                                    className="p-2 text-white hover:bg-indigo-700 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <CartContent
                                    cart={cart}
                                    updateQuantity={updateQuantity}
                                    getTotal={getTotal}
                                    getServiceCharge={getServiceCharge}
                                    getTax={getTax}
                                    setCart={setCart}
                                    setShowCart={setShowCart}
                                    getGrandTotal={getGrandTotal}
                                    isMobile={true}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Separate Cart Component for reusability
const CartContent: React.FC<{
    cart: CartItem[];
    updateQuantity: (id: string, quantity: number) => void;
    getTotal: () => number;
    getServiceCharge: () => number;
    getTax: () => number;
    getGrandTotal: () => number;
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    setShowCart?: React.Dispatch<React.SetStateAction<boolean>>;
    isMobile?: boolean;
}> = ({ cart, updateQuantity, getTotal, getServiceCharge, getTax, getGrandTotal, setShowCart, setCart, isMobile = false }) => {

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');


    // Add this function to format phone numbers
    const formatPhoneNumber = (phone: string) => {
        // Remove all non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');

        // Handle different formats
        if (cleanPhone.startsWith('254')) {
            // Already in correct format (254XXXXXXXXX)
            return cleanPhone;
        } else if (cleanPhone.startsWith('07') || cleanPhone.startsWith('01')) {
            // Convert 07XXXXXXXX or 01XXXXXXXX to 254XXXXXXXXX
            return '254' + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) {
            // Convert 7XXXXXXXX or 1XXXXXXXX to 254XXXXXXXXX
            return '254' + cleanPhone;
        }

        return cleanPhone;
    };

    // Add this function to validate phone number
    const isValidKenyanPhone = (phone: string) => {
        const formatted = formatPhoneNumber(phone);
        // Kenyan numbers: 254 + (7XX, 1XX) + 6 more digits = 12 digits total
        return /^254[71]\d{8}$/.test(formatted);
    };

    // Update the phone number input handler
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhoneNumber(value);

        // Optional: Auto-format as user types
        if (value) {
            const formatted = formatPhoneNumber(value);
            if (formatted !== value && formatted.length <= 12) {
                setPhoneNumber(formatted);
            }
        }
    };


    const handleMakeOrder = async () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        // Validate payment method
        if (!paymentMethod) {
            toast.error("Please select a payment method!");
            return;
        }

        // Validate phone number for M-Pesa
        if (paymentMethod === 'mpesa' && !isValidKenyanPhone(phoneNumber)) {
            toast.error("Please enter a valid phone number for M-Pesa payment!");
            return;
        }

        setLoading(true);

        try {
            let response;

            if (paymentMethod === 'mpesa') {
                const mpesaOrderData = {
                    items: cart.map(item => ({
                        foodId: item._id,
                        qty: item.quantity
                    })),
                    paymentMethod: "mpesa" as const,
                    customerPhone: formatPhoneNumber(phoneNumber)
                };

                response = await WaiterRoutes.makeOrderMpesa(mpesaOrderData);
                toast.success("M-Pesa payment request sent! Please check your phone.");

            } else if (paymentMethod === 'cash') {
                const cashOrderData = {
                    items: cart.map(item => ({
                        foodId: item._id,
                        qty: item.quantity
                    })),
                    paymentMethod: "cash" as const
                };

                response = await WaiterRoutes.makeOrderCash(cashOrderData);
                toast.success("Cash order placed successfully! Please pay at the counter.");
            }

            console.log("Order response:", response);
            console.log("Order placed with items:", cart);

            // Clear cart and close cart view
            setCart([]);
            // setShowCart(false);

            // Reset payment form
            setPaymentMethod('');
            setPhoneNumber('');

        } catch (error: any) {
            console.error("Order failed:", error);

            // Handle API error responses
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Order failed. Please try again.";

            toast.error(errorMessage);

        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {/* Cart Header - Desktop only */}
            {!isMobile && (
                <div className="p-6 border-b border-indigo-700/30">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white text-lg font-semibold">Current Order</h3>
                        <div className="flex space-x-2">
                            <button className="p-2 bg-indigo-600/50 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                                <Percent size={16} />
                            </button>
                            <button className="p-2 bg-indigo-600/50 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Items */}
            <div className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 lg:space-y-4 ${isMobile ? 'max-h-60' : ''}`}>
                {cart.map((item) => (
                    <div key={item._id} className="bg-indigo-700/30 rounded-xl p-3 lg:p-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                                <span className="text-lg lg:text-xl">🍔</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium text-sm lg:text-base truncate">{item.name}</h4>
                                {item.extraSauce && (
                                    <p className="text-indigo-300 text-xs lg:text-sm">Extra Sauce...</p>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-white font-bold text-sm lg:text-base">Ksh{item.price}</span>
                                    <div className="flex items-center space-x-2 bg-indigo-600/50 rounded-lg">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(item._id, item.quantity - 1);
                                            }}
                                            className="p-1 text-white hover:bg-indigo-500 rounded active:scale-95"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-white px-2 text-sm lg:text-base">{item.quantity}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(item._id, item.quantity + 1);
                                            }}
                                            className="p-1 text-white hover:bg-indigo-500 rounded active:scale-95"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Summary */}
            <div className="p-4 lg:p-6 border-t border-indigo-700/30">
                <div className="space-y-2 lg:space-y-3 mb-4">
                    <div className="flex justify-between text-white text-sm lg:text-base">
                        <span>Total</span>
                        <span>Ksh{getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-indigo-300 text-sm lg:text-base">
                        <span>Discount</span>
                        <span>-</span>
                    </div>
                    <div className="flex justify-between text-indigo-300 text-sm lg:text-base">
                        <span>Service Charge</span>
                        <span>Ksh{getServiceCharge().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-indigo-300 text-sm lg:text-base">
                        <span>Tax</span>
                        <span>Ksh{getTax().toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-indigo-700/50"></div>
                    <div className="flex justify-between text-white font-bold text-lg">
                        <span>Grand Total</span>
                        <span>Ksh{getGrandTotal().toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">
                        Payment Method
                    </label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-indigo-800/50 border border-indigo-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    >
                        <option value="">Select payment method</option>
                        <option value="mpesa">M-Pesa</option>
                        <option value="cash">Cash</option>
                    </select>

                    {/* M-Pesa Phone Number Input */}
                    {paymentMethod === 'mpesa' && (
                        <div className="mt-3">
                            <label className="block text-white text-sm font-medium mb-2">
                                M-Pesa Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder="Customer's phone number"
                                className={`w-full bg-indigo-800/50 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-indigo-300 ${phoneNumber && !isValidKenyanPhone(phoneNumber)
                                    ? 'border-red-500 text-red-300'
                                    : 'border-indigo-600 text-white'
                                    }`}
                            />
                            <div className="mt-1">
                                <p className="text-indigo-300 text-xs">
                                    Accepted formats: 254712345678, 0712345678, 712345678
                                </p>
                                {phoneNumber && !isValidKenyanPhone(phoneNumber) && (
                                    <p className="text-red-400 text-xs mt-1">
                                        Please enter a valid Kenyan phone number
                                    </p>
                                )}
                                {phoneNumber && isValidKenyanPhone(phoneNumber) && (
                                    <p className="text-green-400 text-xs mt-1">
                                        ✓ STK Push Will be sent to: {formatPhoneNumber(phoneNumber)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex space-x-3">
                    {/* <button className="flex-1 bg-yellow-400 text-gray-800 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors active:scale-95 text-sm lg:text-base">
                        Save
                    </button> */}
                    {
                        loading ? (
                            <button className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-lg opacity-50 cursor-not-allowed">
                                Processing...
                            </button>
                        ) : (
                            <button
                                onClick={handleMakeOrder}
                                disabled={!paymentMethod}
                                className={`flex-1 font-semibold py-3 rounded-lg transition-colors active:scale-95 text-sm lg:text-base ${!paymentMethod
                                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                Order Now
                            </button>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default Home;