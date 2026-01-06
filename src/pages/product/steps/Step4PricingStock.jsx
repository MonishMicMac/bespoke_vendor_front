import React from 'react';

const Step4PricingStock = ({
    fabrics,
    AVAILABLE_SIZES, sizeNumbers,
    tempFabAddSizes, setTempFabAddSizes,
    readyPricingRows, handleAddReadyRow, handleRemoveReadyRow,
    pricingData, handlePricingChange
}) => {
    return (
        <div className="space-y-8">
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                        <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pricing & Stock Management</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Define pricing and stock levels for each material and size</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {fabrics.map((material, idx) => (
                        <div key={material.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-rose-500 shadow-sm">
                                    <span className="material-symbols-outlined">texture</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{material.identity || `Material ${idx + 1}`}</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{material.material_type_id || 'unspecified'}</p>
                                </div>
                                <div className="flex gap-2">
                                    {material.availability.custom && <span className="px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-tighter border border-rose-500/20">Custom Enabled</span>}
                                    {material.availability.ready && <span className="px-3 py-1 bg-sky-500/10 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-tighter border border-sky-500/20">Ready Enabled</span>}
                                </div>
                            </div>

                            <div className="space-y-8">
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
                                                        const key = `${material.identity}_${size}_custom`;
                                                        return (
                                                            <tr key={key} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-rose-50/20 transition-colors">
                                                                <td className="px-4 py-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 last:border-r-0">{sizeNumbers[size] || size}</td>
                                                                <td className="p-1 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                                                                    <input
                                                                        value={pricingData[key]?.price || ''}
                                                                        onChange={(e) => handlePricingChange(material.identity, size, 'price', e.target.value, 'custom')}
                                                                        className="w-full px-2 py-2 bg-transparent border-0 text-center text-sm font-black text-rose-600 focus:ring-0 outline-none"
                                                                        type="number"
                                                                        placeholder="0"
                                                                    />
                                                                </td>
                                                                <td className="p-1">
                                                                    <input
                                                                        value={pricingData[key]?.discount_price || ''}
                                                                        onChange={(e) => handlePricingChange(material.identity, size, 'discount_price', e.target.value, 'custom')}
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
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm mt-6">
                                        <div className="bg-sky-600 px-4 py-3 flex flex-wrap gap-4 items-center justify-between text-white">
                                            <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">inventory</span>
                                                Ready Made Inventory
                                            </div>
                                            <div className="flex gap-2">
                                                <select
                                                    value={tempFabAddSizes[material.identity] || ''}
                                                    onChange={(e) => setTempFabAddSizes(prev => ({ ...prev, [material.identity]: e.target.value }))}
                                                    className="px-3 py-1 text-[10px] font-bold border border-white/20 rounded bg-white/10 text-white outline-none focus:bg-white/20 transition appearance-none"
                                                >
                                                    <option value="" className="text-slate-900">Add Size...</option>
                                                    {AVAILABLE_SIZES
                                                        .filter(s => !(readyPricingRows[material.identity] || []).includes(s))
                                                        .map(s => <option key={s} value={s} className="text-slate-900">{s}</option>)
                                                    }
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleAddReadyRow(material.identity, tempFabAddSizes[material.identity]);
                                                        setTempFabAddSizes(prev => ({ ...prev, [material.identity]: '' }));
                                                    }}
                                                    disabled={!tempFabAddSizes[material.identity]}
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
                                                    {(readyPricingRows[material.identity] || []).length > 0 ? (
                                                        readyPricingRows[material.identity].map((size) => {
                                                            const key = `${material.identity}_${size}_ready`;
                                                            return (
                                                                <tr key={key} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-sky-50/20 transition-colors">
                                                                    <td className="px-4 py-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 last:border-r-0">{sizeNumbers[size] || size}</td>
                                                                    <td className="p-1 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                                                                        <input
                                                                            value={pricingData[key]?.price || ''}
                                                                            onChange={(e) => handlePricingChange(material.identity, size, 'price', e.target.value, 'ready')}
                                                                            className="w-full px-2 py-2 bg-transparent border-0 text-center text-sm font-black text-sky-600 focus:ring-0 outline-none"
                                                                            type="number"
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="p-1 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                                                                        <input
                                                                            value={pricingData[key]?.discount_price || ''}
                                                                            onChange={(e) => handlePricingChange(material.identity, size, 'discount_price', e.target.value, 'ready')}
                                                                            className="w-full px-2 py-2 bg-transparent border-0 text-center text-sm font-black text-slate-600 focus:ring-0 outline-none"
                                                                            type="number"
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="p-1 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                                                                        <input
                                                                            value={pricingData[key]?.stock || ''}
                                                                            onChange={(e) => handlePricingChange(material.identity, size, 'stock', e.target.value, 'ready')}
                                                                            className="w-full px-2 py-2 bg-transparent border-0 text-center text-sm font-black text-slate-900 focus:ring-0 outline-none"
                                                                            type="number"
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="p-1 text-center">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveReadyRow(material.identity, size)}
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
                                                            <td colSpan="5" className="py-12 bg-slate-50 dark:bg-slate-900/50 text-center text-slate-400 italic text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 dark:border-slate-700 m-4 rounded-xl">
                                                                No sizes added to inventory. Use the selector above to add sizes.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {(!material.availability.custom && !material.availability.ready) && (
                                    <div className="py-8 text-center bg-white dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">error</span>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">Availability Not Selected</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Please enable Custom or Ready Made availability in Step 2 for this material.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {fabrics.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">texture</span>
                            <h3 className="text-xl font-black uppercase tracking-widest opacity-50">No Materials Found</h3>
                            <p className="text-sm font-bold mt-2 opacity-50">Go back to Step 2 to add materials first.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Step4PricingStock;
