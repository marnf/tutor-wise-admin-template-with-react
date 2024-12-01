import React, { useState, useEffect } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    TextareaAutosize,
    TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

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


const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "details", headerName: "Details", flex: 2 },
    { field: "subject", headerName: "Subject", flex: 1 },
    { field: "start_date", headerName: "Start Date", flex: 1 },
    { field: "class_name", headerName: "Class", flex: 1 },
    { field: "lesson_type", headerName: "Lesson Type", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "budget", headerName: "Budget", flex: 1 },
    { field: "days_per_week", headerName: "Days/Week", flex: 1 },
    { field: "start_immediate", headerName: "Start Immediately", flex: 1 },
    { field: "additional_comment", headerName: "Additional Comment", flex: 2 },
    {
        field: "actions",
        headerName: "Actions",
        flex: 2,
        renderCell: (params) => (


            <Box display="flex" justifyContent="end" className="mt-3" gap={1}>

                <FaUserEdit title="Edit"
                    size={25}
                    color="black"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleEdit(params.row)} />

                <MdDelete title="Delete"
                    size={25}
                    color="red"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleDelete(params.row)}
                />
            </Box>

        ),
    },
];

const ApprovedTutorRequest = () => {
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [deleteData, setDeleteData] = useState({});

    useEffect(() => {
        fetch("https://tutorwise-backend.vercel.app/api/admin/approve-request-tutor-list/")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    ...item,
                    start_immediate: item.start_immediate ? "Yes" : "No",
                    handleEdit: handleEditRequest,
                    handleDelete: handleDeleteRequest,
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const result = rows.filter((row) =>
            Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRows(result);
    }, [searchQuery, rows]);

    const handleEditRequest = (row) => {
        setEditData({
            ...row,
            start_immediate: row.start_immediate === "Yes", // Correctly set the start_immediate value
        });
        setOpen(true);
    };

    const handleDeleteRequest = (row) => {
        setDeleteData(row);
        setOpenDeleteModal(true);

    };

    const handleDelete = (e) => {
        e.preventDefault();
        fetch(`https://tutorwise-backend.vercel.app/api/admin/unapprove-request-tutor/${deleteData.id}/`, {
            method: "POST", // Using POST as per your requirement
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData), // Send the data you want to transfer elsewhere
        })
            .then((response) => {
                if (response.ok) {
                    // Perform the transition logic to move data elsewhere
                    setRows((prevRows) =>
                        prevRows.filter((row) => row.id !== editData.id) // Removing the item after successful POST

                    );
                    setOpenDeleteModal(false); // Close the modal after operation
                    window.location.reload();
                } else {
                    console.error("Failed to process request.");
                }
            })
            .catch((error) => console.error("Error processing request:", error));
    };





    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`https://tutorwise-backend.vercel.app/api/admin/edit-approved-request-tutor/${editData.id}/`, {
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
                } else {
                    console.error("Failed to update.");
                }
            })
            .catch((error) => console.error("Error updating data:", error));
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };



    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 className="text-center font-bold h3">Approved Tutor Request List</h2>
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
                                    value={editData.name || ""}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Location"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.location || ""}
                                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
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
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.start_date || ""}
                                    onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
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
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="others" control={<Radio />} label="Others" />
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
                                    value={editData.budget || ""}
                                    onChange={(e) => setEditData({ ...editData, budget: e.target.value })}
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
                                    value={editData.class_name || ""}
                                    onChange={(e) => setEditData({ ...editData, class_name: e.target.value })}
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

        </Box>
    );
};

export default ApprovedTutorRequest;




