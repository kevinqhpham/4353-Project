import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from '../components/HomeHeader.js'

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert(data.message);
        navigate("/userpage");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div>
      <div className="header">
        <HomeHeader/>
      </div>
      <div className="login">
      <h2>Login</h2>
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