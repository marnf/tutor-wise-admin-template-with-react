import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, LinearProgress, Modal, TextField, Typography } from "@mui/material";
import Select from "react-select";  // Import react-select
import { BiSolidSelectMultiple, BiSolidUserDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { FaEye, FaEyeSlash, FaStar, FaUserEdit } from "react-icons/fa";
import { GiCycle } from "react-icons/gi";
import { Snackbar } from '@mui/material';
import moment from "moment";
import { decryptData } from "../../EncryptedPage";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { DateRangePicker } from "react-date-range";
import BASE_URL from "../../Api/baseUrl";



const encryptedUser = localStorage.getItem("user");

let user;
if (encryptedUser) {
    try {
        user = decryptData(encryptedUser);
    } catch (error) {
        console.error("Error decrypting user data:", error);
    }
}
const isSuperAdmin = user?.user_type === "super_admin";



const columns = [
    { field: "customizeId", headerName: "ID", minWidth: 130 },
    {
        field: "username",
        headerName: "Name",
        flex: 1,
        minWidth: 240,
        renderCell: (params) => (
            <Box display="flex" alignItems="center">
                <span>{params.row.username || "N/A"}</span>

                {params.row.is_new && (
                    <div style={{ background: "#f0523a" }} className=" ml-2 h-5 flex items-center justify-center rounded-full px-1">
                        <p className="text-white  font-medium m-0" style={{ fontSize: '10px', margin: 0 }}>new</p>
                    </div>

                )}
            </Box>
        ),
    },
    // { field: "lastLogin", headerName: "Last login", flex: 1 },
    { field: "formattedJoinDate", headerName: "Joining date", minWidth: 160 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "userType", headerName: "User Type", flex: 1 },
    // { field: "rolesName", headerName: "Roles Name", flex: 2 },
    {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (



            <Box display="flex" justifyContent="center" className="mt-3" gap={1}>

                <FaUserEdit title="Edit"
                    size={25}
                    color="black"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleEdit(params.row)}
                />



                <BiSolidUserDetail title="View"
                    size={29}
                    color="#f0523a"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleViewModal(params)} />

                {/* <MdDelete
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
                /> */}


                <MdDelete
                    title="Delete"
                    size={25}
                    color="gray"
                    className="transition ease-in-out delay-250 hover:scale-100 cursor-not-allowed"
                    style={{
                        pointerEvents: "none",
                        opacity: 0.5,
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
    const [originalRolesOptions, setOriginalRolesOptions] = useState([]);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openCreateRoleModal, setOpenCreateRoleModal] = useState(false);

    const [snackbarErrorMessage, setSnackbarErrorMessage] = useState('');
    const [selectedOptions, setSelectedOptions] = useState('')
    const [view, setView] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [editPassword, setEditPassword] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [refreshTable, setRefreshTable] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [initialRoles, setInitialRoles] = useState([]);


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



    // Function to generate random password
    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(generatedPassword);
        setEditPassword(generatedPassword);
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
        fetch(`${BASE_URL}/api/admin/all-users-list/`)
            .then((res) => res.json())
            .then((data) => {
                const usersData = data.user_data || data;

                const formattedUsers = usersData.map((user) => ({
                    is_new: user.is_new,
                    id: user.id,
                    customizeId: user.customized_user_id,
                    lastLogin: formData(user.last_login) || '',
                    joinDate: moment(user?.join_date).format('YYYY-MM-DD') || '',
                    formattedJoinDate: moment(user.join_date).format('DD/MM/YYYY hh:mm a') || '',
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
    }, [refreshTable]);

    // Filter rows based on search query
    useEffect(() => {
        const result = rows.filter((row) =>
            Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRows(result);
    }, [searchQuery, rows]);



    const handleDateFilter = () => {
        const startDate = new Date(dateRange[0].startDate).setHours(0, 0, 0, 0); // Start of the day
        const endDate = new Date(dateRange[0].endDate).setHours(23, 59, 59, 999); // End of the day

        console.log("Start Date:", startDate, "End Date:", endDate);

        const filteredData = rows.filter((row) => {
            const rowDate = new Date(row.joinDate).getTime();
            console.log("Row Date:", rowDate); // Debug
            return rowDate >= startDate && rowDate <= endDate;
        });

        console.log("Filtered Data:", filteredData); // Debug filtered rows
        setFilteredRows(filteredData);
        setShowDatePicker(false); // Close the date picker after filtering
    };

    const resetFilters = () => {

        setRefreshTable((prev) => !prev);
    };


    // Fetch Roles Options for Select
    useEffect(() => {
        fetch(`${BASE_URL}/api/admin/view-role/`)
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
        fetch(`${BASE_URL}/api/admin/view-role/`)
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
        console.log(row)
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
    // const handleCreateRoleSubmit = (event) => {
    //     event.preventDefault();

    //     const formData = new FormData(event.target);
    //     const jsonData = Object.fromEntries(formData.entries());
    //     console.log(jsonData)

    //     fetch(`${BASE_URL}/api/admin/create-role/`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(jsonData),
    //     })
    //         .then((response) => {
    //             if (response.ok) {
    //                 setSnackbarMessage("Role created successfully!");
    //                 setOpenSnackbar(true);
    //                 setOpenCreateRoleModal(false)
    //                 fetchRoles();

    //             } else {
    //                 setSnackbarMessage("failed!");
    //                 setOpenErrorSnackbar(true);
    //                 setOpenCreateRoleModal(false)
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Error submitting form:", error);

    //         });
    // }

    const handleCreateRoleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const jsonData = Object.fromEntries(formData.entries());
        console.log(jsonData);

        fetch(`${BASE_URL}/api/admin/create-role/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
        })
            .then((response) => {
                console.log(response)
                if (response.ok) {
                    showSuccessMessage("Role created successfully!");
                    setOpenCreateRoleModal(false);
                    fetchRoles();
                } else {
                    showErrorMessage("Failed to create role!");
                    setOpenCreateRoleModal(false);
                }
            })
            .catch((error) => {
                console.error("Error submitting form:", error);
                showErrorMessage("An error occurred while creating the role!");
                setOpenCreateRoleModal(false);
            });
    };


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
        fetch(`${BASE_URL}/api/account/admin/create-user/`, {
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
                    handleCloseCreateModal()

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
                    handleCloseCreateModal()
                    setRefreshTable((prev) => !prev);
                }
            })
            .catch((error) => {
                console.error("Network or server error:", error);
                setSnackbarMessage("Oops! Network error occurred.");
                setOpenErrorSnackbar(true);
                handleCloseCreateModal()
            });



    };


    // Confirm Delete User
    const handleConfirmDelete = () => {
        console.log(currentRow.id)
        // API DELETE Request
        fetch(`${BASE_URL}/api/admin/delete-user/${currentRow.id}/`, {
            method: 'DELETE',
        })
            .then(() => {
                // Remove the deleted user from the rows state
                // setRows(rows.filter(row => row.id !== currentRow.id));
                // setFilteredRows(filteredRows.filter(row => row.id !== currentRow.id));
                setOpenDeleteModal(false);  // Close delete confirmation modal
                setSnackbarMessage("User deleted successfully!");
                setOpenSnackbar(true);
                setRefreshTable((prev) => !prev);
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                setSnackbarMessage("Sorry, something went wrong!");
                setOpenErrorSnackbar(true);
            });
    };


    // Cancel Delete
    const handleCancelDelete = () => {
        setOpenDeleteModal(false);  // Close delete confirmation modal without deleting
    };

    // Handle Form Submission for Edit
    const handleSubmit = (event) => {
        event.preventDefault();

        // Use currentRow.role_ids if available, otherwise fallback to initialRoles
        const roleIds = currentRow?.role_ids?.length > 0
            ? currentRow.role_ids.map((role) => {
                if (typeof role === "string") {
                    const matchedOption = originalRolesOptions.find((option) => option.label === role);
                    return matchedOption ? matchedOption.value : role;
                }
                return role; // Already an ID
            })
            : initialRoles.map((role) => {
                const matchedOption = originalRolesOptions.find((option) => option.label === role);
                return matchedOption ? matchedOption.value : role;
            });

        // Prepare the updated data
        const updatedData = {
            username: currentRow.username,
            phone: currentRow.phone,
            user_type: currentRow.userType,
            roles: roleIds, // This will always have the correct roles
        };

        // Conditionally add password to updatedData only if it has a value
        if (editPassword) {
            updatedData.password = editPassword;
        }


        const encryptedUser = localStorage.getItem("user");

        let user;
        if (encryptedUser) {
            try {
                user = decryptData(encryptedUser);
            } catch (error) {
                console.error("Error decrypting user data:", error);
            }
        }
        const token = user?.token;

        console.log(updatedData);

        // API PATCH Request to update user
        fetch(`${BASE_URL}/api/admin/edit-users-list/${currentRow.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(updatedData),
        })
            .then(() => {
                setOpenModal(false);
                setRefreshTable((prev) => !prev);
            })
            .catch((error) => {
                setSnackbarErrorMessage("Failed to submit!");
                setOpenErrorSnackbar(true);
                setOpenModal(false);
            });
    };

    useEffect(() => {
        if (currentRow?.rolesName) {
            setInitialRoles(currentRow.rolesName);
        }
    }, [currentRow]);

    return (


        <Box sx={{ height: "80vh", width: "100%" }}>

            <div className="flex justify-between items-center mb-1">

                <div className="flex flex-col justify-end gap-2">



                    <Typography variant="text-base" className="flex justify-end">
                        <strong className="text-gray-500"> Total user:{rows.length} </strong>
                    </Typography>
                    {/* Search Bar */}


                    <div className="flex   text-end gap-1">


                        <div className="relative flex items-center justify-start gap-1 mb-2">
                            <BsFillCalendarDateFill
                                size={40}
                                color="#f0523a"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer "
                            />

                            {showDatePicker && (
                                <div style={{ position: "absolute", zIndex: 100, top: "50px" }}>
                                    <DateRangePicker
                                        onChange={(item) => setDateRange([item.selection])}
                                        showSelectionPreview={true}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dateRange}
                                        direction="horizontal"
                                    />
                                    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={handleDateFilter}
                                        >
                                            Apply Filter
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={resetFilters}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

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


                <div>
                    {isSuperAdmin ? (
                       
                        <div className="flex items-center gap-2 -mb-2">
                            <button
                                className=" bg-green-600 hover:bg-green-700 text-white transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-300 my-2 p-1 px-2 rounded flex items-center border"
                                onClick={handleCreateUser}
                            >
                                <div className="flex justify-center items-center gap-1">
                                    <GoPlus size={20} />
                                    <p className="text-sm">Create User</p>
                                </div>
                            </button>

                            <button
                                className=" bg-blue-500 hover:bg-blue-700 text-white transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-300 my-2 p-1 px-2 rounded flex items-center border"
                                onClick={handleCreateRole}
                            >
                                <div className="flex justify-center items-center gap-1">
                                    <GoPlus size={20} />
                                    <p className="text-sm">Create Role</p>
                                </div>
                            </button>
                        </div>
                    ) : (
                        // যদি isSuperAdmin মিথ্যা থাকে, তাহলে বাটনগুলো ডিসেবল অবস্থায় থাকবে
                        <div className="flex items-center gap-2 -mb-2">
                            <button
                                className=" bg-green-600 text-white transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-300 my-2 p-1 px-2 rounded flex items-center border"
                                onClick={handleCreateUser}
                                disabled
                            >
                                <div className="flex justify-center items-center gap-1">
                                    <GoPlus size={20} />
                                    <p className="text-sm">Create User</p>
                                </div>
                            </button>

                            <button
                                className=" bg-blue-500 text-white transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-300 my-2 p-1 px-2 rounded flex items-center border"
                                onClick={handleCreateRole}
                                disabled
                            >
                                <div className="flex justify-center items-center gap-1">
                                    <GoPlus size={20} />
                                    <p className="text-sm">Create Role</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>


            </div>

            {loading ? (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress
                        sx={{
                            backgroundColor: "#0d2a4c",
                            "& .MuiLinearProgress-bar": {
                                background: "linear-gradient(90deg,#ef5239 ,#f9553c)", // Gradient effect
                            },
                        }} />
                </Box>
            ) : (

                <DataGrid

                    rows={filteredRows}
                    columns={columns.map((col) => ({
                        ...col,
                        minWidth: col.minWidth || 125
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
                        "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none", // Remove outline when child element inside column header is focused
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
                                            marginTop: '20px',
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
                            fontSize: '1.8rem', fontWeight: 'bold', color: 'black',
                            borderBottom: '2px solid black', paddingBottom: '8px',
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
                                className="form-select w-full"
                                style={{ height: '40px' }}
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
                                style={{ height: '40px' }}
                                value={currentRow?.username || ""}
                                onChange={(e) => setCurrentRow({ ...currentRow, username: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-2 items-center">
                            <div className={`mb-4 col-md-6`}>
                                <label htmlFor="phone" className="form-label">Phone:</label>
                                <input
                                    type="number"
                                    placeholder="edit phone number"
                                    id="phone"
                                    className="form-control"
                                    style={{ height: '40px' }}
                                    value={currentRow?.phone || ""}
                                    onChange={(e) => setCurrentRow({ ...currentRow, phone: e.target.value })}
                                />
                            </div>

                            <div className={`col-md-6 flex flex-row items-center gap-2 mb-2 ${!isSuperAdmin ? "opacity-50 pointer-events-none" : ""
                                }`}>
                                <div className="col-md-4 w-75 input-group">
                                    <label htmlFor="password" className="form-label">Password:</label>

                                    {/* don't delete it */}
                                    {/* <div className="flex flex-row" style={{ position: 'relative', width: '100%' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={editPassword}
                                            placeholder="Change password"
                                            id="EditPassword"
                                            required={isSuperAdmin}
                                            style={{
                                                height: '40px',
                                                padding: '5px 10px',
                                                fontSize: '14px',
                                                flexGrow: 1,
                                                paddingRight: '40px',
                                            }}
                                            className="form-control"
                                            onChange={(e) => setEditPassword(e.target.value)}

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
                                    </div> */}

                                    <div className="flex flex-row" style={{ position: 'relative', width: '100%' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={editPassword}
                                            placeholder="Change password"
                                            id="EditPassword"
                                            style={{
                                                height: '40px',
                                                padding: '5px 10px',
                                                fontSize: '14px',
                                                flexGrow: 1,
                                                paddingRight: '40px',
                                            }}
                                            className="form-control"
                                            onChange={(e) => setEditPassword(e.target.value)}  // Update the state with entered password
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
                                            marginTop: '20px',
                                            border: '1px solid #ccc',
                                            padding: '7px 15px',
                                        }}
                                    >
                                        <GiCycle size={20} />
                                    </Button>
                                </div>
                            </div>
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

            <Dialog open={openDeleteModal} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this user?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>


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






