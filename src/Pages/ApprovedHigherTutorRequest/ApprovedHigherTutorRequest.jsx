import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    MenuItem,
    Autocomplete, // Import Grid component
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";


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
    {
        field: "type",
        headerName: "Type",
        flex: 1,
        renderCell: () => (
            <span style={{ fontWeight: "bold" }}>Tutor</span>
        ),
    },
    { field: "tutor_name", headerName: "Tutor Name", flex: 1 },
    { field: "tutor_phone", headerName: "Phone", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "tutor_charge", headerName: "Charge", flex: 1 },
    {
        field: "type_student",
        headerName: "Type",
        flex: 1,
        renderCell: () => (
            <span style={{ fontWeight: "bold" }}>Student</span>
        ),
    },
    { field: "name", headerName: "Student Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "medium", headerName: "Medium", flex: 1 },
    { field: "start_date", headerName: "Start Date", flex: 1 },
    { field: "subjects", headerName: "Subject", flex: 1 },
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

const ApprovedHigherTutorRequest = () => {
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [formData, setFormData] = useState({}); // Initialize formData state

    useEffect(() => {
        fetch("https://tutorwise-backend.vercel.app/api/admin/view-approve-reqeust-list/")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    ...item,
                    location: `${item.tutor_division}, ${item.tutor_district}`,
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
        setEditData(row);
        setFormData(row); // Initialize formData with row data for editing
        setOpen(true);
    };

    const handleDeleteRequest = (row) => {
        // Store the row data to be deleted
        setOpenDeleteModal(true); // Open the delete modal
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`https://tutorwise-backend.vercel.app/api/admin/edit-approve-hire-tutor-request/${formData.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), // Send the updated formData
        })
            .then((res) => {
                if (res.ok) {
                    setRows((prevRows) =>
                        prevRows.map((row) => (row.id === formData.id ? formData : row))
                    );
                    setOpen(false);
                } else {
                    console.error("Failed to update.");
                }
            })
            .catch((error) => console.error("Error updating data:", error));
    };


    const handleDelete = () => {
        fetch(`https://tutorwise-backend.vercel.app/api/admin/unapproved-request/${editData.id}/`, {
            method: "POST", // You may want to change this to DELETE, depending on the API
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData), // Send the data you want to transfer elsewhere
        })
            .then((response) => {
                if (response.ok) {
                    // Remove the item from the rows after successful deletion
                    setRows((prevRows) =>
                        prevRows.filter((row) => row.id !== editData.id)
                    );
                    setOpenDeleteModal(false); // Close the modal after deletion
                    window.location.reload(); // Reload to update the data
                } else {
                    console.error("Failed to delete the request.");
                }
            })
            .catch((error) => console.error("Error processing the request:", error));
    };




    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };



    const handleChange = (e) => {
        const { name, value } = e.target; // Get the name and value of the field
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,  // Update the specific field in the formData
        }));
    };


    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 className="text-center font-bold h3">Pending Higher Tutor Requests</h2>
            <div className="flex justify-end">
                <TextField
                    label="Search Requests"
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
                <DialogTitle>Edit Request</DialogTitle>
                <DialogContent>
                    <form className="pt-2" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>

                            {/* ID */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="ID"
                                    name="id"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.id || ""}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    disabled
                                />
                            </Grid>

                            {/* Tutor Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Tutor Name"
                                    name="tutor_name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.tutor_name || ""}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    disabled
                                />
                            </Grid>




                            {/* Tutor Phone */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Tutor Phone"
                                    name="tutor_phone"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.tutor_phone || ""}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    disabled
                                />
                            </Grid>

                            {/* Location */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Location"
                                    name="location"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.location || ""}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    disabled
                                />
                            </Grid>


                            {/* Student Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Student Name"
                                    name="name"  // Make sure the name matches the field in formData
                                    variant="outlined"
                                    fullWidth
                                    value={formData.name || ""}  // Controlled by formData
                                    onChange={handleChange}  // Updates formData when the value changes
                                />
                            </Grid>



                            {/* Charge */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Charge"
                                    name="tutor_charge"  // Make sure the name matches the field in formData
                                    variant="outlined"
                                    fullWidth
                                    value={formData.tutor_charge || ""}  // Controlled by formData
                                    onChange={handleChange}  // Updates formData when the value changes
                                />
                            </Grid>



                            {/* Phone */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.phone || ""}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Medium"
                                    select
                                    fullWidth
                                    value={formData.medium || ""} // Make sure it's controlled by formData
                                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })} // Update formData
                                >
                                    {[
                                        'Diploma',
                                        'Bangla medium',
                                        'English medium',
                                        'English version',
                                        'Dakhil'
                                    ].map((option, index) => (
                                        <MenuItem key={index} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </Grid>



                            {/* Start Date */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Start Date"
                                    name="start_date"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.start_date || ""}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            {/* Subject */}
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    freeSolo
                                    options={subjectOptions}  // The predefined list of subjects
                                    value={editData.subjects || ""}  // Bind value to the subject field in editData
                                    onInputChange={(e, newValue) => setEditData({ ...editData, subject: newValue })}  // Update editData on input change
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



                        </Grid>
                        <DialogActions>
                            <Button onClick={handleClose} variant="outlined" color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </DialogActions>
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

export default ApprovedHigherTutorRequest;
