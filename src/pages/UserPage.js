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
      <div className = "header">
          <UserHeader/>
      </div>
      <div className = "logout">
        <button onClick={handleLogout}>
            Logout
        </button>
      </div>
    </div>
  );
}

export default UserPage;
