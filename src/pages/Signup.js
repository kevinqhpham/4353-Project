import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from '../components/HomeHeader.js'
function Signup() {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      alert("Please fill in all fields");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    alert("Signup successful! Redirecting to login...");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <div className = "header">
          <HomeHeader/>
      </div>
      <div className = "signup">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
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

export default Signup;
