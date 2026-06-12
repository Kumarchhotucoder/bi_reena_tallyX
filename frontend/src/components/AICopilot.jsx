import React, { useEffect, useState } from 'react';
import { Sparkles, Bot, ArrowRight, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import './AICopilot.css';

const AICopilot = () => {
    const [activeInsight, setActiveInsight] = useState(0);

    const insights = [
        {
            icon: <AlertCircle size={20} className="ai-icon-alert" />,
            title: "Anomaly Detected",
            desc: "Duplicate payment of ₹45,000 detected for Vendor 'TechCorp'.",
            time: "Just now",
            type: "alert"
        },
        {
            icon: <TrendingUp size={20} className="ai-icon-success" />,
            title: "Cashflow Projection",
            desc: "Based on recurring invoices, cash flow will increase by 18% next week.",
            time: "2 mins ago",
            type: "success"
        },
        {
            icon: <CheckCircle2 size={20} className="ai-icon-info" />,
            title: "Tax Optimization",
            desc: "You have ₹1.2L in unclaimed GST input credit. Click to review.",
            time: "1 hour ago",
            type: "info"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveInsight((prev) => (prev + 1) % insights.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [insights.length]);

    return (
        <section className="ai-section">
            {/* Deep dark animated blobs */}
            <div className="ai-blob ai-blob-cyan"></div>
            <div className="ai-blob ai-blob-purple"></div>

            <div className="ai-container">
                <div className="ai-content-side">
                    <div className="ai-badge">
                        <Sparkles size={16} />
                        <span>BiReenaTellyX AI Engine</span>
                    </div>
                    <h2 className="ai-title">
                        Meet Your 24/7 Virtual <br />
                        <span className="ai-gradient-text">Chief Financial Officer</span>
                    </h2>
                    <p className="ai-description">
                        While other software just records your data, our AI active-scans it. It predicts cash flow shortages, flags duplicate invoices, and finds tax savings automatically—so you can focus on scaling.
                    </p>

                    <ul className="ai-feature-list">
                        <li>
                            <div className="ai-feat-icon"><Bot size={18} /></div>
                            <span>Auto-categorization of 10,000+ bank transactions</span>
                        </li>
                        <li>
                            <div className="ai-feat-icon"><Sparkles size={18} /></div>
                            <span>Real-time anomaly & fraud detection</span>
                        </li>
                    </ul>

                    <a
                        href="#"
                        className="ai-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new Event('openAiCopilotModal'));
                        }}
                    >
                        See AI in Action <ArrowRight size={16} className="ai-btn-arrow" />
                    </a>
                </div>

                <div className="ai-visual-side">
                    <div className="ai-glass-dashboard">
                        <div className="ai-dash-header">
                            <div className="ai-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="ai-dash-title">AI Insights Feed</div>
                        </div>

                        <div className="ai-dash-body">
                            <div className="ai-scanning-bar">
                                <div className="ai-scanner"></div>
                                <span>Analyzing financial health...</span>
                            </div>

                            <div className="ai-insights-list">
                                {insights.map((insight, idx) => (
                                    <div
                                        key={idx}
                                        className={`ai-insight-card ${idx === activeInsight ? 'active' : ''} ${insight.type}`}
                                    >
                                        <div className="ai-insight-icon-wrapper">
                                            {insight.icon}
                                        </div>
                                        <div className="ai-insight-text">
                                            <div className="ai-insight-top">
                                                <h4>{insight.title}</h4>
                                                <span className="ai-time">{insight.time}</span>
                                            </div>
                                            <p>{insight.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="ai-float-tag top-right">99.8% Accuracy</div>
                    <div className="ai-float-tag bottom-left">Predictive Analytics</div>
                </div>
            </div>
        </section>
    );
};

export default AICopilot;
