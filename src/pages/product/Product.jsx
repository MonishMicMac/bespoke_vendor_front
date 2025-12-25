import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import { getProductDetails, updateProduct } from '../../services/vendorService';

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // --- State Variables ---
    const [categories, setCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [gender, setGender] = useState('Female');
    const [isCustomizable, setIsCustomizable] = useState(1);
    const [isAlter, setIsAlter] = useState(0);
    const [alterCharge, setAlterCharge] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');

    // --- Image States ---
    const [mainImage, setMainImage] = useState(null); // File: New Upload
    const [existingMainImage, setExistingMainImage] = useState(null); // String: URL
    const [mainImagePreview, setMainImagePreview] = useState(null); // String: Blob or URL

    const mainImageInputRef = useRef(null);

    const [galleryImages, setGalleryImages] = useState([]); // Array of { file, preview } -> New Uploads
    const [existingGalleryImages, setExistingGalleryImages] = useState([]); // Array of { id, url }
    const [imagesToDelete, setImagesToDelete] = useState([]); // Array of IDs to delete
    const galleryInputRef = useRef(null);
    const fabricInputRef = useRef(null);

    // --- Complex Data States ---
    const [fabrics, setFabrics] = useState([]); // { name, image (url), file (optional) }
    const [isFabricModalOpen, setIsFabricModalOpen] = useState(false);
    const [newFabricName, setNewFabricName] = useState('');
    const [newFabricOneMeterPrice, setNewFabricOneMeterPrice] = useState('');
    const [newFabricImage, setNewFabricImage] = useState(null);
    const [newFabricImagePreview, setNewFabricImagePreview] = useState(null);

    const [attributes, setAttributes] = useState([]); // { key, value }
    const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
    const [newMetaKey, setNewMetaKey] = useState('');
    const [newMetaValue, setNewMetaValue] = useState('');

    // Measurement & Size State
    const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const [availableMeasurements, setAvailableMeasurements] = useState([]);
    const [selectedMeasurementIds, setSelectedMeasurementIds] = useState([]);
    const [measurementImages, setMeasurementImages] = useState({}); // Map ID -> { file, preview }
    const [existingMeasurementImages, setExistingMeasurementImages] = useState({}); // Map ID -> URL

    const [selectedSizes, setSelectedSizes] = useState([]);
    const [sizeNumbers, setSizeNumbers] = useState({}); // { 'XS': 32 }
    const [sizeMeasurements, setSizeMeasurements] = useState({}); // { 'S': { 'meas_1': 34 } }
    const [pricingData, setPricingData] = useState({}); // { 'Fabric_Size': { price, discount_price, stock } }

    const ASSET_BASE_URL = 'http://3.7.112.78/bespoke/public'; // Helper
    const getFullImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${ASSET_BASE_URL}${cleanPath}`;
    };

    // --- Load Initial Data ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const apiBase = import.meta.env.VITE_API;
                const [catRes, measureRes] = await Promise.all([
                    axios.get(`${apiBase}/api/category/view`),
                    axios.get(`${apiBase}/api/get/measurment`)
                ]);

                if (catRes.data && catRes.data.categories) {
                    setCategories(catRes.data.categories);

                }
                if (measureRes.data && measureRes.data.data) {
                    setAvailableMeasurements(measureRes.data.data);

                }

                // If Edit Mode, Fetch Product Details AFTER cats/measures are loaded
                if (isEditMode) {

                    fetchProductData(id, catRes.data.categories);
                }

            } catch (error) {
                console.error("Error fetching dependencies:", error);
            }
        };
        fetchInitialData();
    }, [id]);

    // --- Populate Form for Edit ---
    const fetchProductData = async (productId, availableCategories) => {

        const toastId = toast.loading('Loading product data...');
        try {
            const data = await getProductDetails(productId);


            // Check if it's wrapped in data.data or product key
            const p = data.product || data.data || data;


            if (!p || !p.product_name) {

            }

            setProductName(p.product_name || '');
            setProductDescription(p.description || '');


            // Normalize Gender (API "male" -> UI "Male")
            if (p.gender) {
                const normalizedGender = p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase();
                setGender(normalizedGender);

            }

            setIsCustomizable(Number(p.is_customizable) || 0);
            setIsAlter(Number(p.is_alter) || 0);
            setAlterCharge(p.alter_charge || '');

            // Categories (Handle nested objects from API)
            const catId = p.category_id || p.category?.id;
            const subCatId = p.sub_category_id || p.subcategory?.id;

            setSelectedCategory(catId);

            // Find subcats immediately for correct dropdown population
            if (catId && availableCategories && Array.isArray(availableCategories)) {
                const cat = availableCategories.find(c => c.id == catId);
                if (cat) {
                    setFilteredSubCategories(cat.subcategories || []);
                    setSelectedSubCategory(subCatId);
                } else {

                }
            }

            // Main Image
            if (p.main_image) {
                const url = getFullImageUrl(p.main_image);
                setExistingMainImage(url);
                setMainImagePreview(url);
            }

            // Gallery Handling
            const rawGallery = p.all_images || [];
            const structuredGallery = p.images || [];

            let galleryToUse = [];
            if (structuredGallery.length > 0) {
                // Use structured images if they have some form of identifier or just URL
                galleryToUse = structuredGallery.map((img, idx) => ({
                    id: img.id || img.image_url, // Fallback to URL if no ID
                    url: getFullImageUrl(img.image_url)
                }));
            } else {
                // Fallback to flat string array
                galleryToUse = rawGallery.map((url, idx) => ({
                    id: url,
                    url: getFullImageUrl(url)
                }));
            }

            // Filter out the main image from the gallery
            const mainImageUrl = getFullImageUrl(p.main_image);
            const filteredGallery = galleryToUse.filter(item => item.url !== mainImageUrl);

            // De-duplicate by URL
            const uniqueGallery = [];
            const seenUrls = new Set();
            filteredGallery.forEach(item => {
                if (!seenUrls.has(item.url)) {
                    seenUrls.add(item.url);
                    uniqueGallery.push(item);
                }
            });
            setExistingGalleryImages(uniqueGallery);


            // Fabrics & Pricing (API uses product_materials)
            const materials = p.product_materials || p.productMaterials || [];
            if (materials.length > 0) {
                const mappedFabrics = materials.map(m => ({
                    name: m.materail_name,
                    image: getFullImageUrl(m.img_path),
                    file: null
                }));
                setFabrics(mappedFabrics);

                const pricing = {};
                materials.forEach(mat => {
                    if (mat.prices) {
                        mat.prices.forEach(pr => {
                            const key = `${mat.materail_name}_${pr.size}`;
                            pricing[key] = {
                                price: pr.actual_price,
                                discount_price: pr.discount_price,
                                stock: pr.stock || 0
                            };
                        });
                    }
                });
                setPricingData(pricing);
            }

            // Measurements Selection & Guides (Use product_sizes)
            if (p.product_sizes) {
                const measIds = new Set();
                const sizesSet = new Set();
                const sMeasurements = {};

                p.product_sizes.forEach(ps => {
                    if (ps.measurement_id) measIds.add(Number(ps.measurement_id));
                    if (ps.size) {
                        sizesSet.add(ps.size);
                        if (!sMeasurements[ps.size]) sMeasurements[ps.size] = {};
                        sMeasurements[ps.size][`meas_${ps.measurement_id}`] = ps.details_value;
                    }
                });

                setSelectedMeasurementIds([...measIds]);
                setSelectedSizes([...sizesSet]);
                setSizeMeasurements(sMeasurements);
            }

            // Reference Images for Measurements
            if (p.measurement_references || p.measurementReferences) {
                const refs = p.measurement_references || p.measurementReferences;
                const mImages = {};
                refs.forEach(ref => {
                    if (ref.measurement_id && ref.image_url) {
                        mImages[ref.measurement_id] = {
                            preview: getFullImageUrl(ref.image_url),
                            file: null
                        };
                    }
                });
                setMeasurementImages(mImages);
            }

            // Size Numbers (if specifically provided or derive if possible)
            const sizeNums = p.product_size_numbers || p.size_numbers_json || [];
            if (sizeNums.length > 0) {
                const nums = {};
                const sizesFromMapping = [];
                sizeNums.forEach(sn => {
                    nums[sn.size] = sn.value;
                    sizesFromMapping.push(sn.size);
                });
                setSizeNumbers(nums);

                // Ensure these sizes are also in selectedSizes
                setSelectedSizes(prev => {
                    const combined = new Set([...prev, ...sizesFromMapping]);
                    return [...combined];
                });
            }

            // Attributes
            const attrData = p.attributes || p.product_info || [];
            if (attrData.length > 0) {
                setAttributes(attrData.map(a => ({
                    key: a.detail || a.info_key || '',
                    value: a.value || a.info_value || ''
                })));
            }

            toast.success('Data loaded', { id: toastId });
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to load product', { id: toastId });
        }
    };


    // --- HANDLERS ---
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const removeMainImage = (e) => {
        if (e) e.stopPropagation();
        setMainImage(null);
        setExistingMainImage(null); // Mark existing as removed purely for UI? 
        // Note: API spec says send empty file to keep existing, 
        // OR we might need a flag "delete_main_image" if user wants to remove it entirely.
        // For now, assuming user replaces or keeps.
        setMainImagePreview(null);
        if (mainImageInputRef.current) mainImageInputRef.current.value = '';
    };

    // Gallery
    const handleGalleryImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
            setGalleryImages(prev => [...prev, ...newImages]);
        }
        e.target.value = '';
    };

    const removeGalleryImage = (index, e) => {
        if (e) e.stopPropagation();
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingGalleryImage = (id, e) => {
        if (e) e.stopPropagation();
        setExistingGalleryImages(prev => prev.filter(img => img.id !== id));
        if (id) setImagesToDelete(prev => [...prev, id]);
    };

    // ... (Keep existing Fabric/Attribute/Measure handlers) ...
    // Fabric Handlers
    const handleFabricImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewFabricImage(file);
            setNewFabricImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddFabric = () => {
        if (!newFabricName) return;
        setFabrics([...fabrics, {
            name: newFabricName,
            oneMeterPrice: newFabricOneMeterPrice,
            image: newFabricImagePreview,
            file: newFabricImage
        }]);
        setIsFabricModalOpen(false);
        setNewFabricName(''); setNewFabricImage(null); setNewFabricImagePreview(null);
    };

    const handleAddAttribute = () => {
        if (!newMetaKey || !newMetaValue) return;
        setAttributes([...attributes, { key: newMetaKey, value: newMetaValue }]);
        setIsAttributeModalOpen(false);
        setNewMetaKey(''); setNewMetaValue('');
    };

    const toggleMeasurement = (id) => {
        setSelectedMeasurementIds(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]);
    };

    const handleMeasurementImageUpload = (e, id) => {
        const file = e.target.files[0];
        if (file) setMeasurementImages(prev => ({ ...prev, [id]: { file, preview: URL.createObjectURL(file) } }));
    };

    const removeMeasurementImage = (id) => {
        setMeasurementImages(prev => { const n = { ...prev }; delete n[id]; return n; });
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
    };

    const handleMeasurementChange = (size, measId, value) => {
        setSizeMeasurements(prev => ({
            ...prev,
            [size]: { ...prev[size], [`meas_${measId}`]: value }
        }));
    };

    const handlePricingChange = (fabricName, size, field, value) => {
        const key = `${fabricName}_${size}`;
        setPricingData(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    const handleSizeNumberChange = (size, value) => {
        setSizeNumbers(prev => ({ ...prev, [size]: value }));
    };


    const handleSubmit = async () => {
        const toastId = toast.loading(isEditMode ? 'Updating product...' : 'Publishing product...');

        try {
            const formData = new FormData();

            if (isEditMode) formData.append('product_id', id);

            // 1. Basic Information
            formData.append('name', productName);
            formData.append('description', productDescription);
            formData.append('category_id', selectedCategory);
            formData.append('sub_category_id', selectedSubCategory);
            formData.append('gender', gender);
            formData.append('is_customizable', isCustomizable);
            formData.append('is_alter', isAlter);
            formData.append('alter_charge', alterCharge || 0);

            // 2. Images
            if (mainImage) formData.append('main_image', mainImage);

            // New Gallery
            galleryImages.forEach((img, index) => {
                formData.append(`gallery_images[${index}]`, img.file);
            }); // Note: Backend key might need adjustment to `new_gallery_images` if you changed API logic, or keep typical `gallery_images` and handle append logic on server. Using `gallery_images` as it's standard unless spec changed.

            // Deleted Gallery
            imagesToDelete.forEach((delId, index) => {
                formData.append(`remove_gallery_ids[${index}]`, delId);
            });

            // 3. Materials
            const materialsData = fabrics.map(f => ({ name: f.name }));
            formData.append('materials_json', JSON.stringify(materialsData));

            fabrics.forEach((f, index) => {
                if (f.file) formData.append(`fabrics[${index}][image]`, f.file);
            });

            // 4. Pricing
            const pricingArray = Object.keys(pricingData).map(key => {
                const [fabricName, size] = key.split('_');
                return {
                    fabric: fabricName,
                    size: size,
                    price: pricingData[key].price,
                    discount_price: pricingData[key].discount_price || 0,
                    stock: pricingData[key].stock || 0
                };
            });
            formData.append('prices_json', JSON.stringify(pricingArray));

            // 5. Measurements & Sizes
            formData.append('measurements_json', JSON.stringify(selectedMeasurementIds));
            formData.append('product_size_json', JSON.stringify(sizeMeasurements));

            const sizeNumbersArray = selectedSizes.map(size => ({
                size: size,
                value: sizeNumbers[size] || 0
            }));


            formData.append('size_numbers_json', JSON.stringify(sizeNumbersArray));

            Object.keys(measurementImages).forEach(mid => {
                formData.append(`measurement_images[mid]`, measurementImages[mid].file);
            });

            // 6. Attributes
            const details = attributes.map(a => ({ detail: a.key, value: a.value }));
            formData.append('details_json', JSON.stringify(details));

            const apiCall = isEditMode ? updateProduct : axiosInstance.post;
            const url = isEditMode ? null : '/add/product/web'; // UpdateProduct handles its own URL

            const response = isEditMode
                ? await updateProduct(formData)
                : await axiosInstance.post('/add/product/web', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            if (response.status || response.data?.status) { // Handle varied response structures
                toast.success(isEditMode ? 'Product Updated!' : 'Product Created!', { id: toastId });
                if (!isEditMode) {
                    navigate('/products');
                }
            } else {
                toast.error(response.message || 'Operation failed', { id: toastId });
            }

        } catch (error) {
            console.error(error);
            toast.error('Server error', { id: toastId });
        }
    };

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        setSelectedCategory(catId);
        setSelectedSubCategory('');

        if (catId) {
            const category = categories.find(cat => cat.id == catId);
            setFilteredSubCategories(category?.subcategories || []);
        } else {
            setFilteredSubCategories([]);
        }
    };

    const isDarkMode = false; // Forced for now

    return (
        <div className="min-h-screen pb-24 transition-colors duration-200 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-display">
            <Toaster position="top-center" />

            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-xl">
                        <span className="material-symbols-outlined text-3xl">checkroom</span>
                        <span>Bespoke</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition">
                        Save Draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition"
                    >
                        <span className="material-symbols-outlined text-lg">rocket_launch</span>
                        Publish Product
                    </button>
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
                        <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCre2p4UtM_cN0keGkIDwyNIQFi4bjfk47FmbkPptbH0ftOAKZkuvhX58mP9idTKq3IR4xdH_K8OU_eW6zWs9wDbvF_axEJGyO1_wutWqF3LgeWtEowweWPTYFee4Murcbzz3R5BBMhkRO1fc40yT31IoQfAqAhJpb6V_1NelyWZu2H9DYDzGMCMd-IGnT4pbsYK_jbP8rV_V7fA7XrZiENcIluoUOYOu8LdzxcFqVXXuymihLpW-MzOk2ycX_PGf8Af7o9W_IDAg" />
                    </div>
                </div>
            </nav>

            <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create New Product</h1>
                    <p className="text-slate-500 dark:text-slate-400">Create and manage customizable clothing products with ease.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Basic Information */}
                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                    <span className="material-symbols-outlined">edit_note</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Core product details and categorization</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                                    <input
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400"
                                        placeholder="e.g. Premium Cotton T-Shirt"
                                        type="text"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all appearance-none"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sub-Category</label>
                                        <select
                                            value={selectedSubCategory}
                                            onChange={(e) => setSelectedSubCategory(e.target.value)}
                                            disabled={!selectedCategory}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Sub-Category</option>
                                            {filteredSubCategories.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                                    <div className="flex gap-3">
                                        {['Female', 'Male', 'Unisex'].map(g => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setGender(g)}
                                                className={`px-6 py-2 rounded-full text-sm font-medium transition ${gender === g ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                    <textarea
                                        value={productDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {/* 2. Product Images */}
                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                    <span className="material-symbols-outlined">image</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product Images</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">High-resolution shots</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Main Image */}
                                <div className="col-span-2 relative group">
                                    <input
                                        type="file"
                                        ref={mainImageInputRef}
                                        onChange={handleMainImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <div
                                        onClick={() => !mainImage && mainImageInputRef.current.click()}
                                        className={`w-full aspect-[4/3] rounded-lg border-2 border-dashed ${mainImage ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:border-rose-500 hover:bg-rose-500/5 cursor-pointer'} flex items-center justify-center overflow-hidden transition relative`}
                                    >
                                        {mainImagePreview ? (
                                            <>
                                                <img src={mainImagePreview} alt="Main" className="w-full h-full object-contain p-4" />
                                                <button
                                                    onClick={removeMainImage}
                                                    className="absolute top-2 right-2 p-1 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm border border-slate-200"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">cloud_upload</span>
                                                <span className="text-xs text-slate-500 font-medium">Upload Main Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Add More / Gallery */}
                                <div className="grid grid-cols-2 gap-4 md:flex md:flex-col">
                                    {/* Existing Gallery Images */}
                                    {existingGalleryImages.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden group">
                                            <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                                            <button
                                                onClick={(e) => removeExistingGalleryImage(img.id, e)}
                                                className="absolute top-1 right-1 p-0.5 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">close</span>
                                            </button>
                                            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5 opacity-0 group-hover:opacity-100 transition">
                                                Existing
                                            </div>
                                        </div>
                                    ))}

                                    {/* New Gallery Images */}
                                    {galleryImages.map((img, idx) => (
                                        <div key={`new-${idx}`} className="relative aspect-square rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                            <img src={img.preview} alt="Gallery" className="w-full h-full object-cover" />
                                            <button
                                                onClick={(e) => removeGalleryImage(idx, e)}
                                                className="absolute top-1 right-1 p-0.5 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">close</span>
                                            </button>
                                            <div className="absolute bottom-0 inset-x-0 bg-green-500/80 text-white text-[10px] text-center py-0.5">
                                                New
                                            </div>
                                        </div>
                                    ))}

                                    <input
                                        type="file"
                                        multiple
                                        ref={galleryInputRef}
                                        onChange={handleGalleryImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <div
                                        onClick={() => galleryInputRef.current.click()}
                                        className="w-full aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 dark:hover:border-rose-500 hover:bg-rose-500/5 transition"
                                    >
                                        <span className="material-symbols-outlined text-3xl text-slate-400 mb-1">add_photo_alternate</span>
                                        <span className="text-[10px] text-slate-500 font-medium">Add More</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Measurements & Sizes */}
                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            {/* ... Measurements UI Rewrite matching reference ... */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                    <span className="material-symbols-outlined">straighten</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Measurements & Sizes</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Select applicable measurements</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Select Required Measurements</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {availableMeasurements.map(meas => {
                                        const isSelected = selectedMeasurementIds.includes(meas.id);
                                        return (
                                            <div
                                                key={meas.id}
                                                onClick={() => toggleMeasurement(meas.id)}
                                                className={`relative p-3 rounded-xl border transition cursor-pointer ${isSelected ? 'border-2 border-rose-500 bg-rose-500/5' : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'}`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-4 h-4 rounded flex items-center justify-center text-white ${isSelected ? 'bg-rose-500' : 'border border-slate-300 dark:border-slate-500'}`}>
                                                        {isSelected && <span className="material-symbols-outlined text-[10px] font-bold">check</span>}
                                                    </div>
                                                    <span className={`text-xs font-bold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{meas.name}</span>
                                                </div>
                                                {/* Image Placeholder logic matching reference */}
                                                <div className="flex gap-2">
                                                    <input
                                                        type="file"
                                                        id={`file-${meas.id}`}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleMeasurementImageUpload(e, meas.id)}
                                                    />
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            document.getElementById(`file-${meas.id}`).click();
                                                        }}
                                                        className="w-full bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 aspect-[3/4] flex items-center justify-center text-[10px] text-slate-400 overflow-hidden relative group"
                                                    >
                                                        {measurementImages[meas.id] ? (
                                                            <>
                                                                <img src={measurementImages[meas.id].preview} className="w-full h-full object-cover" />
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeMeasurementImage(meas.id);
                                                                    }}
                                                                    className="absolute top-1 right-1 p-0.5 bg-white rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition"
                                                                >
                                                                    <span className="material-symbols-outlined text-[12px]">close</span>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            meas.img_path ? (
                                                                <img src={meas.img_path.startsWith('http') ? meas.img_path : `${import.meta.env.VITE_API}/${meas.img_path}`} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="flex flex-col items-center">
                                                                    <span className="material-symbols-outlined text-lg mb-1">add_a_photo</span>
                                                                    <span>Ref Img</span>
                                                                </div>
                                                            )
                                                        )}
                                                        {!measurementImages[meas.id] && (
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-medium text-[10px]">
                                                                Upload
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Sizes */}
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Select Available Sizes</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_SIZES.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => toggleSize(size)}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition ${selectedSizes.includes(size) ? 'bg-rose-500 text-white shadow-sm' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Standard Size Values Table */}
                                    {selectedSizes.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-rose-500 text-sm">settings_input_component</span>
                                                Size Value Mapping (Standard)
                                            </h3>
                                            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm w-full max-w-md">
                                                <table className="w-full text-sm border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-700 dark:bg-slate-900">
                                                            <th className="px-4 py-2.5 text-white font-bold text-left border-r border-white/10">Label (Size)</th>
                                                            <th className="px-4 py-2.5 text-white font-bold text-left">Standard Value (e.g. 36, 40)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedSizes.map((size, idx) => (
                                                            <tr key={size} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 last:border-0`}>
                                                                <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-700">{size}</td>
                                                                <td className="px-4 py-2">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Enter numeric size..."
                                                                        value={sizeNumbers[size] || ''}
                                                                        onChange={(e) => handleSizeNumberChange(size, e.target.value)}
                                                                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded focus:border-rose-500 outline-none transition-all font-bold"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Fill Measurements Table */}
                                {selectedSizes.length > 0 && selectedMeasurementIds.length > 0 && (
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm mt-4">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-600 dark:bg-slate-700 border-b border-slate-600 dark:border-slate-700">
                                                        <th className="px-6 py-4 text-white font-bold text-center border-r border-slate-500/50 last:border-r-0 min-w-[100px]">Size</th>
                                                        {selectedMeasurementIds.map(mid => {
                                                            const m = availableMeasurements.find(am => am.id === mid);
                                                            return (
                                                                <th key={mid} className="px-6 py-4 text-white font-bold text-center border-r border-slate-500/50 last:border-r-0 min-w-[120px]">
                                                                    {m?.name || 'Point'}
                                                                </th>
                                                            );
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedSizes.map((size, idx) => (
                                                        <tr
                                                            key={size}
                                                            className={`${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50'} border-b border-slate-100 dark:border-slate-700 last:border-b-0 group hover:bg-rose-50/30 dark:hover:bg-rose-500/5 transition-colors`}
                                                        >
                                                            <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-center border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                                                <div className="flex flex-col">
                                                                    <span className="text-lg">{sizeNumbers[size] || size}</span>
                                                                    {sizeNumbers[size] && <span className="text-[10px] text-slate-400 font-normal">({size})</span>}
                                                                </div>
                                                            </td>
                                                            {selectedMeasurementIds.map(mid => (
                                                                <td key={mid} className="px-4 py-2 text-center border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                                                    <div className="relative group/input">
                                                                        <input
                                                                            type="number"
                                                                            step="0.1"
                                                                            value={sizeMeasurements[size]?.[`meas_${mid}`] || ''}
                                                                            onChange={(e) => handleMeasurementChange(size, mid, e.target.value)}
                                                                            placeholder="--"
                                                                            className="w-full max-w-[100px] px-2 py-2 bg-transparent text-center text-sm font-semibold text-slate-900 dark:text-white outline-none border border-transparent focus:border-rose-500/50 rounded-lg transition-all"
                                                                        />
                                                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-slate-200 dark:bg-slate-600 group-focus-within/input:w-full group-focus-within/input:bg-rose-500 transition-all rounded-full"></div>
                                                                    </div>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 4. Pricing & Stock */}
                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                    <span className="material-symbols-outlined">inventory_2</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pricing & Stock</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage Price and Qty per Fabric & Size</p>
                                </div>
                            </div>

                            {fabrics.length > 0 && selectedSizes.length > 0 ? (
                                <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm mt-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="bg-slate-700 dark:bg-slate-900 border-b border-slate-700">
                                                    <th className="px-6 py-4 text-white font-bold text-left border-r border-white/10 last:border-r-0">Fabric</th>
                                                    <th className="px-6 py-4 text-white font-bold text-center border-r border-white/10 last:border-r-0">Size</th>
                                                    <th className="px-6 py-4 text-white font-bold text-center border-r border-white/10 last:border-r-0">Actual Price ($)</th>
                                                    <th className="px-6 py-4 text-white font-bold text-center border-r border-white/10 last:border-r-0">Discount Price ($)</th>
                                                    <th className="px-6 py-4 text-white font-bold text-center last:border-r-0">Stock (Qty)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fabrics.map((fabric) => (
                                                    selectedSizes.map((size, sIdx) => {
                                                        const key = `${fabric.name}_${size}`;
                                                        return (
                                                            <tr key={key} className={`${sIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-rose-50/30 transition-colors`}>
                                                                <td className="px-6 py-4 border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                                                    <div className="flex items-center gap-3">
                                                                        {fabric.image ? <img src={fabric.image} className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-sm" /> : <div className="w-8 h-8 rounded-full bg-slate-200"></div>}
                                                                        <span className="font-bold text-slate-700 dark:text-slate-300">{fabric.name}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                                                    {sizeNumbers[size] || size}
                                                                </td>
                                                                <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                                                    <input value={pricingData[key]?.price || ''} onChange={(e) => handlePricingChange(fabric.name, size, 'price', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-center text-sm font-bold focus:border-rose-500 outline-none transition-all" type="number" />
                                                                </td>
                                                                <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                                                    <input value={pricingData[key]?.discount_price || ''} onChange={(e) => handlePricingChange(fabric.name, size, 'discount_price', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-center text-sm font-bold focus:border-rose-500 outline-none transition-all" type="number" />
                                                                </td>
                                                                <td className="px-4 py-3 text-center">
                                                                    <input value={pricingData[key]?.stock || ''} onChange={(e) => handlePricingChange(fabric.name, size, 'stock', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-center text-sm font-bold focus:border-rose-500 outline-none transition-all" type="number" />
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">Add Fabrics and Sizes to configure pricing</div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT COLUMN (1/3) - Configuration, Fabrics, Attributes */}
                    <div className="space-y-6">

                        {/* Configuration */}
                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Configuration</h2>
                            <div className="space-y-6">
                                {/* Is Customizable Toggle */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Is Customizable</h3>
                                        <p className="text-xs text-slate-500">Enable user tweaks</p>
                                    </div>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            type="checkbox"
                                            name="toggle"
                                            id="toggle1"
                                            checked={isCustomizable === 1}
                                            onChange={(e) => setIsCustomizable(e.target.checked ? 1 : 0)}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-rose-500 transition-all duration-300 ease-in-out"
                                        />
                                        <label htmlFor="toggle1" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${isCustomizable ? 'bg-rose-500' : 'bg-slate-300'}`}></label>
                                    </div>
                                </div>

                                {/* Is Alter Toggle */}
                                <div className="p-4 bg-pink-50 dark:bg-pink-900/10 rounded-lg border border-pink-100 dark:border-pink-900/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alteration Available</h3>
                                            <p className="text-xs text-slate-500">Allow size fixes</p>
                                        </div>
                                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input
                                                type="checkbox"
                                                name="toggle"
                                                id="toggle2"
                                                checked={isAlter === 1}
                                                onChange={(e) => setIsAlter(e.target.checked ? 1 : 0)}
                                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-rose-500 transition-all duration-300 ease-in-out"
                                            />
                                            <label htmlFor="toggle2" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${isAlter ? 'bg-rose-500' : 'bg-slate-300'}`}></label>
                                        </div>
                                    </div>
                                    {isAlter === 1 && (
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
                                            <input
                                                className="w-full pl-7 py-2.5 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-rose-500 focus:border-rose-500 font-bold shadow-sm"
                                                type="number"
                                                value={alterCharge}
                                                onChange={(e) => setAlterCharge(e.target.value)}
                                            />
                                            <p className="text-[10px] text-slate-500 mt-1 pl-1">Extra charge for alterations</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Fabrics */}
                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Fabrics</h2>
                            <div className="space-y-3 mb-4">
                                {fabrics.map((fabric, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {fabric.image ? (
                                                <div className="w-8 h-8 rounded bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${fabric.image})` }}></div>
                                            ) : (
                                                <div className="w-8 h-8 rounded bg-yellow-400 shadow-sm"></div>
                                            )}
                                            <div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">{fabric.name}</span>
                                                {fabric.oneMeterPrice && <span className="text-xs text-slate-500">₹{fabric.oneMeterPrice}/m</span>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setFabrics(fabrics.filter((_, i) => i !== idx))}
                                            className="text-slate-400 hover:text-red-500 transition"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsFabricModalOpen(true)}
                                className="w-full py-2.5 rounded-lg border border-dashed border-rose-500 text-rose-500 hover:bg-rose-500/5 font-medium text-sm flex items-center justify-center gap-2 transition"
                            >
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                Add New Material
                            </button>
                        </section>

                        {/* Product Attributes */}
                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Product Attributes</h2>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {attributes.map((attr, idx) => (
                                    <div key={idx} className="relative group bg-slate-50 dark:bg-slate-800 rounded-lg p-2 border border-slate-100 dark:border-slate-700 text-center">
                                        <span className="text-xs text-slate-500 uppercase font-bold">{attr.key}</span>
                                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{attr.value}</div>
                                        <button
                                            onClick={() => setAttributes(attributes.filter((_, i) => i !== idx))}
                                            className="absolute top-1 right-1 hidden group-hover:flex text-red-500"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsAttributeModalOpen(true)}
                                className="w-full py-2.5 rounded-lg border border-dashed border-rose-500 text-rose-500 hover:bg-rose-500/5 font-medium text-sm flex items-center justify-center gap-2 transition"
                            >
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                Add Attribute
                            </button>
                        </section>
                    </div>
                </div>
            </main>

            {/* ... Fabric and Attribute Modals need to use new styles ... */}
            {isFabricModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Fabric</h3>
                            <button onClick={() => setIsFabricModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fabric Name</label>
                                <input value={newFabricName} onChange={(e) => setNewFabricName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400" placeholder="e.g. Cotton" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price per Meter (₹)</label>
                                <input type="number" value={newFabricOneMeterPrice} onChange={(e) => setNewFabricOneMeterPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image</label>
                                <input type="file" ref={fabricInputRef} onChange={handleFabricImageChange} className="hidden" />
                                <div onClick={() => fabricInputRef.current.click()} className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-rose-500 overflow-hidden">
                                    {newFabricImagePreview ? <img src={newFabricImagePreview} className="w-full h-full object-cover" /> : <span className="text-slate-400">Upload Image</span>}
                                </div>
                            </div>
                            <button onClick={handleAddFabric} className="w-full py-3 bg-rose-500 text-white rounded-lg font-bold hover:bg-rose-600">Add Fabric</button>
                        </div>
                    </div>
                </div>
            )}

            {isAttributeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Attribute</h3>
                            <button onClick={() => setIsAttributeModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input value={newMetaKey} onChange={(e) => setNewMetaKey(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400" placeholder="Attribute Name (e.g. Fit)" />
                            <input value={newMetaValue} onChange={(e) => setNewMetaValue(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400" placeholder="Value (e.g. Slim)" />
                            <button onClick={handleAddAttribute} className="w-full py-3 bg-rose-500 text-white rounded-lg font-bold hover:bg-rose-600">Add</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-6 right-6 z-40 md:hidden">
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-3 px-6 py-4 bg-rose-500 text-white font-bold text-lg rounded-full shadow-xl shadow-rose-500/40 hover:bg-rose-600 hover:-translate-y-1 transition transform"
                >
                    <span className="material-symbols-outlined">save</span>
                    Save Product
                </button>
            </div>
        </div>
    );
};

export default Product;