import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
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
        <button type="submit" className="bg-green-500 text-white p-2 w-full">
          Login
        </button>
      </form>
      <p className="mt-2">
        Don't have an account? <a href="/" className="text-blue-600">Sign Up</a>
      </p>
    </div>
  );
}

export default Login;
