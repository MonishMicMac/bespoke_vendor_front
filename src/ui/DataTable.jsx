import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ columns, data, loading, pagination, onPageChange }) => {
    return (
        <div className="relative">
            {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className={`px-6 py-4 ${col.tdClassName || ''}`}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {!loading && data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500 font-medium">
                        Showing <span className="text-slate-900 font-bold">{pagination.from}</span> to <span className="text-slate-900 font-bold">{pagination.to}</span> of <span className="text-slate-900 font-bold">{pagination.total}</span> entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 transition shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(pagination.last_page)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => onPageChange(i + 1)}
                                    className={`w-9 h-9 rounded-lg text-sm font-bold transition ${pagination.current_page === i + 1
                                            ? 'bg-slate-900 text-white shadow-md'
                                            : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => onPageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 transition shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
