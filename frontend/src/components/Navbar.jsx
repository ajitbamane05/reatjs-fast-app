import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, admin, logout } = useAuth();

    return (
        <nav className="bg-surface border-b border-background-lighter py-4 mb-8">
            <div className="container">
                <div className="flex justify-between items-center">
                    <Link to="/" className="no-underline">
                        <h2 className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent m-0">
                            QuizMaster
                        </h2>
                    </Link>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/admin/dashboard" className="btn btn-secondary">
                                    Dashboard
                                </Link>
                                <span className="text-gray-400">{admin?.email}</span>
                                <button onClick={logout} className="btn btn-outline">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/admin/login" className="btn btn-primary">
                                Admin Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
