import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('tallyx_token');
    const location = useLocation();

    if (!token) {
        // Redirect them to the / login page, but save the current location they were trying to go to when they were redirected. This allows us to send them along to that page after they login, which is a nicer user experience than dropping them off on the home page.
        // We'll also dispatch the openSignInModal event so the home page knows to open it immediately.
        setTimeout(() => {
            window.dispatchEvent(new Event('openSignInModal'));
        }, 100);

        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
