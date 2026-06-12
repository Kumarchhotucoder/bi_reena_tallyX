import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    const ringRef = useRef(null);
    const dotRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const ring = ringRef.current;
        const dot = dotRef.current;
        if (!ring || !dot) return;

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;
        let dotX = 0;
        let dotY = 0;
        let animationFrameId;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const onMouseDown = () => {
            ring.classList.add('clicking');
            dot.classList.add('clicking');
        };

        const onMouseUp = () => {
            ring.classList.remove('clicking');
            dot.classList.remove('clicking');
        };

        const handleLinkHover = () => setIsHovering(true);
        const handleLinkLeave = () => setIsHovering(false);

        const addHoverListeners = () => {
            document.querySelectorAll('a, button, .hover-trigger').forEach(el => {
                el.addEventListener('mouseenter', handleLinkHover);
                el.addEventListener('mouseleave', handleLinkLeave);
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        addHoverListeners();
        const interval = setInterval(addHoverListeners, 1000);

        const animate = () => {
            // Ring trails with lerp (smooth lag)
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            // Dot follows much faster (almost instant)
            dotX += (mouseX - dotX) * 0.9;
            dotY += (mouseY - dotY) * 0.9;

            if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
            if (dot) dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            cancelAnimationFrame(animationFrameId);
            clearInterval(interval);

            document.querySelectorAll('a, button, .hover-trigger').forEach(el => {
                el.removeEventListener('mouseenter', handleLinkHover);
                el.removeEventListener('mouseleave', handleLinkLeave);
            });
        };
    }, []);

    return (
        <>
            <div
                ref={ringRef}
                className={`custom-cursor-ring ${isHovering ? 'hovered' : ''}`}
            />
            <div
                ref={dotRef}
                className={`custom-cursor-dot ${isHovering ? 'hovered' : ''}`}
            />
        </>
    );
};

export default CustomCursor;
