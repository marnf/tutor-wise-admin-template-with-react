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
    Divider,
    DialogTitle,
    DialogActions
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DateRangePicker } from "react-date-range";
import { BiSolidUserDetail } from "react-icons/bi";
import moment from "moment/moment";
import { BsFillCalendarDateFill } from "react-icons/bs";
import BASE_URL from "../../Api/baseUrl";
import { decryptData } from "../../EncryptedPage";


const columns = [
    { field: "referrerId", headerName: "ID", minWidth: 130 },
    { field: "phone", headerName: "Phone", minWidth: 120 },
    { field: "withdrawAmount", headerName: "Amount", minWidth: 60 },
    { field: "formattedJoinDate", headerName: "Created Date", minWidth: 160, },
    { field: "digitalBank", headerName: "Digital Banking", minWidth: 60 },
    { field: "paidDate", headerName: "Paid Date", minWidth: 70 },
    {
        field: "isPaid",
        headerName: "Paid Status",
        minWidth: 100,
        renderCell: (params) => {
            console.log("isPaid Value:", params.value); // Check what value is coming

            return (
                <Box className="items-center flex justify-center">
                    <Button
                        variant="contained"
                        className="mt-2"
                        sx={{
                            backgroundColor: params.value ? "#4caf50" : "#f44336",
                            color: "#fff",
                            textTransform: "capitalize",
                            "&:hover": {
                                backgroundColor: params.value ? "#388e3c" : "#d32f2f",
                            },
                            "&:focus": {
                                outline: "none",
                                boxShadow: "none",
                            },
                        }}
                        onClick={() => {
                            if (!params.value) {
                                params.row.handleStatus(params.row);
                            }
                        }}
                    >
                        {params.value ? "Paid" : "Pending"}
                    </Button>
                </Box>
            );
        }

    },

    { field: "paymentBy", headerName: "Payment By", minWidth: 70 },

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

const WithDraw = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [view, setView] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [statusModalData, setStatusModalData] = useState([]);
    const [refreshTable, setRefreshTable] = useState(false)

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

   
    const handleRefreshTable = () => {
        setRefreshTable((prev) => !prev)
    }


    useEffect(() => {
        setLoading(true);

        const encryptedUser = localStorage.getItem("user");

        let user;
        if (encryptedUser) {
            try {
                user = decryptData(encryptedUser);
            } catch (error) {
                console.error("Error decrypting user data:", error);
            }
        }
        const token = user?.token;
        console.log(token);

        // Fetch with Authorization header
        fetch(`${BASE_URL}/api/admin/withdraw-list/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                const formattedData = data.map((item) => ({
                    id: item.id,
                    referrerId: item.referrer_id,
                    withdrawAmount: Number(item.with_draw_amount).toFixed(0),
                    digitalBank: item.digital_bank,
                    phone: item.phone,
                    isPaid: Boolean(item.is_paid),
                    paymentBy: item.payment_by || "N/A",

                    paidDate: item.paid_date ? moment(item.paid_date).format('DD/MM/YYYY hh:mm a') : "Not Paid",
                    createdAt: moment(item.created_at).format('YYYY-MM-DD'),
                    formattedJoinDate: moment(item.created_at).format('DD/MM/YYYY hh:mm a') || '',

                    handleViewModal: handleOpenViewModal,
                    handleStatus: handleOpenStatusModal,



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




    const handleOpenViewModal = (item) => {
        setView(item)
        console.log(item)
        setOpenViewModal(true)
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setOpenErrorSnackbar(false);
    };

    const handleOpenStatusModal = (item) => {
        setOpenStatusModal(true)
        setStatusModalData(item)
        console.log(item)
    }

    const handleCloseStatusModal = () => {
        setOpenStatusModal(false);
    };

    const handleConfirm = async () => {
        const encryptedUser = localStorage.getItem("user");

        let user;
        if (encryptedUser) {
            try {
                user = decryptData(encryptedUser);
            } catch (error) {
                console.error("Error decrypting user data:", error);
            }
        }
        const token = user?.token;

        try {
            // API call to post data
            const response = await fetch(`${BASE_URL}/api/admin/accept-withdraw-payment/${statusModalData.id}/`, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // If API call is successful
                console.log("Status updated via API.");
                setSnackbarMessage("Status updated successfully!");
                setOpenSnackbar(true);
                setRefreshTable(prev =>!prev)
            } else {
                // If API call fails
                console.error("Failed to update status.");
                setSnackbarMessage("Failed to update status. Please try again.");
                setOpenErrorSnackbar(true);
            }
        } catch (error) {
            // Handle any other errors
            console.error("An error occurred:", error);
            setSnackbarMessage("An error occurred. Please try again.");
            setOpenErrorSnackbar(true);
        } finally {
            // Close modal after handling the request
            setOpenStatusModal(false);
        }
    };




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
            const rowDate = new Date(row.createdAt).getTime(); // Use raw `created_at`
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
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={handleDateFilter}
                                        sx={{ marginTop: "10px" }}
                                    >
                                        Apply Filter
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={handleRefreshTable}
                                        sx={{ marginTop: "10px" }}
                                    >
                                        Reset
                                    </Button>
                                </div>

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
                    <strong className="text-gray-500"> WithDraw: {rows.length} </strong>
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
                                marginBottom: 1,
                                borderBottom: '1px solid #ddd',
                            }}
                        >
                            {/* Left: Name and Status */}
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                                >
                                    {view.referrerId || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    {view.is_paid ? "Paid" : "Pending"}
                                </Typography>
                            </Box>

                            {/* Right: Date */}
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
                                    <strong>Created At:</strong> {view.createdAt}
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
                                    <strong>Withdraw Amount:</strong> {view.withdrawAmount || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Phone:</strong> {view.phone || 'N/A'}
                                </Typography>
                            </Box>

                            {/* Right Column */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body1">
                                    <strong>Paid Date:</strong> {view.paidDate || 'Not Paid'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Digital Bank:</strong> {view.digitalBank || 'N/A'}
                                </Typography>
                                <Divider />
                                <Typography variant="body1">
                                    <strong>Payment By:</strong> {view.paymentBy || 'N/A'}
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


            <Dialog open={openStatusModal} onClose={handleCloseStatusModal}>
                <DialogTitle>change status</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to change the status?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseStatusModal}>Cancel</Button>
                    <Button onClick={handleConfirm} color="error">Confirm</Button>
                </DialogActions>
            </Dialog>



            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={openErrorSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>


        </Box>
    );
};

export default WithDraw;















 // useEffect(() => {
    //     setLoading(true);

    //     const encryptedUser = localStorage.getitem("user");

    //     let user;
    //     if (encryptedUser) {
    //         try {
    //             user = decryptData(encryptedUser);
    //         } catch (error) {
    //             console.error("Error decrypting user data:", error);
    //         }
    //     }
    //     const token = user?.token;
    //     console.log(token);

    //     // Fetch with Authorization header
    //     fetch(`${BASE_URL}/api/admin/withdraw-list/`, {
    //         method: "GET",
    //         headers: {
    //             "Authorization": `Token ${token}`, // Add the token here
    //             "Content-Type": "application/json", // Optional, based on your API needs
    //         },
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             const formattedData = data.map((item) => ({
    //                 id: item.id,
    //                 customized_user_id: item.customized_user_id,
    //                 name: item.name,
    //                 amount: item.amount,
    //                 email: item.email,
    //                 user_type: item.user_type,
    //                 transaction_id: item.transaction_id,
    //                 package: item.package,
    //                 digital_bank_name: item.digital_bank_name,
    //                 created_at: item.created_at,
    //                 formatted_created_at: moment(item.created_at).format('DD/MM/YYYY hh:mm a') || '',
    //                 phone: item.phone,
    //                 handleViewModal: handleOpenViewModal,
    //             }));
    //             setRows(formattedData);
    //             setFilteredRows(formattedData);
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching data:", error);
    //             setLoading(false);
    //         });

    // }, []);


