import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ArrowRight, Sparkles, CheckCircle2, MonitorPlay } from 'lucide-react';
import Layout from '../components/Layout';
import './ContactPage.css';

const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const contactCards = [
        {
            icon: <Phone size={22} />,
            title: "Call Us",
            detail: "+91 91351-55931",
            sub: "Mon–Sat, 9AM – 7PM IST",
            accent: "ct-orange"
        },
        {
            icon: <Mail size={22} />,
            title: "Email Us",
            detail: "support@bireenatallyx.com",
            sub: "We'll reply within 24 hours",
            accent: "ct-pink"
        },
        {
            icon: <MapPin size={22} />,
            title: "Visit Us",
            detail: "Bireena Info Tech",
            sub: "India",
            accent: "ct-purple"
        },
        {
            icon: <Clock size={22} />,
            title: "Business Hours",
            detail: "Mon – Saturday",
            sub: "9:00 AM – 7:00 PM IST",
            accent: "ct-indigo"
        },
        {
            icon: <MonitorPlay size={22} />,
            title: "Live Software Demo",
            detail: "Request a Free Tour",
            sub: "Experience smart accounting features",
            accent: "ct-blue"
        }
    ];

    return (
        <Layout hidePreFooter>
            <section className="ct-section">
                {/* Background decorations */}
                <div className="ct-bg-blob ct-blob-1"></div>
                <div className="ct-bg-blob ct-blob-2"></div>

                <div className="ct-container">
                    {/* Header */}
                    <div className="ct-header">
                        <span className="ct-badge"><Sparkles size={14} /> Get In Touch</span>
                        <h1 className="ct-title">
                            Let's Start a <span className="ct-title-gradient">Conversation</span>
                        </h1>
                        <p className="ct-subtitle">
                            Have a question or want to schedule a demo? Reach out and we'll get back to you shortly.
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="ct-main">
                        {/* Left: Contact Info Cards */}
                        <div className="ct-info-side">
                            {contactCards.map((card, i) => (
                                <div key={i} className={`ct-info-card ${card.accent}`}>
                                    <div className="ct-info-icon">{card.icon}</div>
                                    <div className="ct-info-text">
                                        <h4>{card.title}</h4>
                                        <p className="ct-info-detail">{card.detail}</p>
                                        <p className="ct-info-sub">{card.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Form */}
                        <div className="ct-form-wrapper">
                            <div className="ct-form-card">
                                <h3 className="ct-form-title">Send us a Message</h3>
                                <p className="ct-form-subtitle">Fill out the form and our team will reach out.</p>

                                {submitted ? (
                                    <div className="ct-success">
                                        <CheckCircle2 size={40} className="ct-success-icon" />
                                        <h4>Message Sent!</h4>
                                        <p>We'll get back to you within 24 hours.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="ct-form">
                                        <div className="ct-form-row">
                                            <div className="ct-field">
                                                <label>Full Name</label>
                                                <input type="text" placeholder="John Doe" required />
                                            </div>
                                            <div className="ct-field">
                                                <label>Email Address</label>
                                                <input type="email" placeholder="john@example.com" required />
                                            </div>
                                        </div>
                                        <div className="ct-field">
                                            <label>Phone Number</label>
                                            <input type="tel" placeholder="+91 98765 43210" />
                                        </div>
                                        <div className="ct-field">
                                            <label>Subject</label>
                                            <select defaultValue="">
                                                <option value="" disabled>Select a topic</option>
                                                <option>General Inquiry</option>
                                                <option>Schedule a Demo</option>
                                                <option>Pricing & Plans</option>
                                                <option>Technical Support</option>
                                                <option>Partnership</option>
                                            </select>
                                        </div>
                                        <div className="ct-field">
                                            <label>Message</label>
                                            <textarea rows={4} placeholder="Tell us how we can help..." required></textarea>
                                        </div>
                                        <button type="submit" className="ct-submit-btn">
                                            <span>Send Message</span>
                                            <Send size={16} className="ct-btn-icon" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default ContactPage;
