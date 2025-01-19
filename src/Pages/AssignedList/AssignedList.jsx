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
    Autocomplete,
    Snackbar,
    Alert,
    LinearProgress,
    Typography,
    Divider,
    FormControlLabel,
    Checkbox,
    Avatar, // Import Grid component
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { BiSolidUserDetail } from "react-icons/bi";
import { decryptData } from "../../EncryptedPage";
import BASE_URL from '../../Api/baseUrl';

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

    {
        field: "type",
        headerName: "Type",
        minWidth: 60,
        maxWidth: 60,
        renderCell: () => (
            <span style={{ fontWeight: "bold" }}>Tutor</span>
        ),
    },
    { field: "tutor_customized_id", headerName: "ID", minWidth: 130 },
    { field: "tutorName", headerName: "Tutor Name", minWidth: 150 },

    {
        field: "type_student",
        headerName: "Type",
        minWidth: 80,
        maxWidth: 80,
        renderCell: () => (
            <span style={{ fontWeight: "bold" }}>Student</span>
        ),
    },
    { field: "studentCustomizedId", headerName: "Student Id", minWidth: 130 },
    { field: "studentName", headerName: "Student Name", minWidth: 150 },
    { field: "budget", headerName: "Budget", minWidth: 70, maxWidth: 70 },
    {
        field: "actions",
        headerName: "Actions",
        minWidth: 150,
        flex: 0.1,
        renderCell: (params) => (

            <Box display="flex" justifyContent="center" className="mt-3" gap={1}>

                {/* <FaUserEdit title="Edit"
                    size={25}
                    color="black"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleEdit(params.row)} /> */}


                <FaUserEdit
                    title="Edit"
                    size={25}
                    color="gray"
                    className="transition ease-in-out delay-250 hover:scale-100 cursor-not-allowed"
                    style={{
                        pointerEvents: "none",
                        opacity: 0.5,
                    }}
                />


                <BiSolidUserDetail title="View"
                    size={36}
                    color="#f0523a"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer pb-2"
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

const AssignedList = () => {

    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [deleteData, setDeleteData] = useState({});
    const [formData, setFormData] = useState({}); // Initialize formData state
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
    const [view, setView] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);


    useEffect(() => {
        setLoading(true);
        fetch(`${BASE_URL}/api/admin/all-tuition-connect-list`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    ...item,
                    location: `${item.tutor_division}, ${item.tutor_district}`,
                    tutorName: item.tutor_name || "Not Provided",
                    studentName: item.student_name || "Not Provided",

                    tutorCustomizedId: item.tutor_customized_id,
                    studentCustomizedId: item.student_customized_id,
                    acceptedDate: new Date(item.accepted_date).toLocaleString(),
                    paymentOption: item.payment_option,

                    budget: Number(Number(item.budget).toFixed(0)),
                    connectType: item.connect_type,
                    handleEdit: handleEditRequest,
                    handleDelete: handleDeleteRequest,
                    handleViewModal: handleOpenViewModal,
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
                setLoading(false);
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
        setDeleteData(row)
        setOpenDeleteModal(true);
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${BASE_URL}/api/admin/edit-approve-hire-tutor-request/${formData.id}/`, {
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
        fetch(`${BASE_URL}/api/admin/unapproved-request/${deleteData.id}/`, {
            method: "POST", // You may want to change this to DELETE, depending on the API
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deleteData), // Send the data you want to transfer elsewhere
        })
            .then((response) => {
                if (response.ok) {
                    // Remove the item from the rows after successful deletion
                    setRows((prevRows) =>
                        prevRows.filter((row) => row.id !== deleteData.id)
                    );
                    setOpenDeleteModal(false); // Close the modal after deletion
                    window.location.reload(); // Reload to update the data
                } else {
                    console.error("Failed to delete the request.");
                }
            })
            .catch((error) => console.error("Error processing the request:", error));
    };




    const handleOpenViewModal = (row) => {
        setOpenViewModal(true)
        setView(row)


    }
    const handleCloseViewModal = () => {
        setOpenViewModal(false)
    }


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

            <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center  text-end gap-1">
                <Typography variant="text-base" className="flex h5">
                    <strong className="text-gray-500">Assigned Tutor:{rows.length} </strong>
                </Typography>
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
                        minWidth: col.minWidth || 150, // Minimum width for each column (adjust as needed)
                    }))}
                    pageSize={10}
                    getRowId={(row) => row.tutor_customized_id || row.student_customized_id}
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
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto", // Ensure horizontal scroll for table content
                        },
                        "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none", // Remove outline when child element inside column header is focused
                        },
                    }}
                />
            )}



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


            {/* view modal */}
            <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth>
                <DialogContent>
                    <div
                        sx={{
                            padding: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: 4,
                            boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
                            backgroundColor: '#f9f9f9',
                            maxWidth: '700px',
                            margin: 'auto',
                        }}
                    >
                        {/* Header Section */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 3,
                                paddingBottom: 2,
                                marginBottom: 1,
                                borderBottom: '1px solid #ddd',
                            }}
                        >
                            {/* Left: Tutor Profile Picture and Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    alt="Tutor Profile"

                                    src={view.tutor_profile_picture ? `${BASE_URL}${view.tutor_profile_picture}` : '/default-image.jpg'}
                                    sx={{ width: 60, height: 60 }}
                                />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                        {view?.tutor_name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                        {view?.tutor_customized_id || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Right: Student Profile Picture and Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    alt="Student Profile"
                                    src={view.student_profile_picture ? `${BASE_URL}${view.student_profile_picture}` : '/default-image.jpg'}
                                    sx={{ width: 60, height: 60 }}
                                />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                        {view?.student_name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                        {view?.student_customized_id || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Body Section: Two Equal Columns */}
                        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                            {/* Left Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body1">
                                    <strong>Payment Option:</strong> {view?.payment_option || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Connected Date: <br /></strong> {view?.accepted_date ? new Date(view.accepted_date).toLocaleString() : 'N/A'}
                                </Typography>

                                <Divider />

                            </Box>

                            {/* Right Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>

                                <Typography variant="body1">
                                    <strong>Connect Type:</strong> {view?.connect_type || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Budget:</strong> {view?.budget || 'N/A'}
                                </Typography>
                                <Divider />


                            </Box>
                        </Box>

                        {/* Footer Section: Cancel Button */}
                        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#ff5722',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '0.5rem 2rem',
                                    '&:hover': {
                                        backgroundColor: '#e64a19',
                                    },
                                }}
                                onClick={handleCloseViewModal}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </div>
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

export default AssignedList;
