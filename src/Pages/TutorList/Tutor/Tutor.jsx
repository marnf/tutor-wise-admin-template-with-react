import React, { useState, useEffect } from "react";
import { Box, LinearProgress, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// Columns definition for DataGrid
const columns = [
    { field: "id", headerName: "ID",  minWidth: 40 },
    {
        field: "profile_picture",
        headerName: "Profile Picture",
         minWidth: 80,
        renderCell: (params) => (
            <img src={params.value} alt="Profile" style={{ width: 50, height: 50, borderRadius: "50%" }} />
        )
    },
    { field: "full_name", headerName: "Name",  minWidth: 150},
    { field: "division", headerName: "Division",  minWidth: 60},
    { field: "location", headerName: "Location",  minWidth: 150},
    { field: "subject", headerName: "Subject",  minWidth: 100},
    { field: "gender", headerName: "Gender",  minWidth: 60},
    { field: "days_per_week", headerName: "Days/Week",  minWidth: 60},
    { field: "charge_per_month", headerName: "Charge",  minWidth: 60},
    { field: "phone", headerName: "Phone",  minWidth: 150},
];

const Tutor = () => {
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(false);

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
                    full_name: item.tutor_personal_info.full_name,
                    division: item.tutor_personal_info.division,
                    location: `${item.tutor_personal_info.district}, ${item.tutor_personal_info.location}`,
                    subject: item.tutor_tuition_info.subject,
                    gender: item.tutor_personal_info.gender,
                    days_per_week: item.tutor_tuition_info.days_per_week,
                    charge_per_month: item.tutor_tuition_info.charge_per_month,
                    phone: item.tutor_personal_info.phone,
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

    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
            <h2 className="text-center font-bold h3">Tutors</h2>
            <div className="flex justify-end">
                <TextField
                    label="Search Tutors"
                    variant="outlined"
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

        </Box>
    );
};

export default Tutor;
