import React, { useState, useEffect } from "react";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, LinearProgress, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BiSolidUserDetail } from "react-icons/bi";
import { IoMdCheckboxOutline } from "react-icons/io";

// Columns definition for DataGrid
const columns = [
    { field: "customizeId", headerName: "ID", flex: 0.1 },
    // { field: "full_name", headerName: "Name", flex: 0.1 },
    { field: "location", headerName: "Location", flex: 0.1 ,  minWidth:120 },
    { field: "phone", headerName: "Phone", maxWidth: 120, minWidth:120 },
    { field: "label", headerName: "Class",  maxWidth: 70 , minWidth:70 },
    { field: "subject", headerName: "Subject", flex: 0.1 , minWidth:120 },
    { field: "gender", headerName: "Gender",  maxWidth: 70, minWidth:70 },
    { field: "days_per_week", headerName: "Days/Week",  maxWidth: 10  },
    { field: "charge_per_month", headerName: "Charge",  maxWidth: 65 , minWidth:60},
    {
        field: "actions",
        headerName: "Actions",
        maxWidth: 120 , minWidth:120,
        renderCell: (params) => (
            <Box className="flex justify-around mt-2">
                <BiSolidUserDetail
                    title="View"
                    size={28}
                    color="#f0523a"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleViewModal(params)}
                />

                <IoMdCheckboxOutline
                    title="View"
                    size={28}
                    color="green"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleApproveModal(params)}
                />
            </Box>
        ),
    },
];

