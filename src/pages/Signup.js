import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
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
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Sign Up
        </button>
      </form>
      <p className="mt-2">
        Already have an account? <a href="/login" className="text-blue-600">Login</a>
      </p>
    </div>
  );
}

export default Signup;
