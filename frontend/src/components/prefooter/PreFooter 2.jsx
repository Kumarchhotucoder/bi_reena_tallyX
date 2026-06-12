import React from 'react';
import { Hourglass, MousePointerClick, Columns } from 'lucide-react';
import './PreFooter.css';

const PreFooter = () => {
    return (
        <section className="prefooter-section">
            <div className="container prefooter-container">
                <div className="prefooter-item">
                    <div className="prefooter-icon">
                        <Hourglass size={48} strokeWidth={1.5} color="#ffffff" />
                    </div>
                    <h3 className="prefooter-title">Free Trial</h3>
                    <p className="prefooter-desc">
                        Start with a free trail to experience effortless accounting.
                    </p>
                    <a href="#trial" className="prefooter-btn">
                        Start a Trial &rarr;
                    </a>
                </div>

                <div className="prefooter-item">
                    <div className="prefooter-icon">
                        <MousePointerClick size={48} strokeWidth={1.5} color="#ffffff" />
                    </div>
                    <h3 className="prefooter-title">Request a Demo</h3>
                    <p className="prefooter-desc">
                        Schedule a personal demo with a BiReenaTallyX product expert.
                    </p>
                    <a href="#demo" className="prefooter-btn">
                        Request a Demo &rarr;
                    </a>
                </div>

                <div className="prefooter-item">
                    <div className="prefooter-icon">
                        <Columns size={48} strokeWidth={1.5} color="#ffffff" />
                    </div>
                    <h3 className="prefooter-title">Plans & Pricing</h3>
                    <p className="prefooter-desc">
                        Compare plans and features and find the best fit for your needs.
                    </p>
                    <a href="#pricing" className="prefooter-btn">
                        View all Plans &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
};

export default PreFooter;
