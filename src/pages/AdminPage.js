import { useNavigate } from "react-router-dom";
import AdminHeader from '../components/AdminHeader.js';

function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className = "header">
          <AdminHeader/>
      </div>
      <div className = "logout">
        <button onClick={handleLogout}>
            Logout
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
