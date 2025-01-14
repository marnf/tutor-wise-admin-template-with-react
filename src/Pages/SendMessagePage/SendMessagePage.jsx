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
    Checkbox, // Import Grid component
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidMessageDetail, BiSolidSelectMultiple, BiSolidUserDetail } from "react-icons/bi";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { decryptData } from "../../EncryptedPage";


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
    { field: "tutor_customized_user_id", headerName: "ID", minWidth: 130 },
    {
        field: "type",
        headerName: "Type",
        minWidth: 60,
        renderCell: () => (
            <span style={{ fontWeight: "bold" }}>Tutor</span>
        ),
    },
    { field: "tutor_name", headerName: "Tutor Name", minWidth: 150 },
    { field: "tutor_phone", headerName: "Phone", minWidth: 120 },
    // { field: "location", headerName: "Location", minWidth: 200 },
    // { field: "tutor_charge", headerName: "Charge", minWidth: 60 },
    {
        field: "type_student",
        headerName: "Type",
        minWidth: 60,
        renderCell: () => (
            <span style={{ fontWeight: "bold" }}>Student</span>
        ),
    },
    { field: "name", headerName: "Student Name", minWidth: 150 },
    { field: "phone", headerName: "Phone", minWidth: 120 },
    // { field: "medium", headerName: "Medium", minWidth: 1 },
    // { field: "start_date", headerName: "Start Date", minWidth: 150 },
    // { field: "subjects", headerName: "Subject", minWidth: 100 },
    {
        field: "actions",
        headerName: "Actions",
        minWidth: 150,
        flex: 0.1,
        renderCell: (params) => (

            <Box display="flex" justifyContent="end" className="mt-3" gap={1}>


                <BiSolidMessageDetail title="Message"
                    size={29}
                    color="#0d2849"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleViewModal(params.row)} />

                <MdDelete
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
                />



            </Box>
        ),
    },
];

