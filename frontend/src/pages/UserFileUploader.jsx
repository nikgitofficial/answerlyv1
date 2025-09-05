import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Box,
  IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Snackbar, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Tooltip,
  TextField
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from '../api/axios';
import CloseIcon from '@mui/icons-material/Close';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserFileUploader = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editDialog, setEditDialog] = useState({ open: false, id: '', oldName: '', newName: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: '' });
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/files', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setFiles(res.data);
    } catch (err) {
      console.error('❌ Error fetching files:', err);
      showSnackbar('❌ Failed to fetch files', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showSnackbar('❗ Please select a file', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    let simulatedProgress = 0;
    const progressInterval = setInterval(() => {
      simulatedProgress += 10;
      if (simulatedProgress > 100) simulatedProgress = 100;
      if (simulatedProgress >= 90) clearInterval(progressInterval);
      setUploadProgress(simulatedProgress);
    }, 100);

    try {
      await axios.post('/files/upload', formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
        showSnackbar('✅ File uploaded!');
        setFile(null);
        e.target.reset();
        fetchFiles();
      }, 500);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      showSnackbar('❌ Upload failed', 'error');
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEditSubmit = async () => {
    setEditing(true);
    try {
      await axios.put(`/files/${editDialog.id}`, { filename: editDialog.newName }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchFiles();
      showSnackbar('✏️ Filename updated!');
      setEditDialog({ open: false, id: '', oldName: '', newName: '' });
    } catch (err) {
      console.error('❌ Edit failed:', err);
      showSnackbar('❌ Failed to rename file', 'error');
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/files/${deleteDialog.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchFiles();
      showSnackbar('🗑️ File deleted');
      setDeleteDialog({ open: false, id: '' });
    } catch (err) {
      console.error('❌ Delete failed:', err);
      showSnackbar('❌ Failed to delete file', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      maxWidth: 1000,
      px: 2,
      py: 3,
    }}>
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: 3,
          borderRadius: 2,
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="Close">
            <IconButton onClick={() => navigate(-1)} size="large">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h5" gutterBottom align="center">
          📤 Upload a File
        </Typography>

        <form onSubmit={handleUpload}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: '1rem' }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={uploading}
            sx={{ height: 48 }}
          >
            {uploading ? (
              <Box sx={{ position: 'relative', width: 40, height: 40, mx: 'auto' }}>
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  size={40}
                  thickness={4}
                  sx={{
                    color: 'green',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {uploadProgress}%
                  </Typography>
                </Box>
              </Box>
            ) : 'Upload'}
          </Button>
        </form>

        <TextField
          fullWidth
          label="Search files"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mt: 3 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />

        <Typography variant="h6" sx={{ mt: 4 }}>📁 Uploaded Files</Typography>

        {loading ? (
          <Box textAlign="center" mt={3}><CircularProgress /></Box>
        ) : filteredFiles.length === 0 ? (
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            No files found.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>Uploaded At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFiles.map((f) => (
                  <TableRow
                    key={f._id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>
                      <Tooltip title="Open file">
                        <Button onClick={() => navigate(`/preview/${f._id}`)} sx={{ textTransform: 'none' }}>
                          {f.filename}
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{new Date(f.createdAt).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Rename">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() =>
                            setEditDialog({ open: true, id: f._id, oldName: f.filename, newName: f.filename })
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, id: f._id })}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : undefined,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog open={editDialog.open} onClose={() => setEditDialog({ ...editDialog, open: false })} fullWidth maxWidth="xs">
          <DialogTitle>Rename File</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="New filename"
              value={editDialog.newName}
              onChange={(e) => setEditDialog({ ...editDialog, newName: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ ...editDialog, open: false })}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained" disabled={editing}>
              {editing ? <CircularProgress size={20} color="inherit" /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: '' })}
          fullWidth maxWidth="xs"
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, id: '' })} disabled={deleting}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleting}>
              {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UserFileUploader;