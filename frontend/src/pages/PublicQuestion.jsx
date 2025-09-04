// pages/PublicQuestion.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";

const PublicQuestion = () => {
  const { slug } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch the question
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`/public-questions/${slug}`);
        setQuestion(res.data);
      } catch (err) {
        console.error("Error fetching question:", err);
        setSnackbar({ open: true, message: "Failed to load question", severity: "error" });
      }
    };
    fetchQuestion();
  }, [slug]);

  // Submit answer
  const handleSubmit = async () => {
    try {
      await axios.post(
        `/public-questions/${slug}/answer`,
        { answer },
        { withCredentials: false } // important for public
      );
      setSnackbar({ open: true, message: "Answer submitted successfully!", severity: "success" });
      setAnswer("");
    } catch (err) {
      console.error("Error submitting answer:", err);
      setSnackbar({ open: true, message: "Failed to submit answer", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!question) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <h2>{question.text}</h2>

      {question.options?.length > 0 && (
        <ul>
          {question.options.map((opt, i) => (
            <li key={i}>{opt}</li>
          ))}
        </ul>
      )}

      <TextField
        label="Your Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit Answer
      </Button>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PublicQuestion;
