import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from '../components/HomeHeader.js'

function SignUp() {
  const [user, setUser] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError("");
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: user.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert("Registration successful!");
        navigate("/userpage");
      } else {
        setError(data.message || "Registration failed");
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
      <div className="signup">
        <h2>Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="border p-2 w-full"
            onChange={handleChange}
            required
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="border p-2 w-full"
            onChange={handleChange}
            required
          />
          <button type="submit">
            Sign Up
          </button>
        </form>
        <p className="mt-2">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;