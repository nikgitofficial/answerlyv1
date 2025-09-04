// src/pages/Settings.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const fileInputRef = useRef(null);

  const originalPic = user?.profilePic;

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // ✅ Username update
  const handleSaveUsername = async () => {
    try {
      setLoading(true);
      const res = await axios.patch("/auth/update-username", { username });
      setUser(res.data.user);
      setSnackbar({ open: true, message: "Username updated successfully!", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Update failed!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Profile picture upload
  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("profilePic", image);

    try {
      setLoading(true);
      const res = await axios.post("/profile/upload-profile-pic", formData);
      setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      setSnackbar({ open: true, message: "Profile picture updated!", severity: "success" });
      setImage(null);
    } catch (error) {
      setSnackbar({ open: true, message: "Upload failed!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setImage(null);
    setUser((prev) => ({ ...prev, profilePic: originalPic }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Settings
        </Typography>

        {/* ✅ Profile Picture Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Profile Picture
          </Typography>
          <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
            <Avatar src={user.profilePic} alt="Profile" sx={{ width: 120, height: 120, mx: "auto" }} />
            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              <PhotoCamera />
              <input
                ref={fileInputRef}
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  if (file) {
                    const preview = URL.createObjectURL(file);
                    setUser((prev) => ({ ...prev, profilePic: preview }));
                  }
                }}
              />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading || !image}
              sx={{ minWidth: 140 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
            </Button>

            {image && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                disabled={loading}
                sx={{ minWidth: 140 }}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ✅ Username Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Edit Username
          </Typography>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            value={email}
            disabled
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSaveUsername}
            disabled={loading}
            sx={{ py: 1.2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save Username"}
          </Button>
        </Box>
      </Paper>

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

export default Settings;
