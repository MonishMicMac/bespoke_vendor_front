import React from 'react';

const Step3Measurements = ({
    availableMeasurements, selectedMeasurementIds, toggleMeasurement,
    isCustomizable,
    AVAILABLE_SIZES, selectedSizes, toggleSize,
    sizeMeasurements, handleMeasurementChange, sizeNumbers
}) => {
    return (
        <div className="space-y-8">
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                        <span className="material-symbols-outlined">straighten</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Measurements & Sizes</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Select applicable measurements for this product</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-rose-500">app_registration</span>
                            Measurement Selection
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {availableMeasurements.map((meas) => {
                                const isReadOnly = isCustomizable === 0;
                                const isSelected = selectedMeasurementIds.includes(meas.id);
                                return (
                                    <label
                                        key={meas.id}
                                        className={`relative flex flex-col gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${isSelected ? 'border-rose-500 bg-rose-500/5 shadow-md shadow-rose-500/5' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'} ${isReadOnly ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:border-rose-300 dark:hover:border-slate-600'}`}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => !isReadOnly && toggleMeasurement(meas.id)}
                                                    disabled={isReadOnly}
                                                    className="peer sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-rose-500 border-rose-500 scale-110' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                                    <span className="material-symbols-outlined text-white text-[14px]">check</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <span className={`block text-[11px] font-black leading-none uppercase tracking-tighter ${isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>{meas.name}</span>
                                            </div>
                                        </div>
                                        {meas.img_path && (
                                            <div className="w-full aspect-[3/4] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden mt-1 group">
                                                <img
                                                    src={meas.img_path.startsWith('http') ? meas.img_path : `${import.meta.env.VITE_API}/${meas.img_path}`}
                                                    alt={meas.name}
                                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        )}
                                    </label>
                                );
                            })}
                            {availableMeasurements.length === 0 && (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">data_alert</span>
                                    <p className="text-sm font-medium">No measurements found for this selection.</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Check category or gender settings</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sizes Selection */}
                    {selectedMeasurementIds.length > 0 && (
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-rose-500">grid_view</span>
                                Select Standard Sizes
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_SIZES.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300 ${selectedSizes.includes(size) ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Measurements Table */}
                    {selectedSizes.length > 0 && selectedMeasurementIds.length > 0 && (
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Measurement Chart</h3>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-slate-800 text-white">
                                                <th className="px-6 py-4 font-black text-center border-r border-slate-700/50 last:border-r-0 min-w-[100px] uppercase tracking-tighter">Size</th>
                                                {selectedMeasurementIds.map(mid => {
                                                    const m = availableMeasurements.find(am => am.id === mid);
                                                    return (
                                                        <th key={mid} className="px-6 py-4 font-black text-center border-r border-slate-700/50 last:border-r-0 min-w-[120px] uppercase tracking-tighter">
                                                            {m?.name || ''}
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedSizes.map((size, idx) => (
                                                <tr
                                                    key={size}
                                                    className={`${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50'} border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-rose-50/30 dark:hover:bg-rose-500/5 transition-colors`}
                                                >
                                                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white text-center border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                                        <span className="text-lg">{size}</span>
                                                    </td>
                                                    {selectedMeasurementIds.map(mid => (
                                                        <td key={mid} className="px-4 py-2 text-center border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    readOnly={true}
                                                                    value={sizeMeasurements[size]?.[`meas_${mid}`] || '--'}
                                                                    className="w-full max-w-[80px] px-2 py-2 bg-transparent text-center text-sm font-black text-slate-900 dark:text-white outline-none border border-transparent cursor-default"
                                                                />
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Step3Measurements;
