import React, { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidSelectMultiple } from "react-icons/bi";


const columns = (handleEditClick, handleDeleteClick) => [
    { field: "id", headerName: "ID", minWidth: 40 },
    { field: "name", headerName: "Name", minWidth: 200 },
    { field: "phone", headerName: "Phone", minWidth: 120 },
    { field: "location", headerName: "Location", minWidth: 150 },
    { field: "details", headerName: "Details", minWidth: 300 },
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
                    onClick={() => params.row.handleEdit(params.row)} />

                <MdDelete title="Delete"
                    size={25}
                    color="red"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleDelete(params.row.id)} />

            </Box>

        ),
    },

];



const InactiveUser = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });



    const handleEditClick =()=>{
        console.log('for test')
    }

    const handleDeleteClick =()=>{
        console.log('for test de;ete')
    }

    useEffect(() => {
        setLoading(true)
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/tuition/list/`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((request) => ({
                    id: request.id,
                    name: request.name || "",
                    phone: request.phone || "",
                    location: request.location || "",
                    details: request.details || "No Details",
                  
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
                setLoading(false)
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);


    const handleCloseSnackbar =()=>{
        console.log('wo')
    }

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
           

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
                    rows={rows}
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
                        "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none", // Remove outline when child element inside column header is focused
                        },
                    }}
                />
            )}


            {/* Dialog for confirming deletion */}
            <Dialog >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this user?</p>
                </DialogContent>
                <DialogActions>
                    <Button >Cancel</Button>
                    <Button  color="error">
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

export default InactiveUser;