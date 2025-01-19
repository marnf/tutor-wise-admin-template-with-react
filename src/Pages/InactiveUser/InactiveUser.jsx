import React, { useState, useEffect } from "react";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormLabel,
    Grid,
    LinearProgress,
    MenuItem,
    Radio,
    RadioGroup,
    Snackbar,
    TextareaAutosize,
    TextField,
    Typography,
} from "@mui/material";
import { SiGitconnected } from "react-icons/si";
import { DataGrid } from "@mui/x-data-grid";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import { BorderLeft } from "@mui/icons-material";
import { decryptData } from "../../EncryptedPage";
import BASE_URL from "../../Api/baseUrl";


// Dummy subject options
const subjectOptions = [
    "Bangla", "English", "Math", "Physics", "Science", "Chemistry",
    "Digital Technology", "Life and livelihood", "Healthy Safety",
    "Religious Studies", "Biology", "Information and Communication Technology",
    "Agriculture Education", "Geography", "Psychology", "Sports",
    "Accounting", "Finance & Banking", "Economics", "Statistics",
    "Production Management & Marketing", "Business Organization and management",
    "Civic & Good Governance", "History", "History and Social Sciences",
    "Islamic History", "Sociology", "Social Work", "Logic", "Soil Science",
    "Arts and crafts", "Art and Culture"
];


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
    { field: "customizedUserId", headerName: "ID", minWidth: 130 },
    { field: "username", headerName: "Name", minWidth: 150 },
    { field: "userType", headerName: "User Type", minWidth: 120 },
    { field: "phone", headerName: "Phone", minWidth: 120 },
    //  { field: "location", headerName: "Location", minWidth: 200 },
    // { field: "details", headerName: "Details", minWidth: 200 },
    // { field: "subject", headerName: "Subject", minWidth: 150 },
    // { field: "start_date", headerName: "Start Date", minWidth: 150 },
    // { field: "lesson_type", headerName: "Lesson Type", minWidth: 100 },
    // { field: "gender", headerName: "Gender", minWidth: 60 },
    // { field: "budget", headerName: "Budget", minWidth: 60 },
    // { field: "days_per_week", headerName: "Days/Week", minWidth: 60 },
    // { field: "start_immediate", headerName: "Start Immediately", minWidth: 60 },
    // { field: "additional_comment", headerName: "Additional Comment", minWidth: 200 },
    {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (


            <Box display="flex" justifyContent="center" className="mt-3" gap={1}>

                <BiSolidUserDetail title="View"
                    size={29}
                    color="#f0523a"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleViewModal(params.row)} />

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


const InactiveUser = () => {
    const [rows, setRows] = useState([]);
    const [view, setView] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [deleteData, setDeleteData] = useState({});
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");



    useEffect(() => {
        setLoading(true);
        fetch(`${BASE_URL}/api/admin/inactive-user-list/`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    username: item.username || "No Username",
                    userType: item.user_type || "No Type",
                    customizedUserId: item.customized_user_id || "No ID",
                    phone: item.phone || "No Phone",
                    handleViewModal: () => handleOpenViewModal(item), // Pass item for modal view
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);


    useEffect(() => {
        const result = rows.filter((row) =>
            Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRows(result);
    }, [searchQuery, rows]);



    const handleDeleteRequest = (row) => {
        setDeleteData(row);
        setOpenDeleteModal(true);

    };

    const handleOpenViewModal = (row) => {
        setOpenViewModal(true)
        setView(row)
    }

    const handleCloseViewModal = () => {
        setOpenViewModal(false)
    }



    const handleDelete = (e) => {
        e.preventDefault();
        fetch(`${BASE_URL}/api/admin/unapprove-request-tutor/${deleteData.id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    setRows((prevRows) => prevRows.filter((row) => row.id !== deleteData.id));
                    setOpenDeleteModal(false);
                    setSnackbarMessage("Tutor request deleted successfully.");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                } else {
                    console.error("Failed to delete request.");
                    setSnackbarMessage("Failed to delete tutor request.");
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                }
            })
            .catch((error) => {
                console.error("Error processing request:", error);
                setSnackbarMessage("Error occurred while deleting the request.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${BASE_URL}/api/admin/edit-approved-request-tutor/${editData.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData),
        })
            .then((response) => {
                if (response.ok) {
                    setRows((prevRows) =>
                        prevRows.map((row) => (row.id === editData.id ? editData : row))
                    );
                    setOpen(false);
                    setSnackbarMessage("Tutor request updated successfully.");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                } else {
                    console.error("Failed to update.");
                    setSnackbarMessage("Failed to update tutor request.");
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                }
            })
            .catch((error) => {
                console.error("Error updating data:", error);
                setSnackbarMessage("Error occurred while updating the request.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            });
    };



    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };



    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>

            <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center  text-end gap-1">
                <Typography variant="text-base" className="flex h5">
                    <strong className="text-gray-500">Inactive User:{rows.length} </strong>
                </Typography>
                <div className="flex justify-end">
                    <TextField
                        label="Search Tutor Requests"
                        variant="outlined"
                        value={searchQuery}
                        size="small"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ marginBottom: "1rem", width: "300px" }}
                    />
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
                        minWidth: col.minWidth || 150,
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
                        "& .MuiDataGrid-columnHeader:focus": {
                            outline: "none", // Remove outline on column header focus
                        },
                        "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none", // Remove outline when child element inside column header is focused
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto", // Ensure horizontal scroll for table content
                        },
                    }}

                />
            )}



            <Dialog open={openViewModal} onClose={handleCloseViewModal}>

                <div
                    style={{
                        padding: "1.5rem",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                    }}
                >
                    {/* Header Section */}
                    <Box
                        className="flex items-center justify-between gap-5"
                    >
                        <Box className="flex gap-4 flex-col">
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                               Name: {view?.username || "No Name"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#777" }}>
                                {view?.customized_user_id || "No Customized ID"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#777" }}>
                                <strong>User Type:</strong> {view?.user_type || "No User Type"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#777" }}>
                                {view?.phone || "No Customized ID"}
                            </Typography>
                        </Box>
                        <Box>


                        </Box>
                    </Box>




                    {/* Cancel Button */}
                    <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                fontWeight: "bold",
                                "&:hover": { backgroundColor: "#0056b3" },
                            }}
                            onClick={handleCloseViewModal}
                        >
                            Close
                        </Button>
                    </Box>
                </div>

            </Dialog>





            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this tutor request?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box>
    );
};




export default InactiveUser;




