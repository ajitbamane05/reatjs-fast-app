import apiClient from './client';

/**
 * Admin registration
 */
export const registerAdmin = async (email, password) => {
    const response = await apiClient.post('/api/auth/admin/register', {
        email,
        password,
    });
    return response.data;
};

/**
 * Admin login
 */
export const loginAdmin = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post('/api/auth/admin/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};

/**
 * Get current admin info
 */
export const getCurrentAdmin = async () => {
    const response = await apiClient.get('/api/auth/admin/me');
    return response.data;
};
