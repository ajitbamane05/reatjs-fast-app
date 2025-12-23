import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listAdminQuizzes, deleteQuiz } from '../../api/quiz';
import QuizCard from '../../components/QuizCard';
import Navbar from '../../components/Navbar';

const DashboardPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        try {
            setLoading(true);
            const data = await listAdminQuizzes();
            setQuizzes(data);
        } catch (err) {
            setError('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (quizId, quizTitle) => {
        if (!confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
            return;
        }

        try {
            await deleteQuiz(quizId);
            setQuizzes(quizzes.filter(q => q.id !== quizId));
        } catch (err) {
            alert('Failed to delete quiz');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12 animate-fade-in">
                    <div>
                        <h1 className="mb-2">Quiz Dashboard</h1>
                        <p className="text-gray-400">Manage your quizzes</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/quiz/create')}
                        className="btn btn-primary btn-large"
                    >
                        + Create Quiz
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card text-center animate-fade-in">
                        <h3 className="text-4xl text-primary font-bold">
                            {quizzes.length}
                        </h3>
                        <p className="text-gray-400">Total Quizzes</p>
                    </div>
                    <div className="card text-center animate-fade-in delay-100">
                        <h3 className="text-4xl text-success font-bold">
                            {quizzes.filter(q => q.is_active).length}
                        </h3>
                        <p className="text-gray-400">Active Quizzes</p>
                    </div>
                    <div className="card text-center animate-fade-in delay-200">
                        <h3 className="text-4xl text-accent font-bold">
                            {quizzes.reduce((sum, q) => sum + q.question_count, 0)}
                        </h3>
                        <p className="text-gray-400">Total Questions</p>
                    </div>
                </div>

                {/* Quizzes List */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <div className="spinner"></div>
                    </div>
                ) : error ? (
                    <div className="card text-center">
                        <p className="text-error">{error}</p>
                        <button onClick={loadQuizzes} className="btn btn-primary mt-4">
                            Try Again
                        </button>
                    </div>
                ) : quizzes.length === 0 ? (
                    <div className="card text-center animate-fade-in">
                        <h3>No Quizzes Yet</h3>
                        <p className="text-gray-400 mb-6">Create your first quiz to get started!</p>
                        <button
                            onClick={() => navigate('/admin/quiz/create')}
                            className="btn btn-primary"
                        >
                            Create Quiz
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="mb-6">Your Quizzes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quizzes.map((quiz, index) => (
                                <div key={quiz.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="flex justify-between items-center">
                                                <h3 className="card-title">{quiz.title}</h3>
                                                <span className={`badge ${quiz.is_active ? 'badge-success' : 'badge-error'}`}>
                                                    {quiz.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            {quiz.description && (
                                                <p className="card-description">{quiz.description}</p>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-gray-400 text-sm mb-6">
                                            <span>{quiz.question_count} questions</span>
                                            <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => navigate(`/admin/quiz/${quiz.id}`)}
                                                className="btn btn-primary flex-1"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDelete(quiz.id, quiz.title)}
                                                className="btn btn-outline border-error text-error hover:bg-error hover:text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default DashboardPage;
