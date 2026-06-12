import React, { useState } from 'react';
import { Filter, Download, ChevronDown } from 'lucide-react';

const Analytics = () => {
    const [activeFilter, setActiveFilter] = useState('Hourly');

    return (
        <section className="section analytics-section" id="analytics">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Drilldown Reports: Analyze Every Cent</h2>
                    <p className="section-subtitle">Deep dive into your financial data with granular controls.</p>
                </div>

                <div className="analytics-card">
                    <div className="analytics-toolbar">
                        <div className="filter-group">
                            {['Hourly', 'Daily', 'Weekly'].map(filter => (
                                <button
                                    key={filter}
                                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <div className="action-group">
                            <button className="btn btn-outline btn-sm">
                                <Filter size={16} /> Filter by Category
                            </button>
                            <button className="btn btn-outline btn-sm">
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="analytics-table">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Date & Time</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item}>
                                        <td>#TRX-00{item}89</td>
                                        <td>Oct 24, 2024 • 14:30</td>
                                        <td>Software</td>
                                        <td>Cloud Server Maintenance</td>
                                        <td><span className="badge good">Completed</span></td>
                                        <td className="text-right font-mono">-${(Math.random() * 1000).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Analytics;
