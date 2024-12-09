import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Snackbar,
    Alert,
    LinearProgress,
    Button
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DateRangePicker } from "react-date-range";

const columns = [
    { field: "id", headerName: "ID", minWidth: 0.5 },
    { field: "date", headerName: "Payment Time", minWidth: 1 },
    { field: "name", headerName: "Name", minWidth: 1 },
    { field: "user_type", headerName: "User Type", minWidth: 1.5 },
    // { field: "email", headerName: "Email", minWidth: 1 },
    // { field: "phone", headerName: "Phone", minWidth: 1 },
    { field: "transaction_id", headerName: "Transaction ID", minWidth: 1 },
    { field: "package", headerName: "Package", minWidth: 1 },
    { field: "digital_bank_name", headerName: "Digital Banking", minWidth: 1 },
    { field: "amount", headerName: "Amount", minWidth: 1 },
];

const ProPayment = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    useEffect(() => {
        setLoading(true)
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/buy-apply-payment`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    name: item.name,
                    user_type: item.user_type,
                    email: item.email,
                    phone: item.phone,
                    transaction_id: item.transaction_id,
                    package: item.package,
                    amount: item.amount,
                    digital_bank_name: item.digital_bank_name,
                    date: item.created_at,
                }));

                setRows(formattedData);
                setFilteredRows(formattedData);
                setLoading(false)
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Filtering rows based on search query
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        const filteredData = rows.filter((row) =>
            row.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            row.email.toLowerCase().includes(event.target.value.toLowerCase()) ||
            row.transaction_id.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredRows(filteredData);
    };

    const handleDateFilter = () => {
        const startDate = dateRange[0].startDate;
        const endDate = dateRange[0].endDate;

        const filteredData = rows.filter((row) => {
            const rowDate = new Date(row.created_at);
            return rowDate >= startDate && rowDate <= endDate;
        });
        setFilteredRows(filteredData);
        setShowDatePicker(false); // Close the date picker after filtering
    };

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>


            {/* Filters & Search */}
            <div className="flex items-center justify-between mb-4">
                {/* Date Range Picker */}
                <div className="relative">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        sx={{ height: "40px" }}
                    >
                        Select Date Range
                    </Button>
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
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{ width: "300px" }}
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
                        minWidth: 150, // Minimum width for each column (adjust as needed)
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
        </Box>
    );
};

export default ProPayment;
