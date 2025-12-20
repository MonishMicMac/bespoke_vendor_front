import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Store, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"; // IMPORT THIS

const Login = () => {
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        const token = Cookies.get('access_token');
        const vendorId = Cookies.get('vendor_id');
        if (token) {
            navigate(vendorId ? `/vendors/${vendorId}` : '/vendors', { replace: true });
        }
    }, [navigate]);

    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const API_URL = import.meta.env.VITE_API;

    // ... (Validation functions remain the same: validateCredentials, validateOtp)
    const validateCredentials = () => {
        if (!email) { toast.error('Email is required'); return false; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { toast.error('Please enter a valid email address'); return false; }
        if (!password) { toast.error('Password is required'); return false; }
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return false; }
        return true;
    };

    const validateOtp = () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) { toast.error('Please enter the complete 6-digit OTP'); return false; }
        return true;
    };

    // Step 1: Login (Remains same)
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateCredentials()) return;

        setLoading(true);
        const toastId = toast.loading('Verifying credentials...');

        try {
            const response = await fetch(`${API_URL}/api/vendor/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('Credentials verified! OTP sent to your email.', { id: toastId });
                setStep(2);
            } else {
                toast.error(data.message || 'Login failed.', { id: toastId });
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Network error. Please try again.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };


    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!validateOtp()) return;

        setLoading(true);
        const toastId = toast.loading('Verifying OTP...');

        try {
            const response = await fetch(`${API_URL}/api/vendor/verifyOtp`, {
                method: 'POST',
                // This tells the browser: "If the server sends a cookie, save it."
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otp.join('') }),
            });
            const data = await response.json();

            if (data.status === true) {
                toast.success('Login Successful!', { id: toastId });

                // We don't touch the token here. It's already in the browser cookies.

                // We just need the ID to know where to navigate
                const vendorId = data.vendor?.id;

                if (vendorId) {
                    // Manually set token if returned by API (fallback for Set-Cookie issues)
                    if (data.token || data.access_token) {
                        Cookies.set('access_token', data.token || data.access_token, { expires: 7 });
                    }

                    Cookies.set('vendor_id', vendorId, { expires: 7 });
                    setTimeout(() => {
                        navigate(`/vendors/${vendorId}`);
                    }, 1000);
                } else {
                    toast.error("Vendor ID missing.", { id: toastId });
                }

            } else {
                toast.error(data.message || 'Invalid OTP.', { id: toastId });
            }
        } catch (error) {
            console.error('OTP verify error:', error);
            toast.error('Network error.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };
    // OTP Input Handlers (Remains same)
    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) { // Fixed to 5 for 6-digit OTP
            document.getElementById(`login-otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`login-otp-${index - 1}`).focus();
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            <Toaster position="top-right" />

            {/* Left Side - Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <Store color="white" size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SellerCRM</span>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Accelerate your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                            sales performance
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                        Join over 10,000 sellers managing their inventory, customers, and analytics in one unified dashboard.
                    </p>
                </div>
                {/* Social Proof */}
                <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl w-max">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                                <span className="text-white font-bold ml-1">5.0</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Trusted by top sellers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white relative">
                <div className="w-full max-w-[440px]">
                    <div className="mb-10">
                        {step === 2 && (
                            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-gray-400 hover:text-gray-800 transition-colors text-sm font-semibold mb-4">
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{step === 1 ? 'Welcome back' : 'Verify OTP'}</h2>
                        <p className="text-slate-500">
                            {step === 1 ? 'Please enter your details to access your dashboard.' : `Enter the 6-digit code sent to ${email}`}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
                            <div className="group">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                                    <input type="email" className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-medium text-slate-700 placeholder:font-normal" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="group">
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="block text-sm font-bold text-slate-700">Password</label>
                                    <a href="#" className="text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors">Forgot Password?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                                    <input type={showPassword ? "text" : "password"} className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-medium text-slate-700 placeholder:font-normal" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                {loading ? 'Verifying...' : 'Log In'} <ArrowRight size={20} />
                            </button>

                            {/* Divider & Social Buttons (Same as before) */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-semibold tracking-wider">Or continue with</span></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 h-15">
                                <button type="button" className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-slate-700 font-semibold text-sm">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Google
                                </button>
                                <button type="button" className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-slate-700 font-semibold text-sm">
                                    <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5" /> Apple
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* STEP 2: OTP FORM */
                        <form onSubmit={handleVerifyOtp} className="space-y-8 animate-fade-in">
                            <div className="flex justify-center gap-4">
                                {otp.map((digit, index) => (
                                    <input key={index} id={`login-otp-${index}`} type="text" maxLength={1} className="w-16 h-16 text-center text-3xl font-bold rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-pink-500 focus:scale-110 focus:shadow-lg outline-none transition-all text-slate-800" value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} />
                                ))}
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-6">Didn't receive code? <button type="button" className="text-pink-500 font-bold hover:underline" onClick={() => toast.success('OTP resent!')}>Resend</button></p>
                                <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {loading ? 'Confirming...' : 'Verify & Login'} <CheckCircle2 size={20} />
                                </button>
                            </div>
                        </form>
                    )}
                    <div className="mt-8 text-center text-[15px] text-slate-500">
                        Don't have an account? <Link to="/signup" className="ml-1 font-bold text-slate-900 hover:text-pink-600 transition-colors">Sign Up</Link>
                    </div>
                </div>
                <div className="absolute bottom-4 text-xs text-slate-400 hidden lg:block">© 2024 Seller CRM Inc. All rights reserved.</div>
            </div>
        </div>
    );
};

export default Login;