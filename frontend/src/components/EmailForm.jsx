import { useState } from 'react';

const EmailForm = ({ onSubmit, buttonText = "Continue" }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(email);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in">
            <div className="form-group">
                <label htmlFor="email" className="form-label">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                {error && <div className="form-error">{error}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-large w-full" disabled={loading}>
                {loading ? 'Processing...' : buttonText}
            </button>
        </form>
    );
};

export default EmailForm;
