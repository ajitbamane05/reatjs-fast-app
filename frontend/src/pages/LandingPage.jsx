import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPublicQuizzes } from '../api/quiz';
import { useUser } from '../context/UserContext';
import QuizCard from '../components/QuizCard';
import EmailForm from '../components/EmailForm';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const { userEmail, saveUserEmail } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        try {
            setLoading(true);
            const data = await listPublicQuizzes();
            setQuizzes(data);
        } catch (err) {
            setError('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleQuizClick = (quizId) => {
        if (userEmail) {
            navigate(`/quiz/${quizId}`);
        } else {
            setSelectedQuizId(quizId);
            setShowEmailForm(true);
        }
    };

    const handleEmailSubmit = async (email) => {
        saveUserEmail(email);
        navigate(`/quiz/${selectedQuizId}`);
    };

    if (showEmailForm) {
        return (
            <>
                <Navbar />
                <div className="container container-sm pt-8">
                    <div className="card max-w-[500px] mx-auto">
                        <div className="card-header text-center">
                            <h2 className="card-title">Enter Your Email</h2>
                            <p className="card-description">
                                We'll save your email to track your quiz progress
                            </p>
                        </div>
                        <EmailForm onSubmit={handleEmailSubmit} buttonText="Start Quiz" />
                        <button
                            onClick={() => setShowEmailForm(false)}
                            className="btn btn-secondary mt-4 w-full"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container pt-8">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-4">
                        Test Your Knowledge
                    </h1>
                    <p className="text-xl text-gray-400 max-w-[600px] mx-auto">
                        Choose from our collection of quizzes and challenge yourself. Track your progress and improve your skills.
                    </p>
                </div>

                {/* Quizzes Grid */}
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
                        <h3>No Quizzes Available</h3>
                        <p className="text-gray-400">Check back later for new quizzes!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {quizzes.map((quiz) => (
                            <div key={quiz.id} onClick={() => handleQuizClick(quiz.id)} className="cursor-pointer">
                                <QuizCard quiz={quiz} linkTo="#" />
                            </div>
                        ))}
                    </div>
                )}

                {userEmail && (
                    <div className="text-center mt-12">
                        <p className="text-gray-400">
                            Logged in as: <strong>{userEmail}</strong>
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default LandingPage;
