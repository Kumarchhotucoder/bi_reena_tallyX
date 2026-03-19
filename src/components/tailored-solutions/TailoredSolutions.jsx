import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, BookOpen, Users, Receipt, ArrowRight } from 'lucide-react';
import './TailoredSolutions.css';

const solutions = [
    {
        title: "Small-scale business",
        description: "Get paid on time, track expenses, automate tasks, and make informed financial decisions.",
        icon: <Receipt size={28} />,
        accent: "ts-orange"
    },
    {
        title: "Mid-market business",
        description: "Go global! Use multi-currency feature, advanced integrations, analytics, and customization.",
        icon: <Building2 size={28} />,
        accent: "ts-pink"
    },
    {
        title: "For students",
        description: "Developed exclusively for students to experiment and self-learn cloud accounting.",
        icon: <BookOpen size={28} />,
        accent: "ts-purple"
    },
    {
        title: "For accountants",
        description: "An expert accountant community to manage books and streamline finances.",
        icon: <Users size={28} />,
        accent: "ts-indigo"
    }
];

const TailoredSolutions = () => {
    return (
        <section className="ts-section">
            <div className="ts-container">
                <div className="ts-header">
                    <span className="ts-pill">Tailored for you</span>
                    <h2 className="ts-title">
                        An accounting solution for <br />
                        <span className="ts-gradient-text">every need and every business</span>
                    </h2>
                </div>

                <div className="ts-grid">
                    {solutions.map((solution, index) => (
                        <div key={index} className={`ts-card ${solution.accent}`}>
                            <div className="ts-icon-wrapper">
                                {solution.icon}
                            </div>
                            <h3 className="ts-card-title">{solution.title}</h3>
                            <p className="ts-card-desc">{solution.description}</p>

                            <div className="ts-card-footer">
                                <Link to="/services" className="ts-action-link">
                                    <span>Learn more</span>
                                    <ArrowRight size={18} className="ts-arrow" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TailoredSolutions;
