import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🧠 MindMate</h1>
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
