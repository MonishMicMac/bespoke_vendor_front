import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderDetails } from "../../services/vendorService";
import {
    Printer,
    Check,
    Package,
    Truck,
    CheckCircle2,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    User,
    Loader2,
    AlertCircle,
    ChevronRight
} from "lucide-react";

const STEPS = [
    { id: "0", label: "Placed", icon: Check },
    { id: "1", label: "Confirmed", icon: CheckCircle2 },
    { id: "2", label: "Processing", icon: Package },
    { id: "3", label: "Shipped", icon: Truck },
    { id: "4", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['orderDetail', id],
        queryFn: () => getOrderDetails(id),
        staleTime: 1000 * 60 * 5,
    });

    const formatCurrency = (amount) => {
        return "₹" + Number(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateString, includeTime = true) => {
        if (!dateString) return "N/A";
        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        };
        if (includeTime) {
            options.hour = 'numeric';
            options.minute = 'numeric';
            options.hour12 = true;
        }
        return new Date(dateString).toLocaleString('en-US', options);
    };

    if (isLoading) {
        return (
            <div className="flex bg-slate-50 items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-rose-500" size={48} />
                    <span className="font-medium text-slate-600">Loading Order Details...</span>
                </div>
            </div>
        );
    }

    if (isError || !data?.status) {
        return (
            <div className="flex flex-col bg-slate-50 items-center justify-center min-h-screen text-red-500 p-6">
                <AlertCircle size={64} className="mb-4" />
                <h2 className="text-xl font-bold">Error Loading Order</h2>
                <p className="text-slate-500 mt-2">{error?.message || "Failed to fetch order details."}</p>
            </div>
        );
    }

    const { orderdetails: order, customerdetails: customer } = data.data;
    const currentStatusLabel = STEPS.find(s => String(s.id) === String(order.orderStatus))?.label || "Processing";
    const currentStepIndex = STEPS.findIndex(step => String(step.id) === String(order.orderStatus));

    const subtotal = Number(order.subtotal || 0);
    const deliveryCharges = Number(order.extra_charges?.delivery || 0);
    const total = subtotal + deliveryCharges;

    return (
        <div className="min-h-screen bg-[#f8fbff] text-slate-800 p-6 md:p-12 font-sans selection:bg-rose-100 italic-none">
            <div className="max-w-[1400px] mx-auto">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-4">
                        <span className="cursor-pointer hover:text-rose-500 transition-colors" onClick={() => navigate('/orders')}>Orders</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-600">Order #{order.OrderId}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">Order #{order.OrderId}</h1>
                                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-xs font-bold ring-1 ring-rose-100">
                                    {currentStatusLabel}
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                                Placed on {formatDate(order.placed_time_and_date)} via Web Store
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
                                Invoice
                            </button>
                            <button className="px-6 py-2.5 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-200">
                                Track Order
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Order Status Card */}
                        <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-12">Order Status</h3>
                            <div className="relative flex justify-between">
                                {/* Base Line */}
                                <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0" />

                                {/* Active Line */}
                                <div
                                    className="absolute top-5 left-0 h-[3px] bg-rose-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out"
                                    style={{ width: `${(Math.max(0, currentStepIndex) / (STEPS.length - 1)) * 100}%` }}
                                />

                                {STEPS.map((step, index) => {
                                    const isCompleted = index < currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    const isFuture = index > currentStepIndex;

                                    return (
                                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                                                ${isCompleted ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100' : ''}
                                                ${isCurrent ? 'bg-white border-rose-500 text-rose-500 shadow-lg shadow-rose-50' : ''}
                                                ${isFuture ? 'bg-slate-50 border-slate-100 text-slate-300' : ''}
                                            `}>
                                                {isCompleted ? <Check size={18} strokeWidth={3} /> : <step.icon size={18} strokeWidth={2.5} />}
                                            </div>
                                            <span className={`text-[13px] font-bold mt-4 transition-colors ${isCompleted || isCurrent ? 'text-rose-500' : 'text-slate-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Order Items</h3>
                                <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[11px] font-bold rounded-full">
                                    {order.orderItems?.length} Items
                                </span>
                            </div>

                            <div className="px-8">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-slate-400 text-[13px] font-semibold border-b border-slate-50">
                                            <th className="py-5 text-left font-medium">Product</th>
                                            <th className="py-5 text-right font-medium">Price</th>
                                            <th className="py-5 text-center font-medium">Qty</th>
                                            <th className="py-5 text-right font-medium">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {order.orderItems?.map((item, idx) => (
                                            <tr key={idx} className="group italic-none">
                                                <td className="py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-[72px] h-[72px] rounded-xl bg-[#f1f5f9] flex items-center justify-center border border-slate-100 overflow-hidden">
                                                            {item.img ? (
                                                                <img src={item.img} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">IMG</span>
                                                            )}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="font-bold text-slate-900 text-[15px]">{item.name}</p>
                                                            <p className="text-[12px] text-slate-400 font-medium">ID: {item.saleorderid}</p>
                                                            {item.size && <p className="text-[12px] text-slate-400 font-medium uppercase">Size: {item.size}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 text-right text-slate-600 font-medium text-[15px]">
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td className="py-6 text-center text-slate-600 font-medium text-[15px]">
                                                    {item.qty}
                                                </td>
                                                <td className="py-6 text-right font-bold text-slate-900 text-[15px]">
                                                    {formatCurrency(item.total_amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Section */}
                            <div className="p-8 bg-white flex justify-end">
                                <div className="w-full max-w-[320px] space-y-4">
                                    <div className="flex justify-between items-center text-slate-500 font-medium">
                                        <span className="text-[15px]">Subtotal</span>
                                        <span className="text-slate-900 font-bold">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500 font-medium">
                                        <span className="text-[15px]">Shipping</span>
                                        <span className="text-emerald-500 font-bold">Free</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">Total</span>
                                        <span className="text-[22px] font-black text-slate-900 tracking-tight">{formatCurrency(total)}</span>
                                    </div>

                                    {/* Payment Card Overlay */}
                                    <div className="mt-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-rose-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                                <CreditCard size={18} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 leading-tight">Paid via Visa</p>
                                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">**** 4242</p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                            Paid
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Timeline Card */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-8">Activity Timeline</h3>
                            <div className="space-y-8 relative">
                                <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-slate-50" />

                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-[12px] h-[12px] rounded-full bg-rose-500 ring-4 ring-rose-50" />
                                    <div>
                                        <p className="text-[15px] font-bold text-slate-900">Order confirmation email sent</p>
                                        <p className="text-[13px] text-slate-400 font-medium mt-1">{formatDate(order.placed_time_and_date)}</p>
                                    </div>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-[12px] h-[12px] rounded-full bg-slate-200 ring-4 ring-slate-50" />
                                    <div>
                                        <p className="text-[15px] font-bold text-slate-600">Order placed by customer</p>
                                        <p className="text-[13px] text-slate-400 font-medium mt-1">{formatDate(order.placed_time_and_date, true)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Content (Right) */}
                    <div className="space-y-8">

                        {/* Customer Card */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900">Customer</h3>
                                <button className="text-[11px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600">
                                    View Profile
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-[22px] font-black text-rose-500 border border-slate-100">
                                    {customer.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[17px] font-black text-slate-900">{customer.name}</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{customer.previous_order_count} Previous orders</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 py-1">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                                        <Mail size={18} />
                                    </div>
                                    <span className="text-[14px] font-medium text-slate-600 truncate">{customer.gmail}</span>
                                </div>
                                <div className="flex items-center gap-3 py-1">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                                        <Phone size={18} />
                                    </div>
                                    <span className="text-[14px] font-medium text-slate-600">{customer.contact}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details Card */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-8">Delivery Details</h3>

                            <div className="space-y-8">
                                <div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Shipping Address</p>
                                    <div className="text-[14px] leading-relaxed font-bold text-slate-900 italic-none">
                                        <p className="mb-0.5">{order.deliveryaddress?.name}</p>
                                        <p className="text-slate-500 font-medium">
                                            {order.deliveryaddress?.house_building_name}, {order.deliveryaddress?.area_colony}<br />
                                            {order.deliveryaddress?.city}, {order.deliveryaddress?.state} {order.deliveryaddress?.pincode}<br />
                                            India
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Billing Address</p>
                                    <p className="text-[14px] font-medium text-slate-500">Same as shipping address</p>
                                </div>

                                {/* Map Placeholder mimicking the image */}
                                <div className="w-full h-[180px] bg-[#f8fbff] rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center relative group cursor-pointer overflow-hidden transition-all hover:border-rose-100">
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                    <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md ring-8 ring-[#f1f5f9]/50">
                                        <MapPin className="text-slate-300 group-hover:text-rose-500 transition-colors duration-500" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Internal Notes Card */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Internal Notes</h3>
                            <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 italic">
                                <p className="text-[14px] font-medium text-slate-700 leading-relaxed">
                                    "Customer called requested to leave package at front door if no answer."
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Credits */}
                <div className="mt-24 pb-12 text-center">
                    <p className="text-[13px] font-medium text-slate-400">
                        © 2025 E-Store Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
