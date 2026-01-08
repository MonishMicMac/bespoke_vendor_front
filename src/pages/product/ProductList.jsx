import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getProducts } from '../../services/vendorService';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const navigate = useNavigate();

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiBase = import.meta.env.VITE_API;
                const response = await axios.get(`${apiBase}/api/category/view`);
                if (response.data && response.data.categories) {
                    setCategories(response.data.categories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Update subcategories when category changes
    useEffect(() => {
        if (selectedCategory) {
            const cat = categories.find(c => c.id == selectedCategory);
            setFilteredSubCategories(cat?.subcategories || []);
        } else {
            setFilteredSubCategories([]);
        }
        setSelectedSubCategory(''); // Reset subcategory when category changes
    }, [selectedCategory, categories]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchProducts = async (page, search = '', categoryId = '', subCategoryId = '') => {
        setLoading(true);
        try {
            const response = await getProducts(page, 20, search, categoryId, subCategoryId);
            if (response.status) {
                setProducts(response.data.data);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
            } else {
                toast.error(response.message || 'Failed to load products');
            }
        } catch (error) {
            toast.error('Error loading products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, debouncedSearch, selectedCategory, selectedSubCategory);
    }, [currentPage, debouncedSearch, selectedCategory, selectedSubCategory]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price).toFixed(2);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">

            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 mb-6">
                <div className="container mx-auto max-w-7xl flex flex-col xl:flex-row items-center justify-between gap-4">
                    <div className="w-full xl:w-auto">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your product catalog</p>
                    </div>

                    <div className="flex flex-col lg:flex-row flex-1 items-center gap-3 w-full max-w-4xl">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-transparent focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white transition-all outline-none h-11"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="w-full lg:w-48">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-transparent focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white outline-none transition-all h-11 appearance-none cursor-pointer"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0\' stroke=\'%23a1a1aa\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Subcategory Filter */}
                        <div className="w-full lg:w-48">
                            <select
                                value={selectedSubCategory}
                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                                disabled={!selectedCategory}
                                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-transparent focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white outline-none transition-all h-11 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0\' stroke=\'%23a1a1aa\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
                            >
                                <option value="">All Subcategories</option>
                                {filteredSubCategories.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Link
                        to="/product/add"
                        className="w-full xl:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition shadow-lg shadow-rose-500/30 whitespace-nowrap h-11"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-6">

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        className="group w-full bg-white dark:bg-slate-800 rounded-[2rem] p-3 shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-700 transition-all duration-500 ease-out relative cursor-pointer"
                                    >
                                        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 shadow-inner">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.product_name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>

                                            {/* Discount Badge */}
                                            {product.discount_percent > 0 && (
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/95 text-rose-500 text-xs font-bold shadow-lg backdrop-blur-md transform transition-transform group-hover:-translate-y-1">
                                                        <span className="material-symbols-outlined text-[16px] leading-none">local_offer</span>
                                                        {product.discount_percent}% OFF
                                                    </span>
                                                </div>
                                            )}

                                            {/* Edit Button */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/product/edit/${product.id}`);
                                                    }}
                                                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md border border-white/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                            </div>

                                            {/* Customizable Badge */}
                                            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                                                {product.is_customizable === 1 && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide uppercase">
                                                        <span className="material-symbols-outlined text-[14px] leading-none text-rose-400">palette</span>
                                                        Customizable
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-5 px-2 pb-2">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1 pr-2">
                                                    <div className="flex items-center gap-1 mb-1.5">
                                                        <span className="material-symbols-outlined text-[14px] text-slate-400">storefront</span>
                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{product.vendor_name}</p>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-rose-500 transition-colors line-clamp-1">
                                                        {product.product_name}
                                                    </h3>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="flex flex-col items-end">
                                                    <span className={`flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm ${product.is_active == "1" ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                        <span className="relative flex h-2 w-2">
                                                            {product.is_active == "1" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>}
                                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${product.is_active == "1" ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                        </span>
                                                        {product.is_active == "1" ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Pricing Section */}
                                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-between group-hover:border-rose-500/20 transition-colors duration-300">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Listing Price</span>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">₹{formatPrice(product.discount_price)}</span>
                                                        {parseFloat(product.discount_price) < parseFloat(product.actual_price) && (
                                                            <span className="text-sm text-slate-400 line-through decoration-slate-400/50">₹{formatPrice(product.actual_price)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:text-rose-500 transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-24 text-center">
                                    <div className="mb-4">
                                        <span className="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No products found</h3>
                                    <p className="text-slate-500">Try adjusting your search or add a new product.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {products.length > 0 && (
                            <div className="flex justify-center items-center gap-2 pb-12">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>

                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        // Show first, last, current, and pages around current
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition ${currentPage === pageNum
                                                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === currentPage - 2 ||
                                            pageNum === currentPage + 2
                                        ) {
                                            return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductList;
