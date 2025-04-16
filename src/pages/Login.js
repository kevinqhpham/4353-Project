import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from '../components/HomeHeader.js'

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setIsAdmin(e.target.checked);  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError("");
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
  
        alert("Login successful!");
  
        if (isAdmin) {
          navigate("/adminpage");
        } else {
          navigate("/userpage");
        }
  
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div>
      <div className="header">
        <HomeHeader/>
      </div>
      <div className="login">
        <h2>Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 w-full"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border p-2 w-full"
            onChange={handleChange}
            required
          />
          <label className = "checkbox">
             Are you an admin
             <input
               type="checkbox"
               checked={isAdmin}
               onChange={handleCheckboxChange}
             />
           </label>
          <button type="submit">
            Login
          </button>
        </form>
        <p className="mt-2">
          Don't have an account? <a href="/">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;