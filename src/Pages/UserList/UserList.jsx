import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal, TextField } from "@mui/material";
import Select from "react-select";  // Import react-select
import { BiSolidSelectMultiple } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GiCycle } from "react-icons/gi";


const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "username", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "userType", headerName: "User Type", flex: 1 },
    { field: "rolesName", headerName: "Roles Name", flex: 2 },
    {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (



            <Box display="flex" justifyContent="end" className="mt-3" gap={1}>

                <BiSolidSelectMultiple title="Edit"
                    size={25}
                    color="green"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleEdit(params.row)} />

                <MdDelete title="Delete"
                    size={25}
                    color="red"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleDelete(params.row)} />

            </Box>

        ),
    },
];

const UserList = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");  // State for search query
    const [openModal, setOpenModal] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [rolesOptions, setRolesOptions] = useState([]);  // State for roles options
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // Delete confirmation modal state
    const [openCreateModal, setOpenCreateModal] = useState(false); // Create modal state
    const [originalRolesOptions, setOriginalRolesOptions] = useState([]); // Keep original list
    const [password, setPassword] = useState("");  // Password state
    const [showPassword, setShowPassword] = useState(false);
    const [loading , setLoading] =useState(false);



    // Function to generate random password
    const generatePassword = () => {
        const length = 8;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(password);
    };

    // password visible or not

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    // Fetch Data for Users
    useEffect(() => {
        fetch("https://tutorwise-backend.vercel.app/api/admin/all-users-list/")
            .then((res) => res.json())
            .then((data) => {
                const usersData = data.user_data || data;
                const formattedUsers = usersData.map((user) => ({
                    id: user.id,
                    username: user.username || "Not Available",
                    phone: user.phone || "Not Available",
                    userType: user.user_type || "Not Available",
                    rolesName: user.roles_name ? user.roles_name.join(", ") : "",  // Store rolesName as a string
                    handleEdit: handleOpenModal,
                    handleDelete: handleDeleteUser,  // Add delete functionality
                }));
                setRows(formattedUsers);
                setFilteredRows(formattedUsers);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Filter rows based on search query
    useEffect(() => {
        if (searchQuery) {
            const filtered = rows.filter((row) =>
                row.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.phone.includes(searchQuery) ||
                row.userType.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRows(filtered);
        } else {
            setFilteredRows(rows);
        }
    }, [searchQuery, rows]);

    // Fetch Roles Options for Select

    useEffect(() => {
        fetch("https://tutorwise-backend.vercel.app/api/admin/view-role/")
            .then((res) => res.json())
            .then((data) => {
                const options = data.map((role) => ({
                    value: role.id,
                    label: role.role_name,
                }));
                setRolesOptions(options);
                setOriginalRolesOptions(options); // Save original list
            })
            .catch((error) => console.error("Error fetching roles options:", error));
    }, []);

    // Handle Role Selection Change
    const handleRolesChange = (selectedOptions) => {
        // Update currentRow rolesName state
        setCurrentRow({
            ...currentRow,
            rolesName: selectedOptions.map((option) => option.label),
        });

        // Update available rolesOptions by adding removed options back
        const selectedValues = selectedOptions.map((option) => option.label);
        const updatedOptions = originalRolesOptions.filter(
            (option) => !selectedValues.includes(option.label)
        );

        setRolesOptions(updatedOptions);
    };

    // Open Modal
    const handleOpenModal = (row) => {
        setCurrentRow({
            ...row,
            rolesName: row.rolesName ? row.rolesName.split(", ") : []  // Convert string to array for react-select
        });
        setOpenModal(true);
    };

    // create user
    const handleCreateUser = () => {
        setOpenCreateModal(true);
    };

    // Close Create User Modal
    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
    };

    // Close Modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentRow(null);
    };

    // Handle Delete User
    const handleDeleteUser = (row) => {
        setCurrentRow({
            ...row,
            rolesName: row.rolesName ? row.rolesName.split(", ") : []  // Convert string to array for react-select
        });
        setOpenDeleteModal(true);  // Open delete confirmation modal
    };


    // Handle Create User Form Submission
    const handleCreateSubmit = (event) => {
        event.preventDefault();

        // Prepare new user data
        const newUser = {
            username: currentRow?.username || "",
            phone: currentRow?.phone || "",
            user_type: currentRow?.userType || "admin",
            password: currentRow?.password || "", // Password field value
            roles_name: currentRow?.rolesName || [],
        };

        // API POST request to create a new user
        fetch("https://tutorwise-backend.vercel.app/api/admin/create-user/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
            .then((response) => response.json())
            .then((data) => {
                // Update the rows state with new user
                setRows([...rows, { ...newUser, id: data.id }]);
                setFilteredRows([...filteredRows, { ...newUser, id: data.id }]);
                handleCloseCreateModal();
            })
            .catch((error) => console.error("Error creating user:", error));
    };


    // Confirm Delete User
    const handleConfirmDelete = () => {
        // API DELETE Request
        fetch(`https://tutorwise-backend.vercel.app/api/admin/delete-user/${currentRow.id}`, {
            method: 'DELETE',
        })
            .then(() => {
                // Remove the deleted user from the rows state
                setRows(rows.filter(row => row.id !== currentRow.id));
                setFilteredRows(filteredRows.filter(row => row.id !== currentRow.id));
                setOpenDeleteModal(false);  // Close delete confirmation modal
            })
            .catch((error) => console.error("Error deleting user:", error));
    };

    // Cancel Delete
    const handleCancelDelete = () => {
        setOpenDeleteModal(false);  // Close delete confirmation modal without deleting
    };

    // Handle Form Submission for Edit
    const handleSubmit = (event) => {
        event.preventDefault();

        // Prepare the updated data
        const updatedData = {
            username: currentRow.username,
            phone: currentRow.phone,
            user_type: currentRow.userType,
            roles_name: currentRow.rolesName,  // Pass as array for API
        };

        // API PUT Request to update user
        fetch(`https://tutorwise-backend.vercel.app/api/admin/edit-approved-request-tutor/${currentRow.id}`, {

            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then(() => {
                // Update the user in the rows state
                setRows(rows.map(row => row.id === currentRow.id ? { ...row, ...updatedData } : row));
                setFilteredRows(filteredRows.map(row => row.id === currentRow.id ? { ...row, ...updatedData } : row));
                handleCloseModal();
                window.location.reload();
            })
            .catch((error) => console.error("Error updating user:", error));
    };

    return (


        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 className="text-center font-bold h3">User List</h2>

            <div className="flex justify-between items-center">

                <button className=" bg-green-600 hover:bg-green-700 text-white transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-300 my-2 p-2 rounded flex items-center border"
                    onClick={handleCreateUser}>
                    <div className="flex justify-center items-center gap-1">
                        <GoPlus size={25} />
                        <p>Create User</p>
                    </div>
                </button>



                {/* Search Bar */}
                <TextField
                    label="Search Users"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "300px" }}
                />



            </div>

            <DataGrid
            
                rows={filteredRows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={{
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "2px solid #1976d2", // Column header's bottom border
                    },
                    "& .MuiDataGrid-cell": {
                        border: "1px solid #e0e0e0", // Border for each cell
                    },

                    "& .MuiDataGrid-cell:focus": {
                        outline: "none", // Remove default outline on focus
                    },
                }}
            />



            {/* Create User Modal */}
            <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
                <Box sx={{ ...modalStyle, width: 700 }}> {/* Modal width increased */}
                    <form onSubmit={handleCreateSubmit} className="p-3">
                        <h2 className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create User</h2>

                        {/* User Type */}
                        <div className="mb-2">
                            <label htmlFor="userType" className="form-label">User Type:</label>
                            <select
                                id="userType"
                                className="form-select"
                                value={currentRow?.userType || "admin"}
                                onChange={(e) => setCurrentRow({ ...currentRow, userType: e.target.value })}
                                required
                            >
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>

                        {/* Access */}
                        <div className="mb-2">
                            <label htmlFor="rolesName" className="form-label">Access:</label>
                            <Select
                                isMulti
                                name="rolesName"
                                options={rolesOptions}
                                value={currentRow?.rolesName?.map((role) => ({
                                    value: role,
                                    label: role,
                                })) || []}
                                onChange={handleRolesChange}
                                closeMenuOnSelect={false}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </div>

                        {/* Username and Phone */}
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <label htmlFor="username" className="form-label">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    style={{ height: '37px', padding: '5px 10px', fontSize: '14px' }}
                                    className="form-control"
                                    value={currentRow?.username || ""}
                                    onChange={(e) => setCurrentRow({ ...currentRow, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="phone" className="form-label">Phone:</label>
                                <input
                                    type="text"
                                    id="phone"
                                    style={{ height: '37px', padding: '5px 10px', fontSize: '14px' }}
                                    className="form-control"
                                    value={currentRow?.phone || ""}
                                    onChange={(e) => setCurrentRow({ ...currentRow, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email and Password */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    style={{ height: '37px', padding: '5px 10px', fontSize: '14px' }}
                                    className="form-control"
                                    value={currentRow?.email || ""}
                                    onChange={(e) => setCurrentRow({ ...currentRow, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 flex flex-row items-center gap-2">
                                <div className="col-md-4 w-75 input-group " aria-describedby="basic-addon1">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <div className="flex flex-row" style={{ position: 'relative', width: '100%' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            id="password"
                                            style={{
                                                height: '37px',
                                                padding: '5px 10px',
                                                fontSize: '14px',
                                                flexGrow: 1,  // Ensures the input takes up all available space
                                                paddingRight: '40px',  // Space for the icons
                                            }}
                                            className="form-control"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        {/* Password Visibility Toggle Button */}
                                        <div className="cursor-pointer mt-1"
                                            onClick={togglePasswordVisibility}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',  // Position visibility toggle button inside the input field
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'transparent',
                                                border: 'none',
                                            }}
                                        >
                                            {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                                        </div>
                                    </div>



                                </div>

                                {/* Password Generator Button outside the input field */}
                                <div className="input-group-prepend w-25" id="basic-addon1">
                                    <Button
                                        onClick={generatePassword}
                                        style={{
                                            marginTop: '10px',  // Adjust as needed for spacing
                                            background: 'success',
                                            border: '1px solid #ccc',
                                            padding: '7px 15px',

                                        }}
                                    >
                                        <GiCycle size={20} />
                                    </Button>
                                </div>


                            </div>

                        </div>








                        {/* Submit Button */}
                        <div className="text-center">
                            <Button variant="contained" color="primary" type="submit">
                                Create User
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>



            {/* Edit Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ ...modalStyle, width: 600 }}>
                    <form onSubmit={handleSubmit} className="p-3">
                        <h2 className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edit User</h2>
                        <div className="mb-4">
                            <label htmlFor="userType" className="form-label">User Type:</label>
                            <select
                                id="userType"
                                className="form-select"
                                value={currentRow?.userType || ""}
                                onChange={(e) => setCurrentRow({ ...currentRow, userType: e.target.value })}
                                required
                            >
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="rolesName" className="form-label">Access:</label>
                            <Select
                                isMulti
                                name="rolesName"
                                options={rolesOptions}
                                value={currentRow?.rolesName?.map((role) => ({
                                    value: role,
                                    label: role,
                                })) || []}
                                onChange={handleRolesChange}
                                closeMenuOnSelect={false}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="username" className="form-label">Username:</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"

                                value={currentRow?.username || ""}
                                onChange={(e) => setCurrentRow({ ...currentRow, username: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="form-label">Phone:</label>
                            <input
                                type="text"
                                id="phone"
                                className="form-control"
                                value={currentRow?.phone || ""}
                                onChange={(e) => setCurrentRow({ ...currentRow, phone: e.target.value })}
                            />
                        </div>

                        <div className="text-center">
                            <Button variant="contained" color="primary" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal open={openDeleteModal} onClose={handleCancelDelete}>
                <Box sx={modalStyle}  >
                    <h2 className="p-5">Are you sure you want to delete this user?</h2>
                    <div className=" p-4 " style={{ textAlign: "center" }}>
                        <Button variant="contained" color="error" onClick={handleConfirmDelete}>Yes, Delete</Button>
                        <Button variant="contained" color="default" onClick={handleCancelDelete} style={{ marginLeft: "8px" }}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </Box>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: 24,
    borderRadius: '8px',
};

export default UserList;
