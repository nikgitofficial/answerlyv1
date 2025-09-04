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
  Snackbar,
  Alert,
  TextField,
  Chip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import QuizIcon from "@mui/icons-material/Quiz";
import MailIcon from "@mui/icons-material/Mail";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import StarIcon from "@mui/icons-material/Star";
import BarChartIcon from "@mui/icons-material/BarChart";

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

  // ⭐ Ratings state
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [newRatingsCount, setNewRatingsCount] = useState(0);
  const [ratingSearch, setRatingSearch] = useState("");
  const [ratingMin, setRatingMin] = useState("");
  const [ratingMax, setRatingMax] = useState("");

  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [selectedTable, setSelectedTable] = useState(null);

  // Delete modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);

  // Question modal state
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Snackbar
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Fetch stats, messages, subscriptions, ratings
  const fetchStatsMessagesSubsRatings = async () => {
    try {
      const [statsRes, messagesRes, subsRes, ratingsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/contact"),
        api.get("/subscription"),
        api.get("/ratings"), // <-- Ratings endpoint (expects array of { _id, user, username, email, value:1-5, comment, createdAt })
      ]);

      setStats({
        ...statsRes.data,
        subscriptions: subsRes.data,
      });
      setMessages(messagesRes.data);

      setRatings(ratingsRes.data || []);
      if (selectedTable !== "ratings") setNewRatingsCount((ratingsRes.data || []).length);

      if (selectedTable !== "messages") setNewMessageCount(messagesRes.data.length);
      else setNewMessageCount(0);
    } catch (err) {
      console.error("❌ Failed to fetch data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
      setRatingsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsMessagesSubsRatings();
    const interval = setInterval(fetchStatsMessagesSubsRatings, 5000);
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

  // ⭐ Ratings analytics
  const ratingStats = useMemo(() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    const trendMap = new Map(); // YYYY-MM-DD => {sum, count}

    ratings.forEach((r) => {
      const v = Number(r.rating) || 0;
      if (v >= 1 && v <= 5) {
        dist[v] += 1;
        sum += v;
      }
      const d = new Date(r.createdAt);
      if (!isNaN(d)) {
        const key = d.toISOString().slice(0, 10);
        const curr = trendMap.get(key) || { sum: 0, count: 0 };
        trendMap.set(key, { sum: curr.sum + v, count: curr.count + 1 });
      }
    });

    const total = ratings.length || 0;
    const average = total ? sum / total : 0;

    // Ordered trend points (last 14 days shown)
    const trend = Array.from(trendMap.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, { sum, count }]) => ({ date, avg: count ? sum / count : 0 }))
      .slice(-14);

    return { dist, total, average, trend };
  }, [ratings]);

  const filteredRatings = useMemo(() => {
    const min = Number(ratingMin) || 0;
    const max = Number(ratingMax) || 5;
    return ratings.filter((r) => {
      const text = `${r.username || r.user?.username || ""} ${r.email || r.user?.email || ""} ${r.comment || ""}`.toLowerCase();
      const val = Number(r.rating) || 0;
      return (
        text.includes(ratingSearch.toLowerCase()) &&
        val >= min &&
        val <= max
      );
    });
  }, [ratings, ratingSearch, ratingMin, ratingMax]);

  // Simple histogram bars (CSS only)
  const Histogram = ({ dist }) => {
    const max = Math.max(...Object.values(dist), 1);
    return (
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", height: 140 }}>
        {([1, 2, 3, 4, 5]).map((star) => {
          const value = dist[star] || 0;
          const h = (value / max) * 120;
          return (
            <Box key={star} sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 34,
                  height: h,
                  bgcolor: "primary.main",
                  borderRadius: 1.2,
                  boxShadow: 2,
                  transition: "height .25s ease",
                }}
                title={`${value} ratings`}
              />
              <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                {star}★
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {value}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Simple sparkline (SVG only)
  const Sparkline = ({ points }) => {
    const w = 300;
    const h = 80;
    if (!points || points.length === 0) {
      return <Typography variant="body2" color="text.secondary">No trend data</Typography>;
    }
    const xs = points.map((_, i) => (i / (points.length - 1 || 1)) * (w - 10) + 5);
    const ys = (() => {
      const vals = points.map((p) => p.avg || 0);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const scale = (v) => {
        if (max === min) return h / 2;
        return h - 10 - ((v - min) / (max - min)) * (h - 20);
      };
      return vals.map(scale);
    })();

    const d = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x},${ys[i]}`).join(" ");
    return (
      <svg width={w} height={h} style={{ display: "block" }}>
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  };

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
          {
            text: "Ratings",
            icon: (
              <Badge badgeContent={newRatingsCount} color="primary">
                <StarIcon />
              </Badge>
            ),
            action: () => setSelectedTable("ratings"),
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
                if (item.text === "Ratings") setNewRatingsCount(0);
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
      setSnack({ open: true, message: "Message deleted", severity: "success" });
    } catch (err) {
      console.error("Failed to delete message:", err.response?.data || err.message);
      setSnack({ open: true, message: "Failed to delete message", severity: "error" });
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
      setSnack({ open: true, message: "All answers deleted", severity: "success" });
    } catch (err) {
      console.error("Failed to delete answers:", err.response?.data || err.message);
      alert("Failed to delete answers.");
      setSnack({ open: true, message: "Failed to delete answers", severity: "error" });
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

  // ⭐ Rating actions
  const handleDeleteRating = async (id) => {
    try {
      await api.delete(`/ratings/${id}`);
      setRatings((prev) => prev.filter((r) => r._id !== id));
      setSnack({ open: true, message: "Rating deleted", severity: "success" });
    } catch (err) {
      console.error("Failed to delete rating:", err.response?.data || err.message);
      setSnack({ open: true, message: "Failed to delete rating", severity: "error" });
    }
  };

  const handleExportRatingsCSV = () => {
    const headers = ["username", "email", "value", "comment", "createdAt"];
    const rows = filteredRatings.map((r) => [
      (r.username || r.user?.username || "").replaceAll(",", " "),
      (r.email || r.user?.email || "").replaceAll(",", " "),
      r.rating,
      (r.comment || "").replaceAll(",", " "),
      new Date(r.createdAt).toISOString(),
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ratings.csv";
    a.click();
    URL.revokeObjectURL(url);
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
                // ⭐ New: Ratings card with average
                {
                  label: "Avg Rating",
                  value: ratingStats.average ? ratingStats.average.toFixed(2) : "0.00",
                  gradient: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
                  tooltip: "View ratings analytics",
                  onClick: () => setSelectedTable("ratings"),
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
          <TableRow>   {/* ✅ was </Row>, fixed */}
            <TableCell>Title</TableCell>
            <TableCell>Slug / ID</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
          </TableRow> {/* ✅ proper closing */}
        </TableHead>
        <TableBody>
          {stats.questions.map((q) => (
            <Tooltip title="Click to view question details" arrow key={q._id}>
              <TableRow
                onClick={() => handleOpenQuestionModal(q)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: theme.palette.action.hover },
                }}
              >
                <TableCell>{q.title}</TableCell>
                <TableCell>{q.slug || q._id}</TableCell>
                <TableCell>
                  {new Date(q.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(q.updatedAt).toLocaleString()}
                </TableCell>
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

            {/* ⭐ Ratings Analytics & Table */}
            {selectedTable === "ratings" && (
              <>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <BarChartIcon />
                  <Typography variant="h5" gutterBottom>
                    ⭐ Ratings & Analytics
                  </Typography>
                  <Chip
                    icon={<StarIcon />}
                    label={`${ratingStats.average ? ratingStats.average.toFixed(2) : "0.00"} avg • ${ratingStats.total} total`}
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                </Box>

                {/* Analytics row */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Ratings Distribution (1–5)
                        </Typography>
                        <Histogram dist={ratingStats.dist} />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          14-Day Average Trend
                        </Typography>
                        <Sparkline points={ratingStats.trend} />
                        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                          {ratingStats.trend.map((p) => (
                            <Chip key={p.date} size="small" label={`${p.date.slice(5)} • ${p.avg.toFixed(2)}`} />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Filters & actions */}
                <Grid container spacing={2} alignItems="center" mb={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Search (user, email, comment)"
                      value={ratingSearch}
                      onChange={(e) => setRatingSearch(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Min"
                      type="number"
                      inputProps={{ min: 1, max: 5 }}
                      value={ratingMin}
                      onChange={(e) => setRatingMin(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Max"
                      type="number"
                      inputProps={{ min: 1, max: 5 }}
                      value={ratingMax}
                      onChange={(e) => setRatingMax(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md="auto">
                    <Button variant="outlined" onClick={() => {
                      setRatingSearch(""); setRatingMin(""); setRatingMax("");
                    }}>
                      Reset Filters
                    </Button>
                  </Grid>
                  <Grid item xs={12} md="auto">
                    <Button variant="contained" onClick={handleExportRatingsCSV}>
                      Export CSV
                    </Button>
                  </Grid>
                </Grid>

                {/* Ratings table */}
                <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
                  {ratingsLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Table>
                      <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Comment</TableCell>
                          <TableCell>Created At</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRatings.map((r) => (
                          <TableRow key={r._id} hover>
                            <TableCell>{r.username || r.user?.username || "—"}</TableCell>
                            <TableCell>{r.email || r.user?.email || "—"}</TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Chip
                                  icon={<StarIcon />}
                                  color={Number(r.rating) >= 4 ? "success" : Number(r.rating) >= 3 ? "warning" : "default"}
                                  label={Number(r.rating).toFixed(1)}
                                  size="small"
                                />
                              </Box>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 360 }}>
                              <Typography variant="body2" noWrap title={r.comment || ""}>
                                {r.comment || "—"}
                              </Typography>
                            </TableCell>
                            <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                              <Button variant="outlined" color="error" onClick={() => handleDeleteRating(r._id)}>
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredRatings.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              <Typography variant="body2" color="text.secondary" py={2}>
                                No ratings found.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
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

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnack((s) => ({ ...s, open: false }))}
            severity={snack.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AdminPage;
