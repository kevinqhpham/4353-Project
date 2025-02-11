import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from '../components/HomeHeader.js'
function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email === user.email && storedUser.password === user.password) {
      alert("Login successful! Redirecting...");
      navigate("/userpage"); // Redirect to dashboard
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div>
      <div className = "header">
          <HomeHeader/>
      </div>
      <div className = "login">
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
