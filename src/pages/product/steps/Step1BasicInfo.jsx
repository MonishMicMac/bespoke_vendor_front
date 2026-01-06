import React from 'react';

const Step1BasicInfo = ({
    productName, setProductName,
    gender, setGender,
    categories, selectedCategory, handleCategoryChange,
    filteredSubCategories, selectedSubCategory, handleSubCategoryChange,
    productDescription, setProductDescription,
    fetchMeasurementsByGender, fetchCategoriesByGender,
    wearTypes, selectedWearType, handleWearTypeChange,
    rooms, selectedRoomId, setSelectedRoomId
}) => {
    return (
        <div className="space-y-8">
            {/* 1. Basic Information */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                        <span className="material-symbols-outlined">edit_note</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Core product details and categorization</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Room Selection */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-tight">Select Room</label>
                        <div className="flex flex-wrap gap-4">
                            {rooms.length > 0 ? (
                                rooms.map(room => (
                                    <button
                                        key={room.id}
                                        type="button"
                                        onClick={() => setSelectedRoomId(room.id)}
                                        className={`relative group flex flex-col items-center gap-2 p-2 rounded-2xl border-2 transition-all duration-300 ${selectedRoomId === room.id ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-500/10 shadow-lg shadow-rose-500/10' : 'border-slate-100 dark:border-slate-700 bg-slate-50/50 hover:border-slate-300'}`}
                                    >
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-inner">
                                            {room.image ? (
                                                <img src={room.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={room.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                    <span className="material-symbols-outlined size-8">meeting_room</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedRoomId === room.id ? 'text-rose-600' : 'text-slate-500'}`}>{room.name}</span>
                                        {selectedRoomId === room.id && (
                                            <div className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                            </div>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="text-xs text-slate-400 italic">Loading rooms...</div>
                            )}
                        </div>
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400"
                            rows="4"
                            placeholder="Tell more about your product..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                        <div className="flex gap-3">
                            {['Female', 'Male', 'Unisex'].map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => {
                                        setGender(g);
                                        fetchMeasurementsByGender(g);
                                        fetchCategoriesByGender(g);
                                    }}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${gender === g ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50'}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Wear Type</label>
                            <select
                                value={selectedWearType}
                                onChange={handleWearTypeChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all appearance-none"
                            >
                                <option value="">Select Wear Type</option>
                                {wearTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
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
                                onChange={handleSubCategoryChange}
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
                </div>
            </section>
        </div>
    );
};

export default Step1BasicInfo;
