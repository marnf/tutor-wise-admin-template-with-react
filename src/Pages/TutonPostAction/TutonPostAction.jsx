import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Snackbar,
    Alert,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    MenuItem,
    Autocomplete,
    TextareaAutosize,
    Checkbox,
    LinearProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const columns = (handleEditClick, handleDeleteClick) => [
    { field: "serial", headerName: "Serial Number", minWidth: 40 },  // Default minWidth: 150
    { field: "id", headerName: "ID", minWidth: 40 },
    { field: "created_at", headerName: "Create Date", minWidth: 200 },
    { field: "student_name", headerName: "Student Name", minWidth: 150 },
    { field: "phone", headerName: "Phone", minWidth: 120 },
    { field: "subject", headerName: "Subject", minWidth: 150 },
    { field: "lesson_type", headerName: "Lesson Type", minWidth: 70 },
    { field: "days_per_week", headerName: "Days Per Week", minWidth: 50 },
    { field: "budget_amount", headerName: "Budget", minWidth: 50 },
    { field: "tuition_start_date", headerName: "Tuition Start Date", minWidth: 200 },
    { field: "educational_level_choices", headerName: "Educational Level", minWidth: 100 },
    { field: "gender", headerName: "Gender", minWidth: 60 },
    { field: "curriculum", headerName: "Curriculum", minWidth: 150 },
    {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (
            <Box display="flex" justifyContent="center" gap={1}>
                <FaUserEdit
                    title="Edit"
                    size={25}
                    className="cursor-pointer"
                    onClick={() => handleEditClick(params.row)}
                />
                <MdDelete
                    title="Delete"
                    size={25}
                    color="red"
                    className="cursor-pointer"
                    onClick={() => handleDeleteClick(params.row.id)}
                />
            </Box>
        ),
    },
];




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

