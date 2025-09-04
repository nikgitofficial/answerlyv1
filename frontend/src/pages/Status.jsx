// src/pages/Status.jsx
import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Chip, useTheme, useMediaQuery } from "@mui/material";

const systemStatus = [
  { service: "Authentication", status: "Operational" },
  { service: "Database", status: "Operational" },
  { service: "API", status: "Degraded Performance" },
  { service: "File Uploads", status: "Operational" },
  { service: "Notifications", status: "Partial Outage" },
  { service: "Dashboard", status: "Operational" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Operational":
      return "success";
    case "Degraded Performance":
      return "warning";
    case "Partial Outage":
      return "error";
    default:
      return "default";
  }
};

// Fade-up-on-scroll wrapper
const FadeUpOnScroll = ({ children, delay = 0 }) => {
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      {children}
    </div>
  );
};

const Status = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 10, mb: 10 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: "center" }}>
        <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
          System Status
        </Typography>
        <Typography
          variant={isSm ? "body1" : "h6"}
          color="text.secondary"
          sx={{ maxWidth: 640, mx: "auto" }}
        >
          Stay up to date with the current status of our services. We provide real-time updates to ensure you are informed about any incidents.
        </Typography>
      </Box>

      {/* Status Cards */}
      <Grid container spacing={4}>
        {systemStatus.map((item, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <FadeUpOnScroll delay={i * 100}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  backdropFilter: "blur(6px)",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
                }}
              >
                <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {item.service}
                  </Typography>
                  <Chip label={item.status} color={getStatusColor(item.status)} sx={{ fontWeight: "bold" }} />
                </CardContent>
              </Card>
            </FadeUpOnScroll>
          </Grid>
        ))}
      </Grid>

      {/* Contact / Updates Section */}
      <Box sx={{ mt: 12, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Want Updates?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          Subscribe to our status updates or contact support if you experience any issues. We ensure timely notifications for all users.
        </Typography>
      </Box>
    </Container>
  );
};

export default Status;
