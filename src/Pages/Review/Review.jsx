import React, { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, LinearProgress, Pagination } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BiSolidSelectMultiple } from "react-icons/bi";
import { FaUserEdit } from "react-icons/fa";



const columns = (handleEditClick, handleApproveClick) => [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "tutor_name", headerName: "Tutor Name", flex: 1 },
    { field: "message", headerName: "Review", flex: 2 },
    { field: "rating", headerName: "Rating", flex: 0.8 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
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

                <BiSolidSelectMultiple title="Approve"
                    size={25}
                    color="green"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => handleApproveClick(params.row.id)} />

            </Box>
        ),
    },
];

const Review = () => {
    const [rows, setRows] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [openApproveModal, setOpenApproveModal] = useState(false);
    const [approveId, setApproveId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [page, setPage] = useState(1);


    useEffect(() => {
        setLoading(true)
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/view-review-rating/`)
            .then((res) => res.json())
            .then((data) => {
                setRows(data);
                setLoading(false)
            })
            .catch((error) => console.error("Error fetching reviews:", error));
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);
        const filtered = rows.filter(
            (row) =>
                row.id.toLowerCase().includes(value) ||
                row.tutor_name.toLowerCase().includes(value) ||
                row.message.toLowerCase().includes(value) ||
                row.rating.toLowerCase().includes(value) ||
                row.name.toLowerCase().includes(value)
        );
        setFilteredRows(filtered);
    };

    // Handle edit button click
    const handleEditClick = (review) => {
        setSelectedReview(review);
        setOpenModal(true);
    };

    // Handle approve button click
    const handleApproveClick = (id) => {
        setApproveId(id);
        setOpenApproveModal(true);
    };

    // Handle form submission for edit
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const BASE_URL = "https://tutorwise-backend.vercel.app";

        // API call to update review
        fetch(`${BASE_URL}/api/admin/edit-review-rating/${selectedReview.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: selectedReview.message,
                rating: selectedReview.rating,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    setSnackbar({ open: true, message: "Review updated successfully!", severity: "success" });
                    setRows((prevRows) =>
                        prevRows.map((row) =>
                            row.id === selectedReview.id
                                ? { ...row, message: selectedReview.message, rating: selectedReview.rating }
                                : row
                        )
                    );
                    setOpenModal(false);
                } else {
                    setSnackbar({ open: true, message: "Failed to update the review.", severity: "error" });
                }
            })
            .catch((error) => {
                console.error("Error updating review:", error);
                setSnackbar({ open: true, message: "An error occurred while updating.", severity: "error" });
            });
    };

    // Handle approve
    const handleApprove = () => {
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/add-testimonials/${approveId}/`, {
            method: "POST",
        })
            .then((res) => {
                if (res.ok) {
                    setSnackbar({ open: true, message: "Review approved successfully!", severity: "success" });
                    setRows((prevRows) => prevRows.filter((row) => row.id !== approveId));
                } else {
                    setSnackbar({ open: true, message: "Failed to approve the review.", severity: "error" });
                }
            })
            .catch((error) => {
                console.error("Error approving review:", error);
                setSnackbar({ open: true, message: "An error occurred while approving.", severity: "error" });
            })
            .finally(() => {
                setOpenApproveModal(false);
                setApproveId(null);
            });
    };

    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>


            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    select
                    label="Rows per page"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    variant="outlined"
                    size="small"
                    sx={{ width: "150px" }}
                >
                    {[5, 10, 20].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </TextField>


                {/* Search Box */}
                <Box display="flex" justifyContent="flex-end" >
                    <TextField
                        placeholder="Search..."
                        value={searchText}
                        onChange={handleSearch}
                        variant="outlined"
                        size="small"
                        sx={{ width: "300px" }}
                    />
                </Box>

            </Box>

            {loading ? (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            ) : (
                <DataGrid
                    rows={rows}
                    columns={columns(handleEditClick, handleApproveClick)}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
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
                />)}
                

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
                        maxHeight: "600px",
                        width: "100%",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        p: 4,
                    }}
                >
                    <h3 className="text-center bold text-2xl font-bold py-1" >Edit Information Form</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="row ">
                            <div className="col-md-10 ">
                                <label htmlFor="tutorName" className="form-label fw-bold">
                                    Tutor Name:
                                </label>
                                <p
                                    className="form-control-plaintext text-gray-500  px-3 border rounded tutor_name"
                                    id="tutorName"
                                >
                                    {selectedReview?.tutor_name}
                                </p>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="staticId" className="form-label fw-bold">
                                    ID:
                                </label>
                                <p
                                    className="form-control-plaintext text-gray-500 px-3 border rounded id-number"
                                    id="staticId"
                                >
                                    {selectedReview?.id}
                                </p>
                            </div>
                        </div>

                        <div className="mb-2">
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

                        <div className="mb-2">
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

                        <div className="mb-2">
                            <label htmlFor="studentName" className="form-label fw-bold">
                                Student Name:
                            </label>
                            <p className="form-control-plaintext text-gray-500 px-3 border rounded student_name">
                                {selectedReview?.student_name}
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


            {/* Modal for approving review */}
            <Dialog open={openApproveModal} onClose={() => setOpenApproveModal(false)}>
                <DialogTitle>Approve Review</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to approve this review?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenApproveModal(false)}>Cancel</Button>
                    <Button onClick={handleApprove} color="success">
                        Approve
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

export default Review;
