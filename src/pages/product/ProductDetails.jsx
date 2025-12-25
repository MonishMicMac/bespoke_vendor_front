import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductDetails } from '../../services/vendorService';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // API Base URL for relative images
    const ASSET_BASE_URL = 'http://3.7.112.78/bespoke/public';

    const getFullImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${ASSET_BASE_URL}${cleanPath}`;
    };

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const response = await getProductDetails(id);
            const productData = response.data || response;

            if (productData && productData.product_name) {
                setProduct(productData);
            } else {
                toast.error("Invalid product data received");
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Product not found</h2>
                <Link to="/products" className="text-rose-500 hover:underline">Back to Products</Link>
            </div>
        );
    }

    // --- DERIVED DATA Helpers ---
    // --- IMAGE HANDLING ---
    const mainImgUrl = getFullImageUrl(product.main_image);

    // Combine all other images sources
    const rawOtherImages = [
        ...(product.all_images || []),
        ...(product.images?.map(img => img.image_url) || [])
    ];

    // Deduplicate and Remove Main Image from Gallery
    const uniqueGallery = rawOtherImages
        .map(getFullImageUrl)
        .filter(url => url && url !== mainImgUrl) // Remove main image
        .filter((url, index, self) => self.indexOf(url) === index); // Remove duplicates

    // Flatten Pricing Data for Table: [ { materialName, materialImg, size, actualPrice, discountPrice } ]
    const pricingRows = [];
    if (product.product_materials) {
        product.product_materials.forEach(mat => {
            if (mat.prices) {
                mat.prices.forEach(price => {
                    pricingRows.push({
                        materialName: mat.materail_name,
                        materialImg: getFullImageUrl(mat.img_path),
                        size: price.size,
                        actualPrice: price.actual_price,
                        discountPrice: price.discount_price
                    });
                });
            }
        });
    }

    // Group Measurements by Size: { "XS": [ { name, value } ], ... }
    const measurementsBySize = {};
    if (product.product_sizes) {
        product.product_sizes.forEach(m => {
            if (!measurementsBySize[m.size]) measurementsBySize[m.size] = [];
            measurementsBySize[m.size].push({
                name: m.measurment_name || m.measurement?.name,
                value: m.details_value
            });
        });
    }


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12 font-sans text-slate-800 dark:text-slate-200">
            {/* 1. HEADER */}
            <header className="bg-white dark:bg-slate-800 shadow-sm sticky  z-50 border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <Link to="/products" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors mt-1">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </Link>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{product.product_name}</h1>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 font-mono">ID: {product.id}</span>
                                    <span>•</span>
                                    <span>{product.vendor?.shop_name}</span>
                                    <span>•</span>
                                    <span className="capitalize">{product.category?.name} / {product.subcategory?.name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wide border ${product.is_customizable === 1 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-700' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                {product.is_customizable === 1 ? 'Customizable' : 'Standard'}
                            </span>
                            <Link
                                to={`/product/edit/${product.id}`}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-sm"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* TOP ROW: Details (Left 2/3) & Images (Right 1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT: Product Details Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 h-full">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase mb-6 tracking-wide">Product Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Gender</p>
                                    <div className="flex items-center gap-1 font-medium text-slate-900 dark:text-white capitalize">
                                        <span className="material-symbols-outlined text-base">wc</span>
                                        {product.gender}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Product Type</p>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {product.product_type == "0" ? 'Ready Made' : 'Custom'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Alteration</p>
                                    <div className="font-medium">
                                        {product.is_alter == "1" ? (
                                            <div className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
                                                <span className="material-symbols-outlined text-base">check</span>
                                                Yes (₹{product.alter_charge})
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">No</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Rating</p>
                                    <div className="flex items-center gap-1 font-medium text-amber-500">
                                        <span className="material-symbols-outlined text-base">star_border</span>
                                        {product.rating || 'N/A'}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Description</p>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md text-slate-700 dark:text-slate-300 leading-relaxed text-sm border border-slate-100 dark:border-slate-700/50">
                                    {product.description || "No description available."}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Images Section */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
                            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Main Image</h2>
                            <div className="aspect-[3/4] w-full rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                                <img
                                    src={mainImgUrl}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Main Product"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {uniqueGallery.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
                                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Gallery ({uniqueGallery.length})</h2>
                                <div className="grid grid-cols-3 gap-2">
                                    {uniqueGallery.map((img, i) => (
                                        <div key={i} className="aspect-square rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-purple-600 cursor-pointer transition-colors group relative">
                                            <img src={img} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={`Gallery ${i}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MIDDLE ROW: PRICING & VARIANTS (Full Width) */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Pricing & Variants</h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{product.product_sizes?.length || 0} Sizes Available</span>
                    </div>

                    <div className="p-6">
                        {/* Group by Material */}
                        {product.product_materials?.map((mat, mIdx) => (
                            <div key={mIdx} className="mb-0">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-600 shadow-sm border border-slate-100 dark:border-slate-600">
                                        <img src={getFullImageUrl(mat.img_path)} className="w-full h-full object-cover" alt={mat.materail_name} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{mat.materail_name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Primary Material</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {mat.prices?.map((price, pIdx) => {
                                        const discountNum = parseFloat(price.actual_price) - parseFloat(price.discount_price);
                                        const discountPerc = Math.round((discountNum / price.actual_price) * 100);

                                        return (
                                            <div key={pIdx} className="group relative flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-purple-500/50 cursor-pointer transition-all duration-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-100 dark:border-slate-600 group-hover:text-purple-600 transition-colors text-sm">
                                                        {price.size}
                                                    </span>
                                                    {discountPerc > 0 && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                                            {discountPerc}% OFF
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-medium text-slate-400 line-through">₹{parseFloat(price.actual_price).toFixed(2)}</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹{parseFloat(price.discount_price).toFixed(2)}</p>
                                                </div>
                                                <div className="absolute inset-0 border-2 border-purple-500 rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none"></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM ROW: MEASUREMENTS & GUIDES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* MEASUREMENTS TABLE */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-fit">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Measurements</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                                    <tr>
                                        <th className="px-6 py-3 w-20">Size</th>
                                        <th className="px-6 py-3">Point</th>
                                        <th className="px-6 py-3 text-right">Value (IN)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {Object.entries(measurementsBySize).map(([size, measures]) => (
                                        measures.map((m, mIdx) => (
                                            <tr key={`${size}-${mIdx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                                {mIdx === 0 && (
                                                    <td rowSpan={measures.length} className="px-6 py-4 align-top font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-700">
                                                        {size}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{m.name}</td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">{m.value}</td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* MEASUREMENT GUIDES */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-fit">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Measurement Guides</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                                {product.measurement_references?.map((ref, i) => (
                                    <div key={i} className="group relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[3/4]">
                                        <img src={getFullImageUrl(ref.image_url)} className="w-full h-full object-cover" alt={ref.measurment_name} />
                                        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm py-2 text-center">
                                            <span className="text-xs font-bold text-white uppercase tracking-wider">{ref.measurment_name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. REVIEWS TABLE */}
            {/* Only show if reviews exist to keep it clean */}
            {product.reviews && product.reviews.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Customer Reviews</h2>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Rating</th>
                                <th className="px-6 py-3">Comment</th>
                                <th className="px-6 py-3 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {product.reviews.map((rev, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-3 font-medium">{rev.username}</td>
                                    <td className="px-6 py-3 text-amber-500 font-bold">{rev.rating} ★</td>
                                    <td className="px-6 py-3 text-slate-600 truncate max-w-xs" title={rev.comments}>{rev.comments}</td>
                                    <td className="px-6 py-3 text-right text-slate-400 text-xs">{rev.review_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
