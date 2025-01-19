import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Snackbar, Alert, TextField, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { decryptData } from "../../EncryptedPage";
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


const Testimonial = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
   
        fetch(`${BASE_URL}/api/admin/testimonials-view/`)
            .then((res) => res.json())
            .then((data) => {
                setRows(data);
                setFilteredRows(data);
                setLoading(false)
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

                    <MdDelete
                        title="Delete"
                        size={25}
                        color={isSuperAdmin ? "red" : "gray"}
                        className={`transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 ${isSuperAdmin ? "cursor-pointer" : "cursor-not-allowed"
                            }`}
                        onClick={() => {
                            if (isSuperAdmin) {
                                handleDeleteClick(params.row.id);
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

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>

            {/* Search Box */}
            <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center  text-end gap-1">
                <Typography variant="text-base" className="flex h5">
                    <strong className="text-gray-500">Total Testimonial:{rows.length} </strong>
                </Typography>
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
                        "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none", // Remove outline when child element inside column header is focused
                        },
                    }}
                />)}

            {/* Delete Confirmation Modal */}

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Approve Review</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to remove this testimonial?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="danger">
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>

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
