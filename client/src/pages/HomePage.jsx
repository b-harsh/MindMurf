import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">
          Welcome to MindMurf
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Signup
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
