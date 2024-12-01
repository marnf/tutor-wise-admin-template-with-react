import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Snackbar, Alert, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";

const Testimonial = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/testimonials-view/`)
            .then((res) => res.json())
            .then((data) => {
                setRows(data);
                setFilteredRows(data); // Initially show all rows
            })
            .catch((error) => console.error("Error fetching reviews:", error));
    }, []);

    // Handle search
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);
        const filtered = rows.filter(
            (row) =>
                row.tutor_name.toLowerCase().includes(value) ||
                row.message.toLowerCase().includes(value) ||
                row.name.toLowerCase().includes(value)
        );
        setFilteredRows(filtered);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setOpenDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/remove-testimonials/${deleteId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.ok) {
                    setSnackbar({ open: true, message: "Review deleted successfully!", severity: "success" });
                    setFilteredRows((prevRows) => prevRows.filter((row) => row.id !== deleteId));
                } else {
                    setSnackbar({ open: true, message: "Failed to delete the review.", severity: "error" });
                }
            })
            .catch((error) => {
                console.error("Error deleting review:", error);
                setSnackbar({ open: true, message: "Error deleting review.", severity: "error" });
            });

        setOpenDeleteModal(false);
    };

    const columns = (handleDeleteClick) => [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "tutor_name", headerName: "Tutor Name", flex: 1 },
        { field: "message", headerName: "Review", flex: 2 },
        { field: "rating", headerName: "Rating", flex: 0.8 },
        { field: "name", headerName: "Student Name", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" justifyContent="end" className="mt-3">
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

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 className="text-center font-bold h3" >Testimonial List</h2>

            {/* Search Box */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
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
                rows={filteredRows}
                columns={columns(handleDeleteClick)}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={{
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "2px solid #1976d2",
                    },
                    "& .MuiDataGrid-cell": {
                        border: "1px solid #e0e0e0",
                    },
                    "& .MuiDataGrid-cell:focus": {
                        outline: "none",
                    },
                }}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                aria-labelledby="delete-review-modal"
                aria-describedby="delete-review-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "500px",
                        width: "100%",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        p: 4,
                    }}
                >
                    <h3 className="text-center font-bold text-xl py-3">Are you sure you want to delete this review?</h3>
                    <div className="d-flex justify-content-center gap-4">
                        <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                            Yes, Delete
                        </Button>
                        <Button variant="contained" onClick={() => setOpenDeleteModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Testimonial;
