import React, { useState, useEffect, useRef } from "react";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormLabel,
    Grid,
    LinearProgress,
    MenuItem,
    Radio,
    RadioGroup,
    Snackbar,
    TextareaAutosize,
    TextField,
    Menu,
    Typography,
} from "@mui/material";
import { SiGitconnected } from "react-icons/si";
import { DataGrid } from "@mui/x-data-grid";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import { BorderLeft } from "@mui/icons-material";

import { BsFillCalendarDateFill } from "react-icons/bs";
import { DateRangePicker } from "react-date-range";
import moment from 'moment';
import BASE_URL from "../../../Api/baseUrl";
import { decryptData } from "../../../EncryptedPage";
import { IoMdDownload } from "react-icons/io";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
// import { Document, Packer, Paragraph, TextRun } from "docx";


// Dummy subject options
const subjectOptions = [
    "Bangla", "English", "Math", "Physics", "Science", "Chemistry",
    "Digital Technology", "Life and livelihood", "Healthy Safety",
    "Religious Studies", "Biology", "Information and Communication Technology",
    "Agriculture Education", "Geography", "Psychology", "Sports",
    "Accounting", "Finance & Banking", "Economics", "Statistics",
    "Production Management & Marketing", "Business Organization and management",
    "Civic & Good Governance", "History", "History and Social Sciences",
    "Islamic History", "Sociology", "Social Work", "Logic", "Soil Science",
    "Arts and crafts", "Art and Culture"
];


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

