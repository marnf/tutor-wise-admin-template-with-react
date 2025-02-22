import React, { useState, useEffect } from "react";
import { Box, Button, Card, Checkbox, Dialog, DialogContent, Divider, FormControlLabel, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BiSolidUserDetail } from "react-icons/bi";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { DateRangePicker } from "react-date-range";
import BASE_URL from "../../../Api/baseUrl";

// Columns definition for DataGrid
const columns = [
    { field: "id", headerName: "ID", minWidth: 130 },
    {
        field: "profile_picture",
        headerName: "Profile Picture",
        minWidth: 80,
        maxWidth: 80,
        renderCell: (params) => (
            <img src={params.value} alt="Profile" style={{ width: 50, height: 50, borderRadius: "50%" }} />
        )
    },
    { field: "full_name", headerName: "Name", flex: 1, minWidth: 130 },

    { field: "subject", headerName: "Subject", minWidth: 100 },
    { field: "gender", headerName: "Gender", minWidth: 60 },
    { field: "days_per_week", headerName: "Days/Week", minWidth: 40 },
    { field: "charge_per_month", headerName: "Charge", minWidth: 60 },
    { field: "start_date", headerName: "Phone", minWidth: 100 },
    {
        field: "actions",
        headerName: "Actions",
        minWidth: 70, // Small width for the action column
        flex: 0.1, // Takes as little space as possible
        renderCell: (params) => (
            <Box display="flex" justifyContent="center" className="mt-3">
                <BiSolidUserDetail
                    title="View"
                    size={28}
                    color="#f0523a"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleViewModal(params)}
                />
            </Box>
        ),
    },
];

