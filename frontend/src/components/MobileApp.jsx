import React, { useRef } from 'react';
import { Apple, Play, CheckCircle, ArrowRight, Smartphone, Scan, Receipt, ShieldCheck, Menu, Settings, Bell, Sparkles, FileText, UserPlus, CreditCard, Clock, ChevronDown, Home, Users, MoreHorizontal } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './MobileApp.css';
import dashboardImage from '../assets/dashboard.png';
import darkPocketImg from '../assets/about-fintech.png';

gsap.registerPlugin(ScrollTrigger);

const MobileApp = () => {
    const containerRef = useRef(null);
    const phoneRef = useRef(null);

    useGSAP(() => {
        // Initial entry animation
        const tlContent = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse",
            }
        });

        // Staggered reveal for text and left side elements
        tlContent.from('.mo-badge', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
            .from('.mo-title', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
            .from('.mo-description', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
            .from('.mo-feature', { x: -30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
            .from('.mo-btn-store', { scale: 0.9, y: 15, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.3')
            .from('.mo-girl-bg', { y: 100, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
            .from(phoneRef.current, { y: 150, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=0.9');

        // Scroll Parallax Effect
        gsap.to('.mo-girl-bg', {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(phoneRef.current, {
            yPercent: -25,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Continuous floating animations for orbs
        gsap.to('.mo-orbit-1', {
            y: -20,
            x: 10,
            rotation: 15,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to('.mo-orbit-2', {
            y: 25,
            x: -15,
            rotation: -10,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, { scope: containerRef });
    return (
        <section className="mobile-section" id="mobile-app" ref={containerRef}>
            {/* Background Aesthetic */}
            <div className="mo-bg-glow mo-glow-orange"></div>
            <div className="mo-bg-glow mo-glow-pink"></div>

            <div className="mo-container">
                <div className="mo-content">
                    <div className="mo-badge">
                        <Smartphone size={16} />
                        <span>Available on iOS & Android</span>
                    </div>
                    <h2 className="mo-title">
                        Your Entire Business in <br />
                        <span className="mo-gradient-text">Your Pocket</span>
                    </h2>
                    <p className="mo-description">
                        Don't wait until you're back at your desk. Send invoices, snap pictures of receipts, reconcile transactions, and view live cash flow right from your phone.
                    </p>

                    <div className="mo-feature-grid">
                        <div className="mo-feature">
                            <div className="mo-feat-icon bg-orange"><Receipt size={18} /></div>
                            <div>
                                <h4>Smart Receipt Scanner</h4>
                                <p>Auto-extract data from photos.</p>
                            </div>
                        </div>
                        <div className="mo-feature">
                            <div className="mo-feat-icon bg-pink"><ShieldCheck size={18} /></div>
                            <div>
                                <h4>FaceID Security</h4>
                                <p>Biometric lock for your data.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mo-download-buttons">
                        <a
                            href="#"
                            className="mo-btn-store"
                            onClick={(e) => {
                                e.preventDefault();
                                window.dispatchEvent(new Event('openMobileAppModal'));
                            }}
                        >
                            <Apple size={24} />
                            <div className="mo-btn-text">
                                <span className="mo-btn-sub">Download on the</span>
                                <span className="mo-btn-main">App Store</span>
                            </div>
                        </a>
                        <a
                            href="#"
                            className="mo-btn-store"
                            onClick={(e) => {
                                e.preventDefault();
                                window.dispatchEvent(new Event('openMobileAppModal'));
                            }}
                        >
                            <Play size={24} />
                            <div className="mo-btn-text">
                                <span className="mo-btn-sub">GET IT ON</span>
                                <span className="mo-btn-main">Google Play</span>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="mo-visual">
                    {/* Girl background wrapper */}
                    <div className="mo-girl-bg">
                        <img src={dashboardImage} alt="Platform Dashboard Background" />
                    </div>

                    <div className="mo-phone-mockup" ref={phoneRef}>
                        <div className="mo-phone-notch"></div>
                        <div className="mo-phone-screen">
                            {/* Status Bar */}
                            <div className="mo-ui-status-bar">
                                <span className="time">9:30</span>
                                <div className="icons">
                                    <div className="icon signal"></div>
                                    <div className="icon wifi"></div>
                                    <div className="icon battery"></div>
                                </div>
                            </div>

                            {/* Header */}
                            <div className="mo-ui-header">
                                <Menu size={18} />
                                <span className="title">BiReena TallyX</span>
                                <div className="actions">
                                    <Settings size={16} />
                                    <Bell size={16} />
                                </div>
                            </div>

                            <div className="mo-ui-scrollable">
                                {/* Welcome Content */}
                                <div className="mo-ui-welcome">
                                    <Sparkles size={16} className="text-primary" />
                                    <div>
                                        <h4>Welcome Rajesh!</h4>
                                        <p>Here's your organization's overview</p>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="mo-ui-quick-actions">
                                    <div className="action-item">
                                        <div className="action-icon text-blue bg-blue-light"><FileText size={16} /></div>
                                        <span>New<br />Invoice</span>
                                    </div>
                                    <div className="action-item">
                                        <div className="action-icon text-green bg-green-light"><UserPlus size={16} /></div>
                                        <span>New<br />Client</span>
                                    </div>
                                    <div className="action-item">
                                        <div className="action-icon text-red bg-red-light"><CreditCard size={16} /></div>
                                        <span>New<br />Expense</span>
                                    </div>
                                    <div className="action-item">
                                        <div className="action-icon text-orange bg-orange-light"><Clock size={16} /></div>
                                        <span>Add<br />Time log</span>
                                    </div>
                                </div>

                                {/* Chart Card */}
                                <div className="mo-ui-chart-card">
                                    <div className="chart-header">
                                        <div className="title-row">
                                            <ArrowRight size={14} className="rotate-down" />
                                            <span>Receivables Summary</span>
                                        </div>
                                        <ChevronDown size={16} className="text-muted" />
                                    </div>
                                    <div className="chart-amount">
                                        <p>Total Receivables</p>
                                        <h3>₹ 38,092.17</h3>
                                    </div>
                                    <div className="bars-container">
                                        <div className="y-axis">
                                            <span>18 K</span><span>15 K</span><span>12 K</span><span>9 K</span><span>6 K</span><span>3 K</span><span>0</span>
                                        </div>
                                        <div className="bars-wrapper">
                                            <div className="grid-lines">
                                                <div /><div /><div /><div /><div /><div /><div />
                                            </div>
                                            <div className="bar-row">
                                                <div className="bar-col">
                                                    <div className="bar h-90 bg-blue"></div>
                                                    <span>Current</span>
                                                </div>
                                                <div className="bar-col">
                                                    <div className="bar h-40 bg-yellow"></div>
                                                    <span>1-15</span>
                                                </div>
                                                <div className="bar-col">
                                                    <div className="bar h-30 bg-orange"></div>
                                                    <span>16-30</span>
                                                </div>
                                                <div className="bar-col">
                                                    <div className="bar h-20 bg-brown"></div>
                                                    <span>31-45</span>
                                                </div>
                                                <div className="bar-col">
                                                    <div className="bar h-0"></div>
                                                    <span>46-60</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Nav */}
                            <div className="mo-ui-bottom-nav">
                                <div className="nav-item active">
                                    <Home size={18} />
                                    <span>Dashboard</span>
                                </div>
                                <div className="nav-item">
                                    <Users size={18} />
                                    <span>Clients</span>
                                </div>
                                <div className="nav-item">
                                    <FileText size={18} />
                                    <span>Invoices</span>
                                </div>
                                <div className="nav-item">
                                    <CreditCard size={18} />
                                    <span>Expenses</span>
                                </div>
                                <div className="nav-item">
                                    <MoreHorizontal size={18} />
                                    <span>More</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Orbs behind phone */}
                    <div className="mo-orbit mo-orbit-1"></div>
                    <div className="mo-orbit mo-orbit-2"></div>
                </div>
            </div>
        </section>
    );
};

export default MobileApp;
