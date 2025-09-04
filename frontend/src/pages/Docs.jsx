// src/pages/Docs.jsx
import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const docsSections = [
  {
    title: "Getting Started",
    content:
      "Learn how to quickly set up your account, create questionnaires, and start collecting responses.",
  },
  {
    title: "Creating Questionnaires",
    content:
      "Step-by-step guide to designing engaging surveys, quizzes, and forms with our intuitive editor.",
  },
  {
    title: "Analyzing Responses",
    content:
      "Discover how to view results, generate reports, and gain actionable insights from your data.",
  },
  {
    title: "Customization & Branding",
    content:
      "Personalize your questionnaires with themes, colors, logos, and advanced settings for your organization.",
  },
  {
    title: "Security & Privacy",
    content:
      "Understand how we protect your data with enterprise-grade security measures and privacy compliance.",
  },
];

// Fade-up on scroll
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

const Docs = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const green = "#4CAF50";
  const greenDark = "#087f23";

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
      {/* Hero Section */}
      <FadeUpOnScroll>
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
            Documentation
          </Typography>
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 640, mx: "auto" }}
          >
            Explore our guides, tutorials, and reference materials to make the most of your
            questionnaire experience.
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* Docs Sections */}
      <Grid container spacing={8} justifyContent="center">
        {docsSections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <FadeUpOnScroll delay={index * 100}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  backdropFilter: "blur(6px)",
                  backgroundColor: "rgba(255,255,255,0.85)",
                  border: `2px solid rgba(76,175,80,0.2)`,
                  transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                  "&:hover": {
                    transform: "translateY(-6px) scale(1.03)",
                    boxShadow: 8,
                    borderColor: green,
                  },
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {section.title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {section.content}
                </Typography>
                <Box sx={{ mt: 3, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: 3,
                      background: `linear-gradient(90deg, ${greenDark}, ${green})`,
                      "&:hover": { opacity: 0.9 },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Paper>
            </FadeUpOnScroll>
          </Grid>
        ))}
      </Grid>

      {/* Call To Action */}
      <FadeUpOnScroll delay={500}>
        <Box sx={{ textAlign: "center", mt: 12 }}>
          <Typography variant={isSm ? "h5" : "h4"} fontWeight="bold" gutterBottom>
            Need More Help?
          </Typography>
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Reach out to our support team for personalized assistance and guidance on using our platform.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${greenDark}, ${green})`,
              boxShadow: 4,
              "&:hover": { opacity: 0.9, transform: "scale(1.03)" },
            }}
          >
            Contact Support
          </Button>
        </Box>
      </FadeUpOnScroll>
    </Container>
  );
};

export default Docs;
