import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';
import {
    Calculator,
    FileText,
    PieChart,
    Users,
    Briefcase,
    Building,
    ArrowRight
} from 'lucide-react';

const ServiceCard = ({ service }) => {
    return (
        <div className="services-card">
            <div className="services-icon-container">
                {React.cloneElement(service.icon, { size: 28, strokeWidth: 1.5 })}
            </div>
            <h3 className="services-card-title">{service.title}</h3>
            <p className="services-card-desc">{service.desc}</p>
            <Link
                to="/services"
                className="services-card-btn"
            >
                Learn more <ArrowRight size={18} />
            </Link>
        </div>
    );
};

const Services = () => {
    const services = [
        {
            icon: <Calculator />,
            title: "Automated Bookkeeping",
            desc: "Say goodbye to manual data entry. We categorize transactions, reconcile bank accounts, and keep your books perpetually audit-ready."
        },
        {
            icon: <FileText />,
            title: "Tax Preparation & Compliance",
            desc: "Stay ahead of regulatory deadlines. We generate detailed tax reports, monitor compliance changes, and prepare everything for easy filing."
        },
        {
            icon: <PieChart />,
            title: "Financial Reporting",
            desc: "Gain deep insights into your cash flow. We provide customizable balance sheets, profit & loss statements, and granular cash flow analysis."
        },
        {
            icon: <Users />,
            title: "Payroll Management",
            desc: "Simplify payroll processing with automated calculations, precise tax withholding, and direct deposit setups for your entire team."
        },
        {
            icon: <Briefcase />,
            title: "CFO Advisory Services",
            desc: "Get strategic financial planning. Our virtual CFOs help you map out growth, analyze margins, and secure long-term capital forecasting."
        },
        {
            icon: <Building />,
            title: "Enterprise Solutions",
            desc: "Custom consolidation and multi-entity management for scaling businesses that require advanced operational workflows."
        }
    ];

    return (
        <section className="services-section" id="services">
            <div className="services-container">
                <div className="services-header">
                    <span className="services-pill">OUR EXPERTISE</span>
                    <h2 className="services-headline">Comprehensive Accounting Services</h2>
                    <p className="services-subheadline">
                        From basic ledger management to complex tax strategy, BiReenaTellyX offers a full<br />
                        suite of services designed to let you focus on growing your business.
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
