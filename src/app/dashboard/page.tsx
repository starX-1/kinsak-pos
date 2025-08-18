'use client'
import React, { useState } from 'react';
import { Heart, Grid3X3, List, Plus, Minus, Percent, ShoppingCart, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    image: string;
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

    const categories: Category[] = [
        { id: 'burger', name: 'Burger', icon: '🍔', isActive: true },
        { id: 'noodles', name: 'Noodles', icon: '🍜' },
        { id: 'drinks', name: 'Drinks', icon: '🥤' },
        { id: 'desserts', name: 'Desserts', icon: '🍰' }
    ];

    const menuItems: MenuItem[] = [
        {
            id: '1',
            name: 'Original Burger',
            price: 59,
            image: '/api/placeholder/200/150',
            category: 'burger',
            items: 11
        },
        {
            id: '2',
            name: 'Cheese Burger',
            price: 65,
            image: '/api/placeholder/200/150',
            category: 'burger',
            items: 8
        },
        {
            id: '3',
            name: 'Spicy Burger',
            price: 72,
            image: '/api/placeholder/200/150',
            category: 'burger',
            items: 15
        },
        {
            id: '4',
            name: 'Double Burger',
            price: 89,
            image: '/api/placeholder/200/150',
            category: 'burger',
            items: 6
        },
        {
            id: '5',
            name: 'Veggie Burger',
            price: 55,
            image: '/api/placeholder/200/150',
            category: 'burger',
            items: 12
        },
        {
            id: '6',
            name: 'BBQ Burger',
            price: 78,
            image: '/api/placeholder/200/150',
            category: 'burger',
            items: 9
        },
        {
            id: '7',
            name: 'Chicken Burger',
            price: 69,
            image: '/api/placeholder/200/150',
            category: 'burger',
            items: 14
        },
        {
            id: '8',
            name: 'Fish Burger',
            price: 75,
            image: '/api/placeholder/200/150',
            category: 'burger',
            items: 7
        }
    ];

    const addToCart = (item: MenuItem) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            setCart(cart.filter(item => item.id !== id));
        } else {
            setCart(cart.map(item =>
                item.id === id ? { ...item, quantity } : item
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
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Order Type Buttons */}
                        <div className="flex space-x-3">
                            <button className="px-4 py-2 bg-yellow-400 text-gray-800 font-semibold rounded-lg">
                                Dine In
                            </button>
                            <button className="px-4 py-2 bg-indigo-600/50 text-white rounded-lg border border-indigo-500">
                                Delivery
                            </button>
                            <button className="px-4 py-2 bg-indigo-600/50 text-white rounded-lg border border-indigo-500">
                                Take Away
                            </button>
                        </div>
                    </div>

                    {/* Mobile Order Type Buttons */}
                    <div className="lg:hidden flex space-x-2 mb-4 overflow-x-auto">
                        <button className="px-4 py-2 bg-yellow-400 text-gray-800 font-semibold rounded-lg whitespace-nowrap">
                            Dine In
                        </button>
                        <button className="px-4 py-2 bg-indigo-600/50 text-white rounded-lg border border-indigo-500 whitespace-nowrap">
                            Delivery
                        </button>
                        <button className="px-4 py-2 bg-indigo-600/50 text-white rounded-lg border border-indigo-500 whitespace-nowrap">
                            Take Away
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex space-x-2 mb-4 lg:mb-6 overflow-x-auto pb-2">
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
                    </div>

                    {/* Menu Grid */}
                    <div className="flex-1 overflow-y-auto">
                        <div className={`${viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4'
                            : 'space-y-3'
                            }`}>
                            {menuItems.map((item) => (
                                <div
                                    key={item.id}
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
                                            <span className="text-xl lg:text-2xl font-bold text-white">${item.price}</span>
                                            <span className="text-indigo-300 text-xs lg:text-sm">{item.items} Items</span>
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

    const handleMakeOrder = async () => {
        setLoading(true);
        // Here you would call your API to make the order
        if (cart.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }
        toast.success("Order placed successfully!");
        console.log("Order placed with items:", cart);
        setLoading(false);
        // empty the cart 
        setCart([]);
        if (setShowCart) setShowCart(false); // Close cart if in mobile view
        

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
                    <div key={item.id} className="bg-indigo-700/30 rounded-xl p-3 lg:p-4">
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
                                    <span className="text-white font-bold text-sm lg:text-base">${item.price}</span>
                                    <div className="flex items-center space-x-2 bg-indigo-600/50 rounded-lg">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(item.id, item.quantity - 1);
                                            }}
                                            className="p-1 text-white hover:bg-indigo-500 rounded active:scale-95"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-white px-2 text-sm lg:text-base">{item.quantity}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(item.id, item.quantity + 1);
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
                        <span>${getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-indigo-300 text-sm lg:text-base">
                        <span>Discount</span>
                        <span>-</span>
                    </div>
                    <div className="flex justify-between text-indigo-300 text-sm lg:text-base">
                        <span>Service Charge</span>
                        <span>${getServiceCharge().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-indigo-300 text-sm lg:text-base">
                        <span>Tax</span>
                        <span>${getTax().toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-indigo-700/50"></div>
                    <div className="flex justify-between text-white font-bold text-lg">
                        <span>Grand Total</span>
                        <span>${getGrandTotal().toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button className="flex-1 bg-yellow-400 text-gray-800 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors active:scale-95 text-sm lg:text-base">
                        Save
                    </button>
                    <button
                        onClick={handleMakeOrder}
                        className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors active:scale-95 text-sm lg:text-base">
                        Order Now
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;