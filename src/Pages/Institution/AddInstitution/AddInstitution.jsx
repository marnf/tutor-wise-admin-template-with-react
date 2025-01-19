import React, { useState } from "react";
import './AddInstitution.css'
import BASE_URL from "../../../Api/baseUrl";

const InstitutionForm = () => {
    const [institutionName, setInstitutionName] = useState("");
    const [image, setImage] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleNameChange = (e) => setInstitutionName(e.target.value);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file)); // Creating object URL for the image to display immediately
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", institutionName);  // Name is always sent

        if (image) {
            // If there is an image, append it
            formData.append("logo", image);
        } else {
            // If no image is selected, logo field will not be sent
            formData.append("logo", "");  // You can also send empty string or just remove the line entirely
        }

        fetch(`${BASE_URL}/api/admin/add-institution/`, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    setSuccess(true);
                    setInstitutionName("");
                    setImage(null);
                    window.location.reload();
                } else {
                    setSuccess(false);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error("Error submitting form:", error);
                setSuccess(false);
            });
    };



    return (
        <div className="page-body pt-1">
            <div className="form-container mt-5">
                <form id="myForm" onSubmit={handleSubmit}>
                    {/* Institution Name Section */}
                    <div className="form-group">
                        <label htmlFor="institutionName" className="form-label">
                            Institution Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="institutionName"
                            name="name"
                            value={institutionName}
                            onChange={handleNameChange}
                            placeholder="Enter institution name"
                            required
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div className="form-group">
                        <label htmlFor="imageInput" className="form-label">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="imageInput"
                            name="logo"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Display the uploaded image */}
                    {image && (
                        <div className="image-preview">
                            <h4>Image Preview</h4>
                            <img
                                src={image}
                                alt="Uploaded Preview"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    borderRadius: "10px",
                                    objectFit: "cover",
                                    marginBottom: "20px",
                                }}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="button-container mt-3">
                        <button type="submit" className="submit-btn">
                            Submit
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Popup */}
            {success === true && (
                <div
                    style={{
                        display: "block",
                        position: "fixed",
                        top: "20%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#36b95d",
                        color: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div>
                        <h6 className="text-white">Data successfully submitted!</h6>
                    </div>
                </div>
            )}

            {/* Failure Popup */}
            {success === false && (
                <div
                    style={{
                        display: "block",
                        position: "fixed",
                        top: "20%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#bd0707",
                        color: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div>
                        <h6 className="text-white">Failed to submit...</h6>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstitutionForm;
