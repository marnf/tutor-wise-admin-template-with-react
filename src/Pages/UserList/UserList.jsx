import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal, TextField } from "@mui/material";
import Select from "react-select";  // Import react-select

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
            <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => params.row.handleEdit(params.row)}
                    style={{ marginRight: 8 }}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => params.row.handleDelete(params.row)}
                >
                    Delete
                </Button>
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
            })
            .catch((error) => console.error("Error fetching roles options:", error));
    }, []);

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
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>User List</h2>

            <div className="flex justify-between items-center">
                {/* Search Bar */}
                <TextField
                    label="Search Users"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "300px" }}
                />


                <button
                    className="transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 my-2 p-3 rounded"
                    onClick={handleCreateUser}>
                    Create User
                </button>

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

            {/* create modal */}

            {/* Create User Modal */}
            <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
                <Box sx={{ ...modalStyle, width: 600 }}>
                    <form onSubmit={handleCreateSubmit} className="p-3">
                        <h2 className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create User</h2>

                        <div className="mb-4">
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

                        <div className="mb-4">
                            <label htmlFor="rolesName" className="form-label">Access:</label>
                            <Select
                                isMulti
                                name="rolesName"
                                options={rolesOptions}
                                value={currentRow?.rolesName?.map(role => ({ value: role, label: role })) || []}
                                onChange={(selectedOptions) =>
                                    setCurrentRow({
                                        ...currentRow,
                                        rolesName: selectedOptions.map(option => option.label),
                                    })
                                }
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
                                required
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
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={currentRow?.password || ""}
                                onChange={(e) => setCurrentRow({ ...currentRow, password: e.target.value })}
                                required
                            />
                        </div>

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
                                options={rolesOptions}  // Dynamic options
                                value={currentRow?.rolesName.map(role => ({ value: role, label: role })) || []}  // Map to objects for react-select
                                onChange={(selectedOptions) =>
                                    setCurrentRow({
                                        ...currentRow,
                                        rolesName: selectedOptions.map(option => option.label)  // Save as string array
                                    })
                                }
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
