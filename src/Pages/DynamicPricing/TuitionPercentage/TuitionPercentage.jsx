import React, { useEffect, useState } from 'react';
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
    LinearProgress,
} from '@mui/material';
import { FaCheck, FaTimes, FaUserEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import BASE_URL from '../../../Api/baseUrl';
import ToggleButton from 'react-toggle-button';
import moment from 'moment';
import { decryptData } from '../../../EncryptedPage';


const TuitionPercentage = () => {


    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [isActive, setIsActive] = useState({});



    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'packageCreatedUser', headerName: 'Admin', flex: 1 },
        { field: 'package', headerName: 'Package', flex: 1 },
        { field: 'presentAmount', headerName: 'Present Amount', minWidth: 70, maxWidth: 70 },
        { field: 'packageType', headerName: 'Package Type', minWidth: 70, maxWidth: 70 },
        { field: 'formattedJoinDate', headerName: 'Created At', minWidth: 160 },
        { field: 'discountPercentage', headerName: 'Discount', flex: 1 },
        { field: 'discountAmount', headerName: 'Discount Amount', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1.5,
            renderCell: (params) => {
                const id = params.row.id;
                const isRowActive = isActive[id] !== undefined ? isActive[id] : params.row.isActive; // Use state for each row

                return (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <FaUserEdit
                            title="Edit"
                            size={25}
                            color="black"
                            onClick={() => handleFormOpen(params.row)}
                            className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                        />

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

                        {/* Toggle Button */}
                        <ToggleButton
                            inactiveLabel={<FaTimes />}

                            activeLabel={<FaCheck />}
                            value={isRowActive}
                            onToggle={() => {
                                handleToggle(!isRowActive); // Toggle the state
                            }}
                            className="transition duration-300 scale-75 " // For smooth transitions
                        />


                    </div>
                );
            },
        },
    ];




    const handleToggle = async (id, currentState) => {
        try {
            // API Call to update isActive status
            const response = await fetch(`${BASE_URL}/api/admin/update-status/${id}/`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ is_active: !currentState })
            });

            if (response.ok) {
                setIsActive((prevState) => ({
                    ...prevState,
                    [id]: !currentState, // Update specific row's isActive state
                }));
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };



    useEffect(() => {
        const fetchData = async () => {
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
            console.log(token)


            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/api/admin/get-pro-tutor-dynamic-price-list/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                setRows(data.map(item => ({
                    id: item.id,
                    packageCreatedUser: item.package_created_user,
                    package: item.package,
                    presentAmount: Number(Number(item.present_amount).toFixed(0)),
                    discountPercentage: item.discount_percentage,
                    discountAmount: Number(Number(item.discount_amount).toFixed(0)),
                    packageDescription: item.package_description,
                    packageType: item.package_type,
                    advancePercentage: item.advance_percentage,
                    latePercentage: item.late_percentage,
                    createdAt: item.created_at,
                    formattedJoinDate: moment(item.created_at).format('DD/MM/YYYY hh:mm a') || '',
                    updatedAt: item.updated_at,
                    isActive: item.is_active
                })));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleFormOpen = (row) => {
        setFormData(row);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setFormData({ id: null, category: '', presentAmount: '', discountAmount: '', details: '' });
        setIsFormOpen(false);
    };


    const handleCreateFormClose = () => {
        setIsCreateFormOpen(false);
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


        if (name === "discountPercentage") {
            const discountValue = value ? parseFloat(value) : 0;
            const presentAmountValue = parseFloat(formData.presentAmount) || 0;


            const newAmount = presentAmountValue - (presentAmountValue * discountValue / 100);

            setFormData({
                ...formData,
                [name]: value,
                newAmount: newAmount.toFixed(0),
            });
        } else {

            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };


    const handleCreateFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        try {
            // API call to create new pricing data
            const response = await fetch('/api/pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newPricing = await response.json();
                setRows([...rows, newPricing]);
                handleCreateFormClose();
            } else {
                console.error('Failed to create pricing');
            }
        } catch (error) {
            console.error('Error creating pricing:', error);
        }
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        try {
            // API call to update pricing data
            const response = await fetch(`/api/pricing/${formData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedPricing = await response.json();
                setRows(rows.map((row) => (row.id === updatedPricing.id ? updatedPricing : row)));
                handleFormClose();
            } else {
                console.error('Failed to update pricing');
            }
        } catch (error) {
            console.error('Error updating pricing:', error);
        }
    };

    const handleChangeCreateForm = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updatedForm = { ...prev, [name]: value };

            // Calculate remaining amount after discount
            if (
                (name === 'presentAmount' || name === 'discountPercentage') &&
                updatedForm.presentAmount &&
                updatedForm.discountPercentage
            ) {
                const discount = (updatedForm.presentAmount * updatedForm.discountPercentage) / 100;
                const remainingAmount = updatedForm.presentAmount - discount;
                updatedForm.newAmount = remainingAmount.toFixed(0);

            }

            return updatedForm;
        });
    };



    return (

        <div className="w-full ">

            <button onClick={setIsCreateFormOpen} className='p-2 my-2 text-white  bg-green-800 rounded'>create price</button>

            {/* DataGrid */}
            <div style={{ height: '80vh', width: '100%' }}>

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

                )}

            </div>


            {/* create form Modal */}
            <Modal open={isCreateFormOpen} onClose={handleCreateFormClose} maxWidth="md" >
                <Box
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white p-6 rounded-lg shadow-lg"
                >
                    <Typography variant="h6" className="mb-4">
                        Pro Package Subscription
                    </Typography>
                    <form onSubmit={handleCreateFormSubmit} className="grid grid-cols-2 gap-4">
                        {/* Left side inputs */}
                        <div className="col-span-1 space-y-4">
                            <TextField
                                select
                                fullWidth
                                name="package"
                                label="package"
                                value={formData.package}
                                onChange={handleChangeCreateForm}
                                required
                            >
                                <MenuItem value="1">One Month</MenuItem>
                                <MenuItem value="2">Two Month</MenuItem>
                                <MenuItem value="3">Three Month</MenuItem>
                                <MenuItem value="4">Four Month</MenuItem>
                                <MenuItem value="5">Five Month</MenuItem>
                                <MenuItem value="6">Six Month</MenuItem>
                                <MenuItem value="7">Seven Month</MenuItem>
                                <MenuItem value="8">Eight Month</MenuItem>
                                <MenuItem value="9">Nine Month</MenuItem>
                                <MenuItem value="10">Ten Month</MenuItem>
                                <MenuItem value="11">Eleven Month</MenuItem>
                                <MenuItem value="12">Twelve Month</MenuItem>

                            </TextField>
                            <TextField
                                fullWidth
                                name="presentAmount"
                                label="Present Amount"
                                type="number"
                                value={formData.presentAmount}
                                onChange={handleChangeCreateForm}
                                required
                            />
                            <TextField
                                fullWidth
                                name="discountPercentage"
                                label="Discount Percentage"
                                type="number"
                                value={formData.discountPercentage}
                                onChange={handleChangeCreateForm}
                                required
                            />
                            <TextField
                                fullWidth
                                name="newAmount"
                                label="New Amount"
                                type="number"
                                value={formData.newAmount}
                                onChange={handleChangeCreateForm}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />


                        </div>

                        {/* Right side input */}
                        <div className="col-span-1">

                            <Typography className="mb-4 text-gray-800 leading-relaxed text-lg">
                                Use
                                <span className="bg-slate-200 px-3 py-1 rounded-lg mx-2 inline-block text-blue-600 font-semibold">
                                    .
                                </span>
                                to add multiple lines...
                            </Typography>



                            <TextField
                                fullWidth
                                name="details"
                                label="Details"
                                multiline
                                rows={8}

                                value={formData.details}
                                onChange={handleChangeCreateForm}
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




            {/* Form Modal */}
            <Modal open={isFormOpen} onClose={handleFormClose} maxWidth="md" >
                <Box
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white p-6 rounded-lg shadow-lg"
                >
                    <Typography variant="h6" className="mb-4">
                        Edit Package Details
                    </Typography>
                    <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
                        {/* Left side inputs */}
                        <div className="col-span-1 space-y-4">
                            <TextField
                                select
                                fullWidth
                                name="package"
                                label="Package"
                                value={formData.package}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="1">One Month</MenuItem>
                                <MenuItem value="2">Two Month</MenuItem>
                                <MenuItem value="3">Three Month</MenuItem>
                                <MenuItem value="4">Four Month</MenuItem>
                                <MenuItem value="5">Five Month</MenuItem>
                                <MenuItem value="6">Six Month</MenuItem>
                                <MenuItem value="7">Seven Month</MenuItem>
                                <MenuItem value="8">Eight Month</MenuItem>
                                <MenuItem value="9">Nine Month</MenuItem>
                                <MenuItem value="10">Ten Month</MenuItem>
                                <MenuItem value="11">Eleven Month</MenuItem>
                                <MenuItem value="12">Twelve Month</MenuItem>

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
                                name="discountPercentage"
                                label="Discount Percentage"
                                type="number"
                                value={formData.discountPercentage}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                fullWidth
                                name="newAmount"
                                label="New Amount"
                                type="number"
                                value={formData.newAmount}
                                onChange={handleChange}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        </div>

                        {/* Right side input */}
                        <div className="col-span-1">

                            <Typography className="mb-4 text-gray-800 leading-relaxed text-lg">
                                Use
                                <span className="bg-slate-200 px-3 py-1 rounded-lg mx-2 inline-block text-blue-600 font-semibold">
                                    .
                                </span>
                                to add multiple lines...
                            </Typography>

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

export default TuitionPercentage;
