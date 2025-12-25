import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Settings,
    LogOut,
    Store,
    ChevronDown,
    ChevronRight,
    Package,
    BarChart3
} from 'lucide-react';
import Cookies from 'js-cookie';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [openSubmenus, setOpenSubmenus] = useState({});


    const vendorId = Cookies.get('vendor_id'); // Get ID for profile link


    const menuItems = [
        {
            path: `/vendors/${vendorId}`, // Link to profile
            label: 'My Profile',
            icon: Users
        },
        {
            path: '/orders',
            label: 'Orders',
            icon: ShoppingBag
        },
        {
            label: 'Products',
            icon: Package,
            submenu: [
                { path: '/products', label: 'All Products' },
                { path: '/product/add', label: 'Add New Product' },
                { path: '/categories', label: 'Categories' },
            ]
        },
        {
            path: '/analytics',
            label: 'Analytics',
            icon: BarChart3
        },
        {
            path: '/settings',
            label: 'Settings',
            icon: Settings
        },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    // Check if any child of a submenu is active to keep it open or highlight parent
    const isSubmenuActive = (item) => {
        return item.submenu?.some(sub => isActive(sub.path));
    };

    const toggleSubmenu = (label) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const handleLogout = () => {
        Cookies.remove('access_token');
        Cookies.remove('vendor_id');
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm transition-all duration-300">
            {/* Logo Area */}
            <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-pink-200">
                    <Store size={22} strokeWidth={2.5} />
                </div>
                <div>
                    <span className="text-xl font-extrabold text-slate-800 tracking-tight block leading-none">Bespoke</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-pink-500">Admin Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                <div className="px-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Overview
                </div>

                {menuItems.map((item, index) => {
                    const active = item.path ? isActive(item.path) : isSubmenuActive(item);
                    const isOpen = openSubmenus[item.label] || isSubmenuActive(item);

                    return (
                        <div key={index}>
                            {item.submenu ? (
                                // Submenu Parent
                                <div>
                                    <button
                                        onClick={() => toggleSubmenu(item.label)}
                                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                                            ? 'bg-pink-50/80 text-pink-600'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon
                                                size={20}
                                                className={`transition-colors duration-200 ${active ? 'text-pink-500 fill-pink-500/10' : 'text-slate-400 group-hover:text-pink-500'
                                                    }`}
                                                strokeWidth={2}
                                            />
                                            {item.label}
                                        </div>
                                        {isOpen ? (
                                            <ChevronDown size={16} className={active ? 'text-pink-500' : 'text-slate-400'} />
                                        ) : (
                                            <ChevronRight size={16} className="text-slate-400" />
                                        )}
                                    </button>

                                    {/* Submenu Items */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="pl-10 pr-2 space-y-1">
                                            {item.submenu.map((subItem) => (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors border-l-2 ${isActive(subItem.path)
                                                        ? 'border-pink-500 text-pink-600 bg-pink-50/50'
                                                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Single Menu Item
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-200'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon
                                        size={20}
                                        className={`transition-colors duration-200 ${active ? 'text-white' : 'text-slate-400 group-hover:text-pink-500'
                                            }`}
                                        strokeWidth={2}
                                    />
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom User Profile / Actions */}
            <div className="p-4 border-t border-gray-100">
                <div className="bg-slate-50 rounded-2xl p-3 mb-2 flex items-center gap-3 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-orange-400 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">John Doe</p>
                        <p className="text-xs text-slate-500 truncate">Administrator</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 w-full rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
