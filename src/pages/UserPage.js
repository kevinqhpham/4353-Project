import { useNavigate } from "react-router-dom";
import UserHeader from '../components/UserHeader.js';
import './UserPage.css'; // Import CSS for styling

function UserPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div>
      <div className="header">
        <UserHeader />
      </div>
      <div className="user-page-body">
        <h1>Welcome to Your Dashboard!</h1>
        <p>
          Here you can manage your profile, view your volunteering history, and explore new opportunities.
        </p>
        <div className="user-actions">
          <button onClick={() => navigate('/profile')} className="action-button">View Profile</button>
          <button onClick={() => navigate('/history')} className="action-button">View History</button>
          <button onClick={() => navigate('/inbox')} className="action-button">Check Inbox</button>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
