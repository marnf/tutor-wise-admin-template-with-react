import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./AddFaq.css"; // Custom CSS for styling

const AddFaq = () => {
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const question = event.target.question.value;
    const answer = event.target.answer.value;

    try {
      const response = await fetch(
        "https://tutorwise-backend.vercel.app/api/admin/add-faq/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question, answer }),
        }
      );

      if (response.ok) {
        setPopupMessage("Data successfully submitted.");
        setIsSuccess(true);
        event.target.reset(); // Reset form fields
      } else {
        setPopupMessage("Failed to submit data.");
        setIsSuccess(false);
      }
    } catch (error) {
      setPopupMessage("Error: Unable to connect to the server.");
      setIsSuccess(false);
    }

    // Open Snackbar
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="page-body pt-1">
      <div className="form-container">
        <h2 className="form-title">Add FAQ Section</h2>
        <form id="myForm" onSubmit={handleSubmit}>
          {/* Question Section */}
          <div className="form-group">
            <label htmlFor="questionInput" className="form-label">
              Question
            </label>
            <input
              type="text"
              className="form-control"
              name="question"
              id="questionInput"
              placeholder="Enter your question"
              required
            />
          </div>

          {/* Answer Section */}
          <div className="form-group">
            <label htmlFor="answerInput" className="form-label">
              Answer
            </label>
            <textarea
              className="form-control"
              name="answer"
              id="answerInput"
              rows="4"
              placeholder="Enter the answer"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="button-container mt-3">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Snackbar for success/failure */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={isSuccess ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {popupMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default AddFaq;