const AllTutorList = () => {
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);


    // Fetch data from the API
    useEffect(() => {
        setLoading(true)
       
        fetch(`${BASE_URL}/api/admin/pro-tutor-list/`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.tutor_personal_info.customized_user_id,
                    profile_picture: item.tutor_personal_info.profile_picture ? `${BASE_URL}${item.tutor_personal_info.profile_picture}` : null,
                    full_name: item.tutor_personal_info.full_name,
                    division: item.tutor_personal_info.division,
                    location: `${item.tutor_personal_info.district}, ${item.tutor_personal_info.location}`,
                    subject: item.tutor_tuition_info.subject,
                    gender: item.tutor_personal_info.gender,
                    days_per_week: item.tutor_tuition_info.days_per_week,
                    charge_per_month: item.tutor_tuition_info.charge_per_month,
                    phone: item.tutor_personal_info.phone,
                    start_date: item?.tutor_personal_info?.pro_tutor_start_date,
                    handleViewModal: (params) => handleOpenViewModal(item)
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
        console.log(item)
        setOpenViewModal(true)


    }
    const handleCloseViewModal = () => {
        setOpenViewModal(false)
    }

    const handleDateFilter = () => {
        const startDate = new Date(dateRange[0].startDate).setHours(0, 0, 0, 0); // Start of the day
        const endDate = new Date(dateRange[0].endDate).setHours(23, 59, 59, 999); // End of the day

        console.log("Start Date:", startDate, "End Date:", endDate);

        const filteredData = rows.filter((row) => {
            const rowDate = new Date(row.start_date).getTime(); // Use raw `created_at`
            console.log("Row Date:", rowDate); // Debug
            return rowDate >= startDate && rowDate <= endDate;
        });

        console.log("Filtered Data:", filteredData); // Debug filtered rows
        setFilteredRows(filteredData);
        setShowDatePicker(false); // Close the date picker after filtering
    };

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>

            <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center  text-end gap-1">

                <div className="flex items-center justify-center gap-1">
                    <div className="relative flex items-center justify-start gap-1">
                        <BsFillCalendarDateFill
                            size={40}
                            color="#f0523a"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer pb-1"
                        />

                        {showDatePicker && (
                            <div style={{ position: "absolute", zIndex: 100, top: "50px" }}>
                                <DateRangePicker
                                    onChange={(item) => setDateRange([item.selection])}
                                    showSelectionPreview={true}
                                    moveRangeOnFirstSelection={false}
                                    ranges={dateRange}
                                    direction="horizontal"
                                />
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={handleDateFilter}
                                    sx={{ marginTop: "10px" }}
                                >
                                    Apply Filter
                                </Button>

                            </div>

                        )}
                    </div>
                    <div className="flex justify-end">
                        <TextField className="mb-1"
                            label="Search Tutors"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: "300px" }}
                        />
                    </div>
                </div>


                <Typography variant="text-base" className="flex h5">
                    <strong className="text-gray-500">Total Pro Tutor:{rows.length} </strong>
                </Typography>

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
                />)}



            <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth maxWidth="lg">
                <DialogContent>
                    <div
                        style={{
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            borderRadius: '8px',
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
                                    src={view.tutor_personal_info?.profile_picture ? `${BASE_URL}${view.tutor_personal_info.profile_picture}` : ''}
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
                                        {view?.tutor_personal_info?.full_name || ''}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                        {view?.tutor_personal_info?.phone || ''}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                        {view?.tutor_personal_info?.university_name || ''}
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
                                    <strong>ID:</strong> {view?.tutor_personal_info?.id || ''}
                                </Typography>
                                <Typography variant="body1">
                                    {view?.tutor_personal_info?.location || ''}
                                </Typography>
                                <Typography variant="body1">
                                    {view?.tutor_tuition_info?.i_will_teach || ''}
                                </Typography>
                                <Typography sx={{ color: '#777' }} variant="body1">
                                    <strong>Apply Number:</strong> {view?.tutor_personal_info?.apply_number || ''}
                                </Typography>
                                <Typography sx={{ color: '#777' }} variant="body1">
                                    <strong>Duration:</strong> {view?.tutor_personal_info?.pro_tutor_package_duration || ''} <strong>Month</strong>
                                </Typography>
                            </Box>
                        </Box>

                        {/* Body Section */}
                        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {/* Personal Info Card */}
                            <Box style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>Personal Info</Typography>
                                <Typography variant="body1"><strong>Gender:</strong> {view?.tutor_personal_info?.gender || ''}</Typography>
                                <Typography variant="body1"><strong>District:</strong> {view?.tutor_personal_info?.district || ''}</Typography>
                                <Typography variant="body1"><strong>Division:</strong> {view?.tutor_personal_info?.division || ''}</Typography>
                                <Typography variant="body1"><strong>Pro Tutor Start Date:</strong> {view?.tutor_personal_info?.pro_tutor_start_date || ''}</Typography>
                                <Typography variant="body1"><strong>Pro Tutor End Date:</strong> {view?.tutor_personal_info?.pro_tutor_end_date || ''}</Typography>
                                <Typography variant="body1"><strong>Profile Headline:</strong> {view?.tutor_personal_info?.profile_headline || ''}</Typography>
                                <br />
                                <Typography variant="body1"><strong>Profile Description:</strong> {view?.tutor_personal_info?.profile_description || ''}</Typography>
                            </Box>

                            {/* College Info Card */}
                            <Box style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>College Info</Typography>
                                <Typography variant="body1"><strong>College Name:</strong> {view?.tutor_personal_info?.college_name || ''}</Typography>
                                <Typography variant="body1"><strong>CGPA:</strong> {view?.tutor_personal_info?.college_cgpa || ''}</Typography>
                                <Typography variant="body1"><strong>Background:</strong> {view?.tutor_personal_info?.college_educational_background || ''}</Typography>
                                <img
                                    src={view?.tutor_personal_info?.college_certificate ? `${BASE_URL}${view.tutor_personal_info.college_certificate}` : '/default-image.jpg'}
                                    alt="College Certificate"
                                    style={{ width: '100%', height: 'auto', marginTop: '10px', borderRadius: '5px' }}
                                />
                            </Box>

                            {/* University Info Card */}
                            <Box style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>University Info</Typography>
                                <Typography variant="body1"><strong>University Name:</strong> {view?.tutor_personal_info?.university_name || ''}</Typography>
                                <Typography variant="body1"><strong>CGPA:</strong> {view?.tutor_personal_info?.university_cgpa || ''}</Typography>
                                <Typography variant="body1"><strong>Level:</strong> {view?.tutor_personal_info?.university_educational_level || ''}</Typography>
                                <Typography variant="body1"><strong>Start Date:</strong> {view?.tutor_personal_info?.university_start_date || ''}</Typography>
                                <Typography variant="body1"><strong>End Date:</strong> {view?.tutor_personal_info?.university_ending_date || ''}</Typography>
                            </Box>

                            {/* Nominee Info Card */}
                            <Box style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>Nominee Info</Typography>
                                <Typography variant="body1"><strong>Nominee 1 Name:</strong> {view?.tutor_personal_info?.nominee1_name || ''}</Typography>
                                <Typography variant="body1"><strong>Address:</strong> {view?.tutor_personal_info?.nominee1_address || ''}</Typography>
                                <Typography variant="body1"><strong>NID Card:</strong> {view?.tutor_personal_info?.nominee1_nidcard_number || ''}</Typography>
                                <img
                                    src={view?.tutor_personal_info?.nominee1_nidcard_picture ? `${BASE_URL}${view.tutor_personal_info.nominee1_nidcard_picture}` : '/default-image.jpg'}
                                    alt="Nominee 1 NID"
                                    style={{ width: '100%', height: 'auto', marginTop: '10px', borderRadius: '5px' }}
                                />
                            </Box>

                            <Box style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>Nominee Info</Typography>
                                <Typography variant="body1"><strong>Nominee 2 Name:</strong> {view?.tutor_personal_info?.nominee2_name || ''}</Typography>
                                <Typography variant="body1"><strong>Address:</strong> {view?.tutor_personal_info?.nominee2_address || ''}</Typography>
                                <Typography variant="body1"><strong>NID Card:</strong> {view?.tutor_personal_info?.nominee2_nidcard_number || ''}</Typography>
                                <img
                                    src={view?.tutor_personal_info?.nominee2_nidcard_picture ? `${BASE_URL}${view.tutor_personal_info.nominee2_nidcard_picture}` : '/default-image.jpg'}
                                    alt="Nominee 2 NID"
                                    style={{ width: '100%', height: 'auto', marginTop: '10px', borderRadius: '5px' }}
                                />
                            </Box>
                        </Box>

                        {/* Footer Section */}
                        <Box style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: '#ff5722',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '10px 30px',
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

export default AllTutorList;
