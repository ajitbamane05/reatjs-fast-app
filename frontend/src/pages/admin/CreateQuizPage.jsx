import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../../api/quiz';
import Navbar from '../../components/Navbar';

const CreateQuizPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const questionRefs = useRef([]);

    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        is_active: true,
    });

    const [questions, setQuestions] = useState([
        {
            question_type: 'mcq',
            question_text: '',
            options: { A: '', B: '', C: '', D: '' },
            order: 1,
            answer: {
                correct_answer: '',
                explanation: '',
            },
        },
    ]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_type: 'mcq',
                question_text: '',
                options: { A: '', B: '', C: '', D: '' },
                order: questions.length + 1,
                answer: {
                    correct_answer: '',
                    explanation: '',
                },
            },
        ]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        // Update order
        newQuestions.forEach((q, i) => {
            q.order = i + 1;
        });
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        if (field.startsWith('answer.')) {
            const answerField = field.split('.')[1];
            newQuestions[index].answer[answerField] = value;
        } else if (field.startsWith('options.')) {
            const optionKey = field.split('.')[1];
            newQuestions[index].options[optionKey] = value;
        } else {
            newQuestions[index][field] = value;

            // Reset options and answer when type changes
            if (field === 'question_type') {
                if (value === 'mcq') {
                    newQuestions[index].options = { A: '', B: '', C: '', D: '' };
                    newQuestions[index].answer.correct_answer = '';
                } else if (value === 'true_false') {
                    newQuestions[index].options = null;
                    newQuestions[index].answer.correct_answer = 'true';
                } else if (value === 'text') {
                    newQuestions[index].options = null;
                    newQuestions[index].answer.correct_answer = '';
                }
            }
        }
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!quizData.title.trim()) {
            setError('Quiz title is required');
            return;
        }

        if (questions.length === 0) {
            setError('At least one question is required');
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question_text.trim()) {
                setError(`Question ${i + 1}: Question text is required`);
                return;
            }
            if (!q.answer.correct_answer.trim()) {
                setError(`Question ${i + 1}: Correct answer is required`);
                return;
            }
            if (q.question_type === 'mcq') {
                const hasEmptyOption = Object.values(q.options).some(opt => !opt.trim());
                if (hasEmptyOption) {
                    setError(`Question ${i + 1}: All MCQ options must be filled`);
                    return;
                }
            }
        }

        try {
            setLoading(true);
            const payload = {
                ...quizData,
                questions: questions.map(q => ({
                    ...q,
                    options: q.question_type === 'mcq' ? q.options : null,
                })),
            };

            await createQuiz(payload);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (questions.length <= 1) return;
        if (questionRefs.current[questions.length - 1]) {
            questionRefs.current[questions.length - 1].focus();
        }
    }, [addQuestion]);

    return (
        <>
            <Navbar />
            <div className="container container-lg py-8">
                <div className="mb-12 animate-fade-in">
                    <h1>Create New Quiz</h1>
                    <p className="text-gray-400">Fill in the details to create a new quiz</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Quiz Details */}
                    <div className="card mb-8">
                        <h2 className="card-title">Quiz Details</h2>

                        <div className="form-group">
                            <label htmlFor="title" className="form-label">Quiz Title *</label>
                            <input
                                type="text"
                                id="title"
                                className="form-input"
                                placeholder="Enter quiz title"
                                value={quizData.title}
                                onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                className="form-textarea"
                                placeholder="Enter quiz description (optional)"
                                value={quizData.description}
                                onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={quizData.is_active}
                                    onChange={(e) => setQuizData({ ...quizData, is_active: e.target.checked })}
                                    className="rounded border-background-lighter text-primary focus:ring-primary"
                                />
                                <span className="form-label mb-0">Make quiz active immediately</span>
                            </label>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2>Questions</h2>
                            <button type="button" onClick={addQuestion} className="btn btn-primary">
                                + Add Question
                            </button>
                        </div>

                        {questions.map((question, index) => (
                            <div key={index} className="card mb-6 animate-slide-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="card-title">Question {index + 1}</h3>
                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(index)}
                                            className="btn btn-outline border-error text-error hover:bg-error hover:text-white"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Question Type *</label>
                                    <select
                                        className="form-select"
                                        value={question.question_type}
                                        onChange={(e) => updateQuestion(index, 'question_type', e.target.value)}
                                        ref={(el) => (questionRefs.current[index] = el)}
                                    >
                                        <option value="mcq">Multiple Choice (MCQ)</option>
                                        <option value="true_false">True/False</option>
                                        <option value="text">Text Answer</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Question Text *</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Enter your question"
                                        value={question.question_text}
                                        onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* MCQ Options */}
                                {question.question_type === 'mcq' && (
                                    <div className="form-group">
                                        <label className="form-label">Options *</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.keys(question.options).map((key) => (
                                                <input
                                                    key={key}
                                                    type="text"
                                                    className="form-input"
                                                    placeholder={`Option ${key}`}
                                                    value={question.options[key]}
                                                    onChange={(e) => updateQuestion(index, `options.${key}`, e.target.value)}
                                                    required
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Correct Answer */}
                                <div className="form-group">
                                    <label className="form-label">Correct Answer *</label>
                                    {question.question_type === 'mcq' ? (
                                        <select
                                            className="form-select"
                                            value={question.answer.correct_answer}
                                            onChange={(e) => updateQuestion(index, 'answer.correct_answer', e.target.value)}
                                            required
                                        >
                                            <option value="">Select correct option</option>
                                            {Object.keys(question.options).map((key) => (
                                                <option key={key} value={key}>{key}</option>
                                            ))}
                                        </select>
                                    ) : question.question_type === 'true_false' ? (
                                        <select
                                            className="form-select"
                                            value={question.answer.correct_answer}
                                            onChange={(e) => updateQuestion(index, 'answer.correct_answer', e.target.value)}
                                            required
                                        >
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter correct answer"
                                            value={question.answer.correct_answer}
                                            onChange={(e) => updateQuestion(index, 'answer.correct_answer', e.target.value)}
                                            required
                                        />
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Explanation (Optional)</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Explain why this is the correct answer"
                                        value={question.answer.explanation}
                                        onChange={(e) => updateQuestion(index, 'answer.explanation', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="card mb-8 bg-error/10 border-2 border-error">
                            <p className="text-error m-0">{error}</p>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard')}
                            className="btn btn-secondary btn-large"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : `Create Quiz with ${questions.length} Question${questions.length > 1 ? 's' : ''}`}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateQuizPage;
