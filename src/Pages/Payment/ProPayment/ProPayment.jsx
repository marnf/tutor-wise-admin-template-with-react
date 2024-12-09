import React, { useState, useEffect } from "react";
import { Box, LinearProgress, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

const columns = [
    { field: "id", headerName: "ID", minWidth: 40 },
    { field: "created_at", headerName: "Payment Time", minWidth: 150 },
    { field: "name", headerName: "User ID", minWidth: 150 },
    { field: "user_type", headerName: "User Type", minWidth: 60 },
    { field: "transaction_id", headerName: "Transaction ID", flex: 1 },
    { field: "package", headerName: "Package", minWidth: 150 },
    { field: "digital_bank_name", headerName: "Digital Banking", minWidth: 80 },
    { field: "amount", headerName: "Amount", minWidth: 60 },
];

const ProPayment = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        setLoading(true);
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/pro-tutor-payment`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    name: item.name,
                    user_type: item.user_type,
                    transaction_id: item.transaction_id,
                    package: item.package,
                    amount: item.amount,
                    digital_bank_name: item.digital_bank_name,
                    created_at: item.created_at,
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        const filteredData = rows.filter((row) =>
            row.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
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
                <Box sx={{ width: "100%" }}>
                    <LinearProgress />
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
                        },
                        "& .MuiDataGrid-cell": {
                            border: "1px solid #e0e0e0",
                        },
                    }}
                />
            )}
        </Box>
    );
};

export default ProPayment;
