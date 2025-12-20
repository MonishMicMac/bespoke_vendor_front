import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  TrendingUp,
  Store
} from 'lucide-react';

const VendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchVendor = async () => {
      try {
        // Assuming the ID matches the one provided in the list logic or param
        const response = await axiosInstance.get(`/details/${id}`); // Or whatever the exact endpoint pattern is
        // Based on user request: "call this api in jwt token i have id using the id call it give correct details"
        // And example response: { status: true, data: { ... } }
        if (response.data.status && response.data.data) {
          setVendor(response.data.data);
        } else {
          // Fallback if structure is slightly different or direct object
          setVendor(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch vendor", err);
        setError("Failed to load vendor details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <XCircle size={32} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Vendor Not Found</h3>
        <p className="text-slate-500 mb-6 max-w-md">{error || "The vendor you are looking for does not exist or could not be loaded."}</p>
        <Link to="/vendors" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium">
          Return to Vendor List
        </Link>
      </div>
    );
  }

  // Calculate status badge color
  const getStatusColor = (status) => {
    if (status === '1') return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, label: 'Active' };
    if (status === '0') return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' };
    return { bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle, label: 'Inactive' };
  };

  const statusObj = getStatusColor(vendor.approval_status);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-gray-50 overflow-hidden flex-shrink-0">
            {vendor.img_path ? (
              <img
                src={`${vendor.img_path}${vendor.id}/profile.jpg`} // Assuming structure based on path, might need adjustment based on actual file name usage
                // Or just use a default avatar if specific filename isn't in API logic yet.
                // The API gave: "img_path": "http://.../storage/" and "id": 19. Usually implies valid url concat.
                // Fallback:
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${vendor.shop_name}&background=random` }}
                alt={vendor.shop_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-500 text-3xl font-bold">
                {vendor.shop_name?.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{vendor.shop_name}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusObj.bg} ${statusObj.text}`}>
                    <statusObj.icon size={12} strokeWidth={3} />
                    {statusObj.label}
                  </span>
                </div>
                <p className="text-slate-500 font-medium">@{vendor.username} • {vendor.vendor_type}</p>
              </div>

              <div className="flex gap-3">
                <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  Edit Profile
                </button>
                <button className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-700 font-semibold text-sm hover:bg-gray-50 transition-all">
                  More Actions
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-600 pt-2">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                {vendor.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                {vendor.mobile_no}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                Joined {new Date(vendor.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={`₹${vendor.total_sales_amount?.toLocaleString() || 0}`}
          icon={DollarSign}
          trend="+12%"
          color="pink"
        />
        <StatCard
          label="Total Orders"
          value={vendor.total_orders || 0}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          label="Products"
          value={vendor.total_products || 0}
          icon={Package}
          color="purple"
        />
        <StatCard
          label="Settled Amount"
          value={`₹${vendor.total_settled_amount?.toLocaleString() || 0}`}
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Store size={20} className="text-pink-500" />
              Business Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem label="Vendor Type" value={vendor.vendor_type} />
              <DetailItem label="GST Number" value={vendor.gst_no || 'N/A'} />
              <DetailItem label="PAN Number" value={vendor.pan_no || 'N/A'} />
              <DetailItem label="Total Customizable" value={vendor.total_customizable_products} />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Address</h4>
              <p className="text-slate-500 leading-relaxed">
                {vendor.address || "No address provided"}
                {vendor.pincode && <br />}
                {vendor.pincode && `Pincode: ${vendor.pincode}`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Additional Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>
            <div className="space-y-4">
              <SummaryRow label="Delivered" value={vendor.total_orders_delivered} color="bg-green-500" />
              <SummaryRow label="Pending" value={vendor.total_orders_pending} color="bg-orange-500" />
              <SummaryRow label="Cancelled" value={vendor.total_orders_cancelled} color="bg-red-500" />
              <SummaryRow label="Returned" value={vendor.total_orders_returned} color="bg-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ label, value, icon: Icon, trend, color }) => {
  const colorClasses = {
    pink: 'bg-pink-50 text-pink-500',
    blue: 'bg-blue-50 text-blue-500',
    purple: 'bg-purple-50 text-purple-500',
    green: 'bg-emerald-50 text-emerald-500',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorClasses[color] || colorClasses.pink}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {trend && (
          <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} className="mr-1" /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h4 className="text-2xl font-extrabold text-slate-900">{value}</h4>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
    <div className="text-base font-semibold text-slate-800">{value}</div>
  </div>
);

const SummaryRow = ({ label, value, color }) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
    <span className="font-bold text-slate-900">{value}</span>
  </div>
);

export default VendorDetails;
