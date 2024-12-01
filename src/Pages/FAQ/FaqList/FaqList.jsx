import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = (handleDeleteClick) => [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "question", headerName: "Question", flex: 1 },
  { field: "answer", headerName: "Answer", flex: 1.5 },
  { field: "created_date", headerName: "Created Date", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.8,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="error"
        onClick={() => handleDeleteClick(params.row.id)}
      >
        Delete
      </Button>
    ),
  },
];

const FaqList = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const BASE_URL = "https://tutorwise-backend.vercel.app";
    fetch(`${BASE_URL}/api/account/view-faq/`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          created_date: moment(item.created_date).format("dddd, MMMM Do YYYY, h:mm A"),
        }));
        setRows(formattedData);
        setFilteredRows(formattedData); // Initially, show all rows
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filteredData = rows.filter((row) =>
      row.question.toLowerCase().includes(query.toLowerCase()) ||
      row.answer.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRows(filteredData);
  };

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  // Confirm deletion
  const handleDelete = () => {
    const BASE_URL = "https://tutorwise-backend.vercel.app";
    fetch(`${BASE_URL}/api/admin/delete-faq/${deleteId}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== deleteId));
          setSnackbar({ open: true, message: "FAQ deleted successfully!", severity: "success" });
        } else {
          setSnackbar({ open: true, message: "Failed to delete FAQ.", severity: "error" });
        }
      })
      .catch((error) => {
        console.error("Error deleting FAQ:", error);
        setSnackbar({ open: true, message: "An error occurred.", severity: "error" });
      })
      .finally(() => {
        setOpenDeleteModal(false);
        setDeleteId(null);
      });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>FAQ List</h2>

      {/* Search Bar */}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ marginBottom: "1rem", width:"300px" }}
      />

      <DataGrid
        rows={filteredRows} // Use filteredRows instead of rows
        columns={columns(handleDeleteClick)}
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

      {/* Dialog for confirming deletion */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this FAQ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FaqList;
