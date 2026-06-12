import React, { useEffect, useRef } from 'react';
import './FullPageSlider.css';

import section1 from '../assets/section1.jpg';
import section2 from '../assets/section2.jpg';
import section3 from '../assets/section3.jpg';
import section4 from '../assets/section4.jpg';

const sections = [
    {
        id: 1,
        title: 'Discover Innovation',
        subtitle: 'Experience the next generation of our platform with intuitive design and powerful features.',
        image: section1,
        cta: 'Get Started'
    },
    {
        id: 2,
        title: 'Seamless Integration',
        subtitle: 'Connect all your favorite tools in one place without writing a single line of code.',
        image: section2,
        cta: 'Learn More'
    },
    {
        id: 3,
        title: 'Analytics That Matter',
        subtitle: 'Make data-driven decisions with our beautiful, real-time analytics dashboard.',
        image: section3,
        cta: 'View Features'
    },
    {
        id: 4,
        title: 'Enterprise Ready',
        subtitle: 'Built for scale with robust security, compliance and administration tools.',
        image: section4,
        cta: 'Contact Sales'
    }
];

const FullPageSlider = () => {
    // Duplicate sections for seamless infinite loop (exactly 2 copies for -50% translation)
    const carouselItems = [...sections, ...sections];

    return (
        <div className="slider-page-wrapper">
            <div className="slider-infinite-track">
                {carouselItems.map((section, index) => (
                    <div key={`${section.id}-${index}`} className="slider-infinite-item">
                        <img
                            src={section.image}
                            alt={section.title}
                            className="slider-infinite-img"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FullPageSlider;
