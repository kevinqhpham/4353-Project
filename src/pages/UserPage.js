import { useNavigate } from "react-router-dom";
import UserHeader from '../components/UserHeader.js';

function UserPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div>
      <div className = "header">
          <UserHeader/>
      </div>
    </div>
  );
}

export default UserPage;
