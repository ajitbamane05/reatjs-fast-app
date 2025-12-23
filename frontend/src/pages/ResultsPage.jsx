import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result;

    if (!result) {
        navigate('/');
        return null;
    }

    const percentage = result.percentage.toFixed(1);
    const isPassing = percentage >= 60;

    return (
        <>
            <Navbar />
            <div className="container container-lg py-8">
                {/* Score Card */}
                <div
                    className={`card text-center mb-12 animate-fade-in ${isPassing
                            ? 'bg-gradient-to-br from-green-500/10 to-green-500/5'
                            : 'bg-gradient-to-br from-red-500/10 to-red-500/5'
                        }`}
                >
                    <h1 className="text-4xl mb-4">
                        {isPassing ? '🎉 Great Job!' : '📚 Keep Learning!'}
                    </h1>
                    <div className="text-2xl mb-2">
                        <span className={`text-[4rem] font-bold bg-clip-text text-transparent bg-gradient-to-br ${isPassing
                            ? 'from-green-500 to-emerald-400'
                            : 'from-red-500 to-red-400'
                            }`}>
                            {percentage}%
                        </span>
                    </div>
                    <p className="text-xl text-gray-400">
                        You scored {result.score} out of {result.total_questions} questions correctly
                    </p>
                </div>

                {/* Quiz Info */}
                <div className="card mb-8">
                    <h2 className="card-title">Quiz: {result.quiz_title}</h2>
                    <div className="flex gap-4 flex-wrap">
                        <span className="badge badge-success">{result.score} Correct</span>
                        <span className="badge badge-error">{result.total_questions - result.score} Incorrect</span>
                        <span className="text-gray-400">
                            Submitted: {new Date(result.submitted_at).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Detailed Results */}
                <h2 className="mb-4">Review Answers</h2>
                <div className="flex flex-col gap-4">
                    {result.results.map((questionResult, index) => (
                        <div
                            key={questionResult.question_id}
                            className={`card animate-slide-in border-2 ${questionResult.is_correct ? 'border-success' : 'border-error'
                                }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="badge">Question {index + 1}</span>
                                <span className={`font-bold ${questionResult.is_correct ? 'text-success' : 'text-error'}`}>
                                    {questionResult.is_correct ? '✓ Correct' : '✗ Incorrect'}
                                </span>
                            </div>

                            <h3 className="card-title text-xl">
                                {questionResult.question_text}
                            </h3>

                            <div className="mt-4 p-4 bg-background-light rounded-lg">
                                <div className="mb-2">
                                    <strong>Your Answer:</strong>{' '}
                                    <span className={questionResult.is_correct ? 'text-success' : 'text-error'}>
                                        {questionResult.user_answer}
                                    </span>
                                </div>
                                {!questionResult.is_correct && (
                                    <div className="mb-2">
                                        <strong>Correct Answer:</strong>{' '}
                                        <span className="text-success">{questionResult.correct_answer}</span>
                                    </div>
                                )}
                                {questionResult.explanation && (
                                    <div className="mt-2 p-2 bg-background rounded border-l-4 border-primary">
                                        <strong>Explanation:</strong> {questionResult.explanation}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mt-12">
                    <button onClick={() => navigate('/')} className="btn btn-primary btn-large">
                        Take Another Quiz
                    </button>
                </div>
            </div>
        </>
    );
};

export default ResultsPage;
