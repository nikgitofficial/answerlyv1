// src/pages/Contact.jsx
import React, { useState, useRef, useEffect } from "react";
import api from "../api/axios"; 
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";

// Reusable fade-up-on-scroll component
const FadeUpOnScroll = ({ children, threshold = 0.2, delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(ref.current);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      {children}
    </div>
  );
};

const Contact = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post("/contact", formData);  // this now goes to http://localhost:5000/api/contact
    setSnackbar({ open: true, message: "Message sent successfully!", severity: "success" });
    setFormData({ name: "", email: "", message: "" });
  } catch (error) {
    setSnackbar({
      open: true,
      message: error.response?.data?.error || "Failed to send message",
      severity: "error",
    });
  }
};


  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 10 }}>
      {/* Hero */}
      <FadeUpOnScroll>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
            Get in Touch
          </Typography>
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 640, mx: "auto" }}
          >
            We’d love to hear from you! Send us a message and we’ll get back to you as soon as possible.
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* Contact Form */}
      <FadeUpOnScroll delay={100}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(255,255,255,0.95)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={6}
                  required
                />
              </Grid>
             <Grid item xs={12} sx={{ textAlign: "center" }}>
               <Button
    type="submit"
    variant="contained"
    size="large"
    sx={{
      px: 6,
      py: 1.5,
      borderRadius: 3,
      color: "#fff",
      background: "linear-gradient(90deg, #087f23, #4CAF50)", // green gradient
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      fontWeight: "bold",
      transition: "transform 0.3s, opacity 0.3s",
      "&:hover": {
        background: "linear-gradient(90deg, #065a18, #388E3C)", // darker green on hover
        transform: "scale(1.03)",
        opacity: 0.95,
      },
    }}
  >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </FadeUpOnScroll>

      {/* Contact Info */}
      <FadeUpOnScroll delay={200}>
        <Box sx={{ mt: 12, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Other Ways to Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Email: nickforjobacc@gmail.com
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Phone: +63 9514190949
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Address: Purok ASCI, BRGY-1 Nasipit Agusan Del Norte, 2025
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
