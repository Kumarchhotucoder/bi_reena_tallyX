import React from 'react';

const DashboardPreview = () => {
    return (
        <section className="dashboard-section">
            <div className="container">
                <div className="dashboard-image-container floating-animation">
                    {/* 
                User needs to place 'dashboard.png' in src/assets/ 
                For now, I'll use a placeholder or local path expectation.
            */}
                    <img
                        src="/src/assets/dashboard.png"
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
