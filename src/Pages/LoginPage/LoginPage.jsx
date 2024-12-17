import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import './LoginPage.css';
import animationData from '../../assets/LogInPageLottie.json';
import logo from '../../../public/images/TutorwiseLogo.png';
import headerImage from '../../../public/images/TutorwiseLogo.png';
import { Alert, Snackbar } from "@mui/material";
import { encryptData } from "../../EncryptedPage";



const LoginPage = () => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [showSetPasswordPopup, setShowSetPasswordPopup] = useState(false);
  const [timer, setTimer] = useState(120);
  const [apiMessageFromOtp, setApiMessageFromOtp] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড দেখানোর জন্য state
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleCheckboxChange = (e) => {
    setShowPassword(e.target.checked);
  };


  const navigate = useNavigate();


  const timerCount = () => {
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





  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://tutorwise-backend.vercel.app/api/account/admin/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gmail: gmail,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {

        const encryptedUser = encryptData({
          user_id: data.user_id,
          user_type: data.user_type,
          roles: data.roles,
          token: data.token,
        });


        localStorage.setItem("user", encryptedUser);
        navigate("/");
      }
      else {

        setSnackbarMessage("Something wrong !");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);

      }
    } catch (error) {
      setSnackbarMessage("Something wrong !");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

      console.log(error)

    }
  };

  const showOtpModal = () => {
    setShowForgotPopup(false);
    setShowOtpPopup(true)
    timerCount()

  }

  const handleEmailSubmit = (event) => {
    event.preventDefault();

    const formData = { gmail: gmail };

    showOtpModal();

    fetch("https://tutorwise-backend.vercel.app/api/account/admin/forgot-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          setSnackbarMessage("submitted successfully !");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);

        } else {
          setSnackbarMessage("Something wrong !");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };



  const handleOtpSubmit = (event) => {
    event.preventDefault();

    const formData = { gmail: gmail, otp: otp };


    fetch("https://tutorwise-backend.vercel.app/api/account/admin/verify-otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          setShowOtpPopup(false);
          setShowSetPasswordPopup(true);
        }
        else {
          return response.json().then((data) => {
            setApiMessageFromOtp(data.message || "Something went wrong.");
          });

        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        setApiMessageFromOtp("An unexpected error occurred.");
        setOtp('');
      });
  };



  const handleResendOtp = () => {

    if (timer === 0) {
      setTimer(120);
      const newOtpTimer = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(newOtpTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }


    const formData = { gmail: gmail };


    fetch("https://tutorwise-backend.vercel.app/api/account/admin/resend-otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {

          setSnackbarMessage(data.message);
          setSnackbarSeverity("success");
          setOpenSnackbar(true);

        } else {
          console.log("Failed to resend OTP.");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });


  };


  const handleForgotPassword = () => {
    setShowForgotPopup(true);
  };


  const handleSetPassword = (e) => {
    e.preventDefault();

    const formData = {
      gmail: gmail,
      password: e.target.password.value,
      confirm_password: e.target.confirm_password.value,
    };


    if (formData.password !== formData.confirm_password) {
      setSnackbarMessage("Passwords are not same");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } else {
      fetch("https://tutorwise-backend.vercel.app/api/account/admin/save-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setSnackbarMessage(data.message);
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            setShowSetPasswordPopup(false);


            navigate("/login");
          } else {
            console.log("Failed to resend OTP.");
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
    }
  };





  return (
    <div>
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
              <div>
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="flex-grow"
                  />
                  <div className="flex items-center  p-2 mb-6">
                    <input
                      type="checkbox"
                      id="show-password"
                      checked={showPassword}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor="show-password" className="text-sm text-nowrap mt-1 text-gray-700">Show Password</label>
                  </div>
                </div>
              </div>

              <button type="submit" className="login-btn button-color">Login</button>
            </form>
            <p className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</p>
          </div>
        </div>



        {/* Forgot Password Popup */}
        {
          showForgotPopup && (
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
                    id="gmailForOtp"
                    name="gmail"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-between space-x-4">
                  <button
                    className="w-full  text-white px-4 py-2 rounded-lg button-blue transition"
                    onClick={() => setShowForgotPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-full text-white px-4 py-2 rounded-lg button-color transition"
                    onClick={handleEmailSubmit}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>


          )
        }

        {/* OTP Verification Popup */}
        {
          showOtpPopup && (
            <div className="fixed inset-0 bg-slate-200 bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
                {/* Close Icon */}
                <button
                  onClick={() => setShowOtpPopup(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                    stroke="currentColor" className="w-6 h-6">
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

                      onKeyDown={(e) => {

                        if (e.key === 'Backspace' && !e.target.value && index > 0) {
                          const prevInput = document.getElementById(`otp-${index - 1}`);
                          prevInput && prevInput.focus();
                        }
                      }}

                      id={`otp-${index}`}
                    />
                  ))}
                </div>

                <div className="text-red-600 text-center">
                  {apiMessageFromOtp}
                </div>

                <div className="flex justify-end gap-2 my-4">
                  <button
                    onClick={handleOtpSubmit}
                    className="w-full button-color text-white py-2 rounded-md text-lg"
                  >
                    Submit
                  </button>
                </div>

                {/* Resend OTP and Timer */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <button
                    onClick={handleResendOtp}
                    disabled={timer > 0}
                    className={`text-blue-600 hover:underline focus:outline-none ${timer > 0 ? 'opacity-50 cursor-not-allowed hover:no-underline' : ''
                      }`}
                  >
                    Resend OTP
                  </button>
                  <p className="text-gray-700">Time left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
                </div>
              </div>
            </div>
          )
        }

        {/* Set New Password Popup */}
        {
          showSetPasswordPopup && (
            <div className="fixed inset-0 bg-slate-200 bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
                {/* Close Icon */}
                <button
                  onClick={() => setShowSetPasswordPopup(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                    stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Logo */}
                <img src={headerImage} style={{ height: '200px', width: '200px' }} alt="Header" className="header-image mx-auto" />

                {/* Set New Password Form */}
                <form onSubmit={handleSetPassword}>
                  <div className="relative mb-6">
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <div className="flex flex-col  items-start gap-2">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="new-password"
                        name="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <div className="ml-2 flex justify-start items-center">
                        <input
                          type="checkbox"
                          onChange={() => setShowNewPassword(!showNewPassword)}
                          className="mr-1"
                        />
                        <span className="text-sm">Show</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="flex flex-col justify-start items-start gap-2">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        name="confirm_password"
                        placeholder="Enter confirm password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <div className="ml-2 flex items-center">
                        <input
                          type="checkbox"
                          onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="mr-1"
                        />
                        <span className="text-sm">Show</span>
                      </div>
                    </div>
                  </div>


                  <div className="flex justify-between space-x-4">
                    <button
                      type="button"
                      className="w-full  px-4 py-2 rounded-lg button-blue text-white transition"
                      onClick={() => setShowSetPasswordPopup(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full text-white px-4 py-2 rounded-lg button-color transition"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        }

      </div >

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div >

  );
};

export default LoginPage;







