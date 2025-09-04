// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import PollIcon from "@mui/icons-material/Poll";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { CalendarToday } from "@mui/icons-material"; // ✅ Added for calendar icon

const COLORS = ["#60a5fa", "#4ade80", "#facc15", "#f87171", "#a78bfa"];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [totalSets, setTotalSets] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [totalAnswers, setTotalAnswers] = useState(null);
  const [loading, setLoading] = useState(true);

  const [analyticsData, setAnalyticsData] = useState({
    questionDistribution: [],
    surveyResponses: [],
    averageScore: 0,
    mostAnsweredQuestion: "",
    surveyCompletionRate: 0,
  });

  // ✅ State for date & time
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const setsRes = await axios.get("/question-sets");
        const sets = setsRes.data;
        setTotalSets(sets.length);

        const questionsCount = sets.reduce(
          (acc, set) => acc + set.questions.length,
          0
        );
        setTotalQuestions(questionsCount);

        let answersCount = 0;
        let questionDistribution = [];
        let surveyResponses = [];
        let totalCorrectAnswers = 0;
        let totalPossibleAnswers = 0;
        const questionAnswerCount = {};

        for (const set of sets) {
          const answersRes = await axios.get(
            `/question-sets/${set.slug}/answers`
          );
          const answers = answersRes.data.answers;
          answersCount += answers.length;

          questionDistribution.push({
            name: set.title,
            questions: set.questions.length,
            answers: answers.length,
          });

          set.questions.forEach((q) => {
            const counts = {};
            answers.forEach((ans) => {
              const ansValue = Array.isArray(ans.answer)
                ? ans.answer[set.questions.indexOf(q)]
                : ans.answer[q._id];
              counts[ansValue] = (counts[ansValue] || 0) + 1;

              questionAnswerCount[q.text] =
                (questionAnswerCount[q.text] || 0) + 1;

              if (ansValue === q.answer) totalCorrectAnswers += 1;
            });
            surveyResponses.push({
              question: q.text,
              counts,
            });
            totalPossibleAnswers += answers.length || 1;
          });
        }

        const averageScore =
          totalPossibleAnswers > 0
            ? (totalCorrectAnswers / totalPossibleAnswers) * 100
            : 0;

        const mostAnsweredQuestion =
          Object.entries(questionAnswerCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "N/A";

        const surveyCompletionRate =
          totalSets > 0 ? (answersCount / totalSets) * 100 : 0;

        setTotalAnswers(answersCount);
        setAnalyticsData({
          questionDistribution,
          surveyResponses,
          averageScore: averageScore.toFixed(1),
          mostAnsweredQuestion,
          surveyCompletionRate: surveyCompletionRate.toFixed(1),
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={60} thickness={5} color="primary" />

      </Box>
    );

  const stats = [
    {
      title: "Total Sets Created",
      value: totalSets,
      icon: <QuizIcon sx={{ fontSize: 50, color: "#4ade80" }} />,
      color: "#f0fdf4",
    },
    {
      title: "Total Questions",
      value: totalQuestions,
      icon: <EqualizerIcon sx={{ fontSize: 50, color: "#60a5fa" }} />,
      color: "#eff6ff",
    },
    {
      title: "Total Answers Submitted",
      value: totalAnswers,
      icon: <CheckCircleIcon sx={{ fontSize: 50, color: "#facc15" }} />,
      color: "#fffbeb",
    },
  ];

  const summaryAnalytics = [
    {
      title: "Average Score (%)",
      value: analyticsData.averageScore,
      icon: <BarChartIcon sx={{ fontSize: 50, color: "#60a5fa" }} />,
      color: "#eff6ff",
    },
    {
      title: "Most Answered Question",
      value: analyticsData.mostAnsweredQuestion,
      icon: <PollIcon sx={{ fontSize: 50, color: "#f87171" }} />,
      color: "#fef2f2",
    },
    {
      title: "Survey Completion Rate (%)",
      value: analyticsData.surveyCompletionRate,
      icon: <CheckCircleIcon sx={{ fontSize: 50, color: "#facc15" }} />,
      color: "#fffbeb",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* ✅ Welcome + Date + Time */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h5" fontWeight={600}>
          Welcome back 👋
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <CalendarToday sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="subtitle1">
            {dateTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mt: 1 }}
          color="secondary"
        >
          {dateTime.toLocaleTimeString()}
        </Typography>
      </Box>

      <Typography
        variant={isMobile ? "h4" : "h3"}
        gutterBottom
        sx={{
          fontWeight: 700,
          color: theme.palette.primary.main,
          textAlign: "center",
          mb: { xs: 4, md: 6 },
        }}
      >
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid
        container
        spacing={{ xs: 3, md: 5 }}
        justifyContent="center"
        sx={{ maxWidth: 1000, mx: "auto" }}
      >
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                background: stat.color,
                boxShadow:
                  "0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
                transition: "all 0.4s ease",
                "&:hover": {
                  transform: "translateY(-6px) scale(1.02)",
                  boxShadow:
                    "0 10px 20px rgba(0,0,0,0.12), 0 4px 6px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: theme.palette.text.secondary }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ mt: 1, fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: isMobile ? "center" : "flex-end",
                    mt: isMobile ? 2 : 0,
                  }}
                >
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ✅ Summary Analytics Cards */}
      <Grid
        container
        spacing={{ xs: 3, md: 5 }}
        justifyContent="center"
        sx={{ maxWidth: 1000, mx: "auto", mt: 5 }}
      >
        {summaryAnalytics.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                background: stat.color,
                boxShadow:
                  "0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
                transition: "all 0.4s ease",
                "&:hover": {
                  transform: "translateY(-6px) scale(1.02)",
                  boxShadow:
                    "0 10px 20px rgba(0,0,0,0.12), 0 4px 6px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: theme.palette.text.secondary }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mt: 1, fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: isMobile ? "center" : "flex-end",
                    mt: isMobile ? 2 : 0,
                  }}
                >
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Analytics Charts */}
      <Box sx={{ mt: 8, maxWidth: 1000, mx: "auto" }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Detailed Analytics
        </Typography>

        {/* Question Distribution Bar Chart */}
        <Paper sx={{ p: 3, mb: 5, borderRadius: 3, boxShadow: theme.shadows[4] }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Questions & Answers per Set
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.questionDistribution}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="questions" fill="#60a5fa" name="Questions" />
              <Bar dataKey="answers" fill="#4ade80" name="Answers Submitted" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Survey Responses Pie Charts */}
        {analyticsData.surveyResponses.map((q, idx) => (
          <Paper
            key={idx}
            sx={{ p: 3, mb: 5, borderRadius: 3, boxShadow: theme.shadows[4] }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {q.question}
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(q.counts).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {Object.entries(q.counts).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
