import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Snackbar,
    Alert,
    LinearProgress,
    Button,
    Dialog,
    DialogContent,
    Typography,
    Divider
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DateRangePicker } from "react-date-range";
import { BiSolidUserDetail } from "react-icons/bi";
import moment from "moment/moment";
import { BsFillCalendarDateFill } from "react-icons/bs";
import BASE_URL from "../../../Api/baseUrl";


const columns = [
    { field: "customized_user_id", headerName: "ID", minWidth: 130 },
    // { field: "name", headerName: "Name", minWidth: 170 },
    { field: "formatted_created_at", headerName: "Date", minWidth: 160 },
    // { field: "email", headerName: "Email", minWidth: 1 },
    { field: "phone", headerName: "Phone", minWidth: 130 },
    { field: "transaction_id", headerName: "Transaction ID", minWidth: 160 },
    { field: "package", headerName: "Package", minWidth: 50 },
    { field: "digital_bank_name", headerName: "Wallet", minWidth: 80, maxWidth: 80 },
    { field: "amount", headerName: "Amount", minWidth: 70 },
    {
        field: "actions",
        headerName: "Actions",
        minWidth: 80,
        flex: 0.1,
        renderCell: (params) => (

            <Box display="flex" justifyContent="center" className="mt-3">

                <BiSolidUserDetail title="View"
                    size={28}
                    color="#0d2a4c "
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleViewModal(params.row)} />

            </Box>
        ),
    },
];

const Payment = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [view, setView] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    useEffect(() => {
        setLoading(true)

        fetch(`${BASE_URL}/api/admin/buy-apply-payment/`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    customized_user_id: item.customized_user_id,
                    name: item.name,
                    amount: item.amount,
                    email: item.email,
                    user_type: item.user_type,
                    transaction_id: item.transaction_id,
                    package: item.package,
                    digital_bank_name: item.digital_bank_name,
                    created_at: item.created_at,
                    formatted_created_at:moment(item.created_at).format('DD/MM/YYYY hh:mm a') || '',
                    phone: item.phone,
                    handleViewModal: handleOpenViewModal,
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
                setLoading(false);
            });

    }, []);


    const formattedDate = (dateString) => {
        if (!dateString) return "N/A";
        return moment(dateString).format("MMMM Do YYYY"); // Keep it for UI
    };


    const handleOpenViewModal = (item) => {
        setView(item)
        console.log(item)
        setOpenViewModal(true)


    }
    const handleCloseViewModal = () => {
        setOpenViewModal(false)
    }


    // Filtering rows based on search query
        useEffect(() => {
            const result = rows.filter((row) =>
                Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRows(result);
        }, [searchQuery, rows]);
    




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



    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>


            {/* Filters & Search */}
            <div className="flex items-center justify-between mb-2">


                <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-start gap-1">
                        <BsFillCalendarDateFill
                            size={39}
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

                    {/* Search Bar */}
                    <TextField
                        label="Search "
                        variant="outlined"
                        value={searchQuery}
                        size="small"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "300px" }}
                    />

                </div>


                <Typography variant="text-base" className="flex h5">
                    <strong className="text-gray-500"> Payment: {rows.length} </strong>
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


            <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth>


                {/* Content */}
                <DialogContent>
                    <div
                        sx={{
                            padding: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: 4,
                            boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
                            backgroundColor: '#f9f9f9',
                            maxWidth: '600px',
                            margin: ' auto',
                        }}
                    >
                        {/* Header Section */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 3,
                                marginBottom: 1,
                                borderBottom: '1px solid #ddd',
                            }}
                        >
                            {/* Left: Name and Phone */}
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                                >
                                    {view?.name || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    {view?.user_type || 'N/A'}
                                </Typography>

                            </Box>

                            {/* Right: Location */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                        fontSize: '1rem',
                                        color: '#555',
                                        textAlign: 'right',
                                    }}
                                >
                                    <strong>ID:</strong>  {view?.customized_user_id || ''}
                                </Typography>
                                <Typography variant="body1">
                                    <strong></strong>{' '}
                                    {view?.created_at
                                        ? new Date(view.created_at).toLocaleString()
                                        : 'N/A'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Body Section */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 3,
                                flexDirection: { xs: 'column', sm: 'row' },
                            }}
                        >
                            {/* Left Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>


                                <Typography variant="body1">
                                    <strong>phone:</strong> {view?.phone || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Package:</strong> {view?.package || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Amount:</strong> {view?.amount || 'N/A'}
                                </Typography>
                            </Box>

                            {/* Right Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body1">
                                    <strong>Bank:</strong> {view?.digital_bank_name || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Budget:</strong> {view?.amount || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1" >
                                    <strong>created:</strong> {formattedDate(view?.created_at)}
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

        </Box>
    );
};

export default Payment;
