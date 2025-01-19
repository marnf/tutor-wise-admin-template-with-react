import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Button,
    Modal,
    Box,
    Typography,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { FaUserEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const DynamicPricing = () => {
    const [rows, setRows] = useState([
        { id: 1, category: "premium", package: 'One Month', presentAmount: 500, discountAmount: 50 },
        { id: 2, category: "premium", package: 'Two Month', presentAmount: 900, discountAmount: 100 },
        { id: 3, category: "premium", package: 'six Month', presentAmount: 1200, discountAmount: 150 },
        { id: 4, category: "limit", package: 'One Month', presentAmount: 400, discountAmount: 40 },
        { id: 5, category: "limit", package: 'Two Month', presentAmount: 800, discountAmount: 90 },
        { id: 6, category: "limit", package: 'six Month', presentAmount: 1100, discountAmount: 140 },
    ]);

    const [formData, setFormData] = useState({
        id: null,
        category: '',
        presentAmount: '',
        discountAmount: '',
        details: '',
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleFormOpen = (row) => {
        setFormData(row);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setFormData({ id: null, category: '', presentAmount: '', discountAmount: '', details: '' });
        setIsFormOpen(false);
    };

    const handleDeleteModalOpen = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setDeleteId(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        setRows(rows.filter((row) => row.id !== deleteId));
        handleDeleteModalClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (formData.id) {
            setRows(rows.map((row) => (row.id === formData.id ? formData : row)));
        } else {
            setRows([...rows, { ...formData, id: rows.length + 1 }]);
        }

        handleFormClose();
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'category', headerName: 'Category', flex: 1 },
        { field: 'package', headerName: 'Package', flex: 1 },
        { field: 'presentAmount', headerName: 'Present Amount', flex: 1 },
        { field: 'discountAmount', headerName: 'Discount Amount', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1.5,
            renderCell: (params) => (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <FaUserEdit title="Edit"
                        size={25}
                        color="black"
                        onClick={() => handleFormOpen(params.row)}
                        className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer" />

                    {/* <MdDelete title="Delete"
                        size={25}
                        color="red"
                        onClick={() => handleDeleteModalOpen(params.id)}
                        className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer" 
                        /> */}


                    <MdDelete
                        title="Delete"
                        size={25}
                        color="gray"
                        className="transition ease-in-out delay-250 hover:scale-100 cursor-not-allowed"
                        style={{
                            pointerEvents: "none",
                            opacity: 0.5,
                        }}
                    />



                </div>
            ),
        },
    ];

    return (
        <div className="w-full mt-10">

            {/* DataGrid */}
            <div style={{ height: '80vh', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    disableSelectionOnClick
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    rowHeight={70}
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
                        "& .MuiDataGrid-columnHeader:focus": {
                            outline: "none", // Remove outline on column header focus
                        },
                        "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none", // Remove outline when child element inside column header is focused
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto", // Ensure horizontal scroll for table content
                        },
                    }}
                />
            </div>

            {/* Form Modal */}
            <Modal open={isFormOpen} onClose={handleFormClose} maxWidth="md" >
                <Box
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white p-6 rounded-lg shadow-lg"
                >
                    <Typography variant="h6" className="mb-4">
                        {formData.id ? 'Edit Pricing' : 'Add Pricing'}
                    </Typography>
                    <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
                        {/* Left side inputs */}
                        <div className="col-span-1 space-y-4">
                            <TextField
                                select
                                fullWidth
                                name="category"
                                label="Category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="One Month">One Month</MenuItem>
                                <MenuItem value="Two Month">Two Month</MenuItem>
                                <MenuItem value="Three Month">Three Month</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                name="presentAmount"
                                label="Present Amount"
                                type="number"
                                value={formData.presentAmount}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                fullWidth
                                name="discountAmount"
                                label="Discount Amount"
                                type="number"
                                value={formData.discountAmount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Right side input */}
                        <div className="col-span-1">
                            <TextField
                                fullWidth
                                name="details"
                                label="Details"
                                multiline
                                rows={8}
                                value={formData.details}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit button */}
                        <div className="col-span-2">
                            <Button variant="contained" color="primary" type="submit" fullWidth>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>


            <Dialog open={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this ?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>



        </div>
    );
};

export default DynamicPricing;
