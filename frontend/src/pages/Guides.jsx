// src/pages/Guidelines.jsx
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

const guidelinesList = [
  {
    title: "Account Setup",
    content:
      "Ensure your account is complete with accurate information to maximize your experience and access all features.",
  },
  {
    title: "Questionnaire Design",
    content:
      "Follow best practices for creating surveys, quizzes, and forms to get clear, actionable results.",
  },
  {
    title: "User Interaction",
    content:
      "Respect respondents’ time and privacy. Keep questions clear, concise, and relevant.",
  },
  {
    title: "Data Security",
    content:
      "Do not share sensitive information unnecessarily. Use strong passwords and secure your account.",
  },
  {
    title: "Reporting & Insights",
    content:
      "Analyze data responsibly and follow ethical guidelines when sharing results or insights.",
  },
  {
    title: "Platform Usage",
    content:
      "Use the platform according to terms and policies. Avoid misuse that could impact other users.",
  },
];

// Fade-up on scroll wrapper
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

const Guidelines = () => {
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
            Guidelines
          </Typography>
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 640, mx: "auto" }}
          >
            Follow these guidelines to ensure the best experience on our platform and maintain a
            safe, professional, and productive environment.
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* Guidelines Cards */}
      <Grid container spacing={6} justifyContent="center">
        {guidelinesList.map((item, index) => (
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
                  {item.title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {item.content}
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
            Need Assistance?
          </Typography>
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Contact our support team if you have questions about any of the guidelines or need
            clarification.
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

export default Guidelines;
