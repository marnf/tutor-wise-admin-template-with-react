import React, { useState, useEffect } from "react";
import { Box, Button, Checkbox, Dialog, DialogContent, Divider, FormControlLabel, LinearProgress, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BiSolidUserDetail } from "react-icons/bi";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import BASE_URL from "../../Api/baseUrl";

// Columns definition for DataGrid
const columns = [
    { field: "customized_user_id", headerName: "ID", minWidth: 130 },
    {
        field: "profile_picture",
        headerName: "Profile Picture",
        minWidth: 60,
        maxWidth: 60,
        renderCell: (params) => (
            <img
                className=" mt-2"
                src={params.value}
                alt="Profile"
                style={{ width: 30, height: 30, borderRadius: "50%" }}
            />
        )
    },
    { field: "full_name", headerName: "Name", flex: 1, minWidth: 130 },
    { field: "phone", headerName: "phone", flex: 1, minWidth: 130 },
    { field: "gmail", headerName: "gmail", flex: 1, minWidth: 130 },
    {
        field: "location",
        headerName: "Location",
        minWidth: 100,
        renderCell: (params) => {
            const district = params.row.district || 'N/A';
            const division = params.row.division || 'N/A';
            return `${district}, ${division}`; 
        },
    },
    { field: "gender", headerName: "Gender", minWidth: 60, maxWidth:60 },
    // { field: "nidcard_number", headerName: "NID Number", minWidth: 150 },
    { field: "formattedJoinDate", headerName: "Created Date", minWidth: 160, maxWidth:160 },
    {
        field: "actions",
        headerName: "Actions",
        minWidth: 70,
        flex: 0.1,
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



const Referrer = () => {
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
    const [refreshTable, setRefreshTable] = useState(false)


    // Fetch data from the API
    useEffect(() => {
        setLoading(true);


        fetch(`${BASE_URL}/api/admin/referrer-list/`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    customized_user_id: item.customized_user_id,
                    created_at: moment(item?.created_at).format('YYYY-MM-DD'),
                    formattedJoinDate: moment(item?.created_at).format('DD/MM/YYYY hh:mm a') || '',

                    profile_picture: item.profile_picture
                        ? `${BASE_URL}${item.profile_picture}`
                        : null,
                    full_name: item.full_name,
                    phone: item.phone,
                    gmail: item.gmail,
                    division: item.division,
                    district: item.district,
                    nidcard_number: item.nidcard_number,
                    nidcard_picture: item.nidcard_picture
                        ? `${BASE_URL}${item.nidcard_picture}`
                        : null,
                    gender: item.gender,
                    profile_headline: item.profile_headline,
                    profile_description: item.profile_description,
                    apply_number: item.apply_number,
                    nominee1_name: item.nominee1_name,
                    nominee1_address: item.nominee1_address,
                    nominee1_nidcard_number: item.nominee1_nidcard_number,
                    nominee1_nidcard_picture: item.nominee1_nidcard_picture
                        ? `${BASE_URL}${item.nominee1_nidcard_picture}`
                        : null,
                    nominee2_name: item.nominee2_name,
                    nominee2_address: item.nominee2_address,
                    nominee2_nidcard_number: item.nominee2_nidcard_number,
                    nominee2_nidcard_picture: item.nominee2_nidcard_picture
                        ? `${BASE_URL}${item.nominee2_nidcard_picture}`
                        : null,
                    college_educational_background: item.college_educational_background,
                    college_background_section: item.college_background_section,
                    college_name: item.college_name,
                    college_cgpa: item.college_cgpa,
                    college_certificate: item.college_certificate
                        ? `${BASE_URL}${item.college_certificate}`
                        : null,
                    university_name: item.university_name,
                    university_cgpa: item.university_cgpa,
                    university_educational_level: item.university_educational_level,
                    university_start_date: item.university_start_date,
                    university_ending_date: item.university_ending_date,
                    university_ongoing: item.university_ongoing,
                    handleViewModal: (params) => handleOpenViewModal(item)
                }));

                setRows(formattedData);
                setFilteredRows(formattedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [refreshTable]);


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
            const rowDate = new Date(row.created_at).getTime(); // Use raw `created_at`
            console.log("Row Date:", rowDate); // Debug
            return rowDate >= startDate && rowDate <= endDate;
        });

        console.log("Filtered Data:", filteredData); // Debug filtered rows
        setFilteredRows(filteredData);
        setShowDatePicker(false); // Close the date picker after filtering
    };

    const resetFilters = () => {
        setRefreshTable((prev) => !prev);
    }

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
                                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={handleDateFilter}
                                    >
                                        Apply Filter
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </Button>
                                </div>

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
                    <strong className="text-gray-500">Total Referrer:{rows.length} </strong>
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
                                    src="/default-image.jpg" // No profile picture provided
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
                                        {view?.full_name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                        {view?.nidcard_number || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                        {view?.district || 'N/A'}, {view?.division || 'N/A'}
                                    </Typography>
                                </div>
                            </Box>

                            {/* Right: ID and University Info */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Typography variant="body2" color="textSecondary" sx={{ color: '#777' }}>
                                    <strong>ID:</strong> {view?.customized_user_id || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    {view?.university_name || 'N/A'}
                                </Typography>
                                <Typography sx={{ color: '#777' }} variant="body1">
                                    <strong>Apply Number:</strong> {view?.apply_number || 'N/A'}
                                </Typography>
                                <Typography sx={{ color: '#777' }} variant="body1">
                                    <strong>University Level:</strong> {view?.university_educational_level || 'N/A'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Body Section */}
                        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {/* Personal Info Card */}
                            <Box style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>Personal Info</Typography>
                                <Typography variant="body1"><strong>Gender:</strong> {view?.gender || 'N/A'}</Typography>
                                <Typography variant="body1"><strong>Profile Headline:</strong> {view?.profile_headline || 'N/A'}</Typography>
                                <Typography variant="body1"><strong>Profile Description:</strong> {view?.profile_description || 'N/A'}</Typography>
                            </Box>

                            {/* University Info Card */}
                            <Box style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>University Info</Typography>
                                <Typography variant="body1"><strong>University Name:</strong> {view?.university_name || 'N/A'}</Typography>
                                <Typography variant="body1"><strong>CGPA:</strong> {view?.university_cgpa || 'N/A'}</Typography>
                                <Typography variant="body1"><strong>Level:</strong> {view?.university_educational_level || 'N/A'}</Typography>
                            </Box>


                            {/* college Info Card */}
                            <Box style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>college Info</Typography>
                                <Typography variant="body1"><strong>college Name:</strong> {view?.college_name || 'N/A'}</Typography>
                                <Typography variant="body1"><strong>Section:</strong> {view?.college_background_section || 'N/A'}</Typography>
                                <Typography variant="body1"><strong>CGPA:</strong> {view?.college_cgpa || 'N/A'}</Typography>
                                <Typography variant="body1"><strong>Background:</strong> {view?.college_educational_background || 'N/A'}</Typography>
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

export default Referrer;
