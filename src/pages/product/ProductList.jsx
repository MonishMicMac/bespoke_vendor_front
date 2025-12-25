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
                                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition cursor-pointer group"
                                    >
                                        <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.product_name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                                                </div>
                                            )}

                                            {/* Badges */}
                                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                {product.is_customizable === 1 && (
                                                    <span className="px-2 py-1 bg-violet-600/90 text-white text-[10px] uppercase font-bold rounded backdrop-blur-sm">
                                                        Customizable
                                                    </span>
                                                )}
                                                {product.discount_percent > 0 && (
                                                    <span className="px-2 py-1 bg-red-500/90 text-white text-[10px] uppercase font-bold rounded backdrop-blur-sm">
                                                        {product.discount_percent}% OFF
                                                    </span>
                                                )}
                                            </div>

                                            {/* Edit Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/product/edit/${product.id}`);
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 rounded-full shadow-sm backdrop-blur-sm transition z-10"
                                                title="Edit Product"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                        </div>

                                        <div className="p-4">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{product.vendor_name}</div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 truncate" title={product.product_name}>
                                                {product.product_name}
                                            </h3>

                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-rose-500">
                                                    ₹{formatPrice(product.discount_price)}
                                                </span>
                                                {parseFloat(product.discount_price) < parseFloat(product.actual_price) && (
                                                    <span className="text-sm text-slate-400 line-through decoration-slate-400">
                                                        ₹{formatPrice(product.actual_price)}
                                                    </span>
                                                )}
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