const SendMessagePage = () => {
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    
    const [editData, setEditData] = useState({});
  
 
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
    const [view, setView] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openSendMessageModal, setOpenSendMessageModal] = useState(false);
    const [allMessage, setAllMessage] = useState([]);
  


    useEffect(() => {
        setLoading(true)
        fetch("https://tutorwise-backend.vercel.app/api/admin/view-hire-request-tutor/")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    ...item,
                    location: `${item.tutor_division}, ${item.tutor_district}`,
                    handleDelete: handleDeleteRequest,
                    handleViewModal: handleOpenViewModal

                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
                setLoading(false)
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const result = rows.filter((row) =>
            Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRows(result);
    }, [searchQuery, rows]);

    

    const handleDeleteRequest = (row) => {

        setOpenDeleteModal(true); // Open the delete modal
    };




    const handleDelete = () => {
        fetch(`https://tutorwise-backend.vercel.app/api/admin/delete-hire-tutor-request/${editData.id}/`, {
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


    const handleOpenViewModal = (row) => {
        setOpenViewModal(true)
        setView(row)


    }
    const handleCloseViewModal = () => {
        setOpenViewModal(false)
    }


    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const handleSendMessageModal = () => {
        setOpenSendMessageModal(true)
    }

    const handleCloseSendMessageModal = () => {
        setOpenSendMessageModal(false)
    }

    const handleMessageApprove = () => {
        console.log(allMessage); // Log the message when the button is clicked
        setOpenSendMessageModal(false);
    };

    const handleMessageChange =(e)=>{
        setAllMessage (e.target.value)
    }

    return (
        <Box sx={{
            height: "80vh",
            width: "100%",
            padding: 2,
            overflowX: "auto", // Ensure horizontal scroll for all devices
        }}>

            <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center  text-end gap-1">
                <Typography variant="text-base" className="flex h5">
                    <strong className="text-gray-500">All users:{rows.length} </strong>
                </Typography>
                <div className="flex justify-end items-center gap-2">
                    <BiSolidMessageDetail
                        title="send message"
                        size={39}
                        color="#0d2849"
                        onClick={handleSendMessageModal}
                        className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer pb-1"
                    />
                    <TextField className="mb-1"
                        label="Search Requests"
                        variant="outlined"
                        value={searchQuery}
                        size="small"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "300px" }}
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
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto", // Ensure horizontal scroll for table content
                        },
                        "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none", // Remove outline when child element inside column header is focused
                        },
                    }}
                />
            )}





            {/* view details modal */}

            <Dialog open={openViewModal} onClose={handleCloseViewModal} maxWidth="md" fullWidth>
                <div className="flex flex-row gap-1">
                    <DialogContent >
                        <div className="w-100"
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
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        {view?.name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                        {view?.phone || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem', color: '#555', textAlign: 'right' }}>
                                        <strong>ID:</strong> {view?.id || 'N/A'}
                                    </Typography>
                                    <Typography variant="body1">
                                        {view?.start_date ? new Date(view.start_date).toLocaleString() : 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Body Section */}
                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                {/* Left Column */}
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body1">
                                        <strong>Tutor Name:</strong> {view?.tutor_name || 'N/A'}
                                    </Typography>
                                    <Divider />
                                    <Typography variant="body1">
                                        <strong>Tutor Phone:</strong> {view?.tutor_phone || 'N/A'}
                                    </Typography>
                                    <Divider />
                                    <Typography variant="body1">
                                        <strong>Tutor Division:</strong> {view?.tutor_division || 'N/A'}
                                    </Typography>
                                    <Divider />
                                    <Typography variant="body1">
                                        <strong>Tutor District:</strong> {view?.tutor_district || 'N/A'}
                                    </Typography>
                                    <Divider />
                                </Box>

                                {/* Right Column */}
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body1">
                                        <strong>Tutor Charge:</strong> {view?.tutor_charge || 'N/A'}
                                    </Typography>
                                    <Divider />
                                    <Typography variant="body1">
                                        <strong>Medium:</strong> {view?.medium || 'N/A'}
                                    </Typography>
                                    <Divider />
                                    <Typography variant="body1">
                                        <strong>Subjects:</strong> {view?.subjects || 'N/A'}
                                    </Typography>
                                    <Divider />
                                    <Typography variant="body1">
                                        <strong>Start Date:</strong> {view?.start_date || 'N/A'}
                                    </Typography>
                                    <Divider />
                                </Box>
                            </Box>

                            {/* Footer Section: Checkboxes */}
                            <Box sx={{ display: 'flex', gap: 2, paddingTop: 2, borderTop: '1px solid #ddd' }}>
                                <FormControlLabel control={<Checkbox checked={view?.is_verified || false} disabled />} label="Verified" />
                                <FormControlLabel control={<Checkbox checked={view?.is_approved || false} disabled />} label="Approved" />
                                <FormControlLabel control={<Checkbox checked={view?.start_immediate || false} disabled />} label="Start Immediately" />
                            </Box>
                        </div>
                    </DialogContent>

                    <div className="p-3 w-50 mt-4"
                        sx={{
                            flex: 1,
                            padding: 5,
                            width: '100%', // Full width for input field
                            gap: 3,
                            borderRadius: 4,
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Write your message here</Typography>
                        <TextField required
                            variant="outlined"
                            rows={8}
                            multiline
                            name="message"
                            sx={{
                                padding: 2,
                                backgroundColor: '#fff',
                                borderRadius: 2,
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                                width: '100%', // Ensures the input field takes the full width of its container
                            }}
                            placeholder="Enter your text here..."
                        />

                        {/* Footer Section: Send and Cancel Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
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
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '0.5rem 2rem',
                                    '&:hover': {
                                        backgroundColor: '#388E3C',
                                    },
                                }}
                            >
                                Send
                            </Button>
                        </Box>
                    </div>
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



            <Dialog open={openSendMessageModal} onClose={handleCloseSendMessageModal} maxWidth="md" fullWidth>
                <DialogTitle className="text-start mb-3">Write your message here</DialogTitle>

                <DialogContent>
                    <TextField
                        variant="outlined"
                        multiline
                        // Increase the height of the input field
                        fullWidth
                        value={allMessage}
                        onChange={handleMessageChange}
                        sx={{
                            padding: 2,
                            backgroundColor: '#fff',
                            borderRadius: 2,
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },

                        }}
                        placeholder="Type your message here..."
                    />
                </DialogContent>

                <DialogActions className="mb-2">
                    <Button onClick={handleCloseSendMessageModal}>Cancel</Button>
                    <Button onClick={handleMessageApprove} color="success">Send Message</Button>
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

export default SendMessagePage;
