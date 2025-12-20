import { Link } from 'react-router-dom';
import { PlayCircle, TrendingUp, BarChart, Package, Truck, CreditCard, User, Box, ArrowUpRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="landing-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem' }}>
                    <Box color="#FF6B9B" />
                    <span>Bespoke</span>
                </div>
                <div className="nav-links">
                    <a href="#">Sell Online</a>
                    <a href="#">Fees & Commission</a>
                    <a href="#">Grow</a>
                    <a href="#">Learn</a>
                </div>
                <div className="nav-actions">
                    <Link to="/login" className="btn-outline-rounded" style={{ border: 'none', background: 'transparent' }}>
                        Login
                    </Link>
                    <Link to="/signup" className="btn-pink" style={{ textDecoration: 'none' }}>Start Selling</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Launch your business with <span className="highlight-pink">0% Commission*</span>
                    </h1>
                    <p className="hero-subtitle">
                        Join India's fastest growing seller community. Reach crores of customers instantly and scale your business effortlessly with our powerful tools.
                    </p>
                    <div className="hero-actions">
                        <Link to="/signup" className="btn-pink" style={{ textDecoration: 'none' }}>Register Now</Link>
                        <button className="btn-outline-rounded" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <PlayCircle size={18} /> How it works
                        </button>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '1rem' }}>*Terms and conditions apply. Limited time offer.</p>
                </div>

               <div className="hero-image-wrapper">
  <div className="rounded-xl overflow-hidden">
    <img
      src="http://3.7.112.78/images/landingpage.png"
      alt="Team working"
      className="w-full h-auto object-cover"
    />
  </div>
</div>

            </section>

            {/* Stats Bar */}
          <div className="max-w-6xl mx-auto px-4">
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 font-bold ">
      
      {/* Stat 1 */}
      <div className="py-6 text-center ">
        <div className="text-3xl font-semibold text-blue-600">
          15 Lakh+
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Active Sellers
        </div>
      </div>

      {/* Stat 2 */}
      <div className="py-6 text-center">
        <div className="text-3xl font-semibold text-blue-600">
          24×7
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Support Available
        </div>
      </div>

      {/* Stat 3 */}
      <div className="py-6 text-center">
        <div className="text-3xl font-semibold text-blue-600">
          7 Days*
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Secure Payments
        </div>
      </div>

      {/* Stat 4 */}
      <div className="py-6 text-center">
        <div className="text-3xl font-semibold text-blue-600">
          19k+
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Pincodes Served
        </div>
      </div>

    </div>
  </div>
</div>


            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <span className="section-title" style={{ fontSize: '2rem' }}>Why sellers <span className="highlight-pink">love selling</span> here?</span>
                    <p style={{ marginTop: '1rem', color: '#6B7280' }}>We provide the tools, support, and reach you need to transform your local business into a national brand.</p>
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="icon-box"><BarChart /></div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Massive Opportunity</h3>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6 }}>Access over 14 crore customers across 19000+ pincodes. Be visible during huge shopping festivals.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-box"><Package /></div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Ease of Doing Business</h3>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6 }}>Create your seller account in under 10 minutes with just 1 product and a valid GSTIN number.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-box"><TrendingUp /></div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Exponential Growth</h3>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6 }}>Sellers see an average 2.8X spike in growth. Leverage our account management services.</p>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="testimonial-section">
                <div style={{ flex: 1 }}>
                    <h2 className="section-title">Seller Success <span className="highlight-pink">Stories</span></h2>
                    <p style={{ color: '#4B5563', maxWidth: '400px', marginBottom: '1.5rem' }}>14 Lakh+ sellers trust us for their online business. Hear from those who started small and made it big.</p>
                    <button className="btn-outline-rounded" style={{ borderColor: '#FF6B9B', color: '#FF6B9B' }}>Read All Stories</button>
                </div>
                <div className="testimonial-card">
                    <div className="user-profile">
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <User size={32} color="#F97316" />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Priya Sharma</div>
                        <div style={{ fontSize: '0.8rem', color: '#F43F5E' }}>Founder, Ethnic Weaves</div>
                    </div>
                    <p className="quote-text">
                        "Starting with just 5 products from my home, the seamless registration and account manager support fueled our growth. Today we ship over 500 orders daily. It's been a life-changing journey."
                    </p>
                </div>
            </section>

            {/* Journey Section */}
            <section className="journey-section">
                <h2 className="section-title">Your <span className="highlight-pink">Journey</span> on Our Platform</h2>
                <p style={{ color: '#6B7280' }}>Starting your online business is easy. Follow these simple steps.</p>

                <div className="steps-row">
                    <div className="step-item">
                        <div className="step-circle"><User /></div>
                        <div className="step-title">1. Create Account</div>
                        <div className="step-subtitle">Register in 10 mins with GST & bank details.</div>
                    </div>
                    <div className="step-item">
                        <div className="step-circle"><Package /></div>
                        <div className="step-title">2. List Products</div>
                        <div className="step-subtitle">Upload your catalog with just 1 product to start.</div>
                    </div>
                    <div className="step-item">
                        <div className="step-circle"><Box /></div>
                        <div className="step-title">3. Get Orders</div>
                        <div className="step-subtitle">Start receiving orders from crores of customers.</div>
                    </div>
                    <div className="step-item">
                        <div className="step-circle"><Truck /></div>
                        <div className="step-title">4. Shipment</div>
                        <div className="step-subtitle">Stress-free delivery with our logistics partners.</div>
                    </div>
                    <div className="step-item">
                        <div className="step-circle"><CreditCard /></div>
                        <div className="step-title">5. Receive Payments</div>
                        <div className="step-subtitle">Get payments securely every 7 days*.</div>
                    </div>
                </div>
            </section>

            {/* Footer Promos */}
            <div className="cta-banner">
                <h2 className="cta-title">Ready to start your selling journey?</h2>
                <p>Join lakhs of sellers who are growing their business every day.</p>
                <button className="btn-white">Start Selling Now</button>
            </div>

            <footer className="main-footer">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Sell Online</h4>
                        <ul>
                            <li>Create Account</li>
                            <li>List Products</li>
                            <li>Storage & Shipping</li>
                            <li>Fees & Commission</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <ul>
                            <li>Seller Learning Center</li>
                            <li>Success Stories</li>
                            <li>FAQs</li>
                            <li>Seller Blog</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Policies</h4>
                        <ul>
                            <li>Return Policy</li>
                            <li>Security</li>
                            <li>Terms of Use</li>
                            <li>Privacy</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>Seller Support</li>
                            <li style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <a href="#"><Box size={16} /></a>
                                <a href="#"><User size={16} /></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="copyright">
                    © 2024 Bespoke Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
