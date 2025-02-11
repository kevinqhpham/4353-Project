import { useNavigate } from "react-router-dom";
import UserHeader from '../components/UserHeader.js';

function UserPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="flex flex-col items-center p-6">
      <UserHeader/>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 mt-4">
        Logout
      </button>
    </div>
  );
}

export default UserPage;
