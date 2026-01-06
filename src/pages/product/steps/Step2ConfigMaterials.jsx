import React, { useState } from 'react';
import Step3Measurements from './Step3Measurements';

const Step2ConfigMaterials = ({
    wearTypes, selectedWearType, handleWearTypeChange,
    fabrics, handleAddMaterial, handleRemoveMaterial, handleMaterialChange,
    toggleMaterialAvailability, handleMaterialImageChange, removeMaterialImage,
    materialTypes,
    attributes, setAttributes, setIsAttributeModalOpen,
    isAlter, setIsAlter, alterCharge, setAlterCharge,
    handleAddAddon, handleRemoveAddon, handleAddonChange, handleAddonImageChange,
    // Pricing Props
    AVAILABLE_SIZES, sizeNumbers,
    tempFabAddSizes, setTempFabAddSizes,
    readyPricingRows, handleAddReadyRow, handleRemoveReadyRow,
    pricingData, handlePricingChange,
    // Measurement Props
    availableMeasurements, selectedMeasurementIds, toggleMeasurement,
    isCustomizable, selectedSizes, toggleSize,
    sizeMeasurements, handleMeasurementChange,
    activeTab, setActiveTab
}) => {

    return (
        <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('materials')}
                    className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'materials' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'}`}
                >
                    <span className="material-symbols-outlined text-sm">texture</span>
                    Fabric & Pricing
                </button>
                <button
                    onClick={() => setActiveTab('measurements')}
                    className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'measurements' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'}`}
                >
                    <span className="material-symbols-outlined text-sm">straighten</span>
                    Measurement Details
                </button>
            </div>

            {activeTab === 'materials' ? (
                <>
                    {/* Wear Type & Configuration */}
                    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                <span className="material-symbols-outlined">settings</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuration</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Set product type and alteration options</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-900/30">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alteration Available</h3>
                                        <p className="text-xs text-slate-500">Allow size fixes for customers</p>
                                    </div>
                                    <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            type="checkbox"
                                            id="toggle-alter"
                                            checked={isAlter === 1}
                                            onChange={(e) => setIsAlter(e.target.checked ? 1 : 0)}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-rose-500 transition-all duration-300 ease-in-out"
                                        />
                                        <label htmlFor="toggle-alter" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${isAlter ? 'bg-rose-500' : 'bg-slate-300'}`}></label>
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
                                            placeholder="0"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1 pl-1">Extra charge for alterations</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Materials (Advanced) */}
                    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                <span className="material-symbols-outlined">texture</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fabrics</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Manage multiple material options for this product</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {fabrics.map((material, idx) => (
                                <div key={material.id} className="relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 transition-all">
                                    <button
                                        onClick={() => handleRemoveMaterial(idx)}
                                        className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 transition"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight uppercase">Fabric identity</label>
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                                                        ID: {(String(material.id).startsWith('temp_') || (typeof material.id === 'number' && material.id > 1000000000000)) ? 'NEW' : material.id}
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Elegant Red Chiffon"
                                                    value={material.identity}
                                                    onChange={(e) => handleMaterialChange(idx, 'identity', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 tracking-tight uppercase">Fabric name</label>
                                                {(() => {
                                                    const currentVal = material.material_type;
                                                    const isKnown = materialTypes.some(m => m.name === currentVal);
                                                    const isCustomMode = (currentVal && !isKnown) || material.force_custom_mode;

                                                    if (isCustomMode) {
                                                        return (
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Type custom material..."
                                                                    value={currentVal}
                                                                    onChange={(e) => handleMaterialChange(idx, 'material_type', e.target.value)}
                                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        handleMaterialChange(idx, 'force_custom_mode', false);
                                                                        handleMaterialChange(idx, 'material_type', '');
                                                                    }}
                                                                    className="px-3 py-2 text-slate-500 hover:text-rose-500 border border-slate-300 rounded-lg bg-white"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">list</span>
                                                                </button>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <select
                                                            value={currentVal}
                                                            onChange={(e) => {
                                                                if (e.target.value === '__other__') {
                                                                    handleMaterialChange(idx, 'force_custom_mode', true);
                                                                    handleMaterialChange(idx, 'material_type', '');
                                                                } else {
                                                                    handleMaterialChange(idx, 'material_type', e.target.value);
                                                                }
                                                            }}
                                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none appearance-none bg-white dark:bg-slate-700"
                                                        >
                                                            <option value="">Select Material</option>
                                                            {materialTypes.map(m => (
                                                                <option key={m.id} value={m.name}>{m.name}</option>
                                                            ))}
                                                            <option disabled>──────────</option>
                                                            <option value="__other__" className="font-bold text-rose-500">+ Other (Type Custom)</option>
                                                        </select>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 tracking-tight uppercase">Material Description</label>
                                            <textarea
                                                placeholder="Enter details about this material (e.g., fabric weight, feel, usage)..."
                                                value={material.description}
                                                onChange={(e) => handleMaterialChange(idx, 'description', e.target.value)}
                                                rows="2"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400 outline-none resize-none"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight uppercase">Material Images</label>
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById(`mat-${material.id}-add-new`).click()}
                                                    className="text-[10px] font-black text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-sm">add_circle</span>
                                                    ADD MORE PHOTOS
                                                </button>
                                                <input
                                                    id={`mat-${material.id}-add-new`}
                                                    type="file"
                                                    className="hidden"
                                                    multiple
                                                    onChange={(e) => handleMaterialImageChange(idx, 'add_new', e)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                {/* 1. Existing Images */}
                                                {(material.existingImages || []).map((img, imgIdx) => (
                                                    <div key={`existing-${img.id}`} className="flex flex-col gap-2">
                                                        <div className="relative group aspect-[3/4] rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:border-rose-300 transition-all">
                                                            <img src={img.url} className="w-full h-full object-cover" />

                                                            {/* Overlay Controls */}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                                                                <button
                                                                    onClick={() => document.getElementById(`mat-${material.id}-replace-${imgIdx}`).click()}
                                                                    className="p-1.5 bg-white text-slate-700 rounded-lg hover:text-rose-500 shadow-sm transition"
                                                                    title="Replace Image"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => removeMaterialImage(idx, 'existing', imgIdx)}
                                                                    className="p-1.5 bg-white text-red-500 rounded-lg hover:bg-red-50 shadow-sm transition"
                                                                    title="Remove Image"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                                </button>
                                                            </div>

                                                            <input
                                                                id={`mat-${material.id}-replace-${imgIdx}`}
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(e) => handleMaterialImageChange(idx, imgIdx, e)}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-400 text-center uppercase">Cloud Image</span>
                                                    </div>
                                                ))}

                                                {/* 2. Newly Added Images */}
                                                {(material.newImages || []).map((img, nIdx) => (
                                                    <div key={`new-${nIdx}`} className="flex flex-col gap-2">
                                                        <div className="relative group aspect-[3/4] rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:border-rose-300 border-dashed transition-all">
                                                            <img src={img.preview} className="w-full h-full object-cover" />

                                                            {/* Overlay Controls */}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                                                                <button
                                                                    onClick={() => removeMaterialImage(idx, 'new', nIdx)}
                                                                    className="p-1.5 bg-white text-red-500 rounded-lg shadow-sm transition"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-rose-500 text-center uppercase">New Image</span>
                                                    </div>
                                                ))}

                                                {/* 3. Add Placeholder if empty or just as trailing button */}
                                                <div
                                                    onClick={() => document.getElementById(`mat-${material.id}-add-new`).click()}
                                                    className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer bg-white dark:bg-slate-900 group"
                                                >
                                                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition">add_a_photo</span>
                                                    <span className="text-[10px] font-black mt-2 uppercase tracking-tighter text-center">Add Photo</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Availability Toggle */}
                                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-wrap gap-6">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Customizable</span>
                                                <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                                    <input
                                                        type="checkbox"
                                                        id={`toggle-custom-${idx}`}
                                                        checked={material.availability.custom}
                                                        onChange={() => toggleMaterialAvailability(idx, 'custom')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-rose-500 transition-all duration-300 ease-in-out"
                                                    />
                                                    <label htmlFor={`toggle-custom-${idx}`} className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${material.availability.custom ? 'bg-rose-500' : 'bg-slate-300'}`}></label>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-sky-600">Ready Made</span>
                                                <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                                    <input
                                                        type="checkbox"
                                                        id={`toggle-ready-${idx}`}
                                                        checked={material.availability.ready}
                                                        onChange={() => toggleMaterialAvailability(idx, 'ready')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-sky-500 transition-all duration-300 ease-in-out"
                                                    />
                                                    <label htmlFor={`toggle-ready-${idx}`} className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${material.availability.ready ? 'bg-sky-500' : 'bg-slate-300'}`}></label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing Section (Relocated inside Material Card) */}
                                        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                            {/* Custom Made Pricing Table */}
                                            {material.availability.custom && (
                                                <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                                    <div className="bg-rose-500 px-4 py-2 flex justify-between items-center text-white">
                                                        <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-sm">edit_square</span>
                                                            Custom Made Pricing
                                                        </div>
                                                        <div className="text-[10px] font-bold opacity-80 uppercase">All standard sizes included</div>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-xs border-collapse">
                                                            <thead>
                                                                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                                                    <th className="px-4 py-3 text-slate-500 font-black text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 uppercase">Size</th>
                                                                    <th className="px-4 py-3 text-slate-500 font-black text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 uppercase">Base Price (₹)</th>
                                                                    <th className="px-4 py-3 text-slate-500 font-black text-center last:border-r-0 uppercase">Offer Price (₹)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {AVAILABLE_SIZES.map((size) => {
                                                                    const key = `${material.id}_${size}_custom`;
                                                                    return (
                                                                        <tr key={key} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-rose-50/20 transition-colors">
                                                                            <td className="px-4 py-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 last:border-r-0">{sizeNumbers[size] || size}</td>
                                                                            <td className="p-1 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                                                                                <input
                                                                                    value={pricingData[key]?.price || ''}
                                                                                    onChange={(e) => handlePricingChange(material.id, size, 'price', e.target.value, 'custom')}
                                                                                    className="w-full px-2 py-2 bg-transparent border-0 text-center text-sm font-black text-rose-600 focus:ring-0 outline-none"
                                                                                    type="number"
                                                                                    placeholder="0"
                                                                                />
                                                                            </td>
                                                                            <td className="p-1">
                                                                                <input
                                                                                    value={pricingData[key]?.discount_price || ''}
                                                                                    onChange={(e) => handlePricingChange(material.id, size, 'discount_price', e.target.value, 'custom')}
                                                                                    className="w-full px-2 py-2 bg-transparent border-0 text-center text-sm font-black text-slate-600 focus:ring-0 outline-none"
                                                                                    type="number"
                                                                                    placeholder="0"
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Ready Made Pricing Table */}
                                            {material.availability.ready && (
                                                <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                                    <div className="bg-sky-600 px-4 py-3 flex flex-wrap gap-4 items-center justify-between text-white">
                                                        <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-sm">inventory</span>
                                                            Ready Made Inventory
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <select
                                                                value={tempFabAddSizes[material.id] || ''}
                                                                onChange={(e) => setTempFabAddSizes(prev => ({ ...prev, [material.id]: e.target.value }))}
                                                                className="px-3 py-1 text-[10px] font-bold border border-white/20 rounded bg-white/10 text-white outline-none focus:bg-white/20 transition appearance-none"
                                                            >
                                                                <option value="" className="text-slate-900">Add Size...</option>
                                                                {AVAILABLE_SIZES
                                                                    .filter(s => !(readyPricingRows[material.id] || []).includes(s))
                                                                    .map(s => <option key={s} value={s} className="text-slate-900">{s}</option>)
                                                                }
                                                            </select>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    handleAddReadyRow(material.id, tempFabAddSizes[material.id]);
                                                                    setTempFabAddSizes(prev => ({ ...prev, [material.id]: '' }));
                                                                }}
                                                                disabled={!tempFabAddSizes[material.id]}
                                                                className="px-4 py-1 bg-white text-sky-600 rounded text-[10px] font-black hover:bg-sky-50 disabled:opacity-50 transition shadow-sm"
                                                            >
                                                                + ADD SIZE
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-xs border-collapse">
                                                            <thead>
                                                                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                                                    <th className="px-4 py-3 text-slate-500 font-black text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 uppercase">Size</th>
                                                                    <th className="px-4 py-3 text-slate-500 font-black text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 uppercase">Price (₹)</th>
                                                                    <th className="px-4 py-3 text-slate-500 font-black text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 uppercase">Offer Price (₹)</th>
                                                                    <th className="px-4 py-3 text-slate-500 font-black text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 uppercase">Stock Qty</th>
                                                                    <th className="px-4 py-3 text-center w-12 uppercase">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(readyPricingRows[material.id] || []).length > 0 ? (
                                                                    readyPricingRows[material.id].map((size) => {
                                                                        const key = `${material.id}_${size}_ready`;
                                                                        return (
                                                                            <tr key={key} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-sky-50/20 transition-colors">
                                                                                <td className="px-4 py-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 last:border-r-0">{sizeNumbers[size] || size}</td>
                                                                                <td className="p-1 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                                                                                    <input
                                                                                        value={pricingData[key]?.price || ''}
                                                                                        onChange={(e) => handlePricingChange(material.id, size, 'price', e.target.value, 'ready')}
                                                                                        className="w-full px-2 py-2 bg-transparent border-0 text-center text-sm font-black text-sky-600 focus:ring-0 outline-none"
                                                                                        type="number"
                                                                                        placeholder="0"
                                                                                    />
                                                                                </td>
                                                                                <td className="p-1 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                                                                                    <input
                                                                                        value={pricingData[key]?.discount_price || ''}
                                                                                        onChange={(e) => handlePricingChange(material.id, size, 'discount_price', e.target.value, 'ready')}
                                                                                        className="w-full px-2 py-2 bg-transparent border-0 text-center text-sm font-black text-slate-600 focus:ring-0 outline-none"
                                                                                        type="number"
                                                                                        placeholder="0"
                                                                                    />
                                                                                </td>
                                                                                <td className="p-1 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                                                                                    <input
                                                                                        value={pricingData[key]?.stock || ''}
                                                                                        onChange={(e) => handlePricingChange(material.id, size, 'stock', e.target.value, 'ready')}
                                                                                        className="w-full px-2 py-2 bg-transparent border-0 text-center text-sm font-black text-slate-900 focus:ring-0 outline-none"
                                                                                        type="number"
                                                                                        placeholder="0"
                                                                                    />
                                                                                </td>
                                                                                <td className="p-1 text-center">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleRemoveReadyRow(material.id, size)}
                                                                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                                                                    >
                                                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="5" className="py-8 bg-slate-50 dark:bg-slate-900/50 text-center text-slate-400 italic text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 dark:border-slate-700 m-2 rounded-xl">
                                                                            No sizes added to inventory.
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Addons Section (Nested inside Material Card) */}
                                            <div className="space-y-4 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Material Specific Addons</h4>
                                                        <p className="text-[10px] text-slate-500 font-medium">Extra customization options for this material</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddAddon(idx)}
                                                        className="px-4 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-black hover:bg-rose-600 transition shadow-sm flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add_circle</span>
                                                        ADD ADDON
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {(material.addons || []).map((addon, addonIdx) => (
                                                        <div key={addon.id} className="relative group bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-rose-300 transition-all">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAddon(idx, addonIdx)}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-700 text-rose-500 rounded-full shadow-md border border-slate-100 dark:border-slate-600 flex items-center justify-center hover:bg-rose-50 transition z-10"
                                                            >
                                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                                            </button>

                                                            <div className="flex gap-4">
                                                                <div
                                                                    onClick={() => document.getElementById(`addon-img-${idx}-${addonIdx}`).click()}
                                                                    className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:border-rose-400 flex items-center justify-center bg-slate-50 dark:bg-slate-900"
                                                                >
                                                                    <input
                                                                        id={`addon-img-${idx}-${addonIdx}`}
                                                                        type="file"
                                                                        className="hidden"
                                                                        onChange={(e) => handleAddonImageChange(idx, addonIdx, e)}
                                                                    />
                                                                    {addon.preview ? (
                                                                        <img src={addon.preview} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="material-symbols-outlined text-slate-300">add_photo_alternate</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 space-y-2">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Addon Name (e.g. Cuff Embroidery)"
                                                                        value={addon.name}
                                                                        onChange={(e) => handleAddonChange(idx, addonIdx, 'name', e.target.value)}
                                                                        className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-700/50 border border-transparent rounded-lg focus:border-rose-500 outline-none"
                                                                    />
                                                                    <div className="relative">
                                                                        <span className="absolute left-2 top-1.5 text-[10px] text-slate-400 font-bold">₹</span>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Charge"
                                                                            value={addon.amount}
                                                                            onChange={(e) => handleAddonChange(idx, addonIdx, 'amount', e.target.value)}
                                                                            className="w-full pl-6 pr-3 py-1.5 text-xs font-bold text-rose-600 bg-slate-50 dark:bg-slate-700/50 border border-transparent rounded-lg focus:border-rose-500 outline-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(material.addons || []).length === 0 && (
                                                        <div className="col-span-full py-6 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                                                            <span className="material-symbols-outlined text-2xl mb-1 opacity-20">extension</span>
                                                            <p className="text-[10px] font-bold uppercase tracking-tight opacity-40">No addons for this material</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleAddMaterial}
                                className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 font-bold hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">add_circle</span>
                                ADD NEW MATERIAL OPTION
                            </button>
                        </div>
                    </section>

                    {/* Attributes Section */}
                    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                <span className="material-symbols-outlined">label</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product Attributes</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Add metadata like Fit, Style, Fabric Composition etc.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {attributes.map((attr, idx) => (
                                <div key={idx} className="relative group bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-100 dark:border-slate-600 text-center transition-all hover:shadow-sm">
                                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{attr.key}</span>
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{attr.value}</div>
                                    <button
                                        onClick={() => setAttributes(attributes.filter((_, i) => i !== idx))}
                                        className="absolute top-2 right-2 hidden group-hover:flex text-red-500 p-1 bg-white dark:bg-slate-800 rounded shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setIsAttributeModalOpen(true)}
                                className="aspect-square flex flex-col items-center justify-center rounded-xl border border-dashed border-rose-300 text-rose-500 hover:bg-rose-50/5 transition group"
                            >
                                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition">add_circle</span>
                                <span className="text-[10px] font-bold mt-1">NEW ATTR</span>
                            </button>
                        </div>
                    </section>
                </>
            ) : (
                <Step3Measurements
                    availableMeasurements={availableMeasurements}
                    selectedMeasurementIds={selectedMeasurementIds}
                    toggleMeasurement={toggleMeasurement}
                    isCustomizable={isCustomizable}
                    selectedSizes={selectedSizes}
                    toggleSize={toggleSize}
                    sizeMeasurements={sizeMeasurements}
                    handleMeasurementChange={handleMeasurementChange}
                    AVAILABLE_SIZES={AVAILABLE_SIZES}
                    sizeNumbers={sizeNumbers}
                />
            )}
        </div>
    );
};

export default Step2ConfigMaterials;
