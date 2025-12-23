import apiClient from './client';

/**
 * Register user email (no auth required)
 */
export const registerUserEmail = async (email) => {
    const response = await apiClient.post('/api/users/register', { email });
    return response.data;
};

/**
 * Create quiz (admin only)
 */
export const createQuiz = async (quizData) => {
    const response = await apiClient.post('/api/quizzes', quizData);
    return response.data;
};

/**
 * List quizzes (admin only)
 */
export const listAdminQuizzes = async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/api/quizzes', {
        params: { skip, limit },
    });
    return response.data;
};

/**
 * Get quiz details (admin only)
 */
export const getAdminQuiz = async (quizId) => {
    const response = await apiClient.get(`/api/quizzes/${quizId}`);
    return response.data;
};

/**
 * Update quiz (admin only)
 */
export const updateQuiz = async (quizId, quizData) => {
    const response = await apiClient.put(`/api/quizzes/${quizId}`, quizData);
    return response.data;
};

/**
 * Delete quiz (admin only)
 */
export const deleteQuiz = async (quizId) => {
    await apiClient.delete(`/api/quizzes/${quizId}`);
};

/**
 * List active quizzes (public)
 */
export const listPublicQuizzes = async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/api/public/quizzes', {
        params: { skip, limit },
    });
    return response.data;
};

/**
 * Get quiz for taking (public, no answers)
 */
export const getPublicQuiz = async (quizId) => {
    const response = await apiClient.get(`/api/public/quizzes/${quizId}`);
    return response.data;
};

/**
 * Submit quiz answers (public)
 */
export const submitQuiz = async (quizId, email, answers) => {
    const response = await apiClient.post(`/api/public/quizzes/${quizId}/submit`, {
        email,
        answers,
    });
    return response.data;
};
