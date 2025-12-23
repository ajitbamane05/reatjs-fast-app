
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz, linkTo, showStatus = false }) => {
    return (
        <Link to={linkTo} className="card block no-underline">
            <div className="card-header">
                <div className="flex justify-between items-center">
                    <h3 className="card-title">{quiz.title}</h3>
                    {showStatus && (
                        <span className={`badge ${quiz.is_active ? 'badge-success' : 'badge-error'} `}>
                            {quiz.is_active ? 'Active' : 'Inactive'}
                        </span>
                    )}
                </div>
                {quiz.description && (
                    <p className="card-description">{quiz.description}</p>
                )}
            </div>
            <div className="flex justify-between items-center text-gray-400 text-sm">
                <span>{quiz.question_count || 0} questions</span>
                <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
            </div>
        </Link>
    );
};

export default QuizCard;

