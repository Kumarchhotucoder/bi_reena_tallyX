import React from 'react';
import { Building2, BookOpen, Users, Receipt, ArrowUpRight } from 'lucide-react';
import './TailoredSolutions.css';

const solutions = [
    {
        title: "Small-scale business",
        description: "Get paid on time, track expenses, automate tasks, and make informed financial decisions.",
        icon: <Receipt size={28} color="#ffffff" />,
        bgColorClass: "icon-blue"
    },
    {
        title: "Mid-market business",
        description: "Go global! Use multi-currency feature, advanced integrations, analytics, and customization.",
        icon: <Building2 size={28} color="#ffffff" />,
        bgColorClass: "icon-black"
    },
    {
        title: "For students",
        description: "Developed exclusively for students to experiment and self-learn cloud accounting.",
        icon: <BookOpen size={28} color="#000000" />,
        bgColorClass: "icon-yellow"
    },
    {
        title: "For accountants",
        description: "An expert accountant community to manage books and streamline finances.",
        icon: <Users size={28} color="#ffffff" />,
        bgColorClass: "icon-blue"
    }
];

const TailoredSolutions = () => {
    return (
        <section className="tailored-section">
            <div className="container tailored-container">
                <div className="tailored-header">
                    <span className="tailored-label">Tailored for you</span>
                    <h2 className="tailored-title">
                        An accounting solution for every need and every business
                    </h2>
                </div>

                <div className="tailored-grid">
                    {solutions.map((solution, index) => (
                        <div key={index} className="tailored-card">
                            <div className="card-image-box">
                                <div className={`icon-square ${solution.bgColorClass}`}>
                                    {solution.icon}
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">{solution.title}</h3>
                                <p className="card-desc">{solution.description}</p>
                                <div className="card-action">
                                    <button className="arrow-btn" aria-label={`Read more about ${solution.title}`}>
                                        <ArrowUpRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TailoredSolutions;
