import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const LoginPage = () => {
  const [gmail, setGmail] = useState("");  // 'gmail' নামক state ব্যবহার
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // Error state to display error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API রিকোয়েস্ট পাঠানো
    try {
      const response = await fetch("http://192.168.0.154:8000/api/account/admin/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gmail: gmail,  // এখানে 'gmail' নাম দিয়ে পাঠানো হচ্ছে
          password: password,
        }),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        
        localStorage.setItem("user", JSON.stringify({
          user_id: data.user_id,
          user_type: data.user_type,
          roles: data.roles,
          token: data.token,
        }));
        navigate("/");  // হোম পেজে রিডিরেক্ট করুন
      } else {
        // API থেকে আসা ভুল লগিন মেসেজ
        setError(data.message || "Invalid email or password!");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-header">Welcome to Tutor Wise Admin Panel</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="gmail">Email</label>
            <input
              type="email"  // এখানে ইমেল ইনপুট ব্যবহার
              id="gmail"
              name="gmail"
              placeholder="Enter your email"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