const columns = [
    { field: "userId", headerName: "ID", minWidth: 130 },
    { field: "name", headerName: "Name", minWidth: 150 },
    { field: "referrer", headerName: "Referrer Id", minWidth: 130, maxWidth: 130 },
    { field: "budget", headerName: "Budget", minWidth: 60, maxWidth: 60 },
    { field: "gender", headerName: "Gender", minWidth: 60, maxWidth: 60 },
    { field: "subject", headerName: "Subject", minWidth: 180 },
    { field: "formattedJoinDate", headerName: "Post Date", minWidth: 160 },


    // { field: "subject", headerName: "Subject", minWidth: 150 },
    // { field: "class_name", headerName: "Class", minWidth: 120 },
    // { field: "lesson_type", headerName: "Lesson Type", minWidth: 100 },
    // { field: "details", headerName: "Details", minWidth: 200 },
    // { field: "location", headerName: "Location", minWidth: 200 },
    // { field: "days_per_week", headerName: "Days/Week", minWidth: 60 },
    // { field: "start_immediate", headerName: "Start Immediately", minWidth: 60 },
    // { field: "additional_comment", headerName: "Additional Comment", minWidth: 200 },
    {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (


            <Box display="flex" justifyContent="center" className="mt-3" gap={1}>
                {/* 
                <FaUserEdit title="Edit"
                    size={25}
                    disabled
                    color="black"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleEdit(params.row)} /> */}

                <FaUserEdit
                    title="Edit"
                    size={25}
                    color="gray"
                    className="transition ease-in-out delay-250 hover:scale-100 cursor-not-allowed"
                    style={{
                        pointerEvents: "none",
                        opacity: 0.5,
                    }}
                />


                <IoMdDownload title="View"
                    size={29}
                    color="#f0523a"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleDownloadModal(params.row)}
                />


                <BiSolidUserDetail title="View"
                    size={29}
                    color="#f0523a"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                    onClick={() => params.row.handleViewModal(params.row)}
                />


                {/* 
                <MdDelete
                    title="Delete"
                    size={25}
                    color={isSuperAdmin ? "red" : "gray"}
                    className={`transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 ${isSuperAdmin ? "cursor-pointer" : "cursor-not-allowed"
                        }`}
                    onClick={() => {
                        if (isSuperAdmin) {
                            params.row.handleDelete(params.row);
                        }
                    }}
                    style={{
                        pointerEvents: isSuperAdmin ? "auto" : "none",
                        opacity: isSuperAdmin ? 1 : 0.5,
                    }}
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


            </Box>

        ),
    },
];


const AllTuition = () => {
    const [rows, setRows] = useState([]);
    const [view, setView] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [deleteData, setDeleteData] = useState({});
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDownloadModal, setOpenDownloadModal] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [refreshTable, setRefreshTable] = useState(false)

    const modalRef = useRef(null);


    useEffect(() => {
        setLoading(true);
        fetch(`${BASE_URL}/api/admin/tuition/list/`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    userId: item.student_customized_id,
                    name: item.student_name,
                    referrer: item.ref_referrer_customized_id,
                    phone: item.phone,
                    email: item.gmail,
                    lessonType: item.lesson_type,
                    jobTitle: item.job_title,
                    educationalLevel: item.educational_level_choices,
                    studyMaterial: item.study_material || "N/A",
                    startImmediate: item.start_immediate ? "Yes" : "No",
                    subject: item.subject.join(", "),
                    budget: Number(Number(item.budget_amount).toFixed(0)),
                    daysPerWeek: item.days_per_week,
                    gender: item.gender,
                    division: item.division || "N/A",
                    district: item.district || "N/A",
                    tuitionStartDate: moment(item.tuition_start_date).format("YYYY-MM-DD"),
                    curriculum: item.curriculum,
                    createdAt: moment(item.created_at).format("YYYY-MM-DD"),
                    formattedJoinDate: moment(item.created_at).format("DD/MM/YYYY hh:mm a"),
                    isActive: item.is_active ? "Active" : "Inactive",
                    handleEdit: handleEditRequest,
                    handleDelete: handleDeleteRequest,
                    handleViewModal: handleOpenViewModal,
                    handleDownloadModal: handleOpenDownloadModal,

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


    // useEffect(() => {
    //     const result = rows.filter((row) =>
    //         Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    //     );
    //     setFilteredRows(result);
    // }, [searchQuery, rows]);


    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            const result = rows.filter((row) =>
                Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRows(result);
        }, 500);

        return () => clearTimeout(debounceSearch);
    }, [searchQuery, rows]);


    const handleDateFilter = () => {
        const startDate = new Date(dateRange[0].startDate).setHours(0, 0, 0, 0); // Start of the day
        const endDate = new Date(dateRange[0].endDate).setHours(23, 59, 59, 999); // End of the day

        console.log("Start Date:", startDate, "End Date:", endDate);

        const filteredData = rows.filter((row) => {
            const rowDate = new Date(row.createdAt).getTime();
            console.log("Row Date:", rowDate); // Debug
            return rowDate >= startDate && rowDate <= endDate;
        });

        console.log("Filtered Data:", filteredData); // Debug filtered rows
        setFilteredRows(filteredData);
        setShowDatePicker(false); // Close the date picker after filtering
    };


    const resetFilters = () => {
        setRefreshTable((prev) => !prev);
    }

    const handleEditRequest = (row) => {
        setEditData({
            ...row,
        });
        setOpen(true);
    };

    const handleDeleteRequest = (row) => {
        setDeleteData(row);
        setOpenDeleteModal(true);

    };

    const handleOpenViewModal = (row) => {
        setOpenViewModal(true)
        setView(row)
    }

    const handleOpenDownloadModal = (row) => {
        setOpenDownloadModal(true)
        setView(row)
    }

    const handleCloseViewModal = () => {
        setOpenViewModal(false)
    }

    const handleCloseDownloadModal = () => {
        setOpenDownloadModal(false)
    }



    const handleDelete = (e) => {
        e.preventDefault();
        fetch(`${BASE_URL}/api/admin/unapprove-request-tutor/${deleteData.id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    setRows((prevRows) => prevRows.filter((row) => row.id !== deleteData.id));
                    setOpenDeleteModal(false);
                    setSnackbarMessage("Tutor request deleted successfully.");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                } else {
                    console.error("Failed to delete request.");
                    setSnackbarMessage("Failed to delete tutor request.");
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                }
            })
            .catch((error) => {
                console.error("Error processing request:", error);
                setSnackbarMessage("Error occurred while deleting the request.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            });
    };


    const handleSubmit = (e) => {

        console.log(editData)
        e.preventDefault();
        fetch(`${BASE_URL}/api/admin/edit-approved-request-tutor/${editData.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData),
        })
            .then((response) => {
                if (response.ok) {
                    setRows((prevRows) =>
                        prevRows.map((row) => (row.id === editData.id ? editData : row))
                    );
                    setOpen(false);
                    setSnackbarMessage("Tutor request updated successfully.");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                } else {
                    console.error("Failed to update.");
                    setSnackbarMessage("Failed to update tutor request.");
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                }
            })
            .catch((error) => {
                console.error("Error updating data:", error);
                setSnackbarMessage("Error occurred while updating the request.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            });
    };

    const handleClose = () => {
        setOpen(false);

    };


    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };







    const handleDownloadImage = async () => {
        if (modalRef.current) {
            const canvas = await html2canvas(modalRef.current, {
                backgroundColor: null, // Transparent Background
                scale: 3, // Increase scale for higher resolution
                useCORS: true, // Fix potential CORS issues
                logging: true, // Useful for debugging
            });
            const image = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = image;
            link.download = "modal-content.png";
            link.click();
        }
        handleClose(); // Close dropdown after selection
    };

    // Handle PDF download

    // const handleDownloadPDF = async () => {
    //     if (modalRef.current) {
    //         const canvas = await html2canvas(modalRef.current, {
    //             backgroundColor: null,
    //             scale: 3,
    //             useCORS: true,
    //         });
    //         const imgData = canvas.toDataURL("image/png");

    //         const doc = new jsPDF();
    //         const imgWidth = 210; // A4 page width in mm
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    //         // Add image with calculated height
    //         doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    //         doc.save("modal-content.pdf");
    //     }
    //     handleClose(); // Close dropdown after selection
    // };


    // Handle DOC (Word) download
    const handleDownloadDOC = async () => {
        try {
            if (modalRef.current) {
                // Create a new DOCX document with formatted content
                const doc = new Document({
                    sections: [
                        {
                            properties: {},
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "আসসালামু আলাইকুম।",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "TutorWise এর পক্ষ থেকে শুভেচ্ছা।",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "টিউটর আবশ্যক",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • লোকেশন: " + (view?.district || '') + " " + (view?.division || ''),
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • সাবজেক্ট: " + (view?.subject || ''),
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • মিডিয়াম: " + (view?.medium || ''),
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • ক্লাস: " + (view?.educationalLevel || ''),
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • শিক্ষার্থী: " + (view?.studentName || ''),
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • টিউটর: " + (view?.tutorName || ''),
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • শুরুর তারিখ: " + (view?.tuitionStartDate || ''),
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • সপ্তাহে: " + (view?.daysPerWeek || '') + " দিন",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • বেতন : " + (view?.budget || '') + " /মাস",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "     • পড়াতে হবে: " + (view?.curriculum || ''),
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                               
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "এই টিউশনি পেতে এখনই ভিজিট করুন: www.tutorwise.com.bd",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Phone/WhatsApp: 01897-621279",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Facebook Page: https://www.facebook.com/tutorwise.com.bd",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Youtube: https://www.youtube.com/@tutorwise",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Email: tutorwise.com.bd@gmail.com",
                                            font: "Arial Unicode MS", 
                                        }),
                                    ],
                                }),
                            ],
                        },
                    ],
                });

                // Convert the document to a base64 string
                const base64String = await Packer.toBase64String(doc);

                // Convert the base64 string to a Blob
                const blob = new Blob([new Uint8Array(atob(base64String).split("").map(char => char.charCodeAt(0)))], {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                });

                // Create a download link and trigger the download
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "modal-content.docx";
                link.click();
            }
        } catch (error) {
            console.error("Error creating DOCX:", error);
        }

        handleClose(); // Close the dropdown after download
    };









    return (
        <Box sx={{ height: "80vh", width: "100%", padding: 2 }}>

            <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center  text-end gap-1">


                <div className="flex justify-end gap-2 items-center mb-2">
                    <div className="relative flex items-center justify-start gap-1">
                        <BsFillCalendarDateFill
                            size={40}
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
                                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={handleDateFilter}
                                    >
                                        Apply Filter
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </Button>
                                </div>

                            </div>

                        )}
                    </div>

                    <TextField
                        label="Search Tutor Requests"
                        variant="outlined"
                        value={searchQuery}
                        size="small"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "300px" }}
                    />
                </div>

                <Typography variant="text-base" className="flex h5">
                    <strong className="text-gray-500">Total Posts:{rows.length} </strong>
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
                        minWidth: col.minWidth || 150,
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

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Edit Student Details</DialogTitle>
                <DialogContent>
                    <form className="mt-2" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Customized ID */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Customized ID"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.customized_id || ""}
                                    disabled
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            {/* Created At */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Created At"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.created_at || ""}
                                    disabled
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>



                            {/* Phone */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.phone || ""}
                                    disabled
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>


                            {/* Gmail */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Gmail"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.gmail || ""}
                                    disabled
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            {/* NID Card */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="NID Card Number"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.nidcard_number || ""}
                                    disabled
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            {/* Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.full_name || ""}
                                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "black",
                                                borderWidth: "2px",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "black",
                                                borderWidth: "3px",
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Division */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Division"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.division || ""}
                                    onChange={(e) => setEditData({ ...editData, division: e.target.value })}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "black",
                                                borderWidth: "2px",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "black",
                                                borderWidth: "3px",
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* District */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="District"
                                    variant="outlined"
                                    fullWidth
                                    value={editData.district || ""}
                                    onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "black",
                                                borderWidth: "2px",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "black",
                                                borderWidth: "3px",
                                            },
                                        },
                                    }}
                                />
                            </Grid>



                            {/* Gender */}
                            <Grid item xs={12} sm={6}>
                                <FormLabel className="mb-1">Gender</FormLabel>
                                <RadioGroup
                                    className=" border-t-2 border-gray-500"
                                    row
                                    value={editData.gender || ""}
                                    onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                >
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Others" control={<Radio />} label="Others" />
                                </RadioGroup>
                            </Grid>



                            {/* Submit and Cancel Buttons */}
                            <Grid item xs={12}>
                                <DialogActions>
                                    <Button onClick={handleClose} variant="outlined" color="secondary">
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </DialogActions>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>


            <Dialog open={openViewModal} onClose={handleCloseViewModal} maxWidth="md" >
                <Box
                    sx={{
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                        backgroundColor: "#ffffff",

                        margin: "auto",
                    }}
                >
                    {/* Header Section */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingBottom: 2,
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {view?.name || "No Name"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#555" }}>
                                    {view?.email || "No Email"}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={view?.startImmediate || false} disabled />}
                                        label="Start Immediate"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={view?.is_active || false} disabled />}
                                        label="Active"
                                    />

                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ textAlign: "right", color: "#777" }}>
                                <strong>ID:</strong> {view?.userId || "No ID"}
                            </Typography>
                            <Typography variant="body2">
                                {view?.createdAt
                                    ? new Date(view.createdAt).toLocaleString()
                                    : "No Created Date"}
                            </Typography>

                        </Box>
                    </Box>

                    {/* Body Section */}
                    <Box sx={{ marginTop: 3 }}>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 2,
                            }}
                        >
                            <Typography variant="body1">
                                <strong>Phone:</strong> {view?.phone || "No Phone"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Gender:</strong> {view?.gender || "No Gender"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Division:</strong>{view?.district || "No District"} {view?.division || "No Division"}
                            </Typography>

                            <Typography variant="body1">
                                <strong>Educational Level:</strong> {view?.educationalLevel || "No Data"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Lesson Type:</strong> {view?.lessonType || "No Data"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Subject:</strong> {view?.subject || "No Subject"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Budget:</strong> {view?.budget ? `${view.budget} ` : "No Budget"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Days Per Week:</strong> {view?.daysPerWeek || "No Data"}
                            </Typography>

                            <Typography variant="body1">
                                <strong>Tuition Start Date: <br /></strong>{" "}
                                {view?.tuitionStartDate
                                    || "No Date"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Curriculum: <br /></strong> {view?.curriculum || "No Curriculum"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Job Title: <br /> </strong> {view?.jobTitle || "No jobTitle"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Study Material:  <br /></strong> {view?.study_material || "No study material"}
                            </Typography>

                        </Box>
                    </Box>

                    {/* Footer Section */}
                    <Box sx={{ textAlign: "center", marginTop: 4 }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                fontWeight: "bold",
                                padding: "0.5rem 2rem",
                                "&:hover": {
                                    backgroundColor: "#0056b3",
                                },
                            }}
                            onClick={handleCloseViewModal}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Dialog>


            <Dialog open={openDownloadModal} onClose={handleCloseDownloadModal} maxWidth="md">
                <Box
                    sx={{
                        padding: 4,
                        backgroundColor: "#ffffff",
                        margin: "auto",
                    }}
                    ref={modalRef} // Attach ref to modal content
                >
                    {/* Header Section */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 2, borderBottom: "1px solid #ddd" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {view?.name || "No Name"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#555" }}>
                                    {view?.email || "No Email"}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={view?.startImmediate || false} disabled />}
                                        label="Start Immediate"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={view?.is_active || false} disabled />}
                                        label="Active"
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ textAlign: "right", color: "#777" }}>
                                <strong>ID:</strong> {view?.userId || "No ID"}
                            </Typography>
                            <Typography variant="body2">
                                {view?.createdAt ? new Date(view.createdAt).toLocaleString() : "No Created Date"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Body Section */}
                    <Box sx={{ marginTop: 3 }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                            <Typography variant="body1"><strong>Phone:</strong> {view?.phone || "No Phone"}</Typography>
                            <Typography variant="body1"><strong>Gender:</strong> {view?.gender || "No Gender"}</Typography>
                            <Typography variant="body1"><strong>Division:</strong>{view?.district || "No District"} {view?.division || "No Division"}</Typography>
                            <Typography variant="body1"><strong>Educational Level:</strong> {view?.educationalLevel || "No Data"}</Typography>
                            <Typography variant="body1"><strong>Lesson Type:</strong> {view?.lessonType || "No Data"}</Typography>
                            <Typography variant="body1"><strong>Subject:</strong> {view?.subject || "No Subject"}</Typography>
                            <Typography variant="body1"><strong>Budget:</strong> {view?.budget ? `${view.budget} ` : "No Budget"}</Typography>
                            <Typography variant="body1"><strong>Days Per Week:</strong> {view?.daysPerWeek || "No Data"}</Typography>
                            <Typography variant="body1"><strong>Tuition Start Date: <br /></strong> {view?.tuitionStartDate || "No Date"}</Typography>
                            <Typography variant="body1"><strong>Curriculum: <br /></strong> {view?.curriculum || "No Curriculum"}</Typography>
                            <Typography variant="body1"><strong>Job Title: <br /> </strong> {view?.jobTitle || "No jobTitle"}</Typography>
                            <Typography variant="body1"><strong>Study Material:  <br /></strong> {view?.study_material || "No study material"}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box className="flex items-center justify-end mt-5 m-2 gap-5">
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "0.5rem 2rem",
                            "&:hover": {
                                backgroundColor: "#0056b3",
                            },
                        }}
                        onClick={handleCloseDownloadModal}
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "0.5rem 2rem",
                            "&:hover": {
                                backgroundColor: "#0056b3",
                            },
                        }}
                        onClick={handleDownloadImage} // Open dropdown
                    >
                        Download Image
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "0.5rem 2rem",
                            "&:hover": {
                                backgroundColor: "#0056b3",
                            },
                        }}
                        onClick={handleDownloadDOC} // Open dropdown
                    >
                        Download Docx
                    </Button>

                    {/* <Menu
                        anchorEl={types}
                        open={buttonOpen}
                        onClose={handleClose}
                        sx={{
                            marginTop: 1,
                        }}
                    >
                        <MenuItem onClick={handleDownloadImage}>Download Image (PNG)</MenuItem>
                        <MenuItem onClick={handleDownloadPDF}>Download PDF</MenuItem>
                        <MenuItem onClick={handleDownloadDOC}>Download DOC</MenuItem>
                    </Menu> */}
                </Box>
            </Dialog>





            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this tutor request?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box>
    );
};




export default AllTuition;




