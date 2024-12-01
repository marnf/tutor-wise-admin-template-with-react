import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextareaAutosize, Grid, MenuItem, Autocomplete, Radio, RadioGroup, FormControlLabel, FormLabel, Checkbox } from "@mui/material"; 


const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "username", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "details", headerName: "Details", flex: 2 },
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
                    style={{ marginRight: 8 }} >
                    Approve
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => params.row.handleDelete(params.row)} >
                    Delete
                </Button>
            </Box>
        ),
    },
];

const PendingTutorRequest = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);  // Modal open state
    const [editData, setEditData] = useState({});  // State to hold the data for editing

    const subjectOptions = [
        "Math",
        "Science",
        "English",
        "History",
        "Geography",
        "Literature",
        "Art",
    ];

    useEffect(() => {
        fetch("https://tutorwise-backend.vercel.app/api/admin/view-request-tutor/")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((request) => ({
                    id: request.id,
                    username: request.username || "Not Available",
                    phone: request.phone || "Not Available",
                    location: request.location || "Not Available",
                    details: request.details || "No Details",
                    handleEdit: handleOpenEditModal,
                    handleDelete: handleDeleteRequest,
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = rows.filter((row) =>
                row.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.phone.includes(searchQuery) ||
                row.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRows(filtered);
        } else {
            setFilteredRows(rows);
        }
    }, [searchQuery, rows]);

    const handleOpenEditModal = (row) => {
        setEditData(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditData({});
    };

    const handleDeleteRequest = (row) => {
        // Implement delete logic here
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 

        console.log("Form Data:", editData); 

        fetch(`https://tutorwise-backend.vercel.app/api/admin/request-tutor-add-info/${editData.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData), 
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error("Failed to update. Status:", response.status);
                    return Promise.reject("Failed to update");
                }
            })
            .then((updatedData) => {
                console.log("Successfully updated:", updatedData);
                window.location.reload(); 
            })
            .catch((error) => {
                console.error("Error updating data:", error);
            });
    };



    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Tutor Request List</h2>

            <div className="flex justify-between items-center">
                <TextField
                    label="Search Tutor Requests"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "300px" }}
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

            {/* Edit Modal */}
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
                                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
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
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Others" control={<Radio />} label="Others" />
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
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Subject"
                                            variant="outlined"
                                            fullWidth
                                            value={editData.subject || ""}
                                            onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
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

                            {/* Checkbox */}
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={editData.start_immediate || false}
                                            onChange={(e) => setEditData({ ...editData, start_immediate: e.target.checked })}
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
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </DialogActions>
                            </Grid>

                            {/* Buttons */}

                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>


        </Box>
    );
};

export default PendingTutorRequest;
