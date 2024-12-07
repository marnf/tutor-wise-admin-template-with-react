import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import './LoginPage.css';
import animationData from '../../assets/LogInPageLottie.json';
import logo from '../../../public/images/TutorwiseLogo.png';
import headerImage from '../../../public/images/TutorwiseLogo.png';

const LoginPage = () => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // 2 মিনিটের টাইমার

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API রিকোয়েস্ট হ্যান্ডলিং (উল্লেখিত কোড অপরিবর্তিত রাখা হয়েছে)
  };

  const handleForgotPassword = () => {
    setShowForgotPopup(true);
  };

  const handleOtpSubmit = () => {
    setShowForgotPopup(false);
    setShowOtpPopup(true);
    const otpTimer = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(otpTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = () => {
    setTimer(120);
  }



  return (
    <div className="login-container">
      <div className="content flex">
        {/* Lottie Animation */}
        <div className="animation-container">
          <Player autoplay loop src={animationData} style={{ height: '500px', width: '500px' }} /> {/* Increased size */}
        </div>

        {/* Login Card */}
        <div className="login-box">
          <img src={headerImage} style={{ height: '200px', width: '200px' }} alt="Header" className="header-image" />

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="gmail">Email</label>
              <input
                type="email"
                id="gmail"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-btn">Login</button>
          </form>
          <p className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</p>
        </div>
      </div>

      {/* Forgot Password Popup */}
      {showForgotPopup && (
        <div className="fixed inset-0 bg-slate-200  bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Give your Email Account</h2>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex justify-between space-x-4">
              <button
                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowForgotPopup(false)}
              >
                Cancel
              </button>
              <button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={handleOtpSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>


      )}

      {/* OTP Verification Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-slate-200  bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            {/* Close Icon */}
            <button
              onClick={() => setShowOtpPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none" >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                stroke="currentColor" className="w-6 h-6" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo */}
            <img src={headerImage} style={{ height: '200px', width: '200px' }} alt="Header" className="header-image mx-auto" />

            {/* Instruction */}
            <p className="text-gray-700 mb-4">We sent an OTP to your email. Please submit it below.</p>

            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(4)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={otp[index] || ''}
                  onChange={(e) => {
                    const updatedOtp = otp.split('');
                    updatedOtp[index] = e.target.value;

                    // Move to next input box if not empty
                    if (e.target.value && index < 3) {
                      const nextInput = document.getElementById(`otp-${index + 1}`);
                      nextInput && nextInput.focus();
                    }
                    setOtp(updatedOtp.join(''));
                  }}
                  id={`otp-${index}`}
                />
              ))}
            </div>


            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={handleOtpSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded-md text-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>

            {/* Resend OTP and Timer */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <button
                onClick={handleResendOtp}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Resend OTP
              </button>
              <p className="text-gray-700">Time left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
            </div>
          </div>
        </div>

      )}
    </div>

  );
};

export default LoginPage;