const TutorPostAction = () => {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);  // Original data
    const [searchText, setSearchText] = useState("");  // Search query
    const [editData, setEditData] = useState({});  // For editing data
    const [open, setOpen] = useState(false);  // Dialog open state
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [filteredRows, setFilteredRows] = useState([]);  // Filtered data for search
    const [deleteId, setDeleteId] = useState([]);  // Filtered data for search

    // Fetch data on initial load
    useEffect(() => {
        const fetchData = () => {
            setLoading(true);

            fetch("https://tutorwise-backend.vercel.app/api/admin/tuition/list/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    return response.json();
                })
                .then((data) => {
                    const dataWithSerial = data.map((item, index) => ({
                        ...item,
                        serial: index + 1
                    }));

                    setRows(dataWithSerial);
                    setFilteredRows(dataWithSerial);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        };

        fetchData();
    }, []);




    // Handle search functionality
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);

        // Filter rows based on search
        const filtered = rows.filter((row) =>
            Object.values(row).some((field) =>
                String(field).toLowerCase().includes(value)
            )
        );
        setFilteredRows(filtered);  // Update filtered rows
    };

    // Handle editing
    const handleEditClick = (row) => {
        setEditData(row);
        setOpen(true);
    };

    // Handle dialog close
    const handleClose = () => setOpen(false);

    // Handle delete action
    const handleDeleteClick = (row) => {
        setOpenDeleteModal(true);
        setDeleteId(row)
        console.log(row)
    };

    const handleDeleteConfirm = () => {
        fetch(`http://192.168.0.154:8000/api/admin/delete-tuition-post/${deleteId}/`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    setSnackbarMessage("Tutor request deleted successfully!");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                    setRows(rows.filter((row) => row.id !== deleteId)); // Correctly filter using deleteId
                    setOpenDeleteModal(false); // Close the modal after deletion
                } else {
                    setSnackbarMessage("Failed to delete the tutor request.");
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                }
            })
            .catch((error) => {
                setSnackbarMessage("An error occurred while deleting.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                setOpenDeleteModal(false); // Close modal on error as well
            });

    }

    // Handle form submit for editing
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Form Data:", editData);

        fetch(`http://192.168.0.154:8000/api/admin/edit-tuition-post/${editData.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData),
        })

            .then((updatedData) => {
                setRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === updatedData.id ? { ...row, ...updatedData } : row
                    )
                );
                setFilteredRows((prevFilteredRows) =>
                    prevFilteredRows.map((row) =>
                        row.id === updatedData.id ? { ...row, ...updatedData } : row
                    )
                );
                setOpen(false);
                setSnackbarMessage("Successfully done");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            })
            .catch((error) => {
                console.error("Error updating data:", error);
                setOpen(false);
            });
    };

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>

            <Box display="flex" justifyContent="flex-end" mb={1}>
                <TextField
                    placeholder="Search..."
                    value={searchText}
                    onChange={handleSearch}
                    variant="outlined"
                    
                    size="small"
                    right
                    fullWidth
                    sx={{  width: '300px' }}
                />
            </Box>

            {loading ? (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            ) : (

                <DataGrid
                    rows={filteredRows}  // filtered rows
                    columns={columns(handleEditClick, handleDeleteClick).map((col) => ({
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
                            borderBottom: "2px solid #1976d2",
                        },
                        "& .MuiDataGrid-cell": {
                            border: "1px solid #e0e0e0",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        },
                        "& .MuiDataGrid-cell:focus": {
                            outline: "none",
                        },
                        "& .MuiDataGrid-root": {
                            overflowX: "auto",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto",
                        },
                    }}
                />



            )}

            {/* Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Edit Tutor Request</DialogTitle>
                <DialogContent>
                    <form className="mt-2" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Name and Location */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.student_name || ""}
                                    onChange={(e) => setEditData({ ...editData, student_name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Location"
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                    value={editData.user_location || ""}
                                    onChange={(e) => setEditData({ ...editData, user_location: e.target.value })}
                                />
                            </Grid>

                            {/* Phone and Start Date */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.phone || ""}
                                    disabled

                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.tuition_start_date || ""}
                                    onChange={(e) => setEditData({ ...editData, tuition_start_date: e.target.value })}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            {/* Gender and Lesson Type */}
                            <Grid item xs={12} sm={6}>
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup
                                    row
                                    value={editData.gender || ""}
                                    onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                >
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    {/* <FormControlLabel value="Others" control={<Radio />} label="Others" /> */}
                                </RadioGroup>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormLabel>Lesson Type</FormLabel>
                                <RadioGroup
                                    row
                                    value={editData.lesson_type || ""}
                                    onChange={(e) => setEditData({ ...editData, lesson_type: e.target.value })}
                                >
                                    <FormControlLabel value="Online" control={<Radio />} label="Online" />
                                    <FormControlLabel value="Offline" control={<Radio />} label="Offline" />
                                    <FormControlLabel value="Both" control={<Radio />} label="Both" />
                                </RadioGroup>
                            </Grid>

                            {/* Budget and Days Per Week */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Budget"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.budget_amount || ""}
                                    onChange={(e) => setEditData({ ...editData, budget_amount: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Days Per Week"
                                    select
                                    fullWidth
                                    value={editData.days_per_week || ""}
                                    onChange={(e) => setEditData({ ...editData, days_per_week: e.target.value })}
                                >
                                    {[1, 2, 3, 4, 5, 6].map((day, index) => (
                                        <MenuItem key={index} value={day}>
                                            {`${day} day${day > 1 ? 's' : ''}`}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Subject and Class */}
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    freeSolo
                                    options={subjectOptions}
                                    value={editData.subject || ""}
                                    onInputChange={(e, newValue) => setEditData({ ...editData, subject: newValue })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Subject"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                />

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Class"
                                    select
                                    fullWidth
                                    value={editData.educational_level_choices || ""}
                                    onChange={(e) => setEditData({ ...editData, educational_level_choices: e.target.value })}
                                >
                                    {[
                                        "Class 1",
                                        "Class 2",
                                        "Class 3",
                                        "Class 4",
                                        "Class 5",
                                        "Class 6",
                                        "Class 7",
                                        "Class 8",
                                        "Class 9",
                                        "Class 10",
                                    ].map((cls, index) => (
                                        <MenuItem key={index} value={cls}>
                                            {cls}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Details and Additional Comment */}
                            <Grid item xs={12} sm={6}>
                                <TextareaAutosize
                                    minRows={4}
                                    disabled
                                    placeholder="Details"
                                    value={editData.details || ""}
                                    onChange={(e) => setEditData({ ...editData, details: e.target.value })}
                                    style={{ width: "100%", border: "1px solid gray", padding: "10px", borderRadius: "5px" }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextareaAutosize
                                    minRows={4}
                                    placeholder="Additional Comment"
                                    value={editData.additional_comment || ""}
                                    onChange={(e) => setEditData({ ...editData, additional_comment: e.target.value })}
                                    style={{ width: "100%", border: "1px solid gray", padding: "10px", borderRadius: "5px" }}
                                />
                            </Grid>


                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={editData.start_immediate || false}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    start_immediate: e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Start Immediately"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DialogActions>
                                    <Button onClick={handleClose} variant="outlined" color="secondary">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </DialogActions>
                            </Grid>

                            {/* Buttons */}

                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>


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

export default TutorPostAction;
