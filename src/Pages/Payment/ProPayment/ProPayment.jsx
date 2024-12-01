import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "user_type", headerName: "User Type", flex: 1.5 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "transaction_id", headerName: "Transaction ID", flex: 1 },
    { field: "package", headerName: "Package", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "digital_bank_name", headerName: "Digital Banking", flex: 1 },
    { field: "created_at", headerName: "Payment Time", flex: 1 },
];

const ProPayment = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const BASE_URL = "https://tutorwise-backend.vercel.app";
        fetch(`${BASE_URL}/api/admin/pro-tutor-payment`)
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
                    created_at: item.created_at,
                }));

                setRows(formattedData);
                setFilteredRows(formattedData); // Initially, show all rows
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

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 className="text-center font-bold h3">Pro Payment</h2>

            {/* Search Bar */}
            <div className="flex justify-end">
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{ marginBottom: "1rem", width: "300px" }}
                />
            </div>

            <DataGrid
                rows={filteredRows}
                columns={columns}
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
                    },

                    "& .MuiDataGrid-cell:focus": {
                        outline: "none", // Remove default outline on focus
                    },
                }}
            />
        </Box>
    );
};

export default ProPayment;
