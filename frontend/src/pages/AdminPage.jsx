// src/pages/AdminPage.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

// ✅ Material UI
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import QuizIcon from "@mui/icons-material/Quiz";
import MailIcon from "@mui/icons-material/Mail";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";

const drawerWidth = 260;

const AdminPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    users: [],
    questions: [],
    answers: [],
    subscriptions: [],
  });
  const [messages, setMessages] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [selectedTable, setSelectedTable] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);

  // Question modal state
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Fetch stats & messages & subscriptions
  const fetchStatsAndMessages = async () => {
    try {
      const [statsRes, messagesRes, subsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/contact"),
        api.get("/subscriptions"), // <--- fetch subscriptions
      ]);
      setStats({
        ...statsRes.data,
        subscriptions: subsRes.data, // <--- store subscriptions
      });
      setMessages(messagesRes.data);

      if (selectedTable !== "messages") setNewMessageCount(messagesRes.data.length);
      else setNewMessageCount(0);
    } catch (err) {
      console.error("❌ Failed to fetch data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndMessages();
    const interval = setInterval(fetchStatsAndMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedTable]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err.message);
    }
    logout();
    navigate("/login");
  };

  const aggregatedAnswers = useMemo(() => {
    if (!stats.answers || !stats.questions) return [];
    return stats.answers.map((a) => {
      let correctCount = 0;
      stats.questions.forEach((q, idx) => {
        const userAnswer = Array.isArray(a.answer) ? a.answer[idx] : a.answer[q._id];
        if (userAnswer === q.answer) correctCount += 1;
      });
      return { ...a, score: correctCount };
    });
  }, [stats.answers, stats.questions]);

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: "#fff",
        }}
      >
        <Avatar sx={{ bgcolor: "#fff", color: theme.palette.primary.main }}>
          {user?.username?.[0] || "A"}
        </Avatar>
        <Typography variant="h6" fontWeight={700}>
          {user?.username || "Admin"}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {[
          { text: "Dashboard", icon: <QuizIcon /> },
          {
            text: "Messages",
            icon: (
              <Badge badgeContent={newMessageCount} color="error">
                <MailIcon />
              </Badge>
            ),
            action: () => setSelectedTable("messages"),
          },
          {
            text: "Subscriptions",
            icon: <SubscriptionsIcon />,
            action: () => setSelectedTable("subscriptions"),
          },
          { text: "Logout", icon: <PeopleIcon />, action: handleLogout },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={activeMenu === item.text}
              onClick={() => {
                setActiveMenu(item.text);
                if (item.action) item.action();
                if (item.text === "Messages") setNewMessageCount(0);
              }}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.selected,
                  borderRadius: 2,
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleDeleteMessage = (id) => {
    setDeletingMessageId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteMessage = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/contact/${deletingMessageId}`);
      setMessages((prev) => prev.filter((m) => m._id !== deletingMessageId));
    } catch (err) {
      console.error("Failed to delete message:", err.response?.data || err.message);
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setDeletingMessageId(null);
    }
  };

  const confirmDeleteAllAnswers = async () => {
    setDeleteLoading(true);
    try {
      const res = await api.delete("/admin/answers");
      alert(res.data.message);
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to delete answers:", err.response?.data || err.message);
      alert("Failed to delete answers.");
    } finally {
      setDeleteLoading(false);
      setDeleteAllModalOpen(false);
    }
  };

  const handleOpenQuestionModal = (question) => {
    setSelectedQuestion(question);
    setQuestionModalOpen(true);
  };

  const handleCloseQuestionModal = () => {
    setSelectedQuestion(null);
    setQuestionModalOpen(false);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: "0px 3px 15px rgba(0,0,0,0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxShadow: "2px 0px 20px rgba(0,0,0,0.1)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          mt: 8,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Typography variant="h5" gutterBottom mb={4} sx={{ fontWeight: 600 }}>
          Welcome <strong>{user?.username || "Admin"}</strong>! Manage application
          settings and user accounts.
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={6}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
              {[
                {
                  label: "Total Users",
                  value: stats.totalUsers,
                  gradient: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  tooltip: "View all registered users",
                  onClick: () => setSelectedTable("users"),
                },
                {
                  label: "Total Questions",
                  value: stats.totalQuestions,
                  gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
                  tooltip: "View all available questions",
                  onClick: () => setSelectedTable("questions"),
                },
                {
                  label: "Total Answers",
                  value: stats.answers.length,
                  gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
                  tooltip: "View all submitted answers",
                  onClick: () => setSelectedTable("answers"),
                },
                {
                  label: "Messages",
                  value: messages.length,
                  gradient: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                  tooltip: "View contact messages",
                  onClick: () => setSelectedTable("messages"),
                },
                {
                  label: "Subscriptions",
                  value: stats.subscriptions.length,
                  gradient: "linear-gradient(135deg, #ff7e5f, #feb47b)",
                  tooltip: "View all subscribers",
                  onClick: () => setSelectedTable("subscriptions"),
                },
              ].map((card) => (
                <Grid item xs={12} sm={6} md={3} key={card.label}>
                  <Tooltip title={card.tooltip} arrow>
                    <Card
                      onClick={card.onClick}
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        background: card.gradient,
                        color: "#fff",
                        boxShadow: 6,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": { transform: "translateY(-5px)", boxShadow: 12 },
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                          {card.label}
                        </Typography>
                        <Typography variant="h3" fontWeight={700}>
                          {card.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>

            {/* Back button */}
            {selectedTable && (
              <Box mb={3}>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedTable(null)}
                  sx={{ mb: 2 }}
                >
                  ← Back to Dashboard
                </Button>
              </Box>
            )}

            {/* Tables */}
            {/* Users Table */}
            {selectedTable === "users" && (
              <>
                <Typography variant="h5" gutterBottom mt={3}>
                  👥 Users
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.users.map((u) => (
                        <TableRow key={u._id} hover>
                          <TableCell>{u.username}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* Questions Table */}
            {selectedTable === "questions" && (
              <>
                <Typography variant="h5" gutterBottom>
                  ❓ Questions
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Slug / ID</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.questions.map((q) => (
                        <Tooltip title="Click to view question details" arrow key={q._id}>
                          <TableRow
                            onClick={() => handleOpenQuestionModal(q)}
                            sx={{ cursor: "pointer", "&:hover": { bgcolor: theme.palette.action.hover } }}
                          >
                            <TableCell>{q.title}</TableCell>
                            <TableCell>{q.slug || q._id}</TableCell>
                            <TableCell>{new Date(q.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{new Date(q.updatedAt).toLocaleString()}</TableCell>
                          </TableRow>
                        </Tooltip>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* Answers Table */}
            {selectedTable === "answers" && (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h5" gutterBottom>
                    📝 Answers
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setDeleteAllModalOpen(true)}
                  >
                    Delete All Answers
                  </Button>
                </Box>
                <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Submitted At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {aggregatedAnswers.map((a) => (
                        <TableRow key={a._id} hover>
                          <TableCell>{a.username}</TableCell>
                          <TableCell>{a.score}</TableCell>
                          <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* Messages Table */}
            {selectedTable === "messages" && (
              <>
                <Typography variant="h5" gutterBottom>
                  📧 Messages
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Received At</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {messages.map((m) => (
                        <TableRow key={m._id} hover>
                          <TableCell>{m.name}</TableCell>
                          <TableCell>{m.email}</TableCell>
                          <TableCell>{m.message}</TableCell>
                          <TableCell>{new Date(m.createdAt).toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteMessage(m._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* Subscriptions Table */}
            {selectedTable === "subscriptions" && (
              <>
                <Typography variant="h5" gutterBottom>
                  💳 Subscriptions
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Plan</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Subscribed At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.subscriptions.map((s) => (
                        <TableRow key={s._id} hover>
                          <TableCell>{s.username || s.user?.username}</TableCell>
                          <TableCell>{s.email || s.user?.email}</TableCell>
                          <TableCell>{s.plan}</TableCell>
                          <TableCell>
                            <Badge
                              color={s.status === "active" ? "success" : "warning"}
                              variant="dot"
                            >
                              {s.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}

        {/* Delete Message Modal */}
        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this message?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmDeleteMessage}
              color="error"
              variant="contained"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete All Answers Modal */}
        <Dialog open={deleteAllModalOpen} onClose={() => setDeleteAllModalOpen(false)}>
          <DialogTitle>Confirm Delete All Answers</DialogTitle>
          <DialogContent>
            Are you sure you want to delete <strong>all answers</strong>? This cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteAllModalOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmDeleteAllAnswers}
              color="error"
              variant="contained"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete All"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Question Modal */}
        <Dialog open={questionModalOpen} onClose={handleCloseQuestionModal} fullWidth maxWidth="sm">
          <DialogTitle>Question Details</DialogTitle>
          <DialogContent>
            {selectedQuestion && (
              <>
                <Typography variant="h6" mb={1}>
                  {selectedQuestion.title}
                </Typography>
                <Typography variant="body2" mb={2}>
                  {selectedQuestion.description}
                </Typography>
                <Typography variant="subtitle2">
                  Correct Answer: <strong>{selectedQuestion.answer}</strong>
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseQuestionModal}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminPage;
