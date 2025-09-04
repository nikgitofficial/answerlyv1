// src/pages/Analytics.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../api/axios";

const COLORS = ["#4CAF50", "#087f23", "#82ca9d", "#ffc658", "#00bfff"];

// Fade-up on scroll component
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

const Analytics = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    dailyResponses: [],
    topQuestionnaires: [],
    userStats: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get("/analytics"); // your endpoint
        setAnalytics(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <FadeUpOnScroll>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Analytics Dashboard
        </Typography>
      </FadeUpOnScroll>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Daily Responses Line Chart */}
        <FadeUpOnScroll delay={100}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 6,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "translateY(-5px) scale(1.02)", boxShadow: 10 },
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Daily Responses
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailyResponses}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="responses"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </FadeUpOnScroll>

        {/* Top Questionnaires Bar Chart */}
        <FadeUpOnScroll delay={250}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 6,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "translateY(-5px) scale(1.02)", boxShadow: 10 },
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Top Questionnaires
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topQuestionnaires}>
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="responses"
                    fill={theme.palette.success.main}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </FadeUpOnScroll>

        {/* User Stats Pie Chart */}
        <FadeUpOnScroll delay={400}>
          <Grid item xs={12}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 6,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "translateY(-5px) scale(1.02)", boxShadow: 10 },
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.userStats}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill={theme.palette.primary.main}
                    label
                  >
                    {analytics.userStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </FadeUpOnScroll>
      </Grid>
    </Container>
  );
};

export default Analytics;
