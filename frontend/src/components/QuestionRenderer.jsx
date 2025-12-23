const QuestionRenderer = ({ question, answer, onChange, disabled = false }) => {
    const handleChange = (value) => {
        onChange(question.id, value);
    };

    const renderMCQ = () => {
        if (!question.options) return null;

        return (
            <div className="flex flex-col gap-2">
                {Object.entries(question.options).map(([key, value]) => (
                    <label
                        key={key}
                        className={`card cursor-pointer p-4 border-2 transition-colors ${answer === key
                                ? 'border-primary bg-background-light'
                                : 'border-transparent bg-surface hover:bg-surface/80'
                            }`}
                    >
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={key}
                            checked={answer === key}
                            onChange={(e) => handleChange(e.target.value)}
                            disabled={disabled}
                            className="mr-2"
                        />
                        <span><strong>{key}:</strong> {value}</span>
                    </label>
                ))}
            </div>
        );
    };

    const renderTrueFalse = () => {
        return (
            <div className="flex gap-4">
                <label
                    className={`card flex-1 cursor-pointer p-4 border-2 text-center transition-colors ${answer === 'true'
                            ? 'border-primary bg-background-light'
                            : 'border-transparent bg-surface hover:bg-surface/80'
                        }`}
                >
                    <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="true"
                        checked={answer === 'true'}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={disabled}
                        className="mr-2"
                    />
                    <span>True</span>
                </label>
                <label
                    className={`card flex-1 cursor-pointer p-4 border-2 text-center transition-colors ${answer === 'false'
                            ? 'border-primary bg-background-light'
                            : 'border-transparent bg-surface hover:bg-surface/80'
                        }`}
                >
                    <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="false"
                        checked={answer === 'false'}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={disabled}
                        className="mr-2"
                    />
                    <span>False</span>
                </label>
            </div>
        );
    };

    const renderText = () => {
        return (
            <input
                type="text"
                className="form-input"
                placeholder="Type your answer here..."
                value={answer || ''}
                onChange={(e) => handleChange(e.target.value)}
                disabled={disabled}
            />
        );
    };

    return (
        <div className="card animate-fade-in">
            <div className="card-header">
                <div className="flex justify-between items-center mb-2">
                    <span className="badge">Question {question.order}</span>
                    <span className="text-gray-400 text-sm uppercase">
                        {question.question_type.replace('_', ' ')}
                    </span>
                </div>
                <h3 className="card-title">{question.question_text}</h3>
            </div>
            <div>
                {question.question_type === 'mcq' && renderMCQ()}
                {question.question_type === 'true_false' && renderTrueFalse()}
                {question.question_type === 'text' && renderText()}
            </div>
        </div>
    );
};

export default QuestionRenderer;
