import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import { getProductDetails, updateProduct } from '../../services/vendorService';

// Step Components
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2ConfigMaterials from './steps/Step2ConfigMaterials';
import Step3Summary from './steps/Step3Summary';

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // --- State Variables ---
    const [categories, setCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [wearTypes, setWearTypes] = useState([]);
    const [selectedWearType, setSelectedWearType] = useState('');
    const [gender, setGender] = useState('Female');
    const [isAlter, setIsAlter] = useState(0);
    const [alterCharge, setAlterCharge] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    // --- Image States ---
    const [mainImage, setMainImage] = useState(null); // File: New Upload
    const [existingMainImage, setExistingMainImage] = useState(null); // String: URL
    const [mainImagePreview, setMainImagePreview] = useState(null); // String: Blob or URL

    const mainImageInputRef = useRef(null);

    const [galleryImages, setGalleryImages] = useState([]); // Array of { file, preview } -> New Uploads
    const [existingGalleryImages, setExistingGalleryImages] = useState([]); // Array of { id, url }
    const [imagesToDelete, setImagesToDelete] = useState([]); // Array of IDs to delete
    const [materialsToDelete, setMaterialsToDelete] = useState([]); // Array of material IDs to delete
    const [addonsToDelete, setAddonsToDelete] = useState([]); // Array of addon IDs to delete
    const [materialImagesToDelete, setMaterialImagesToDelete] = useState([]); // Array of material image IDs to delete
    const galleryInputRef = useRef(null);
    const fabricInputRef = useRef(null);
    const isInitialLoad = useRef(true);

    // --- Complex Data States ---
    // Materials (New Structure)
    // [{ id, identity, description, material_type_id, images: { main, front, back, left, right, extras: [] }, previews: { ... }, availability: { custom: true, ready: false } }]
    const [fabrics, setFabrics] = useState([]);
    // isCustomizable is now derived from fabrics availability
    const isCustomizable = fabrics.some(f => f.availability?.custom) ? 1 : 0;
    const [materialTypes, setMaterialTypes] = useState([]); // From API

    // Old Fabric Modal states removed as we use inline cards now

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
    const [allStandardSizes, setAllStandardSizes] = useState([]);
    const [sizeNumbers, setSizeNumbers] = useState({}); // { 'XS': 32 }
    const [sizeMeasurements, setSizeMeasurements] = useState({}); // { 'S': { 'meas_1': 34 } }
    const [pricingData, setPricingData] = useState({}); // { 'Fabric_Size': { price, discount_price, stock } }
    const [customPricingRows, setCustomPricingRows] = useState({}); // { fabricIdentity: ['XS', 'L'] }
    const [readyPricingRows, setReadyPricingRows] = useState({}); // { fabricIdentity: ['XS', 'L'] }
    const [tempFabAddSizes, setTempFabAddSizes] = useState({}); // { fabricIdentity: 'XS' } - for Add dropdown
    const [autoFilledMeasurementIds, setAutoFilledMeasurementIds] = useState([]); // Track auto-filled measurements
    const [subCategoryMappingExists, setSubCategoryMappingExists] = useState(false);
    const [configActiveTab, setConfigActiveTab] = useState('materials'); // 'materials' or 'measurements'
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Multi-Step State
    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
        { id: 1, name: 'Basic Information', icon: 'edit_note' },
        { id: 2, name: 'Product Configuration', icon: 'texture' },
        { id: 3, name: 'Summary & Review', icon: 'visibility' }
    ];

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }; // Track if subcat mapping exists

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
                // Shared Dependencies for both Create and Edit
                await fetchWearTypes();
                await fetchMaterialTypes();
                await fetchRooms();

                if (isEditMode) {
                    await fetchProductData(id);
                } else {
                    // Create Mode Defaults
                    fetchMeasurementsByGender('Female');
                    fetchCategoriesByGender('Female');
                }
            } catch (error) {
                console.error("Error fetching dependencies:", error);
            } finally {
                isInitialLoad.current = false;
            }
        };
        fetchInitialData();
    }, [id]);

    const fetchCategoriesByGender = async (genderName) => {
        try {
            const genderMapping = {
                'Male': 1,
                'Female': 2,
                'Kids': 3,
                'Unisex': 4,
                'Others': 5
            };
            const categoryType = genderMapping[genderName] || 2;

            // Using GET as requested
            const res = await axiosInstance.get('/category/list', {
                params: { category_type: categoryType }
            });

            if (res.data && res.data.categories) {
                setCategories(res.data.categories);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories by gender:", error);
            setCategories([]);
        }
    };

    const fetchWearTypes = async () => {
        try {
            const res = await axiosInstance.get('/wear-types');
            if (res.data && res.data.data) {
                setWearTypes(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching wear types:", error);
        }
    };

    const fetchRooms = async () => {
        try {
            const apiBase = import.meta.env.VITE_API;
            const res = await axios.get(`${apiBase}/api/rooms?page=1&search=&per_page=50`);

            // Extract rooms from varied potential structures (direct array, .rooms.data, .data)
            let roomsList = [];
            if (Array.isArray(res.data)) {
                roomsList = res.data;
            } else if (res.data?.rooms?.data) {
                roomsList = res.data.rooms.data;
            } else if (res.data?.data) {
                roomsList = res.data.data;
            }

            setRooms(roomsList);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const fetchMaterialTypes = async () => {
        try {
            const res = await axiosInstance.get('/materials');
            if (res.data && res.data.data) {
                setMaterialTypes(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching material types:", error);
        }
    };

    const fetchMeasurementsByGender = async (genderName, shouldAutoSelect = false) => {
        try {
            const apiBase = import.meta.env.VITE_API;
            const genderMapping = {
                'Male': 1,
                'Female': 2,
                'Kids': 3,
                'Unisex': 4,
                'Others': 5
            };
            const genderId = genderMapping[genderName] || 2;
            // Updated URL provided by user
            const url = `${apiBase}/api/get/measurment/web?gender=${genderId}`;
            const measureRes = await axios.get(url);

            if (measureRes.data && measureRes.data.data) {
                const measurements = measureRes.data.data;
                setAvailableMeasurements(measurements);

                if (shouldAutoSelect) {
                    // Auto Fill Values & Select Sizes
                    const newSizeMeasurements = {};
                    const sizesFound = new Set();

                    measurements.forEach(m => {
                        let details = m.size_details;
                        if (typeof details === 'string') {
                            try { details = JSON.parse(details); } catch (e) { details = null; }
                        }

                        if (details) {
                            Object.entries(details).forEach(([size, value]) => {
                                sizesFound.add(size);
                                if (!newSizeMeasurements[size]) newSizeMeasurements[size] = {};
                                newSizeMeasurements[size][`meas_${m.id}`] = value;
                            });
                        }
                    });

                    if (sizesFound.size > 0) {
                        const sortedSizes = [...sizesFound];
                        setSelectedSizes(sortedSizes);
                        setAllStandardSizes(sortedSizes);
                        setSizeMeasurements(prev => ({ ...prev, ...newSizeMeasurements }));
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching measurements by gender:", error);
        }
    };

    const fetchMeasurementsBySubCategory = async (subCatId) => {
        try {
            const apiBase = import.meta.env.VITE_API;
            const res = await axios.get(`${apiBase}/api/measurements/by-subcategory/${subCatId}`);

            if (res.data && res.data.status && res.data.data) {
                const measurements = res.data.data;
                if (measurements && measurements.length > 0) {
                    setAvailableMeasurements(measurements);
                    setSubCategoryMappingExists(true);

                    // Auto Select All Measurements if Ready-Made (Standard mapping)
                    if (isCustomizable === 0) {
                        const allMeasIds = measurements.map(m => m.id);
                        setSelectedMeasurementIds(allMeasIds);
                    }

                    // Auto Fill Values & Select Sizes
                    const newSizeMeasurements = {};
                    const sizesFound = new Set();

                    measurements.forEach(m => {
                        let details = m.size_details;
                        if (typeof details === 'string') {
                            try { details = JSON.parse(details); } catch (e) { details = null; }
                        }

                        if (details) {
                            Object.entries(details).forEach(([size, value]) => {
                                sizesFound.add(size);
                                if (!newSizeMeasurements[size]) newSizeMeasurements[size] = {};
                                newSizeMeasurements[size][`meas_${m.id}`] = value;
                            });
                        }
                    });

                    if (sizesFound.size > 0) {
                        const sortedSizes = [...sizesFound];
                        setSelectedSizes(sortedSizes);
                        setAllStandardSizes(sortedSizes);
                        setSizeMeasurements(prev => ({ ...prev, ...newSizeMeasurements }));
                    }
                } else {
                    setSubCategoryMappingExists(false);
                    setAvailableMeasurements([]);
                }
            } else {
                setSubCategoryMappingExists(false);
                setAvailableMeasurements([]);
            }
        } catch (error) {
            console.error("Error fetching measurements by subcategory:", error);
            setSubCategoryMappingExists(false);
            setAvailableMeasurements([]);
        }
    };

    const fetchMeasurementsByWearType = async (wearTypeId) => {
        try {
            const apiBase = import.meta.env.VITE_API;
            const res = await axiosInstance.get(`/measurements/by-type/${wearTypeId}`);

            if (res.data && res.data.status && res.data.data) {
                const measurements = res.data.data;
                if (measurements && measurements.length > 0) {
                    setAvailableMeasurements(measurements);

                    // Auto Select All if Ready-Made
                    if (isCustomizable === 0) {
                        const allMeasIds = measurements.map(m => m.id);
                        setSelectedMeasurementIds(allMeasIds);
                    }

                    const newSizeMeasurements = {};
                    const sizesFound = new Set();

                    measurements.forEach(m => {
                        if (m.size_details) {
                            const details = typeof m.size_details === 'string' ? JSON.parse(m.size_details) : m.size_details;
                            Object.entries(details).forEach(([size, value]) => {
                                sizesFound.add(size);
                                if (!newSizeMeasurements[size]) newSizeMeasurements[size] = {};
                                newSizeMeasurements[size][`meas_${m.id}`] = value;
                            });
                        }
                    });

                    if (sizesFound.size > 0) {
                        const foundSizesList = [...sizesFound];
                        setSelectedSizes(foundSizesList);
                        setAllStandardSizes(foundSizesList);
                        setSizeMeasurements(prev => ({ ...prev, ...newSizeMeasurements }));
                    } else {
                        setAllStandardSizes(AVAILABLE_SIZES);
                        if (isCustomizable === 1) {
                            setSelectedSizes(AVAILABLE_SIZES);
                        }
                    }
                } else {
                    setAvailableMeasurements([]);
                }
            } else {
                setAvailableMeasurements([]);
            }
        } catch (error) {
            console.error("Error fetching measurements by wear type:", error);
            setAvailableMeasurements([]);
        }
    };

    useEffect(() => {
        // Skip during initial data load to avoid overwriting existing selections
        if (isInitialLoad.current) return;

        // In Edit Mode, we should NOT wipe selections based on standard mappings 
        // unless the user specifically CHANGES the category/subcategory.
        // We'll skip this logic if everything was loaded by fetchProductData and hasn't changed.

        if (selectedSubCategory) {
            if (subCategoryMappingExists) {
                const allIds = availableMeasurements.map(m => m.id);
                if (isCustomizable === 0) {
                    if (allIds.length > 0) {
                        if (selectedMeasurementIds.length !== allIds.length) {
                            setSelectedMeasurementIds(allIds);
                        }
                        // Ensure values are fetched for all standard measurements if switching to ready-made
                        const activeSizes = allStandardSizes.length > 0 ? allStandardSizes : AVAILABLE_SIZES;
                        allIds.forEach(mId => {
                            activeSizes.forEach(size => {
                                if (!sizeMeasurements[size]?.[`meas_${mId}`]) {
                                    fetchMeasurementValue(mId, size);
                                }
                            });
                        });
                    }
                } else {
                    if (allIds.length > 0 && selectedMeasurementIds.length === allIds.length) {
                        // Only clear if we are SURE it was a ready-made auto-select and not a loaded custom list
                        // For simplicity, if mapping exists and it's custom, we let user manually pick
                    }
                }
            } else {
                if (isCustomizable === 1) {
                    fetchMeasurementsByGender(gender, true);
                } else if (!isEditMode) {
                    // Only clear if NOT in Edit Mode or if user intentionally changed subcat
                    setAvailableMeasurements([]);
                    setSelectedMeasurementIds([]);
                }
            }
        } else if (isCustomizable === 1) {
            fetchMeasurementsByGender(gender, true);
        } else if (!isEditMode) {
            setAvailableMeasurements([]);
            setSelectedMeasurementIds([]);
        }
    }, [selectedSubCategory, subCategoryMappingExists, isCustomizable, gender, availableMeasurements.length]);

    // --- Populate Form for Edit ---
    const fetchProductData = async (productId) => {
        const toastId = toast.loading('Loading product data...');
        try {
            const data = await getProductDetails(productId);
            const p = data.product || data.data || data;

            if (!p || !p.product_name) {
                toast.error("Product details not found");
                return;
            }

            // 1. Basic Information
            setProductName(p.product_name || '');
            setProductDescription(p.description || '');
            // Normalize room_id to Number if it's not empty, to match room.id in the list
            setSelectedRoomId(p.room_id ? Number(p.room_id) : '');

            // 2. Gender & Categories
            if (p.gender) {
                const normalized = p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase();
                setGender(normalized);
                // Await to ensure availableMeasurements is populated before we potentially overwrite/process it
                await fetchMeasurementsByGender(normalized);
                await fetchCategoriesByGender(normalized);
            }

            setIsAlter(Number(p.is_alter) || 0);
            setAlterCharge(p.alter_charge || '');

            const catId = p.category_id || p.category?.id;
            const subCatId = p.sub_category_id || p.subcategory?.id;

            if (catId) {
                await fetchSubCategories(catId);
                setSelectedCategory(catId);
                // Important: Set subcategory AFTER the list is fetched
                if (subCatId) {
                    setSelectedSubCategory(subCatId);
                    await fetchMeasurementsBySubCategory(subCatId);
                }
            }

            const wearTypeId = p.wear_type_id || p.wear_type?.id;
            if (wearTypeId) setSelectedWearType(wearTypeId);

            // 3. Images
            if (p.main_image) {
                const url = getFullImageUrl(p.main_image);
                setExistingMainImage(url);
                setMainImagePreview(url);
            }

            const structuredGallery = p.images || [];
            const galleryToUse = structuredGallery.map(img => ({
                id: img.id,
                url: getFullImageUrl(img.image_url || img.img_path)
            }));
            setExistingGalleryImages(galleryToUse);

            // 4. Materials (Fabrics) & Pricing
            const materials = p.product_materials || [];
            if (materials.length > 0) {
                const mappedFabrics = materials.map(m => {
                    const identity = m.material_identity || m.identity || '';
                    const imgs = m.images || [];

                    // material_type_id logic: 0: custom, 1: ready, 2: both
                    const mTypeId = Number(m.material_type_id);
                    const isCustom = mTypeId === 0 || mTypeId === 2;
                    const isReady = mTypeId === 1 || mTypeId === 2;

                    return {
                        id: m.id,
                        identity: identity,
                        description: m.description || '',
                        material_type: m.material_name || m.material_type || '',
                        existingImages: imgs.map(img => ({
                            id: img.id,
                            url: getFullImageUrl(img.img_path),
                            file: null // Will hold the new file if replaced
                        })),
                        newImages: [], // Array of { file, preview } for newly added images
                        previews: {
                            // Previews for legacy/pose logic if still needed elsewhere, but we'll focus on the arrays
                            main: getFullImageUrl(imgs[0]?.img_path || m.img_path),
                            front: getFullImageUrl(imgs[1]?.img_path),
                            back: getFullImageUrl(imgs[2]?.img_path),
                            left: getFullImageUrl(imgs[3]?.img_path),
                            right: getFullImageUrl(imgs[4]?.img_path),
                            extras: imgs.slice(5).map(img => getFullImageUrl(img.img_path))
                        },
                        availability: {
                            custom: isCustom,
                            ready: isReady
                        },
                        addons: (m.addons || m.product_addons || []).map(a => ({
                            id: a.id,
                            name: a.name || '',
                            amount: a.amount || a.price || '',
                            preview: getFullImageUrl(a.images?.[0]?.img_path || a.img_path || a.image_url || a.image)
                        }))
                    };
                });
                setFabrics(mappedFabrics);

                const pricing = {};
                const rRows = {};
                const cRows = {};

                mappedFabrics.forEach((f, fIdx) => {
                    const mat = materials[fIdx];
                    const identity = f.id; // Use our mapped unique ID
                    if (mat && mat.prices) {
                        mat.prices.forEach(pr => {
                            const type = (String(pr.price_type).toLowerCase() === 'custom' || pr.price_type_id == 0) ? 'custom' : 'ready';
                            const key = `${identity}_${pr.size}_${type}`;

                            pricing[key] = {
                                id: pr.id,
                                price: pr.actual_price,
                                discount_price: pr.discount_price,
                                stock: pr.qty || 0
                            };

                            if (type === 'ready') {
                                if (!rRows[identity]) rRows[identity] = [];
                                if (!rRows[identity].includes(pr.size)) rRows[identity].push(pr.size);
                            } else {
                                if (!cRows[identity]) cRows[identity] = [];
                                if (!cRows[identity].includes(pr.size)) cRows[identity].push(pr.size);
                            }
                        });
                    }
                });
                setPricingData(pricing);
                setReadyPricingRows(rRows);
                setCustomPricingRows(cRows);
            }

            // 5. Measurements (Matrix parsing from product_measurements)
            if (p.product_measurements && p.product_measurements.length > 0) {
                const measIds = new Set();
                const sizesSet = new Set();
                const sMeasurements = {};
                const loadedAvailableMeasurements = [];

                p.product_measurements.forEach(pm => {
                    if (pm.measurement_id) measIds.add(Number(pm.measurement_id));

                    if (pm.measurement) {
                        loadedAvailableMeasurements.push(pm.measurement);
                    }

                    const matrix = pm.value || {};
                    Object.entries(matrix).forEach(([size, measValues]) => {
                        sizesSet.add(size);
                        if (!sMeasurements[size]) sMeasurements[size] = {};

                        const val = measValues[`meas_${pm.measurement_id}`];
                        if (val !== undefined) {
                            sMeasurements[size][`meas_${pm.measurement_id}`] = val;
                        }
                    });
                });

                if (loadedAvailableMeasurements.length > 0) {
                    setSubCategoryMappingExists(true); // Mark as mapping existing so UI shows standard fields if needed
                }

                setSelectedMeasurementIds([...measIds]);
                setSelectedSizes([...sizesSet].sort());
                setSizeMeasurements(sMeasurements);
            }

            // 6. Attributes
            if (p.product_details && Array.isArray(p.product_details)) {
                const loadedAttributes = p.product_details.map(d => ({
                    key: d.detail || d.key || '',
                    value: d.value || ''
                }));
                setAttributes(loadedAttributes);
            }

            toast.success('Data loaded successfully', { id: toastId });
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to load product for editing', { id: toastId });
        }
    };


    const handleSubCategoryChange = (e) => {
        const subCatId = e.target.value;
        setSelectedSubCategory(subCatId);
        if (subCatId) {
            fetchMeasurementsBySubCategory(subCatId);
        }
    };

    const handleWearTypeChange = (e) => {
        const typeId = e.target.value;
        setSelectedWearType(typeId);
        if (isCustomizable && typeId) {
            fetchMeasurementsByWearType(typeId);
        }
    };


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
    // Material Handlers
    const handleAddMaterial = () => {
        const newMaterial = {
            id: Date.now(), // Temp ID
            identity: '',
            description: '',
            material_type: '',
            existingImages: [],
            newImages: [],
            previews: { main: null, front: null, back: null, left: null, right: null, extras: [] },
            availability: { custom: true, ready: false },
            addons: [], // Each material has its own addons
            force_custom_mode: false // For Select/Input toggle
        };
        setFabrics([...fabrics, newMaterial]);
        // Note: isCustomizable will now trigger the useEffect to fetch gender measurements if needed
    };

    const handleRemoveMaterial = (index) => {
        const mat = fabrics[index];
        if (mat && mat.id && !String(mat.id).startsWith('temp_')) {
            setMaterialsToDelete(prev => [...prev, mat.id]);
        }
        setFabrics(prev => prev.filter((_, i) => i !== index));
    };

    const handleMaterialChange = (index, field, value) => {
        setFabrics(prev => {
            const newFabrics = [...prev];
            newFabrics[index] = { ...newFabrics[index], [field]: value };
            return newFabrics;
        });
    };

    const toggleMaterialAvailability = (index, type) => {
        // Fetch measurements if we enable custom for the first time across all materials
        if (type === 'custom' && !fabrics[index].availability.custom) {
            const alreadyHasCustom = fabrics.some((f, i) => i !== index && f.availability?.custom);
            if (!alreadyHasCustom && selectedWearType) {
                fetchMeasurementsByWearType(selectedWearType);
            }
        }

        setFabrics(prev => {
            const newFabrics = [...prev];
            // Properly copy the item to avoid mutation
            newFabrics[index] = {
                ...newFabrics[index],
                availability: {
                    ...newFabrics[index].availability,
                    [type]: !newFabrics[index].availability[type]
                }
            };
            return newFabrics;
        });
    };

    const handleMaterialImageChange = (index, pose, e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setFabrics(prev => {
            const newFabrics = [...prev];
            const mat = { ...newFabrics[index] };

            if (pose === 'add_new') {
                // Adding to newImages (completely new upload)
                const additions = files.map(file => ({
                    file,
                    preview: URL.createObjectURL(file)
                }));
                mat.newImages = [...(mat.newImages || []), ...additions];
            } else if (typeof pose === 'number') {
                // Replacing an existing image slot
                const file = files[0];
                const updatedExisting = [...mat.existingImages];
                updatedExisting[pose] = {
                    ...updatedExisting[pose],
                    file,
                    url: URL.createObjectURL(file) // Show preview in place
                };
                mat.existingImages = updatedExisting;
            } else if (pose === 'replace_new' && e.subIndex !== undefined) {
                // Replacing a previously added new image
                const file = files[0];
                const updatedNew = [...mat.newImages];
                updatedNew[e.subIndex] = {
                    file,
                    preview: URL.createObjectURL(file)
                };
                mat.newImages = updatedNew;
            }

            newFabrics[index] = mat;
            return newFabrics;
        });
        e.target.value = '';
    };

    const removeMaterialImage = (index, listType, imgIdx) => {
        setFabrics(prev => {
            const newFabrics = [...prev];
            const mat = { ...newFabrics[index] };

            if (listType === 'existing') {
                const img = mat.existingImages[imgIdx];
                if (img?.id) {
                    setMaterialImagesToDelete(prevDel => [...prevDel, img.id]);
                }
                mat.existingImages = mat.existingImages.filter((_, i) => i !== imgIdx);
            } else {
                mat.newImages = mat.newImages.filter((_, i) => i !== imgIdx);
            }

            newFabrics[index] = mat;
            return newFabrics;
        });
    };

    const handleAddAttribute = () => {
        if (!newMetaKey || !newMetaValue) return;
        setAttributes([...attributes, { key: newMetaKey, value: newMetaValue }]);
        setIsAttributeModalOpen(false);
        setNewMetaKey(''); setNewMetaValue('');
    };

    // Addon Handlers (Nested in Material)
    const handleAddAddon = (matIndex) => {
        setFabrics(prev => {
            const next = [...prev];
            const mat = { ...next[matIndex] };
            mat.addons = [...(mat.addons || []), { id: Date.now(), name: '', amount: '', image: null, preview: null }];
            next[matIndex] = mat;
            return next;
        });
    };

    const handleRemoveAddon = (matIndex, addonIndex) => {
        const mat = fabrics[matIndex];
        const addon = mat.addons[addonIndex];
        if (addon && addon.id && !String(addon.id).startsWith('temp_') && !isNaN(Number(addon.id))) {
            setAddonsToDelete(prev => [...prev, addon.id]);
        }
        setFabrics(prev => {
            const next = [...prev];
            const mat = { ...next[matIndex] };
            mat.addons = mat.addons.filter((_, i) => i !== addonIndex);
            next[matIndex] = mat;
            return next;
        });
    };

    const handleAddonChange = (matIndex, addonIndex, field, value) => {
        setFabrics(prev => {
            const next = [...prev];
            const mat = { ...next[matIndex] };
            const nextAddons = [...mat.addons];
            nextAddons[addonIndex] = { ...nextAddons[addonIndex], [field]: value };
            mat.addons = nextAddons;
            next[matIndex] = mat;
            return next;
        });
    };

    const handleAddonImageChange = (matIndex, addonIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            setFabrics(prev => {
                const next = [...prev];
                const mat = { ...next[matIndex] };
                const nextAddons = [...mat.addons];
                nextAddons[addonIndex] = { ...nextAddons[addonIndex], image: file, preview: URL.createObjectURL(file) };
                mat.addons = nextAddons;
                next[matIndex] = mat;
                return next;
            });
        }
    };

    const fetchMeasurementValue = async (mId, size) => {
        try {
            const apiBase = import.meta.env.VITE_API;
            const res = await axios.get(`${apiBase}/api/measurements/get-value?measurement_id=${mId}&size_name=${size}`);
            if (res.data && res.data.status && res.data.value) {
                setSizeMeasurements(prev => ({
                    ...prev,
                    [size]: { ...prev[size], [`meas_${mId}`]: res.data.value }
                }));
                setAutoFilledMeasurementIds(prev => prev.includes(mId) ? prev : [...prev, mId]);
            }
        } catch (error) {
            console.error("Error fetching measurement value:", error);
        }
    };

    const toggleMeasurement = (id) => {
        const isSelected = selectedMeasurementIds.includes(id);
        if (!isSelected) {
            setSelectedMeasurementIds(prev => [...prev, id]);

            // If customizable, auto-select all sizes if none are selected
            if (isCustomizable === 1 && selectedSizes.length === 0) {
                setSelectedSizes(AVAILABLE_SIZES);
            }

            // If customizable, we want to fetch for all standard sizes even if not "selected" in the chips
            const activeSizes = allStandardSizes.length > 0 ? allStandardSizes : (isCustomizable === 1 ? AVAILABLE_SIZES : selectedSizes);
            if (activeSizes.length > 0) {
                activeSizes.forEach(size => fetchMeasurementValue(id, size));
            }
        } else {
            setSelectedMeasurementIds(prev => prev.filter(mid => mid !== id));
            setAutoFilledMeasurementIds(prev => prev.filter(mid => mid !== id));
        }
    };

    const handleMeasurementImageUpload = (e, id) => {
        const file = e.target.files[0];
        if (file) setMeasurementImages(prev => ({ ...prev, [id]: { file, preview: URL.createObjectURL(file) } }));
    };

    const removeMeasurementImage = (id) => {
        setMeasurementImages(prev => { const n = { ...prev }; delete n[id]; return n; });
    };

    const toggleSize = (size) => {
        const isSelected = selectedSizes.includes(size);
        if (!isSelected) {
            setSelectedSizes(prev => [...prev, size]);
            if (selectedMeasurementIds.length > 0) {
                selectedMeasurementIds.forEach(mId => fetchMeasurementValue(mId, size));
            }
        } else {
            setSelectedSizes(prev => prev.filter(s => s !== size));
        }
    };

    const handleMeasurementChange = (size, measId, value) => {
        setSizeMeasurements(prev => ({
            ...prev,
            [size]: { ...prev[size], [`meas_${measId}`]: value }
        }));
    };

    const handlePricingChange = (materialId, size, field, value, type) => {
        const key = `${materialId}_${size}_${type}`;
        setPricingData(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    const handleSizeNumberChange = (size, value) => {
        setSizeNumbers(prev => ({ ...prev, [size]: value }));
    };

    const handleAddCustomRow = (materialId, size) => {
        if (!size) return;
        setCustomPricingRows(prev => {
            const current = prev[materialId] || [];
            if (current.includes(size)) return prev;
            return { ...prev, [materialId]: [...current, size] };
        });
    };

    const handleRemoveCustomRow = (materialId, size) => {
        setCustomPricingRows(prev => {
            const current = prev[materialId] || [];
            return { ...prev, [materialId]: current.filter(s => s !== size) };
        });
        const key = `${materialId}_${size}_custom`;
        setPricingData(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const handleAddReadyRow = (materialId, size) => {
        if (!size) return;
        setReadyPricingRows(prev => {
            const current = prev[materialId] || [];
            if (current.includes(size)) return prev;
            return { ...prev, [materialId]: [...current, size] };
        });
    };

    const handleRemoveReadyRow = (materialId, size) => {
        setReadyPricingRows(prev => {
            const current = prev[materialId] || [];
            return { ...prev, [materialId]: current.filter(s => s !== size) };
        });
        const key = `${materialId}_${size}_ready`;
        setPricingData(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    // Sync Rows from existing pricing data on load
    useEffect(() => {
        if (Object.keys(pricingData).length > 0) {
            // Sync Custom
            setCustomPricingRows(prev => {
                if (Object.keys(prev).length > 0) return prev;
                const newRows = {};
                let found = false;
                Object.keys(pricingData).forEach(key => {
                    if (key.endsWith('_custom')) {
                        const parts = key.split('_'); parts.pop();
                        const size = parts.pop();
                        const identity = parts.join('_');
                        if (!newRows[identity]) newRows[identity] = [];
                        if (!newRows[identity].includes(size)) { newRows[identity].push(size); found = true; }
                    }
                });
                return found ? newRows : prev;
            });
            // Sync Ready
            setReadyPricingRows(prev => {
                if (Object.keys(prev).length > 0) return prev;
                const newRows = {};
                let found = false;
                Object.keys(pricingData).forEach(key => {
                    if (key.endsWith('_ready')) {
                        const parts = key.split('_'); parts.pop();
                        const size = parts.pop();
                        const identity = parts.join('_');
                        if (!newRows[identity]) newRows[identity] = [];
                        if (!newRows[identity].includes(size)) { newRows[identity].push(size); found = true; }
                    }
                });
                return found ? newRows : prev;
            });
        }
    }, [pricingData]);


    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const toastId = toast.loading(isEditMode ? 'Updating product...' : 'Publishing product...');

        try {
            const formData = new FormData();

            if (isEditMode) formData.append('product_id', id);

            // 1. Basic Information
            formData.append('name', productName);
            formData.append('description', productDescription);
            formData.append('category_id', selectedCategory);
            formData.append('sub_category_id', selectedSubCategory);
            formData.append('room_id', selectedRoomId);
            formData.append('gender', gender);
            formData.append('wear_type_id', selectedWearType);
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

            // Deleted Materials
            materialsToDelete.forEach((delId, index) => {
                formData.append(`remove_material_ids[${index}]`, delId);
            });

            // Deleted Addons
            addonsToDelete.forEach((delId, index) => {
                formData.append(`remove_addon_ids[${index}]`, delId);
            });

            // Material Images to Delete
            if (materialImagesToDelete.length > 0) {
                formData.append('remove_image_ids', JSON.stringify(materialImagesToDelete));
                formData.append('removed_image', JSON.stringify(materialImagesToDelete));
            }

            // 3. Materials (Advanced)
            const materialsPayload = fabrics.map(m => ({
                // If ID is temp timestamp (Date.now() > 10^12) or starts with temp_, send null
                id: (String(m.id).startsWith('temp_') || (typeof m.id === 'number' && m.id > 1000000000000)) ? null : m.id,
                identity: m.identity,
                description: m.description,
                material_type: m.material_type, // Send Name
                material_type_id: ((m.availability?.custom && m.availability?.ready) ? 2 : (m.availability?.custom ? 0 : 1)), // 0: custom, 1: ready, 2: both
                availability: m.availability,
                addons: (m.addons || []).map(a => ({
                    id: (String(a.id).startsWith('temp_') || isNaN(Number(a.id)) || (typeof a.id === 'number' && a.id > 1000000000000)) ? null : a.id,
                    name: a.name,
                    amount: a.amount || a.price
                }))
            }));
            formData.append('materials_json', JSON.stringify(materialsPayload));

            fabrics.forEach((m, index) => {
                const isExistingMaterial = m.id && !String(m.id).startsWith('temp_') && !(typeof m.id === 'number' && m.id > 1000000000000);

                if (isExistingMaterial) {
                    // 1. Handle Replaced Existing Images (changed_image[id])
                    (m.existingImages || []).forEach(img => {
                        if (img.file) {
                            formData.append(`materials[${index}][changed_image][${img.id}]`, img.file);
                        }
                    });

                    // 2. Handle New Extra Images (extra_image[idx])
                    (m.newImages || []).forEach((imgObj, eIdx) => {
                        if (imgObj.file) {
                            formData.append(`materials[${index}][extra_image][${eIdx}]`, imgObj.file);
                        }
                    });
                } else {
                    // 3. Handle Completely New Material Images
                    // Use pose names for the first 5, then extras
                    const allNewFiles = [
                        ...(m.existingImages || []).map(i => i.file).filter(Boolean),
                        ...(m.newImages || []).map(i => i.file).filter(Boolean)
                    ];

                    allNewFiles.forEach((file, fIdx) => {
                        const poseNames = ['main', 'front', 'back', 'left', 'right'];
                        const key = poseNames[fIdx] || `extra_${fIdx}`;
                        formData.append(`materials[${index}][${key}]`, file);
                    });
                }

                // Addons Images
                if (m.addons && m.addons.length > 0) {
                    m.addons.forEach((addon, aIdx) => {
                        if (addon.image) {
                            formData.append(`materials[${index}][addons][${aIdx}]`, addon.image);
                        }
                    });
                }
            });

            // 4. Pricing
            // 4. Pricing
            const pricingArray = Object.keys(pricingData).map(key => {
                const parts = key.split('_');
                const type = parts.pop();
                const size = parts.pop();
                const materialId = parts.join('_');

                // Resolve ID back to the user-entered identity for backend compatibility
                const mat = fabrics.find(f => String(f.id) === materialId);
                const fabricName = mat ? mat.identity : materialId;

                return {
                    id: pricingData[key].id || null,
                    material_id: (String(materialId).startsWith('temp_') || (typeof materialId === 'number' && materialId > 1000000000000)) ? null : materialId,
                    fabric: fabricName,
                    size: size,
                    type: type,
                    price_type_id: type === 'custom' ? 0 : 1,
                    price: pricingData[key].price,
                    discount_price: pricingData[key].discount_price || 0,
                    stock: type === 'custom' ? 0 : (pricingData[key].stock || 0)
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
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try {
            const res = await axiosInstance.get(`/subcategories/by-category/${categoryId}`);
            if (res.data && res.data.data) {
                setFilteredSubCategories(res.data.data);
            } else {
                setFilteredSubCategories([]);
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            setFilteredSubCategories([]);
        }
    };

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        setSelectedCategory(catId);
        setSelectedSubCategory('');

        if (catId) {
            fetchSubCategories(catId);
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
                <div className="mb-12">
                    <div className="flex items-center justify-between max-w-4xl mx-auto relative">
                        {/* Progress Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-rose-500 -translate-y-1/2 z-0 transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${currentStep >= step.id ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 rotate-[360deg]' : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'}`}
                                >
                                    <span className="material-symbols-outlined">{step.icon}</span>
                                </div>
                                <div className={`absolute top-full mt-3 text-[10px] font-black uppercase tracking-tighter whitespace-nowrap transition-colors duration-300 ${currentStep >= step.id ? 'text-rose-500' : 'text-slate-400'}`}>
                                    {step.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 mb-24">
                    {currentStep === 1 && (
                        <Step1BasicInfo
                            productName={productName} setProductName={setProductName}
                            gender={gender} setGender={setGender}
                            categories={categories} selectedCategory={selectedCategory} handleCategoryChange={handleCategoryChange}
                            filteredSubCategories={filteredSubCategories} selectedSubCategory={selectedSubCategory} handleSubCategoryChange={handleSubCategoryChange}
                            productDescription={productDescription} setProductDescription={setProductDescription}
                            fetchMeasurementsByGender={fetchMeasurementsByGender} fetchCategoriesByGender={fetchCategoriesByGender}
                            wearTypes={wearTypes} selectedWearType={selectedWearType} handleWearTypeChange={handleWearTypeChange}
                            rooms={rooms} selectedRoomId={selectedRoomId} setSelectedRoomId={setSelectedRoomId}
                        />
                    )}

                    {currentStep === 2 && (
                        <Step2ConfigMaterials
                            isAlter={isAlter} setIsAlter={setIsAlter} alterCharge={alterCharge} setAlterCharge={setAlterCharge}
                            fabrics={fabrics} handleAddMaterial={handleAddMaterial} handleRemoveMaterial={handleRemoveMaterial} handleMaterialChange={handleMaterialChange}
                            toggleMaterialAvailability={toggleMaterialAvailability}
                            materialTypes={materialTypes} handleMaterialImageChange={handleMaterialImageChange} removeMaterialImage={removeMaterialImage}
                            handleAddAddon={handleAddAddon} handleRemoveAddon={handleRemoveAddon} handleAddonChange={handleAddonChange} handleAddonImageChange={handleAddonImageChange}
                            attributes={attributes} setAttributes={setAttributes} setIsAttributeModalOpen={setIsAttributeModalOpen}
                            // Pricing & Stock Props
                            AVAILABLE_SIZES={AVAILABLE_SIZES}
                            sizeNumbers={sizeNumbers}
                            tempFabAddSizes={tempFabAddSizes}
                            setTempFabAddSizes={setTempFabAddSizes}
                            readyPricingRows={readyPricingRows}
                            handleAddReadyRow={handleAddReadyRow}
                            handleRemoveReadyRow={handleRemoveReadyRow}
                            pricingData={pricingData}
                            handlePricingChange={handlePricingChange}
                            // Measurement Props (Moved to Step 2 Tabs)
                            availableMeasurements={availableMeasurements}
                            selectedMeasurementIds={selectedMeasurementIds}
                            toggleMeasurement={toggleMeasurement}
                            isCustomizable={isCustomizable}
                            selectedSizes={selectedSizes}
                            toggleSize={toggleSize}
                            sizeMeasurements={sizeMeasurements}
                            handleMeasurementChange={handleMeasurementChange}
                            activeTab={configActiveTab}
                            setActiveTab={setConfigActiveTab}
                        />
                    )}

                    {currentStep === 3 && (
                        <Step3Summary
                            productName={productName}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            filteredSubCategories={filteredSubCategories}
                            selectedSubCategory={selectedSubCategory}
                            fabrics={fabrics}
                            pricingData={pricingData}
                            sizeNumbers={sizeNumbers}
                            AVAILABLE_SIZES={AVAILABLE_SIZES}
                            availableMeasurements={availableMeasurements}
                            selectedMeasurementIds={selectedMeasurementIds}
                            measurementImages={measurementImages}
                            sizeMeasurements={sizeMeasurements}
                            selectedSizes={selectedSizes}
                            handleFinalSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            rooms={rooms}
                            selectedRoomId={selectedRoomId}
                            attributes={attributes}
                            onEditSection={(section) => {
                                setCurrentStep(2);
                                setConfigActiveTab(section === 'measurements' ? 'measurements' : 'materials');
                            }}
                        />
                    )}
                </div>

                {/* Navigation Controls */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 p-4 z-40">
                    <div className="container mx-auto max-w-7xl flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/pages/productlist')}
                                className="px-6 py-3 text-slate-500 hover:text-slate-700 font-bold transition"
                            >
                                Cancel
                            </button>
                            {currentStep < 3 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg"
                                >
                                    Continue
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 px-8 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/25"
                                >
                                    {id ? 'Update Product' : 'Publish Product'}
                                    <span className="material-symbols-outlined">rocket_launch</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </main>


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
        </div >
    );
};

export default Product;