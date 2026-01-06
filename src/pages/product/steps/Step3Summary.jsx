import React, { useState } from 'react';

const Step3Summary = ({
    productName, categories, selectedCategory, filteredSubCategories, selectedSubCategory,
    fabrics, pricingData, sizeNumbers, AVAILABLE_SIZES,
    availableMeasurements, selectedMeasurementIds, measurementImages,
    sizeMeasurements, selectedSizes,
    handleFinalSubmit, isSubmitting,
    onEditSection,
    rooms, selectedRoomId,
    attributes
}) => {
    const [activeTab, setActiveTab] = useState(0); // number for material index, or 'measurements'
    const [verifiedTabs, setVerifiedTabs] = useState({}); // { [index|'measurements']: boolean }

    const isMeasurementTab = activeTab === 'measurements';
    const material = !isMeasurementTab ? fabrics[activeTab] : null;

    if (!material && !isMeasurementTab) return <div className="p-10 text-center text-slate-500">No content to summarize.</div>;

    const categoryName = categories.find(c => String(c.id) === String(selectedCategory))?.name || '---';
    const subCategoryName = filteredSubCategories.find(s => String(s.id) === String(selectedSubCategory))?.name || '---';
    const selectedRoom = rooms.find(r => String(r.id) === String(selectedRoomId));

    // Check if ALL tabs are verified
    const allMaterialsVerified = fabrics.every((_, idx) => verifiedTabs[idx]);
    const measurementVerified = verifiedTabs['measurements'];
    const isReadyToSubmit = allMaterialsVerified && measurementVerified;

    const toggleVerification = (tabKey) => {
        setVerifiedTabs(prev => ({
            ...prev,
            [tabKey]: !prev[tabKey]
        }));
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Material Selector - Top Bar */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                {fabrics.map((mat, idx) => (
                    <button
                        key={mat.id}
                        onClick={() => setActiveTab(idx)}
                        className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === idx
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                            : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm">texture</span>
                        <div className="flex flex-col items-center">
                            <span>{mat.identity || `Material ${idx + 1}`}</span>
                            {verifiedTabs[idx] && <span className="text-[8px] opacity-80 leading-none">VERIFIED</span>}
                        </div>
                    </button>
                ))}
                <button
                    onClick={() => setActiveTab('measurements')}
                    className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'measurements'
                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                        : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'
                        }`}
                >
                    <span className="material-symbols-outlined text-sm">straighten</span>
                    <div className="flex flex-col items-center">
                        <span>MEASUREMENT</span>
                        {verifiedTabs['measurements'] && <span className="text-[8px] opacity-80 leading-none">VERIFIED</span>}
                    </div>
                </button>
            </div>

            {/* Main Summary Card */}
            <div className="relative bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Reference style Folder Tab */}
                <div className="absolute top-0 left-0 pt-3 pl-8">
                    <div className="bg-slate-800 dark:bg-slate-900 px-6 py-1.5 rounded-t-xl inline-block">
                        <span className="text-white font-black italic tracking-tighter text-sm uppercase">SUMMARY</span>
                    </div>
                </div>

                <div className="p-8 pt-16">
                    {/* GLOBAL PRODUCT INFO HEADER */}
                    <section className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-10 flex flex-wrap items-center gap-x-12 gap-y-6">
                        <div className="min-w-[200px]">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Product Name</label>
                            <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter block truncate max-w-sm">{productName || 'Unnamed Product'}</span>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category / Sub-Category</label>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{categoryName}</span>
                                <span className="text-slate-300">/</span>
                                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{subCategoryName}</span>
                            </div>
                        </div>

                        {selectedRoom && (
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Assigned Room</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
                                        <img src={selectedRoom.image} className="w-full h-full object-cover" alt="room" />
                                    </div>
                                    <span className="text-sm font-black text-rose-500 uppercase tracking-tight">{selectedRoom.name}</span>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* PRODUCT ATTRIBUTES */}
                    {attributes && attributes.length > 0 && (
                        <section className="mb-10">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">PRODUCT ATTRIBUTES</label>
                            <div className="flex flex-wrap gap-4">
                                {attributes.map((attr, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col min-w-[140px]">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 underline decoration-rose-500/30 underline-offset-4">{attr.key}</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{attr.value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {isMeasurementTab ? (
                        <div className="space-y-10">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                    PRODUCT MEASUREMENTS
                                </h2>
                                <p className="text-sm font-medium text-slate-500">Selected measurement points and size charts</p>
                            </div>

                            <section>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">SELECTED POINTS</label>
                                <div className="flex flex-wrap gap-6">
                                    {selectedMeasurementIds.length > 0 ? (
                                        selectedMeasurementIds.map(id => {
                                            const meas = availableMeasurements.find(m => m.id === id);
                                            const imgObj = measurementImages[id];
                                            return (
                                                <div key={id} className="flex flex-col items-center gap-2">
                                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-1">
                                                        {imgObj?.preview || (meas?.img_path) ? (
                                                            <img
                                                                src={imgObj?.preview || (meas.img_path.startsWith('http') ? meas.img_path : `${import.meta.env.VITE_API}/${meas.img_path}`)}
                                                                className="w-full h-full object-contain rounded-xl"
                                                                alt={meas?.name}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                                <span className="material-symbols-outlined text-2xl">straighten</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tighter text-center">{meas?.name || '---'}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-xs italic text-slate-500">No specific measurements selected.</div>
                                    )}
                                </div>
                            </section>

                            <section>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">SIZE CHART PREVIEW</label>
                                <div className="border border-slate-900 dark:border-slate-700 rounded-sm overflow-hidden overflow-x-auto">
                                    <table className="w-full text-left text-[11px] font-bold border-collapse">
                                        <thead>
                                            <tr className="bg-slate-200 dark:bg-slate-800 border-b border-slate-900 dark:border-slate-700">
                                                <th className="px-3 py-1.5 border-r border-slate-900 dark:border-slate-700">Size</th>
                                                {selectedMeasurementIds.map(id => (
                                                    <th key={id} className="px-3 py-1.5 border-r border-slate-900 dark:border-slate-700 text-center uppercase tracking-tighter">
                                                        {availableMeasurements.find(m => m.id === id)?.name || '---'}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {AVAILABLE_SIZES.filter(s => selectedSizes.includes(s)).map(size => (
                                                <tr key={size} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                                                    <td className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">{sizeNumbers[size] || size}</td>
                                                    {selectedMeasurementIds.map(id => (
                                                        <td key={id} className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 text-center">
                                                            {sizeMeasurements[size]?.[`meas_${id}`] || '---'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            {selectedSizes.length === 0 && (
                                                <tr>
                                                    <td colSpan={selectedMeasurementIds.length + 1} className="px-3 py-4 text-center text-slate-400 italic">No sizes selected.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Verification for Measurements */}
                            <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={!!verifiedTabs['measurements']}
                                            onChange={() => toggleVerification('measurements')}
                                        />
                                        <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 peer-checked:bg-sky-600 peer-checked:border-sky-600 transition-all flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-lg scale-0 peer-checked:scale-100 transition-transform">check</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-sky-600 transition-colors">I HAVE VERIFIED MEASUREMENT DETAILS</span>
                                </label>
                                <button
                                    onClick={() => onEditSection('measurements')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    Edit
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* PHOTOS SECTION */}
                            <section>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">PHOTOS</label>
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex flex-wrap gap-4">
                                        {/* 1. Existing Images */}
                                        {(material.existingImages || []).map((img, imgIdx) => (
                                            <div key={`existing-${img.id || imgIdx}`} className="relative group">
                                                <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 bg-slate-50 shadow-sm">
                                                    <img src={img.url} className="w-full h-full object-cover" alt={`Material ${imgIdx + 1}`} />
                                                </div>
                                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[8px] font-black px-1.5 rounded uppercase tracking-tighter">Existing</span>
                                            </div>
                                        ))}

                                        {/* 2. New Images */}
                                        {(material.newImages || []).map((img, nIdx) => (
                                            <div key={`new-${nIdx}`} className="relative group">
                                                <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-rose-100 dark:border-rose-900/30 bg-rose-50/30 shadow-sm border-dashed">
                                                    <img src={img.preview} className="w-full h-full object-cover" alt={`New ${nIdx + 1}`} />
                                                </div>
                                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[8px] font-black px-1.5 rounded uppercase tracking-tighter">New</span>
                                            </div>
                                        ))}

                                        {/* Empty State */}
                                        {(material.existingImages?.length === 0 && material.newImages?.length === 0) && (
                                            <div className="w-full py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">image_not_supported</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">No Photos Added</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* PRICING TABLES */}
                            <div className="space-y-8">
                                {/* Custom Made Pricing Table */}
                                {material.availability.custom && (
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] block">Customize Pricing ({material.identity})</label>
                                            <div className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded text-[8px] font-black uppercase tracking-widest border border-rose-100">Bespoke</div>
                                        </div>
                                        <div className="border border-slate-900 dark:border-slate-700 rounded-sm overflow-hidden">
                                            <table className="w-full text-left text-[11px] font-bold border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-200 dark:bg-slate-800 border-b border-slate-900 dark:border-slate-700">
                                                        <th className="px-3 py-2 border-r border-slate-900 dark:border-slate-700">Size</th>
                                                        <th className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 text-center">Base Price</th>
                                                        <th className="px-3 py-2 text-center">Offer Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {AVAILABLE_SIZES.map(size => {
                                                        const key = `${material.id}_${size}_custom`;
                                                        const custom = pricingData[key];
                                                        if (!custom) return null;
                                                        return (
                                                            <tr key={size} className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-rose-50/10 transition-colors">
                                                                <td className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">{sizeNumbers[size] || size}</td>
                                                                <td className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 text-center">₹{custom.price || '0'}</td>
                                                                <td className="px-3 py-2 text-center text-rose-600">₹{custom.discount_price || '0'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                )}

                                {/* Ready Made Pricing Table */}
                                {material.availability.ready && (
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-[10px] font-black text-sky-600 uppercase tracking-[0.2em] block">Ready-made Pricing ({material.identity})</label>
                                            <div className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded text-[8px] font-black uppercase tracking-widest border border-sky-100">Standard</div>
                                        </div>
                                        <div className="border border-slate-900 dark:border-slate-700 rounded-sm overflow-hidden">
                                            <table className="w-full text-left text-[11px] font-bold border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-200 dark:bg-slate-800 border-b border-slate-900 dark:border-slate-700">
                                                        <th className="px-3 py-2 border-r border-slate-900 dark:border-slate-700">Size</th>
                                                        <th className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 text-center">Price</th>
                                                        <th className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 text-center">Offer Price</th>
                                                        <th className="px-3 py-2 text-center">Stock</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {AVAILABLE_SIZES.map(size => {
                                                        const key = `${material.id}_${size}_ready`;
                                                        const ready = pricingData[key];
                                                        if (!ready) return null;
                                                        return (
                                                            <tr key={size} className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-sky-50/10 transition-colors">
                                                                <td className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">{sizeNumbers[size] || size}</td>
                                                                <td className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 text-center">₹{ready.price || '0'}</td>
                                                                <td className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 text-center text-sky-600">₹{ready.discount_price || '0'}</td>
                                                                <td className="px-3 py-2 text-center">{ready.stock || '0'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* ADD ON */}
                            <section>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">ADD ON</label>
                                <div className="border border-slate-900 dark:border-slate-700 rounded-sm overflow-hidden">
                                    <table className="w-full text-left text-[11px] font-bold border-collapse">
                                        <thead>
                                            <tr className="bg-slate-200 dark:bg-slate-800 border-b border-slate-900 dark:border-slate-700">
                                                <th className="px-3 py-1.5 border-r border-slate-900 dark:border-slate-700">Detail</th>
                                                <th className="px-3 py-1.5 border-r border-slate-900 dark:border-slate-700 text-center">Picture</th>
                                                <th className="px-3 py-1.5 text-center">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(material.addons || []).map((addon, aIdx) => (
                                                <tr key={addon.id || aIdx} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                                                    <td className="px-3 py-2 border-r border-slate-900 dark:border-slate-700 align-middle">{addon.name || '---'}</td>
                                                    <td className="px-3 py-1 border-r border-slate-900 dark:border-slate-700 text-center">
                                                        {addon.preview ? (
                                                            <img src={addon.preview} className="w-10 h-10 object-cover rounded mx-auto" />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-slate-300">image</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-center align-middle">₹{addon.price || addon.amount || '0'}</td>
                                                </tr>
                                            ))}
                                            {(material.addons || []).length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className="px-3 py-4 text-center text-slate-400 italic">No addons for this material.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Verification for Material */}
                            <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={!!verifiedTabs[activeTab]}
                                            onChange={() => toggleVerification(activeTab)}
                                        />
                                        <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-lg scale-0 peer-checked:scale-100 transition-transform">check</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-rose-600 transition-colors">I HAVE VERIFIED THIS MATERIAL DETAILS</span>
                                </label>
                                <button
                                    onClick={() => onEditSection('materials')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    Edit
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-wrap items-center justify-center gap-8 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={() => handleFinalSubmit('save')}
                        disabled={isSubmitting || !isReadyToSubmit}
                        className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase hover:text-rose-500 transition-colors disabled:opacity-30 flex items-center gap-2"
                    >
                        {isSubmitting ? 'SAVING...' : 'SAVE'}
                    </button>
                    <button
                        onClick={() => handleFinalSubmit('active')}
                        disabled={isSubmitting || !isReadyToSubmit}
                        className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase hover:text-rose-500 transition-colors disabled:opacity-30 flex items-center gap-2"
                    >
                        {isSubmitting ? 'PROCESSING...' : 'SAVE & ACTIVE'}
                    </button>
                    {!isReadyToSubmit && (
                        <span className="text-[10px] font-bold text-rose-500 uppercase animate-pulse">Please verify all tabs to enable publishing</span>
                    )}
                </div>
            </div >
        </div >
    );
};

export default Step3Summary;
