import React, { useState, useEffect } from "react";
import { Box, Divider, FormControlLabel, LinearProgress, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BiSolidUserDetail } from "react-icons/bi";

// Columns definition for DataGrid
const columns = [
    { field: "id", headerName: "ID", minWidth: 40 },
    {
        field: "profile_picture",
        headerName: "Profile Picture",
        minWidth: 80,
        renderCell: (params) => (
            <img src={params.value} alt="Profile" style={{ width: 50, height: 50, borderRadius: "50%" }} />
        )
    },
    { field: "full_name", headerName: "Name", minWidth: 150 },
    { field: "division", headerName: "Division", minWidth: 80 },
    { field: "location", headerName: "Location", minWidth: 150 },
    { field: "subject", headerName: "Subject", minWidth: 100 },
    { field: "gender", headerName: "Gender", minWidth: 60 },
    { field: "days_per_week", headerName: "Days/Week", minWidth: 40 },
    { field: "charge_per_month", headerName: "Charge", minWidth: 40 },
    { field: "phone", headerName: "Phone", minWidth: 150 },
    {
        field: "actions",
        headerName: "Actions",
        minWidth: 150,
        renderCell: (params) => (

            <Box display="flex" justifyContent="end" className="mt-3" gap={1}>

                <BiSolidUserDetail title="View"
                    size={28}
                    color="purple"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleViewModal()} />

            </Box>
        ),
    },
];

const Protutor = () => {
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);

    // Fetch data from the API
    useEffect(() => {
        setLoading(true)
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch("https://tutorwise-backend.vercel.app/api/admin/pro-tutor-list/")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.tutor_personal_info.id,
                    profile_picture: item.tutor_personal_info.profile_picture ? `${BASE_URL}${item.tutor_personal_info.profile_picture}` : null,
                    full_name: item.tutor_personal_info.full_name,
                    division: item.tutor_personal_info.division,
                    location: `${item.tutor_personal_info.district}, ${item.tutor_personal_info.location}`,
                    subject: item.tutor_tuition_info.subject,
                    gender: item.tutor_personal_info.gender,
                    days_per_week: item.tutor_tuition_info.days_per_week,
                    charge_per_month: item.tutor_tuition_info.charge_per_month,
                    phone: item.tutor_personal_info.phone,
                    handleViewModal: handleOpenViewModal
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



    const handleOpenViewModal = (row) => {
        setView(row)
        setOpenViewModal(true)


    }
    const handleCloseViewModal = () => {
        setOpenViewModal(false)
    }

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 className="text-center font-bold h3">Pro Tutors</h2>
            <div className="flex justify-end">
                <TextField
                    label="Search Tutors"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: "1rem", width: "300px" }}
                />
            </div>

            {loading ? (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            ) : (
                <DataGrid
                    rows={filteredRows}
                    columns={columns.map((col) => ({
                        ...col,
                        minWidth: col.minWidth || 150, // Minimum width for each column (adjust as needed)
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
                    }}
                />)}


             <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth maxWidth="lg">
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
                            maxWidth: '800px',
                            margin: 'auto',
                        }}
                    >
                        {/* Header Section */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: 3,
                                paddingBottom: 2,
                                marginBottom: 1,
                                borderBottom: '1px solid #ddd',
                            }}
                        >
                            {/* Left: Profile Image */}
                            <Box>
                                <img
                                    src={view?.tutor_personal_info?.profile_picture || '/default-image.jpg'}
                                    alt="Profile"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #ddd',
                                    }}
                                />
                            </Box>

                            {/* Left: Name and Phone */}
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {view?.tutor_personal_info?.full_name || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                    {view?.tutor_personal_info?.phone || 'N/A'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Body Section */}
                        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                            {/* Left Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body1">
                                    <strong>Tutor Location:</strong> {view?.tutor_personal_info?.location || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Tutor Division:</strong> {view?.tutor_personal_info?.division || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Tutor District:</strong> {view?.tutor_personal_info?.district || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Profile Headline:</strong> {view?.tutor_personal_info?.profile_headline || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Profile Description:</strong> {view?.tutor_personal_info?.profile_description || 'N/A'}
                                </Typography>
                                <Divider />
                            </Box>

                            {/* Right Column */}
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
                                    <strong>Teaching Level:</strong> {view?.tutor_tuition_info?.i_will_teach || 'N/A'}
                                </Typography>
                                <Divider />
                            </Box>
                        </Box>

                        {/* Footer Section: Checkboxes */}
                        <Box sx={{ display: 'flex', gap: 2, paddingTop: 2, borderTop: '1px solid #ddd' }}>
                            <FormControlLabel
                                control={<Checkbox checked={view?.tutor_personal_info?.is_verified || false} disabled />}
                                label="Verified"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={view?.tutor_personal_info?.is_pro_tutor || false} disabled />}
                                label="Pro Tutor"
                            />
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


        </Box>
    );
};

export default Protutor;
