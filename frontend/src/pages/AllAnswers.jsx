// src/components/AllAnswers.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
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
  CircularProgress,
  TextField,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// ✅ Import Navbar
import Navbar from "../components/Navbar";

const AllAnswers = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await axios.get(`/question-sets/${slug}/answers`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching set answers:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchAnswers();
  }, [slug]);

  // Aggregate user answers for overall score
  const aggregatedAnswers = useMemo(() => {
    if (!data) return [];

    const usersMap = {};
    data.answers.forEach((ans) => {
      const userId = ans.user?._id || ans.userName || "Anonymous";

      if (!usersMap[userId]) {
        usersMap[userId] = {
          user: ans.user ? ans.user.name : ans.userName || "Anonymous",
          totalQuestions: data.set.questions.length,
          correctCount: 0,
          submittedAt: ans.createdAt,
        };
      }

      data.set.questions.forEach((q, idx) => {
        const userAnswer = Array.isArray(ans.answer)
          ? ans.answer[idx]
          : ans.answer[q._id];
        if (userAnswer === q.answer) {
          usersMap[userId].correctCount += 1;
        }
      });

      if (new Date(ans.createdAt) > new Date(usersMap[userId].submittedAt)) {
        usersMap[userId].submittedAt = ans.createdAt;
      }
    });

    return Object.values(usersMap).filter((u) =>
      u.user.toLowerCase().includes(userFilter.toLowerCase())
    );
  }, [data, userFilter]);

  if (loading)
    return (
      <>
        <Navbar /> {/* ✅ Navbar always visible */}
        <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
          <CircularProgress size={60} color="primary" />
        </Box>
      </>
    );

  if (!data || data.answers.length === 0)
    return (
      <>
        <Navbar /> {/* ✅ Navbar always visible */}
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              No data found
            </Typography>
            <Button variant="contained" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </Paper>
        </Box>
      </>
    );

  return (
    <>
      <Navbar /> {/* ✅ Navbar at top */}

      <Box p={isMobile ? 2 : 5}>
        {/* Back Button */}
        <Button
          variant="outlined"
          sx={{ mb: 3, borderRadius: 3 }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>

        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          gutterBottom
          textAlign={isMobile ? "center" : "left"}
        >
          Answers for Set: {data.set.title}
        </Typography>

        {/* Filter */}
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          mb={4}
          alignItems={isMobile ? "stretch" : "center"}
        >
          <TextField
            label="Filter by User"
            variant="outlined"
            size="small"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            fullWidth={isMobile}
          />
        </Stack>

        {/* ✅ Aggregated Scores Table */}
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Summary Scores
        </Typography>
        <TableContainer
          component={Paper}
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: theme.shadows[6],
            mb: 5,
          }}
        >
          <Table sx={{ minWidth: 300 }}>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Questions</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Submitted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aggregatedAnswers.map((u, idx) => (
                <TableRow
                  key={idx}
                  sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{u.user}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.correctCount}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.totalQuestions}
                      color="info"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>{new Date(u.submittedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Detailed Answers Section */}
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Detailed User Answers
        </Typography>
        {data.answers.map((ans, idx) => (
          <Accordion key={idx} sx={{ mb: 2, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>
                {ans.user ? ans.user.name : ans.userName || "Anonymous"} •{" "}
                {new Date(ans.createdAt).toLocaleString()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {data.set.questions.map((q, qIdx) => {
                const userAnswer = Array.isArray(ans.answer)
                  ? ans.answer[qIdx]
                  : ans.answer[q._id];
                const isCorrect = userAnswer === q.answer;
                return (
                  <Box
                    key={qIdx}
                    mb={2}
                    p={2}
                    sx={{
                      border: "1px solid",
                      borderColor: isCorrect ? "success.main" : "error.main",
                      borderRadius: 2,
                      backgroundColor: isCorrect
                        ? "success.light"
                        : "error.light",
                    }}
                  >
                    <Typography fontWeight={600}>
                      Q{qIdx + 1}: {q.question}
                    </Typography>
                    <Typography>User Answer: {userAnswer || "No Answer"}</Typography>
                    <Typography>Correct Answer: {q.answer}</Typography>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
};

export default AllAnswers;
