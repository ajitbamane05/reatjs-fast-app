import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(() => {
        return localStorage.getItem('user_email') || null;
    });

    const saveUserEmail = (email) => {
        localStorage.setItem('user_email', email);
        setUserEmail(email);
    };

    const clearUserEmail = () => {
        localStorage.removeItem('user_email');
        setUserEmail(null);
    };

    const value = {
        userEmail,
        saveUserEmail,
        clearUserEmail,
        hasEmail: !!userEmail,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
