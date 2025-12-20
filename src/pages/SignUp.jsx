import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { User, Mail, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

const SignUp = () => {
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        const token = Cookies.get('access_token');
        const vendorId = Cookies.get('vendor_id');
        if (token) {
            navigate(vendorId ? `/vendors/${vendorId}` : '/vendors', { replace: true });
        }
    }, [navigate]);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: 'designer', // Default selected to match image
        name: '',
        email: '',
        mobile: ''
    });
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const handleNext = () => {
        if (step === 1 && !formData.role) return;
        if (step === 2 && (!formData.name || !formData.email || !formData.mobile)) return;
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl overflow-hidden relative">

                {/* Top Progress Line (Matches image style) */}
                <div className="absolute top-0 left-0 h-1.5 bg-gray-100 w-full">
                    <div
                        className="h-full bg-pink-500 transition-all duration-500 ease-out rounded-r-full"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>

                <div className="p-8 pt-10">
                    {/* Back Navigation */}
                    <div className="h-6 mb-2">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-1 text-gray-400 hover:text-gray-800 transition-colors text-sm font-semibold"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}
                    </div>

                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <div className="text-center mb-10">
                                <h1 className="text-[28px] font-bold text-slate-900 mb-2">Choose your Role</h1>
                                <p className="text-slate-500">Select how you want to partner with us</p>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-10">
                                {/* Designer Card */}
                                <div
                                    onClick={() => handleRoleSelect('designer')}
                                    className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-4 group
                                        ${formData.role === 'designer'
                                            ? 'border-pink-500 bg-pink-50/50 shadow-sm'
                                            : 'border-gray-100 bg-white hover:border-pink-200 hover:shadow-md'
                                        }`}
                                >
                                    {/* Red Dot Indicator */}
                                    {formData.role === 'designer' && (
                                        <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-pink-500 rounded-full"></div>
                                    )}

                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 p-1">
                                        <img src="http://3.7.112.78/images/desginer.png" alt="Designer" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-lg font-bold mb-1 ${formData.role === 'designer' ? 'text-pink-500' : 'text-slate-700'}`}>Designer</div>
                                        <div className="text-xs text-slate-400 font-medium">Create & sell your designs</div>
                                    </div>
                                </div>

                                {/* Shop Owner Card */}
                                <div
                                    onClick={() => handleRoleSelect('shop')}
                                    className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-4 group
                                        ${formData.role === 'shop'
                                            ? 'border-pink-500 bg-pink-50/50 shadow-sm'
                                            : 'border-gray-100 bg-white hover:border-pink-200 hover:shadow-md'
                                        }`}
                                >
                                    {formData.role === 'shop' && (
                                        <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-pink-500 rounded-full"></div>
                                    )}

                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 p-1">
                                        <img src="http://3.7.112.78/images/shop.png" alt="Shop" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-lg font-bold mb-1 ${formData.role === 'shop' ? 'text-pink-500' : 'text-slate-700'}`}>Shop Owner</div>
                                        <div className="text-xs text-slate-400 font-medium">Sell your inventory</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details Form */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <div className="text-center mb-8">
                                <h1 className="text-[28px] font-bold text-slate-900 mb-2">Your Details</h1>
                                <p className="text-slate-500">Tell us a bit about yourself</p>
                            </div>

                            <div className="space-y-5 mb-8">
                                <div className="group">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-medium text-slate-700"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-medium text-slate-700"
                                            placeholder="name@company.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                                        <input
                                            type="tel"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-medium text-slate-700"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: OTP */}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <div className="text-center mb-8">
                                <h1 className="text-[28px] font-bold text-slate-900 mb-2">Verify OTP</h1>
                                <p className="text-slate-500">Enter code sent to <span className="text-slate-900 font-bold">{formData.mobile}</span></p>
                            </div>

                            <div className="flex justify-center gap-3 mb-10">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        className="w-16 h-16 text-center text-3xl font-bold rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-pink-500 focus:scale-110 focus:shadow-lg outline-none transition-all text-slate-800"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Action */}
                    <button
                        onClick={step === 3 ? () => console.log('Submit') : handleNext}
                        disabled={step === 1 && !formData.role}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-pink-200
                            ${(step === 1 && !formData.role)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-500 to-pink-500 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        {step === 3 ? 'Confirm & Register' : 'Continue'} <ArrowRight size={22} />
                    </button>

                    <div className="mt-8 text-center text-[15px] text-slate-500">
                        Already have an account?
                        <Link to="/login" className="ml-1 font-bold text-slate-900 hover:text-pink-600 transition-colors">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;