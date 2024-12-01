import React, { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";



const columns = (handleEditClick, handleDeleteClick) => [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
        field: "logo",
        headerName: "Institution Logo",
        flex: 1,
        renderCell: (params) => (
            <img
                src={params.value || "https://via.placeholder.com/50"}
                alt="Institution Logo"
                style={{ width: 50, height: 50, borderRadius: "8px" }}
            />
        ),
    },
    { field: "name", headerName: "Institution Name", flex: 1 },
    {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (

            <Box display="flex" justifyContent="end" className="mt-3" gap={1}>

                <FaUserEdit title="Edit"
                    size={25}
                    color="black"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => handleEditClick(params.row)} />

                <MdDelete title="Delete"
                    size={25}
                    color="red"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => handleDeleteClick(params.row.id)}
                />
            </Box>
        ),
    },
];

const InstitutionList = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]); // ফিল্টারকৃত ডেটা
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/view-institution/`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    logo: item.logo ? `${BASE_URL}${item.logo}` : null,
                    name: item.name,
                }));
                setRows(formattedData);
                setFilteredRows(formattedData); // Initialize filteredRows
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Handle edit button click
    const handleEditClick = (institution) => {
        setSelectedInstitution(institution);
        setOpenModal(true);
    };


    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);
        const filtered = rows.filter(
            (row) =>
                row.id.toString().toLowerCase().includes(value) ||
                row.name.toLowerCase().includes(value)
        );

        setFilteredRows(filtered);
    };


    // Handle form submission for edit
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const BASE_URL = "https://tutorwise-backend.vercel.app";

        // API call to update institution
        fetch(`${BASE_URL}/api/admin/edit-institution/${selectedInstitution.id}/`, {
            method: "PUT", // or "PATCH" depending on your backend
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: selectedInstitution.name,
                logo: selectedInstitution.logo,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    setSnackbar({ open: true, message: "Institution updated successfully!", severity: "success" });
                    // Update the rows with the new data
                    setRows((prevRows) =>
                        prevRows.map((row) =>
                            row.id === selectedInstitution.id
                                ? { ...row, name: selectedInstitution.name, logo: selectedInstitution.logo }
                                : row
                        )
                    );
                    setOpenModal(false); // Close the modal after success
                } else {
                    setSnackbar({ open: true, message: "Failed to update the institution.", severity: "error" });
                }
            })
            .catch((error) => {
                console.error("Error updating institution:", error);
                setSnackbar({ open: true, message: "An error occurred while updating.", severity: "error" });
            });
    };


    // Handle delete button click
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setOpenDeleteModal(true);
    };

    // Confirm deletion
    const handleDelete = () => {
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/delete-institution/${deleteId}/`, {
            method: "POST",
        })
            .then((res) => {
                if (res.ok) {
                    setRows((prevRows) => prevRows.filter((row) => row.id !== deleteId));
                    setSnackbar({ open: true, message: "Institution deleted successfully!", severity: "success" });
                } else {
                    setSnackbar({ open: true, message: "Failed to delete the institution.", severity: "error" });
                }
            })
            .catch((error) => {
                console.error("Error deleting institution:", error);
                setSnackbar({ open: true, message: "An error occurred.", severity: "error" });
            })
            .finally(() => {
                setOpenDeleteModal(false);
                setDeleteId(null);
            });
    };

    // Close delete modal
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setDeleteId(null);
    };



    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 className="text-center font-bold h3">Institution List</h2>

            <Box className ="flex justify-end mb-2">
                <TextField
                    placeholder="Search..."
                    value={searchText}
                    onChange={handleSearch}
                    variant="outlined"
                    size="small"
                    sx={{ width: "300px" }}
                />
            </Box>


            <DataGrid
                rows={filteredRows} // Use filteredRows here
                columns={columns(handleEditClick, handleDeleteClick)}
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

            {/* Modal for editing institution */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="edit-institution-modal"
                aria-describedby="edit-institution-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "600px",
                        width: "100%",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        p: 4,
                    }}
                >
                    <h3 className="form-title">Edit Institution</h3>
                    <form onSubmit={handleFormSubmit} className="form-container">
                        <div className="form-group">
                            <label htmlFor="institutionName" className="form-label">
                                Institution Name
                            </label>
                            <input
                                type="text"
                                id="institutionName"
                                className="form-control"
                                value={selectedInstitution?.name || ""}
                                onChange={(e) =>
                                    setSelectedInstitution((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="institutionLogo" className="form-label">
                                Institution Logo URL
                            </label>
                            <input
                                type="text"
                                id="institutionLogo"
                                className="form-control"
                                value={selectedInstitution?.logo || ""}
                                onChange={(e) =>
                                    setSelectedInstitution((prev) => ({
                                        ...prev,
                                        logo: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>

                        {/* Image Preview */}
                        {selectedInstitution?.logo && (
                            <div className="image-preview">
                                <h4 className="text-start p-2 border-b-2">Image Preview</h4>
                                <img className="p-2 mx-auto"
                                    src={selectedInstitution.logo}
                                    alt="Preview"
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        borderRadius: "10px",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        )}

                        <div className="button-container">
                            <button type="submit" className="submit-btn">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Box>
            </Modal>


            {/* Dialog for confirming deletion */}
            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this institution?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InstitutionList;