const ConnectedTutor = ({ onApprove }) => {
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [approve, setApprove] = useState([]);
    const [openApproveModal, setOpenApproveModal] = useState(false);

    // Fetch data from the API
    useEffect(() => {
        setLoading(true)
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch("https://tutorwise-backend.vercel.app/api/admin/non-pro-tutor-list")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.tutor_personal_info.id,
                    profile_picture: item.tutor_personal_info.profile_picture ? `${BASE_URL}${item.tutor_personal_info.profile_picture}` : null,
                    phone: item.tutor_personal_info.phone,
                    customizeId: item.tutor_personal_info.customized_user_id,
                    full_name: item.tutor_personal_info.full_name,
                    location: `${item.tutor_personal_info.district}, ${item.tutor_personal_info.location}`,
                    subject: item.tutor_tuition_info.subject,
                    gender: item.tutor_personal_info.gender,
                    label: item.tutor_tuition_info.i_will_teach,
                    days_per_week: item.tutor_tuition_info.days_per_week,
                    charge_per_month:Number(Number(item.tutor_tuition_info.charge_per_month).toFixed(0)),
                    handleViewModal: (params) => handleOpenViewModal(item),
                    handleApproveModal: handleOpenApproveModal
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
                setLoading(false)
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Filter data based on search query
    useEffect(() => {
        const result = rows.filter((row) =>
            Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRows(result);
    }, [searchQuery, rows]);



    const handleOpenViewModal = (item) => {
        setView(item)
        setOpenViewModal(true)


    }
    const handleCloseViewModal = () => {
        setOpenViewModal(false)
    }




    const handleOpenApproveModal = (item) => {
        setApprove(item)
        setOpenApproveModal(true)


    }
    const handleCloseApproveModal = () => {
        setOpenApproveModal(false)
    }

    const handleApprove = (approve) => {
        if (onApprove) {
            onApprove(approve);
            setOpenApproveModal(false)
        }
    };


    return (
        <Box className="w-70 sm:w-100 h-96  p-2 " >

            <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center  text-end gap-1 mb-1">
                <Typography variant="text-base" className="flex h5">
                    <strong className="text-gray-500">Total:{rows.length} </strong>
                </Typography>

                <div className="flex justify-end">
                    <TextField
                        label="Search Tutors"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
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
                        minWidth: col.minWidth ,
                         maxWidth:col.maxWidth
                    }))}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick

                    sx={{
                        "& .MuiDataGrid-root": {
                            overflowX: "auto", // Horizontal scroll allow করে
                        },
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                            borderBottom: "2px solid #1976d2",
                            fontSize: "0.9rem", // ছোট স্ক্রিনে font size adjust
                        },
                        "& .MuiDataGrid-cell": {
                            border: "1px solid #e0e0e0",
                            whiteSpace: "normal", // টেক্সট wrap করার জন্য
                            wordWrap: "break-word",
                            fontSize: "0.8rem", // ছোট স্ক্রিনে font size adjust
                        },
                        "& .MuiDataGrid-cell:focus": {
                            outline: "none",
                        },
                        "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none", // Remove outline when child element inside column header is focused
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto", // Horizontal scroll support
                        },
                        "& .MuiDataGrid-footerContainer": {
                            justifyContent: "center", // Pagination center-align
                        },
                    }}
                />
            )}





            <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth maxWidth="md">
                {/* Content */}
                <DialogContent>
                    <div
                        sx={{
                            padding: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            borderRadius: 4,
                            boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
                            backgroundColor: '#f9f9f9',
                            margin: 'auto',
                        }}
                    >
                        {/* Header Section */}
                        <Box className="flex justify-between items-center flex-col md:flex-row lg:flex-row"
                            sx={{
                                gap: 3,
                                paddingBottom: 2,
                                marginBottom: 1,
                                borderBottom: '1px solid #ddd',
                            }}
                        >
                            {/* Left: Profile Image */}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: "center" }}>
                                <img
                                    src={view.tutor_personal_info?.profile_picture ? `https://tutorwise-backend.vercel.app${view.tutor_personal_info.profile_picture}` : '/default-image.jpg'}
                                    alt="Profile"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #ddd',
                                    }}
                                />
                                <div>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        {view?.tutor_personal_info?.full_name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                        {view?.tutor_personal_info?.phone || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                        {view?.tutor_personal_info?.university_name || 'N/A'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={view?.tutor_personal_info?.is_verified || false} disabled />}
                                            label="Verified"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={view?.tutor_personal_info?.is_pro_tutor || false} disabled />}
                                            label="Pro Tutor"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={view?.tutor_personal_info?.university_ongoing || false} disabled />}
                                            label="University Ongoing"
                                        />

                                    </Box>
                                </div>
                            </Box>

                            {/* Right: Name, Phone, ID, University Name */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>

                                <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                    <strong>ID:</strong> {view?.tutor_personal_info?.id || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    {view?.tutor_personal_info?.location || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    {view?.tutor_tuition_info?.i_will_teach || 'N/A'}
                                </Typography>
                                <Typography sx={{ color: '#777' }} variant="body1">
                                    <strong>Apply Number:</strong> {view?.tutor_personal_info?.apply_number || 'N/A'}
                                </Typography>
                                <Typography sx={{ color: '#777' }} variant="body1">
                                    <strong  >Duration:</strong> {view?.tutor_personal_info?.pro_tutor_package_duration || 'N/A'} <strong  >Month</strong>
                                </Typography>


                            </Box>
                        </Box>

                        {/* Body Section */}
                        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                            {/* Left Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body1">
                                    <strong>Subject:</strong> {view?.tutor_tuition_info?.subject || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Charge Per Month:</strong> {view?.tutor_tuition_info?.charge_per_month || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Days Per Week:</strong> {view?.tutor_tuition_info?.days_per_week || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Gender:</strong> {view?.tutor_personal_info?.gender || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Location:</strong>{view?.tutor_personal_info?.district || 'N/A'} {view?.tutor_personal_info?.division || 'N/A'}
                                </Typography>


                            </Box>

                            {/* Right Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>

                                <Typography variant="body1">
                                    <strong>College Section:</strong> {view?.tutor_personal_info?.college_background_section || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>College Name:</strong> {view?.tutor_personal_info?.college_name || 'N/A'}
                                </Typography>
                                <Divider />
                                <Divider />
                                <Typography variant="body1">
                                    <strong>University Name:</strong> {view?.tutor_personal_info?.university_name || 'N/A'}
                                </Typography>

                                <Divider />
                                <Typography variant="body1">
                                    <strong>University Level:</strong> {view?.tutor_personal_info?.university_educational_level || 'N/A'}
                                </Typography>

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

            <Dialog open={openApproveModal} onClose={handleCloseApproveModal}>
                <DialogTitle>Confirm Assigning</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to Assign this tutor for this student?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseApproveModal}>Cancel</Button>
                    <Button onClick={() => handleApprove(approve)} color="success">Approve</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default ConnectedTutor;
