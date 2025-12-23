import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin as loginAPI, getCurrentAdmin } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('admin_token');
            if (token) {
                try {
                    const adminData = await getCurrentAdmin();
                    setAdmin(adminData);
                } catch (err) {
                    localStorage.removeItem('admin_token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const data = await loginAPI(email, password);
            localStorage.setItem('admin_token', data.access_token);

            // Fetch admin info
            const adminData = await getCurrentAdmin();
            setAdmin(adminData);

            return true;
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setAdmin(null);
    };

    const value = {
        admin,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!admin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
