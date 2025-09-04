// src/pages/Support.jsx
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "../api/axios";

const Support = () => {
  const [form, setForm] = useState({ email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // 🔹 API endpoint for support messages (create one in backend if needed)
      await axios.post("/support", form);
      setSnackbar({ open: true, message: "Your message has been sent!", severity: "success" });
      setForm({ email: "", message: "" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to send. Try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Support
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Find answers to common questions or reach out to us directly.
      </Typography>

      {/* FAQ Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Frequently Asked Questions
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I reset my password?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Go to the login page and click "Forgot Password". Follow the instructions sent to your email.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I update my profile information?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Navigate to your Settings page where you can edit your username and profile picture.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I contact support?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You can use the contact form below or email us directly at <b>support@example.com</b>.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Contact Form */}
      <Paper sx={{ p: 4, mt: 5, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom>
          Contact Support
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ py: 1.2 }}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Support;
