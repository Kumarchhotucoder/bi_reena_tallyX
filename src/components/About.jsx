import React from 'react';
import {
    ShieldCheck, Activity, Target, Users, Zap, TrendingUp,
    ArrowRight, Sparkles, Heart, Eye, Linkedin, Quote, Star,
    CheckCircle, Award, Globe, BarChart3, Lock, RefreshCw,
    Shield, HeadphonesIcon, UserPlus, FileSpreadsheet, Download, CheckCircle2
} from 'lucide-react';
import './About.css';
import newTeamImage from '../assets/new_team.png';
import aboutImg from '../assets/about-fintech.png';
import reenaContactImg from '../assets/reena_contact.png';
import nehaImg from '../assets/neha.png';

const About = () => {

    const stats = [
        { number: "99.9%", label: "Uptime Guarantee", icon: <CheckCircle size={18} />, accent: "ab-orange" },
        { number: "24/7", label: "Expert Support", icon: <Activity size={18} />, accent: "ab-pink" },
        { number: "10K+", label: "Happy Businesses", icon: <Users size={18} />, accent: "ab-purple" },
        { number: "50+", label: "Smart Integrations", icon: <Globe size={18} />, accent: "ab-indigo" }
    ];

    const values = [
        { icon: <Lock size={24} />, title: "Enterprise Security", desc: "SOC 2 certified with 256-bit AES encryption. Your financial data stays fortress-level protected, always.", accent: "ab-orange" },
        { icon: <Zap size={24} />, title: "Blazing Performance", desc: "Process 10,000+ transactions per second. Lightning-fast reports, zero lag, even during peak hours.", accent: "ab-pink" },
        { icon: <Target size={24} />, title: "Pixel-Perfect Accuracy", desc: "AI-driven auto-reconciliation catches every mismatch. Say goodbye to manual errors forever.", accent: "ab-purple" },
        { icon: <Users size={24} />, title: "Seamless Collaboration", desc: "Role-based access for your entire team. Accountants, managers, and auditors — all in one place.", accent: "ab-indigo" },
        { icon: <BarChart3 size={24} />, title: "Intelligent Insights", desc: "17+ real-time dashboards. Cash flow predictions, expense trends, and tax-ready reports at a glance.", accent: "ab-orange" },
        { icon: <RefreshCw size={24} />, title: "Auto Sync & Feeds", desc: "Direct bank feeds from 150+ banks. Auto-categorize transactions. Zero manual data entry.", accent: "ab-pink" }
    ];

    const team = [
        {
            name: "Deepika Singh", role: "Founder & Director", accent: "ab-orange",
            bio: "Driving organizational growth through vision, execution, and innovation. Focused on long-term value creation and building high-performance teams.",
            photo: reenaContactImg,
            linkedin: "https://www.linkedin.com/in/bireena-info-tech-a975533a1/"
        },
        {
            name: "Chhotu Kumar", role: "Full Stack Developer", accent: "ab-pink",
            bio: "Building scalable web applications with React & Firebase. Passionate about problem solving and clean code.",
            photo: newTeamImage,
            linkedin: "https://www.linkedin.com/in/chhotu-kumar-b9443628b/"
        },
        {
            name: "Deepak Kumar", role: "Full Stack Developer", accent: "ab-indigo",
            bio: "Building scalable web applications with React & Firebase. Passionate about problem solving and clean code.",
            photo: nehaImg,
            linkedin: "https://www.linkedin.com/in/deepak-kumar-18999232b/"
        }
    ];

    const testimonials = [
        {
            name: "Vikram Singh", company: "Singh Textiles Pvt. Ltd.", role: "Chief Financial Officer",
            quote: "BiReenaTellyX cut our month-end close from 5 days to just 8 hours. The automation is absolutely game-changing for our 200-person operation.",
            rating: 5, accent: "ab-orange",
            photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face"
        },
        {
            name: "Meera Joshi", company: "Joshi & Associates CA", role: "Chartered Accountant",
            quote: "I manage 40+ clients effortlessly now. GST filing, TDS, invoicing, reconciliation — everything flows seamlessly in one dashboard.",
            rating: 5, accent: "ab-pink",
            photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=120&h=120&fit=crop&crop=face"
        },
        {
            name: "Arjun Reddy", company: "TechNova Solutions", role: "Founder & CEO",
            quote: "We migrated from Tally and the ROI was instant. Real-time dashboards, bank feeds, and multi-user access — it's like having a CFO on autopilot.",
            rating: 5, accent: "ab-purple",
            photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face"
        }
    ];

    return (
        <section className="ab-section" id="about">
            {/* Background Elements */}
            <div className="ab-bg-glow ab-glow-1"></div>
            <div className="ab-bg-glow ab-glow-2"></div>
            <div className="ab-bg-glow ab-glow-3"></div>
            <div className="ab-grid-overlay"></div>

            <div className="ab-container">

                {/* ── 1. HERO ── */}
                <div className="ab-hero">
                    <div className="ab-hero-content">
                        <span className="ab-pill">
                            <Award size={14} />
                            <span>Trusted by 10,000+ Indian Businesses</span>
                        </span>
                        <h1 className="ab-headline">
                            The Smarter Way to do{' '}
                            <span className="ab-gradient-text">Accounting</span>
                        </h1>
                        <p className="ab-hero-desc">
                            BiReenaTellyX replaces your spreadsheets, legacy software, and manual workflows with one intelligent cloud platform. From GST compliance to real-time P&L — manage everything in minutes, not days.
                        </p>

                        <div className="ab-hero-buttons">
                            <a href="/features" className="ab-btn-primary">
                                <span>Explore Platform</span>
                                <ArrowRight size={16} className="ab-btn-arrow" />
                            </a>
                            <a href="/pricing" className="ab-btn-outline">
                                <span>View Plans</span>
                            </a>
                        </div>

                        <div className="ab-hero-trust">
                            <div className="ab-trust-avatars">
                                {team.slice(0, 3).map((t, i) => (
                                    <img key={i} src={t.photo} alt="" className="ab-trust-img" />
                                ))}
                            </div>
                            <div className="ab-trust-text">
                                <div className="ab-trust-stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#fb923c" color="#fb923c" />)}
                                </div>
                                <span>Rated 4.9/5 by 2,400+ users</span>
                            </div>
                        </div>
                    </div>

                    <div className="ab-hero-visual">
                        <div className="ab-visual-glow"></div>
                        <div className="ab-img-frame">
                            <img src={aboutImg} alt="BiReenaTellyX Platform Dashboard" className="ab-main-img" />
                        </div>
                        <div className="ab-float-badge ab-float-tl">
                            <div className="ab-badge-icon ab-badge-orange"><ShieldCheck size={18} /></div>
                            <div>
                                <h5>Bank-Grade Security</h5>
                                <p>256-bit AES encrypted</p>
                            </div>
                        </div>
                        <div className="ab-float-badge ab-float-br">
                            <div className="ab-badge-icon ab-badge-purple"><Activity size={18} /></div>
                            <div>
                                <h5>Live Dashboard</h5>
                                <p>Real-time financials</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 2. STATS ── */}
                <div className="ab-stats-row">
                    {stats.map((s, i) => (
                        <div key={i} className={`ab-stat-card ${s.accent}`}>
                            <div className="ab-stat-icon">{s.icon}</div>
                            <h3 className="ab-stat-number">{s.number}</h3>
                            <p className="ab-stat-label">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── 3. MISSION & VISION ── */}
                <div className="ab-mv-row">
                    <div className="ab-mv-card ab-mv-mission">
                        <div className="ab-mv-accent"></div>
                        <div className="ab-mv-icon-box ab-icon-warm"><Heart size={22} /></div>
                        <h3>Our Mission</h3>
                        <p>
                            To democratize financial management — making enterprise-grade accounting tools accessible and affordable for every Indian business, from solo freelancers to growing enterprises.
                        </p>
                        <ul className="ab-mv-bullets">
                            <li><CheckCircle size={14} /> Affordable for all business sizes</li>
                            <li><CheckCircle size={14} /> 100% GST & India-tax compliant</li>
                            <li><CheckCircle size={14} /> No accounting degree required</li>
                        </ul>
                    </div>
                    <div className="ab-mv-card ab-mv-vision">
                        <div className="ab-mv-accent"></div>
                        <div className="ab-mv-icon-box ab-icon-cool"><Eye size={22} /></div>
                        <h3>Our Vision</h3>
                        <p>
                            To become India's most trusted cloud accounting platform by 2028, empowering 1 million+ businesses with intelligent automation, real-time insights, and complete financial transparency.
                        </p>
                        <ul className="ab-mv-bullets">
                            <li><CheckCircle size={14} /> 1M+ businesses by 2028</li>
                            <li><CheckCircle size={14} /> AI-powered financial intelligence</li>
                            <li><CheckCircle size={14} /> Pan-India & global expansion</li>
                        </ul>
                    </div>
                </div>

                {/* ── 4. VALUES ── */}
                <div className="ab-values-section">
                    <div className="ab-section-header">
                        <span className="ab-pill"><Sparkles size={14} /> Why We're Different</span>
                        <h2 className="ab-section-title">
                            Built for <span className="ab-gradient-text">Modern Businesses</span>
                        </h2>
                        <p className="ab-section-desc">
                            Six pillars that make BiReenaTellyX the obvious choice for ambitious businesses.
                        </p>
                    </div>
                    <div className="ab-values-grid">
                        {values.map((v, i) => (
                            <div key={i} className={`ab-value-card ${v.accent}`}>
                                <div className="ab-value-icon">{v.icon}</div>
                                <h4>{v.title}</h4>
                                <p>{v.desc}</p>
                                <div className="ab-value-shine"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 5. TEAM ── */}
                <div className="ab-team-section">
                    <div className="ab-section-header">
                        <span className="ab-pill"><Sparkles size={14} /> Leadership</span>
                        <h2 className="ab-section-title">
                            The People Behind <span className="ab-gradient-text">BiReenaTellyX</span>
                        </h2>
                        <p className="ab-section-desc">
                            A passionate team of engineers, designers, and finance experts building the future of accounting.
                        </p>
                    </div>
                    <div className="ab-team-grid">
                        {team.map((m, i) => (
                            <div key={i} className={`ab-team-card ${m.accent}`}>
                                <div className={`ab-team-photo-ring ${m.accent}`}>
                                    <img src={m.photo} alt={m.name} className="ab-team-img" />
                                </div>
                                <h4 className="ab-team-name">{m.name}</h4>
                                <span className="ab-team-role">{m.role}</span>
                                <p className="ab-team-bio">{m.bio}</p>
                                <a href={m.linkedin || "#"} target={m.linkedin ? "_blank" : "_self"} rel={m.linkedin ? "noopener noreferrer" : undefined} className={`ab-team-social ${m.accent}`} aria-label={`${m.name} LinkedIn`}>
                                    <Linkedin size={15} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 6. TESTIMONIALS ── */}
                <div className="ab-testimonial-section">
                    <div className="ab-section-header">
                        <span className="ab-pill"><Sparkles size={14} /> Client Love</span>
                        <h2 className="ab-section-title">
                            Trusted by <span className="ab-gradient-text">Industry Leaders</span>
                        </h2>
                        <p className="ab-section-desc">
                            Real stories from real businesses who transformed their financial workflows.
                        </p>
                    </div>
                    <div className="ab-testimonial-grid">
                        {testimonials.map((t, i) => (
                            <div key={i} className={`ab-testimonial-card ${t.accent}`}>
                                <div className="ab-tcard-top">
                                    <Quote size={32} className="ab-tcard-quote" />
                                    <div className="ab-tcard-stars">
                                        {[...Array(t.rating)].map((_, j) => (
                                            <Star key={j} size={13} fill="#fb923c" color="#fb923c" />
                                        ))}
                                    </div>
                                </div>
                                <p className="ab-tcard-text">"{t.quote}"</p>
                                <div className="ab-tcard-author">
                                    <img src={t.photo} alt={t.name} className="ab-tcard-avatar" />
                                    <div>
                                        <h5>{t.name}</h5>
                                        <p>{t.role}, {t.company}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;
