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
  LinearProgress,
  Typography,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import Modal from '@mui/material/Modal';
import { decryptData } from "../../../EncryptedPage";
import BASE_URL from "../../../Api/baseUrl";




const encryptedUser = localStorage.getItem("user");

let user;
if (encryptedUser) {
  try {
    user = decryptData(encryptedUser);
  } catch (error) {
    console.error("Error decrypting user data:", error);
  }
}
const isSuperAdmin = user?.user_type === "super_admin";



const columns = (handleDeleteClick, handleEditClick) => [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "question", headerName: "Question", flex: 1 },
  { field: "answer", headerName: "Answer", flex: 1.5 },
  { field: "created_date", headerName: "Created Date", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.8,
    renderCell: (params) => (
      <Box display="flex" justifyContent="end" className="mt-3">
        <FaUserEdit
          title="Edit"
          size={25}
          color="black"
          className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
          onClick={() => handleEditClick(params.row)}
        />

        <MdDelete
          title="Delete"
          size={25}
          color={isSuperAdmin ? "red" : "gray"}
          className={`transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 ${isSuperAdmin ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          onClick={() => {
            if (isSuperAdmin) {
              handleDeleteClick(params.row.id);
            }
          }}
          style={{
            pointerEvents: isSuperAdmin ? "auto" : "none",
            opacity: isSuperAdmin ? 1 : 0.5,
          }}
        />
      </Box>
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
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({ id: null, question: "", answer: "" });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setLoading(true);
  
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
        setFilteredRows(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filteredData = rows.filter(
      (row) =>
        row.question.toLowerCase().includes(query.toLowerCase()) ||
        row.answer.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRows(filteredData);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDelete = () => {
   
    fetch(`${BASE_URL}/api/admin/delete-faq/${deleteId}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== deleteId));
          setFilteredRows((prevFilteredRows) => prevFilteredRows.filter((row) => row.id !== deleteId));
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

  const handleEditRequest = (row) => {
    setEditData({ id: row.id, question: row.question, answer: row.answer });
    setShowEditModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    fetch(`${BASE_URL}/api/admin/edit-faq/${editData.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: editData.question,
        answer: editData.answer,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === editData.id ? { ...row, question: editData.question, answer: editData.answer } : row
            )
          );
          setFilteredRows((prevFilteredRows) =>
            prevFilteredRows.map((row) =>
              row.id === editData.id ? { ...row, question: editData.question, answer: editData.answer } : row
            )
          );
          setSnackbar({ open: true, message: "FAQ updated successfully!", severity: "success" });
        } else {
          setSnackbar({ open: true, message: "Failed to update FAQ.", severity: "error" });
        }
        setShowEditModal(false); // Edit modal বন্ধ করা
      })
      .catch((error) => {
        console.error("Error updating FAQ:", error);
        setSnackbar({ open: true, message: "An error occurred.", severity: "error" });
        setShowEditModal(false); // Edit modal বন্ধ করা
      });
  };


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>

      {/* Search Bar */}

      <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center  text-end gap-1">
        <Typography variant="text-base" className="flex h5">
          <strong className="text-gray-500">Total:{rows.length} </strong>
        </Typography>

        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          size="small"
          sx={{ marginBottom: "1rem", width: "300px" }}
        />
      </div>


      {
        loading ? (
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
            rows={filteredRows} // Use filteredRows instead of rows
            columns={columns(handleDeleteClick, handleEditRequest)}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f0f0f0",
                fontWeight: "bold",
                borderBottom: "2px solid #1976d2",
              },
              "& .MuiDataGrid-cell": {
                border: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none", // Remove outline when child element inside column header is focused
                        },
            }}
          />
        )
      }

      {/* Dialog for confirming deletion */}


      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button onClick={handleDelete} color="danger">
            Remove
          </Button>
        </DialogActions>
      </Dialog>


      {/* Edit FAQ Dialog */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "white", color: "black", textAlign: "center" }}>
          <Typography variant="h6">Edit FAQ</Typography>
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <TextField
            label="Question"
            variant="outlined"
            fullWidth
            value={editData.question}
            onChange={(e) => setEditData({ ...editData, question: e.target.value })}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "gray", // হোভার ইফেক্ট সরানো
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2", // ফোকাস অবস্থায় নীল বর্ডার
                  boxShadow: "0 0 5px rgba(25, 118, 210, 0.5)", // হালকা নীল শেডো
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray", // ডিফল্ট ধূসর বর্ডার
              },
            }}
          />
          <TextField
            label="Answer"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={editData.answer}
            onChange={(e) => setEditData({ ...editData, answer: e.target.value })}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "gray", // হোভার ইফেক্ট সরানো
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2", // ফোকাস অবস্থায় নীল বর্ডার
                  boxShadow: "0 0 5px rgba(25, 118, 210, 0.5)", // হালকা নীল শেডো
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray", // ডিফল্ট ধূসর বর্ডার
              },
            }}
          />


        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={() => setShowEditModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box >
  );
};


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  boxShadow: 24,
  borderRadius: '8px',
};

export default FaqList;
