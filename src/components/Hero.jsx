import React from 'react';
import { Play, Check, ArrowRight } from 'lucide-react';
import leftBubble from '../assets/left-bubble.png';

const Hero = () => {
    return (
        <section className="hero-section" id="home">
            <img src={leftBubble} alt="Decorative bubble" className="hero-left-bubble" />
            {/* Visual Elements */}
            <div className="blob blob-left"></div>
            <div className="blob blob-right"></div>

            {/* Horizontal Floating Particles */}
            <div className="hero-particles">
                <span className="shape-circle"></span>
                <span className="shape-square"></span>
                <span className="shape-triangle"></span>
                <span className="shape-circle"></span>
                <span className="shape-square"></span>
                <span className="shape-triangle"></span>
                <span className="shape-circle"></span>
                <span className="shape-square"></span>
                <span className="shape-triangle"></span>
                <span className="shape-circle"></span>
                <span className="shape-square"></span>
                <span className="shape-triangle"></span>
                <span className="shape-circle"></span>
                <span className="shape-square"></span>
                <span className="shape-triangle"></span>
            </div>

            <div className="container hero-container relative">
                <h1 className="hero-headline">
                    Simplifying Accounting <br />
                    <span className="gradient-text">with Intelligent, Automated Technology</span>
                </h1>
                <p className="hero-subheadline">
                    Simplify GST filing, automate invoices, and get real-time business insights with India&apos;s most trusted cloud ERP.
                </p>

                <div className="hero-ctas">
                    <button
                        className="btn btn-primary btn-xl"
                        onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new Event('openTrialModal'));
                        }}
                    >
                        Sign up Now <ArrowRight size={18} className="ml-2" style={{ marginLeft: '8px' }} />
                    </button>
                    <button
                        className="btn btn-white btn-xl flex-center"
                        onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new Event('openDemoModal'));
                        }}
                    >
                        <Play size={18} fill="white" color="white" style={{ marginRight: '8px' }} /> Schedule Demo
                    </button>
                </div>

                <div className="trust-badges">
                    <div className="badge-item">
                        <div className="check-circle"><Check size={14} /></div>
                        <span>Easy Accounting</span>
                    </div>
                    <div className="badge-item">
                        <div className="check-circle"><Check size={14} /></div>
                        <span>GST Ready</span>
                    </div>
                    <div className="badge-item">
                        <div className="check-circle"><Check size={14} /></div>
                        <span>Secure Cloud Data</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
