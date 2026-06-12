import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import './faq/FAQ.css';
import supportTeamImg from '../assets/support-team.jpg';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqItems = [
        {
            question: "How secure is my financial data?",
            answer: "Your financial data is protected using advanced encryption standards (SSL/TLS), role-based access control, and secure cloud storage. Regular backups and multi-layer authentication ensure your accounting data remains safe and confidential."
        },
        {
            question: "Can I generate GST-compliant invoices?",
            answer: "Yes. The software supports GST-compliant invoicing, automatic tax calculation, HSN/SAC codes, and GST return reports, making it easy to stay compliant with government regulations.",
            hasSlider: true
        },
        {
            question: "Do I need accounting knowledge to use this software?",
            answer: "No. Our platform is built for non-accountants as well. With guided workflows, smart suggestions, and automated journal entries, even small business owners can manage accounts without deep accounting expertise."
        },
        {
            question: "How does your reporting system stand out?",
            answer: "Our reporting dashboard provides real-time visual analytics, interactive charts, and customizable financial summaries—far beyond traditional static reports. You can filter by date, department, branch, or category instantly."
        },
        {
            question: "Can it scale with my growing business?",
            answer: "Absolutely. Whether you're a freelancer, startup, or multi-branch enterprise, the platform scales with your needs, supporting multi-user access, branch-wise accounting, and high transaction volumes."
        },
        {
            question: "Do you offer automated bank reconciliation?",
            answer: "Yes. Our system automatically matches bank transactions with accounting entries, saving hours of manual reconciliation work and reducing errors."
        },
        {
            question: "How is your accounting software different from Tally or Zoho?",
            answer: "Unlike traditional accounting tools, our software combines automated accounting, real-time analytics, and AI-powered financial insights in one platform. It requires no installation, works fully on the cloud, and provides a cleaner, more intuitive user interface designed for modern businesses."
        }
    ];

    return (
        <section className="faq-section container">
            <div className="faq-main-wrapper">
                <div className="faq-header">
                    <h2 className="faq-title">Frequently Asked Questions.</h2>
                    <div className="support-team">
                        <span className="support-label">Support Team</span>
                        <img loading="lazy" decoding="async" className="alignnone size-full wp-image-985" src={supportTeamImg} alt="Support Team" width="93" height="44" title="Home 26" />
                    </div>
                </div>

                <div className="faq-container" style={{ position: 'relative' }}>
                    <div className="faq-list">
                        {faqItems.map((item, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                <div className="faq-item-content">
                                    <h3 className="faq-question">{item.question}</h3>
                                    {activeIndex === index ? (
                                        <Minus className="faq-icon" />
                                    ) : (
                                        <Plus className="faq-icon" />
                                    )}
                                </div>
                                <div className="faq-answer">
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* "We Are Here" sticker simulation - Visual flair */}


        </section>
    );
};

export default FAQ;
