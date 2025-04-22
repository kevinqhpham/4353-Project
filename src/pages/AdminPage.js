import { useNavigate } from "react-router-dom";
import AdminHeader from '../components/AdminHeader.js';

function AdminPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center p-6">
      <div className = "header">
          <AdminHeader/>
      </div>
    </div>
  );
}

export default AdminPage;
