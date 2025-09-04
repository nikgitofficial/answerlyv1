import { useState, useContext, useRef } from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  Stack,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const fileInputRef = useRef(null);

  const originalPic = user?.profilePic;

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('profilePic', image);

    try {
      setLoading(true);
      const res = await axios.post('/profile/upload-profile-pic', formData);
      setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      setSnackbar({ open: true, message: 'Profile picture updated!' });
      setImage(null);
    } catch (error) {
      setSnackbar({ open: true, message: 'Upload failed!' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setImage(null);
    setUser((prev) => ({ ...prev, profilePic: originalPic }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 500,
        margin: 'auto',
        mt: 4,
        p: 4,
        borderRadius: 3,
        textAlign: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Profile Picture
      </Typography>

      <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
        <Avatar
          src={user.profilePic}
          alt="Profile"
          sx={{ width: 140, height: 140, mx: 'auto' }}
        />
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark' },
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
          sx={{ minWidth: 160 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
        </Button>

        {image && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            disabled={loading}
            sx={{ minWidth: 160 }}
          >
            Cancel
          </Button>
        )}
      </Stack>

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: '' })}
        autoHideDuration={3000}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Profile;