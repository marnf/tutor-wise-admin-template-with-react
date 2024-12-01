import React, { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// Add search term state
const Testimonial = () => {
    const [rows, setRows] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openApproveModal, setOpenApproveModal] = useState(false);
    const [approveId, setApproveId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [searchTerm, setSearchTerm] = useState(""); // For search box

    useEffect(() => {
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/testimonials-view/`)
            .then((res) => res.json())
            .then((data) => {
                setRows(data);
            })
            .catch((error) => console.error("Error fetching reviews:", error));
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter rows based on search term
    const filteredRows = rows.filter(
        (row) =>
            row.tutor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Button style for actions
    const buttonStyle = {
        marginRight: "8px", // Add space between buttons
        textTransform: "none", // Prevent uppercase text
        padding: "6px 12px", // Adjust padding
    };

    const columns = (handleEditClick, handleApproveClick, handleDeleteClick) => [
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
                <Box display="flex" gap={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(params.row)}
                        sx={buttonStyle}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApproveClick(params.row.id)}
                        sx={buttonStyle}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteClick(params.row.id)}
                        sx={buttonStyle}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    const handleEditClick = (row) => {
        setSelectedReview(row);
        setOpenModal(true);
    };

    const handleApproveClick = (id) => {
        setApproveId(id);
        setOpenApproveModal(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setOpenDeleteModal(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log(selectedReview);
        setSnackbar({ open: true, message: "Changes saved successfully!", severity: "success" });
        setOpenModal(false);
    };

    const handleDeleteConfirm = () => {
        setRows(rows.filter((row) => row.id !== deleteId));
        setSnackbar({ open: true, message: "Review deleted successfully!", severity: "success" });
        setOpenDeleteModal(false);
    };

    const handleApproveConfirm = () => {
        setRows(rows.map((row) => (row.id === approveId ? { ...row, approved: true } : row)));
        setSnackbar({ open: true, message: "Review approved successfully!", severity: "success" });
        setOpenApproveModal(false);
    };

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Review List</h2>

            {/* Search Box */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{ width: 300 }}
                />
            </Box>

            <DataGrid
                rows={filteredRows}
                columns={columns(handleEditClick, handleApproveClick, handleDeleteClick)}
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

            {/* Modal for editing review */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="edit-review-modal"
                aria-describedby="edit-review-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "800px",
                        width: "100%",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        p: 4,
                    }}
                >
                    <h3 className="text-center bold text-2xl font-bold py-3">Edit Information Form</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="row mb-4">
                            <div className="col-md-10 ">
                                <label htmlFor="tutorName" className="form-label fw-bold">
                                    Tutor Name:
                                </label>
                                <p className="form-control-plaintext text-gray-500 px-3 border rounded tutor_name" id="tutorName">
                                    {selectedReview?.tutor_name}
                                </p>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="staticId" className="form-label fw-bold">
                                    ID:
                                </label>
                                <p className="form-control-plaintext text-gray-500 px-3 border rounded id-number" id="staticId">
                                    {selectedReview?.id}
                                </p>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="review" className="form-label fw-bold">
                                Review:
                            </label>
                            <textarea
                                id="review"
                                className="form-control border border-dark"
                                rows="3"
                                name="message"
                                placeholder="Write your review here"
                                value={selectedReview?.message || ""}
                                onChange={(e) =>
                                    setSelectedReview((prev) => ({
                                        ...prev,
                                        message: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="rating" className="form-label fw-bold">
                                Rating (1-5):
                            </label>
                            <input
                                type="number"
                                id="rating"
                                name="rating"
                                className="form-control border border-dark"
                                min="1"
                                max="5"
                                value={selectedReview?.rating || ""}
                                onChange={(e) =>
                                    setSelectedReview((prev) => ({
                                        ...prev,
                                        rating: e.target.value,
                                    }))
                                }
                                placeholder="Enter a rating"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="studentName" className="form-label fw-bold">
                                Student Name:
                            </label>
                            <p className="form-control-plaintext text-gray-500 px-3 border rounded student_name">
                                {selectedReview?.name}
                            </p>
                        </div>

                        <div className="text-end">
                            <Button type="submit" variant="contained" color="primary">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                aria-labelledby="delete-confirmation-modal"
            >
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", p: 3, backgroundColor: "#fff", borderRadius: "12px" }}>
                    <h4 className="py-5">Are you sure you want to delete this review?</h4>
                    <div className=" flex justify-center">
                        <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                        <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} sx={{ marginLeft: "1rem" }}>
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Approve Confirmation Modal */}
            <Modal
                open={openApproveModal}
                onClose={() => setOpenApproveModal(false)}
                aria-labelledby="approve-confirmation-modal"
            >
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", p: 3, backgroundColor: "#fff", borderRadius: "12px" }}>
                    <h4 className="py-5" >Are you sure you want to approve this review?</h4>
                    <div className="flex justify-center">
                        <Button variant="contained" color="success" onClick={handleApproveConfirm}>
                            Approve
                        </Button>
                        <Button variant="outlined" onClick={() => setOpenApproveModal(false)} sx={{ marginLeft: "1rem" }}>
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Snackbar for success message */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Testimonial;
