import React from 'react';
import dashboardImage from '../assets/dashboard.png';

const DashboardPreview = () => {
    return (
        <section className="dashboard-section">
            <div className="container">
                <div className="dashboard-image-container floating-animation">
                    <img
                        src={dashboardImage}
                        alt="Dashboard Preview"
                        className="dashboard-img"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/1200x800?text=Please+Add+src/assets/dashboard.png";
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
