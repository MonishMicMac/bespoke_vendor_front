import { Bell, Search, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
            {/* Search */}
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full max-w-md focus-within:ring-2 focus-within:ring-pink-100 transition-all">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder:text-slate-400"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-slate-500 hover:text-slate-700">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-orange-400 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-pink-200">
                        JD
                    </div>
                    <div className="hidden sm:block text-left">
                        <div className="text-sm font-semibold text-slate-700">John Doe</div>
                        <div className="text-xs text-slate-500">Admin</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
