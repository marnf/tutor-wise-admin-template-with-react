import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogContent, Divider, LinearProgress, Modal, TextField, Typography } from "@mui/material";
import Select from "react-select";  // Import react-select
import { BiSolidSelectMultiple, BiSolidUserDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GiCycle } from "react-icons/gi";
import { Snackbar } from '@mui/material';
import moment from "moment";



const user = JSON.parse(localStorage.getItem("user"));
const isSuperAdmin = user?.user_type === "super_admin";



const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "username", headerName: "Name", flex: 1 },
    { field: "lastLogin", headerName: "Last login", flex: 1 },
    { field: "joinDate", headerName: "Joining date", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "userType", headerName: "User Type", flex: 1 },
    { field: "rolesName", headerName: "Roles Name", flex: 2 },
    {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (



            <Box display="flex" justifyContent="center" className="mt-3" gap={1}>

                <BiSolidSelectMultiple title="Edit"
                    size={25}
                    color="green"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleEdit(params.row)}
                />

                <BiSolidUserDetail title="View"
                    size={29}
                    color="#f0523a"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleViewModal(params)} />

                <MdDelete
                    title="Delete"
                    size={25}
                    color={isSuperAdmin ? "red" : "gray"}
                    className={`transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 ${isSuperAdmin ? "cursor-pointer" : "cursor-not-allowed"
                        }`}
                    onClick={() => {
                        if (isSuperAdmin) {
                            params.row.handleDelete(params.row);
                        }
                    }}
                    style={{
                        pointerEvents: isSuperAdmin ? "auto" : "none",
                        opacity: isSuperAdmin ? 1 : 0.5,
                    }}
                />
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
    const [loading, setLoading] = useState(false);
    const [openCreateRoleModal, setOpenCreateRoleModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedOptions, setSelectedOptions] = useState('')
    const [view, setView] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);



    // Function to generate random password
    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(generatedPassword);
    };

    // password visible or not
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const formData = (dateString) => {
        if (!dateString) return "";
        return moment(dateString).format("MMMM Do YYYY");
    };

    // Fetch Data for Users
    useEffect(() => {
        setLoading(true);
        fetch("https://tutorwise-backend.vercel.app/api/admin/all-users-list/")
            .then((res) => res.json())
            .then((data) => {
                const usersData = data.user_data || data;

                const formattedUsers = usersData.map((user) => ({
                    id: user.id,
                    lastLogin: formData(user.last_login) || '',
                    joinDate: formData(user.join_date) || '',
                    username: user.username || "",
                    phone: user.phone || "",
                    userType: user.user_type || "",
                    rolesName: user.roles_name ? user.roles_name.join(", ") : "",  // Store rolesName as a string
                    handleEdit: handleOpenModal,
                    handleDelete: handleDeleteUser,  // Add delete functionality
                    handleViewModal: handleOpenViewModal
                }));
                setRows(formattedUsers);
                setFilteredRows(formattedUsers);
                setLoading(false);
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


    const fetchRoles = () => {
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
    }

    const handleOpenViewModal = (item) => {
        setView(item.row)
        console.log(item.row)
        setOpenViewModal(true)


    }
    const handleCloseViewModal = () => {
        setOpenViewModal(false)
    }


    // Handle Role Selection Change
    const handleRolesChange = (selectedOptions) => {

        setSelectedOptions(selectedOptions)

        const selectedIds = selectedOptions.map((option) => option.value); // Collect selected IDs
        const selectedNames = selectedOptions.map((option) => option.label); // Collect selected Names


        setCurrentRow({
            ...currentRow,

            role_ids: selectedIds,  // Sending IDs for submission
            rolesName: selectedNames, // Displaying Names in input
            rolesName: selectedOptions.map((option) => option.label), // This updates the display names
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
            rolesName: row.rolesName ? row.rolesName.split(", ") : []
        });
        setOpenModal(true);
    };

    // create user
    const handleCreateUser = () => {
        setOpenCreateModal(true);
    };

    const handleCreateRole = () => {
        setOpenCreateRoleModal(true)
    }

    // Close Create User Modal
    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
    };

    const handleCloseCreateRoleModal = () => {
        setOpenCreateRoleModal(false);
    };

    const handleCloseSnackbar = () => {
        setOpenErrorSnackbar(false);
    };

    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false);
    };

    // Close Modal
    const handleCloseModal = () => {
        setOpenModal(false)
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

    // handle create role modal
    const handleCreateRoleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const jsonData = Object.fromEntries(formData.entries());
        console.log(jsonData)

        fetch("https://tutorwise-backend.vercel.app/api/admin/create-role/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
        })
            .then((response) => {
                if (response.ok) {
                    setSnackbarMessage("Role created successfully!");
                    setOpenSnackbar(true);
                    setOpenCreateRoleModal(false)
                    fetchRoles();

                } else {
                    setSnackbarMessage("failed!");
                    setOpenErrorSnackbar(true);
                    setOpenCreateRoleModal(false)
                }
            })
            .catch((error) => {
                console.error("Error submitting form:", error);

            });
    }


    // Handle Create User Form Submission
    const handleCreateSubmit = (event) => {
        event.preventDefault();

        // Convert role names to IDs (if required)
        const roleIds = currentRow?.role_ids?.map((role) => {
            if (typeof role === "string") {
                const matchedOption = originalRolesOptions.find((option) => option.label === role);
                return matchedOption ? matchedOption.value : role;
            }
            return role;
        }) || [];

        // Prepare new user data
        const newUser = {
            id: new Date().getTime(), // Correctly setting ID
            username: currentRow?.username || "",
            gmail: currentRow?.gmail || "",
            password: password || "",
            phone: currentRow?.phone || "",
            user_type: currentRow?.userType || "admin",
            role_ids: roleIds, // Send IDs
        };

        console.log(newUser);

        // API POST request to create a new user
        fetch("https://tutorwise-backend.vercel.app/api/account/admin/create-user/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Server Error:", errorData);

                    const errorMessage = errorData.message || errorData.error || "Unknown error occurred!";
                    setSnackbarMessage(errorMessage);
                    setOpenErrorSnackbar(true);
                    return;
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    setRows([...rows, { ...newUser, id: data.id || new Date().getTime() }]);
                    setFilteredRows([...filteredRows, { ...newUser, id: data.id || new Date().getTime() }]);
                    setOpenCreateModal(false);
                    setSnackbarMessage("User created successfully!");
                    setOpenSnackbar(true);
                }
            })
            .catch((error) => {
                console.error("Network or server error:", error);
                setSnackbarMessage("Oops! Network error occurred.");
                setOpenErrorSnackbar(true);
            });



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
                setSnackbarMessage("user deleted successfully!");
                setOpenSnackbar(true);
            })
            .catch((error) => console.error("Error deleting user:", error));
        setSnackbarMessage("sorry, something wrong!");
        setOpenErrorSnackbar(true);
    };

    // Cancel Delete
    const handleCancelDelete = () => {
        setOpenDeleteModal(false);  // Close delete confirmation modal without deleting
    };

    // Handle Form Submission for Edit
    const handleSubmit = (event) => {
        event.preventDefault();

        const roleIds = currentRow?.role_ids?.map((role) => {
            if (typeof role === "string") {
                // Find the corresponding id from originalRolesOptions
                const matchedOption = originalRolesOptions.find((option) => option.label === role);
                return matchedOption ? matchedOption.value : role; // Return id if found, else return the role as is
            }
            return role; // Already an ID
        }) || [];

        // Prepare the updated data
        const updatedData = {
            username: currentRow.username,
            phone: currentRow.phone,
            user_type: currentRow.userType,
            role_ids: roleIds,  // Pass as array for API
        };

        console.log(updatedData)

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

                setSnackbarMessage("data submitted successfully!");
                setOpenSnackbar(true);
            })
            .catch((error) => console.error("Error updating user:", error));

        setSnackbarMessage("failed to submit!");
        setOpenErrorSnackbar(true);
    };

    return (


        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>

            <div className="flex justify-between items-center mb-1">

                <div className="flex items-center gap-2 -mb-2">
                    <button className=" bg-green-600 hover:bg-green-700 text-white transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-300 my-2 p-1 px-2 rounded flex items-center border"
                        onClick={handleCreateUser}>
                        <div className="flex justify-center items-center gap-1">
                            <GoPlus size={20} />
                            <p className="text-sm">Create User</p>
                        </div>
                    </button>


                    <button className=" bg-blue-500 hover:bg-blue-700 text-white transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-300 my-2 p-1 px-2 rounded flex items-center border"
                        onClick={handleCreateRole}
                    >
                        <div className="flex justify-center items-center gap-1">
                            <GoPlus size={20} />
                            <p className="text-sm"> Create Role</p>
                        </div>
                    </button>
                </div>



                {/* Search Bar */}


                <div className="flex flex-col  text-end gap-1">
                    <Typography variant="text-base" className="flex justify-end">
                     <strong className="text-gray-500"> Total Payment:{rows.length} </strong>
                    </Typography>
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
            </div>

            {loading ? (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            ) : (

                <DataGrid

                    rows={filteredRows}
                    columns={columns.map((col) => ({
                        ...col,
                        minWidth: 125, // Minimum width for each column (adjust as needed)
                    }))}
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
                            whiteSpace: "normal", // Allow text to wrap in cells
                            wordWrap: "break-word", // Break long words if necessary
                        },
                        "& .MuiDataGrid-cell:focus": {
                            outline: "none", // Remove default outline on focus
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto", // Ensure horizontal scroll for table content
                        },
                    }}
                />
            )}



            {/* Create User Modal */}
            <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
                <Box sx={{ ...modalStyle }}> {/* Modal width increased */}
                    <form onSubmit={handleCreateSubmit} className="p-3">
                        <h2 className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create User</h2>

                        {/* User Type */}
                        <div className="mb-2">
                            <label htmlFor="userType" className="form-label">User Type:</label>
                            <select
                                id="userType"
                                className="form-select"
                                name="user_type"
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
                                name="role_ids"
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
                                    name="username"
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
                                    name="phone"
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
                                    name="gmail"
                                    id="gmail"
                                    style={{ height: '37px', padding: '5px 10px', fontSize: '14px' }}
                                    className="form-control"
                                    value={currentRow?.gmail || ""}
                                    onChange={(e) => setCurrentRow({ ...currentRow, gmail: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 flex flex-row items-center gap-2">
                                <div className="col-md-4 w-75 input-group" aria-describedby="basic-addon1">
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
                                                flexGrow: 1,
                                                paddingRight: '40px',
                                            }}
                                            className="form-control"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <div
                                            className="cursor-pointer mt-1"
                                            onClick={togglePasswordVisibility}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
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
                                <div className="input-group-prepend w-25" id="basic-addon1">
                                    <Button
                                        onClick={generatePassword}
                                        style={{
                                            marginTop: '10px',
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


            <Modal open={openCreateRoleModal} onClose={handleCloseCreateRoleModal}>
                <Box
                    sx={{
                        ...modalStyle, bgcolor: 'background.paper',
                        borderRadius: '8px', boxShadow: 24, p: 4,
                    }}>
                    <form onSubmit={handleCreateRoleSubmit} className="p-3">
                        <h2 className="text-center mb-4" style={{
                            fontSize: '1.8rem', fontWeight: 'bold', color: '#1976d2',
                            borderBottom: '2px solid #1976d2', paddingBottom: '8px',
                        }} >
                            Create Role
                        </h2>

                        {/* Role Name Input */}
                        <div className="mb-4">
                            <label htmlFor="role_name" style={{
                                display: 'block', marginBottom: '8px', fontWeight: '500',
                                fontSize: '1rem', color: '#333',
                            }}>
                                Role Name
                            </label>
                            <input type="text" name="role_name" id="role_name" className="w-100"
                                style={{
                                    padding: '10px 12px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc',
                                    width: '100%',
                                }} placeholder="Enter role name" required
                            />
                        </div>


                        {/* Description Input */}
                        <div className="mb-4">
                            <label htmlFor="desc" style={{
                                display: 'block', marginBottom: '8px', fontWeight: '500',
                                fontSize: '1rem', color: '#333',
                            }}>
                                Description
                            </label>
                            <input type="text" name="desc" id="desc" className="w-100"
                                style={{
                                    padding: '10px 12px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc',
                                    width: '100%',
                                }} placeholder="Enter Description" required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    borderRadius: '6px',
                                }}
                            >
                                Create Role
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
                                name="role_ids"
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


            {/* view modal */}
            <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth>


                {/* Content */}
                <DialogContent>
                    <div
                        sx={{
                            padding: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: 4,
                            boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
                            backgroundColor: '#f9f9f9',
                            maxWidth: '600px',
                            margin: ' auto',
                        }}
                    >
                        {/* Header Section */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 3,
                                marginBottom: 1,
                                borderBottom: '1px solid #ddd',
                            }}
                        >
                            {/* Left: Name and Phone */}
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                                >
                                    Name:{view?.username || ''}
                                </Typography>
                                <Typography variant="body1">
                                    Type:{view?.userType || ''}
                                </Typography>

                            </Box>

                            {/* Right: Location */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                        fontSize: '1rem',
                                        color: '#555',
                                        textAlign: 'right',
                                    }}
                                >
                                    <strong>ID:</strong>  {view?.id || ''}
                                </Typography>
                                <Typography variant="body1">
                                    {view?.joinDate || 'N/A'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Body Section */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 3,
                                flexDirection: { xs: 'column', sm: 'row' },
                            }}
                        >
                            {/* Left Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>


                                <Typography variant="body1">
                                    <strong>phone:</strong> {view?.phone || 'N/A'}
                                </Typography>

                                <Typography variant="body1">
                                    <strong>Roles:</strong> <br /> {view?.rolesName || 'N/A'}
                                </Typography>



                            </Box>

                            {/* Right Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>

                                <Typography variant="body1">
                                    <strong>Last login:</strong> <br /> {view?.lastLogin || ''}
                                </Typography>

                            </Box>
                        </Box>


                        {/* Footer Section: Cancel Button */}
                        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#ff5722',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '0.5rem 2rem',
                                    '&:hover': {
                                        backgroundColor: '#e64a19',
                                    },
                                }}
                                onClick={handleCloseViewModal}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Snackbar component */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={openErrorSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseErrorSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseErrorSnackbar} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
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
