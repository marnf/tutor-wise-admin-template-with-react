import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaEye, FaEyeSlash, FaUserAlt, FaVideo } from "react-icons/fa";
import axiosInstance from "../../Api/apiClient";
import { PiStudent } from "react-icons/pi";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CreateUser = () => {
    const navigate = useNavigate();

    // State for form inputs
    const [accountType, setAccountType] = useState("student");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ReTypepassword, setReTypepassword] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // State for password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordReTypeVisible, setPasswordReTypeVisible] = useState(false);

    // State for errors
    const [errors, setErrors] = useState({
        phoneNumber: "",
        username: "",
        password: "",
        ReTypepassword: "",
        apiError: "",
    });



    // State for email/phone code options
    const [code_gmail, setCodeGmail] = useState(0);
    const [code_phone, setCodePhone] = useState(0);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleReTypePasswordVisibility = () => {
        setPasswordReTypeVisible(!passwordReTypeVisible);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleCloseErrorSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenErrorSnackbar(false);
    };

    // Success and Error message functions
    const showSuccessMessage = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const showErrorMessage = (message) => {
        setSnackbarMessage(message);
        setOpenErrorSnackbar(true);
    };



    // Handle form submission
    const handleSignUp = async () => {
        // Reset errors
        setErrors({
            phoneNumber: "",
            username: "",
            password: "",
            ReTypepassword: "",
            apiError: "",
        });

        // Validation
        if (!phoneNumber) {
            setErrors((prev) => ({ ...prev, phoneNumber: "Mobile number is required" }));
            return;
        }
        if (!username) {
            setErrors((prev) => ({ ...prev, username: "Email address is required" }));
            return;
        }
        if (!password) {
            setErrors((prev) => ({ ...prev, password: "Password is required" }));
            return;
        }
        if (password !== ReTypepassword) {
            setErrors((prev) => ({ ...prev, ReTypepassword: "Passwords do not match" }));
            return;
        }

        console.log(accountType, phoneNumber, username, password, code_gmail, code_phone);

        // API call to create user
        try {
            const response = await axiosInstance.post("/api/admin/create-end-user/", {
                user_type: accountType,
                phone: phoneNumber,
                username: username,
                password: password,
                code_gmail: code_gmail,
                code_phone: code_phone,
            });

            const message = response.data.message;

            if (response.status === 200) {
                showSuccessMessage(message);
            }
        } catch (error) {
            console.error(error.response.data.error);

            showErrorMessage(error.response.data.error);
        }
    };

    return (
        <div className="flex bg-EntryBG items-center justify-center xl:px-0 px-2 mt-10 text-xs 2xl:text-sm">
            <div className="bg-white border 2xl:w-1/2 lg:w-4/5 w-full xl:p-8 p-6 py-8 items-center justify-center gap-10 md:shadow-2xl rounded-2xl">
                {/* Right Section */}
                <div className="w-full">
                    <h2 className="text-2xl text-center font-bold mb-4 text-gray-800">
                        Registration
                    </h2>
                    <p className="text-sm text-center text-gray-600 mb-6">
                        Register now as a Student, Tutor, Referrer and Media.
                    </p>

                    {/* Tab Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 mb-6  bg-gray-200 rounded-lg border border-gray">
                        <button
                            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 ${accountType === "student"
                                ? "bg-DefaultColor text-white shadow-md"
                                : "bg-transparent text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={() => setAccountType("student")}
                        >
                            <span className="flex justify-center items-center gap-2">
                                <PiStudent size={20} />
                                <p>Student</p>
                            </span>
                        </button>
                        <button
                            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 ${accountType === "tutor"
                                ? "bg-DefaultColor text-white shadow-md"
                                : "bg-transparent text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={() => setAccountType("tutor")}
                        >
                            <span className="flex justify-center items-center gap-2">
                                <FaChalkboardTeacher size={20} />
                                <p>Tutor</p>
                            </span>
                        </button>
                        <button
                            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 ${accountType === "referrer"
                                ? "bg-DefaultColor text-white shadow-md"
                                : "bg-transparent text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={() => setAccountType("referrer")}
                        >
                            <span className="flex justify-center items-center gap-2">
                                <FaUserAlt size={20} />
                                <p>Referrer</p>
                            </span>
                        </button>
                        <button
                            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 ${accountType === "Media"
                                ? "bg-DefaultColor text-white shadow-md"
                                : "bg-transparent text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={() => setAccountType("Media")}
                        >
                            <span className="flex justify-center items-center gap-2">
                                <FaVideo size={20} />
                                <p>Media</p>
                            </span>
                        </button>
                    </div>

                    {/* Input Fields */}
                    <div className="w-full space-y-4">
                        <div>
                            <input
                                type="number"
                                placeholder="Mobile Number"
                                className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-DefaultSecondColor focus:border-transparent required "
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-DefaultSecondColor focus:border-transparent"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />

                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Create Password"
                                className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-DefaultSecondColor focus:border-transparent "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700 "
                            >
                                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                            </button>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Re-Type Password */}
                        <div className="relative">
                            <input
                                type={passwordReTypeVisible ? "text" : "password"}
                                placeholder="Re-Type Password"
                                className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-DefaultSecondColor focus:border-transparent"
                                value={ReTypepassword}
                                onChange={(e) => setReTypepassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={toggleReTypePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
                            >
                                {passwordReTypeVisible ? <FaEye /> : <FaEyeSlash />}
                            </button>
                            {errors.ReTypepassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.ReTypepassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Checkbox for Gmail and Phone */}
                    <div className="flex flex-col items-start space-y-4 my-3">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={code_gmail === 1}
                                onChange={() => setCodeGmail(code_gmail === 1 ? 0 : 1)}
                                className="h-4 w-4 text-DefaultColor focus:ring-DefaultColor rounded-sm"
                            />

                            <span className="ml-2 text-sm">Send username and password via gmail</span>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={code_phone === 1}
                                onChange={() => setCodePhone(code_phone === 1 ? 0 : 1)}
                                className="h-4 w-4"
                            />
                            <span className="ml-2 text-sm">Send username and password via Phone</span>
                        </div>
                    </div>

                    {/* Create Account Button */}
                    <button
                        onClick={handleSignUp}
                        className="w-full  bg-DefaultColor text-white py-3 px-6 mt-6 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Create Account
                    </button>
                </div>
            </div>

            {/* Snackbar component */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}  // Auto close after 2 seconds
                onClose={handleCloseSnackbar}  // Handle close
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={openErrorSnackbar}
                autoHideDuration={2000}  // Auto close after 2 seconds
                onClose={handleCloseErrorSnackbar}  // Handle close
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseErrorSnackbar} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default CreateUser;









// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaChalkboardTeacher, FaEye, FaEyeSlash, FaUserAlt, FaVideo } from "react-icons/fa";
// import axiosInstance from "../../Api/apiClient";
// import { PiStudent } from "react-icons/pi";
// import BASE_URL from "../../Api/baseUrl";
// import { decryptData } from "../../EncryptedPage";

// const CreateUser = () => {
//     const navigate = useNavigate();

//     // State for form inputs
//     const [accountType, setAccountType] = useState("Student");
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [ReTypepassword, setReTypepassword] = useState("");

//     // State for password visibility
//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const [passwordReTypeVisible, setPasswordReTypeVisible] = useState(false);

//     // State for errors
//     const [errors, setErrors] = useState({
//         phoneNumber: "",
//         username: "",
//         password: "",
//         ReTypepassword: "",
//         apiError: "",
//     });

//     // Toggle password visibility
//     const togglePasswordVisibility = () => {
//         setPasswordVisible(!passwordVisible);
//     };

//     const toggleReTypePasswordVisibility = () => {
//         setPasswordReTypeVisible(!passwordReTypeVisible);
//     };

//     // Handle form submission
//     const handleSignUp = async () => {
//         // Reset errors
//         setErrors({
//             phoneNumber: "",
//             username: "",
//             password: "",
//             ReTypepassword: "",
//             apiError: "",
//         });

//         // Validation
//         if (!phoneNumber) {
//             setErrors((prev) => ({ ...prev, phoneNumber: "Mobile number is required" }));
//             return;
//         }
//         if (!username) {
//             setErrors((prev) => ({ ...prev, username: "Email address is required" }));
//             return;
//         }
//         if (!password) {
//             setErrors((prev) => ({ ...prev, password: "Password is required" }));
//             return;
//         }
//         if (password !== ReTypepassword) {
//             setErrors((prev) => ({ ...prev, ReTypepassword: "Passwords do not match" }));
//             return;
//         }

//         console.log(accountType, phoneNumber, username, password);

//         // API call to create user
//         try {
//             const encryptedUser = localStorage.getItem("user");
//             let user;
//             if (encryptedUser) {
//                 try {
//                     user = decryptData(encryptedUser);
//                 } catch (error) {
//                     console.error("Error decrypting user data:", error);
//                 }
//             }
//             const token = user?.token;
//             console.log(token)

//             const response = await fetch(`${BASE_URL}/api/admin/create-end-user/`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Token ${token}`, // Pass the token here
//                 },
//                 body: JSON.stringify({
//                     user_type : accountType,
//                     phone : phoneNumber,
//                     username : username,
//                     password :password ,
//                 }),
//             });

//             const data = await response.json();

//             if (data.success) {
//                 navigate("/login"); // Redirect to login page after successful registration
//             } else {
//                 setErrors((prev) => ({ ...prev, apiError: data.message }));
//             }
//         } catch (error) {
//             setErrors((prev) => ({ ...prev, apiError: "An error occurred during registration" }));
//         }

//     };

//     return (
//         <div className="flex bg-EntryBG items-center justify-center xl:px-0 px-2 mt-10 text-xs 2xl:text-sm">
//             <div className="bg-white border 2xl:w-1/2 lg:w-4/5 w-full xl:p-8 p-6 py-8 items-center justify-center gap-10 md:shadow-2xl rounded-2xl">
//                 {/* Right Section */}
//                 <div className=" w-full">
//                     <h2 className="text-2xl text-center font-bold mb-4 text-gray-800">
//                         Registration
//                     </h2>
//                     <p className="text-sm text-center text-gray-600 mb-6">
//                         Register now as a Student, Tutor, Referrer, or Media.
//                     </p>

//                     {/* Tab Buttons */}
//                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4  mb-6 p-1.5 bg-gray-100 rounded-lg">
//                         <button
//                             className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 ${accountType === "Student"
//                                 ? "bg-teal-500 text-white shadow-md"
//                                 : "bg-transparent text-gray-600 hover:bg-gray-200"
//                                 }`}
//                             onClick={() => setAccountType("Student")}
//                         >
//                             <span className="flex justify-center items-center gap-2">
//                                 <PiStudent size={20} />
//                                 <p>Student</p>
//                             </span>
//                         </button>
//                         <button
//                             className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 ${accountType === "Tutor"
//                                 ? "bg-blue-500 text-white shadow-md"
//                                 : "bg-transparent text-gray-600 hover:bg-gray-200"
//                                 }`}
//                             onClick={() => setAccountType("Tutor")}
//                         >
//                             <span className="flex justify-center items-center gap-2">
//                                 <FaChalkboardTeacher size={20} />
//                                 <p>Tutor</p>
//                             </span>
//                         </button>
//                         <button
//                             className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 ${accountType === "Referrer"
//                                 ? "bg-orange-500 text-white shadow-md"
//                                 : "bg-transparent text-gray-600 hover:bg-gray-200"
//                                 }`}
//                             onClick={() => setAccountType("Referrer")}
//                         >
//                             <span className="flex justify-center items-center gap-2">
//                                 <FaUserAlt size={20} />
//                                 <p>Referrer</p>
//                             </span>
//                         </button>
//                         <button
//                             className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 ${accountType === "Media"
//                                 ? "bg-purple-500 text-white shadow-md"
//                                 : "bg-transparent text-gray-600 hover:bg-gray-200"
//                                 }`}
//                             onClick={() => setAccountType("Media")}
//                         >
//                             <span className="flex justify-center items-center gap-2">
//                                 <FaVideo size={20} />
//                                 <p>Media</p>
//                             </span>
//                         </button>
//                     </div>

//                     {/* Input Fields */}
//                     <div className="w-full space-y-4">
//                         <div>
//                             <input
//                                 type="text"
//                                 placeholder="Mobile Number"
//                                 className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                                 value={phoneNumber}
//                                 onChange={(e) => setPhoneNumber(e.target.value)}
//                             />
//                             {errors.phoneNumber && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
//                             )}
//                         </div>

//                         <div>
//                             <input
//                                 type="text"
//                                 placeholder="Email Address"
//                                 className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                                 value={username}
//                                 onChange={(e) => setUsername(e.target.value)}
//                             />
//                             {errors.username && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.username}</p>
//                             )}
//                         </div>

//                         {/* Password */}
//                         <div className="relative">
//                             <input
//                                 type={passwordVisible ? "text" : "password"}
//                                 placeholder="Create Password"
//                                 className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={togglePasswordVisibility}
//                                 className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
//                             >
//                                 {passwordVisible ? <FaEye /> : <FaEyeSlash />}
//                             </button>
//                             {errors.password && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//                             )}
//                         </div>

//                         {/* Re-Type Password */}
//                         <div className="relative">
//                             <input
//                                 type={passwordReTypeVisible ? "text" : "password"}
//                                 placeholder="Re-Type Password"
//                                 className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                                 value={ReTypepassword}
//                                 onChange={(e) => setReTypepassword(e.target.value)}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={toggleReTypePasswordVisibility}
//                                 className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
//                             >
//                                 {passwordReTypeVisible ? <FaEye /> : <FaEyeSlash />}
//                             </button>
//                             {errors.ReTypepassword && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.ReTypepassword}</p>
//                             )}
//                         </div>
//                     </div>

//                     {/* Create Account Button */}
//                     <button
//                         onClick={handleSignUp}
//                         className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 mt-6 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
//                     >
//                         Create Account
//                     </button>

//                     {errors.apiError && (
//                         <p className="text-red-500 text-center text-xs mt-4">{errors.apiError}</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreateUser;