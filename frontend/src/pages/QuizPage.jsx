import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicQuiz, submitQuiz } from '../api/quiz';
import { useUser } from '../context/UserContext';
import QuestionRenderer from '../components/QuestionRenderer';
import Navbar from '../components/Navbar';

const QuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { userEmail } = useUser();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userEmail) {
            navigate('/');
            return;
        }
        loadQuiz();
    }, [quizId, userEmail]);

    const loadQuiz = async () => {
        try {
            setLoading(true);
            const data = await getPublicQuiz(quizId);
            setQuiz(data);
        } catch (err) {
            setError('Failed to load quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handleSubmit = async () => {
        // Check if all questions are answered
        const unanswered = quiz.questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
            return;
        }

        try {
            setSubmitting(true);
            const result = await submitQuiz(quizId, userEmail, answers);
            navigate(`/results/${result.submission_id}`, { state: { result } });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = quiz?.questions?.length || 0;
    const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="spinner"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="container container-sm pt-8">
                    <div className="card text-center">
                        <p className="text-error">{error}</p>
                        <button onClick={() => navigate('/')} className="btn btn-primary mt-4">
                            Back to Home
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container container-lg py-8">
                {/* Quiz Header */}
                <div className="card mb-8 animate-fade-in">
                    <h1 className="card-title">{quiz.title}</h1>
                    {quiz.description && <p className="card-description">{quiz.description}</p>}

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-gray-400">{answeredCount} / {totalQuestions}</span>
                        </div>
                        <div className="w-full h-2 bg-background-lighter rounded-lg overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="flex flex-col gap-8">
                    {quiz.questions.map((question) => (
                        <QuestionRenderer
                            key={question.id}
                            question={question}
                            answer={answers[question.id]}
                            onChange={handleAnswerChange}
                        />
                    ))}
                </div>

                {/* Submit Button */}
                <div className="card mt-8 text-center">
                    <button
                        onClick={handleSubmit}
                        className="btn btn-primary btn-large min-w-[200px]"
                        disabled={submitting || answeredCount < totalQuestions}
                    >
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                    {answeredCount < totalQuestions && (
                        <p className="text-gray-400 mt-2">
                            Please answer all questions before submitting
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default QuizPage;
