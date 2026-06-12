import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PreFooter from './prefooter/PreFooter';
import CustomCursor from './CustomCursor';
import DemoModal from './DemoModal';
import TrialModal from './TrialModal';
import AiCopilotModal from './AiCopilotModal';
import MobileAppModal from './MobileAppModal';
import PricingModal from './PricingModal';
import SignInModal from './SignInModal';
import ForgotPasswordModal from './ForgotPasswordModal';

const Layout = ({ children, hidePreFooter }) => {
    const location = useLocation();

    // Scroll to top automatically when the route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // The navbar is fixed and very tall. The HomePage hero section manually handles this with padding-top: 12rem.
    // For all other pages, we add a padding to the <main> tag to prevent the fixed navbar from overlapping the top content.
    const isHomePage = location.pathname === '/';
    const mainStyle = {
        position: 'relative',
        zIndex: 1,
        paddingTop: isHomePage ? '0' : '150px' // 150px compensates for the tall navbar
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <CustomCursor />
            <Navbar />
            <main style={mainStyle}>
                {children}
            </main>
            {!hidePreFooter && <PreFooter />}
            <Footer />
            <DemoModal />
            <TrialModal />
            <AiCopilotModal />
            <MobileAppModal />
            <PricingModal />
            <SignInModal />
            <ForgotPasswordModal />
        </div>
    );
};

export default Layout;
