// src/pages/Home.jsx
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import LightbulbIcon from "@mui/icons-material/Lightbulb";
import TimelineIcon from "@mui/icons-material/Timeline";
import PeopleIcon from "@mui/icons-material/People";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import SecurityIcon from "@mui/icons-material/Security";
import DevicesIcon from "@mui/icons-material/Devices";

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

const features = [
  { title: "Easy to Use", desc: "Quickly create quizzes or surveys with a simple and intuitive interface.", icon: <LightbulbIcon /> },
  { title: "Real-time Insights", desc: "Instantly analyze responses and improve your decision-making.", icon: <TimelineIcon /> },
  { title: "For Everyone", desc: "Perfect for education, research, business, or just for fun quizzes.", icon: <PeopleIcon /> },
  { title: "Customizable", desc: "Personalize questionnaires with themes, colors, and branding.", icon: <ColorLensIcon /> },
  { title: "Secure", desc: "Your data is protected with top-notch security and privacy features.", icon: <SecurityIcon /> },
  { title: "Cross-Platform", desc: "Accessible from desktop, tablet, or mobile anytime, anywhere.", icon: <DevicesIcon /> },
];

const steps = [
  { step: "1", text: "Sign up and create your account." },
  { step: "2", text: "Build your first questionnaire with our easy tools." },
  { step: "3", text: "Share it with friends, students, or colleagues." },
  { step: "4", text: "Get real-time results and insights instantly." },
];

const testimonials = [
  { name: "Winston Lee", feedback: "This app made teaching so much easier! My students love the quizzes." },
  { name: "BBM", feedback: "Perfect for collecting feedback in my business. Fast and reliable." },
  { name: "Budoy", feedback: "The best tool for surveys! Simple, clean, and powerful." },
];

const PublicHome = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const green = "#4CAF50";
  const greenDark = "#087f23";

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 8, mb: 8 }} >

      {/* Hero Section */}
      <FadeUpOnScroll>
        <Box
          sx={{
            py: { xs: 6, md: 10 },
            px: 3,
            mb: 12,
            borderRadius: 4,
            background: `linear-gradient(135deg, #000000 0%, ${green} 100%)`,
            color: "#fff",
            textAlign: "center",
            boxShadow: 6,
          }}
        >
         <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
  Welcome to Answerly – Your Questionnaire App
</Typography>
          <Typography variant={isSm ? "body1" : "h6"} paragraph sx={{ maxWidth: 640, mx: "auto", mb: 4 }}>
            Create, manage, and take questionnaires with ease. Gain instant insights and make learning or surveys interactive!
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{
                mr: 2,
                px: 5,
                py: 1.5,
                borderRadius: 3,
                background: `linear-gradient(135deg, #000000 0%, ${green} 100%)`,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "transform 0.3s, opacity 0.3s",
                "&:hover": { opacity: 0.9, transform: "scale(1.03)" },
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                borderColor: "rgba(255,255,255,0.7)",
                color: "#fff",
                transition: "transform 0.3s, background-color 0.3s",
                "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.1)", transform: "scale(1.03)" },
              }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </FadeUpOnScroll>

      {/* Features Section */}
      <Box sx={{ py: 10, backgroundColor: "rgba(245,245,245,0.8)" }}>
        <FadeUpOnScroll>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ textAlign: "center", mb: 6 }}>
            Powerful Features
            <Box sx={{ width: 60, height: 4, bgcolor: green, borderRadius: 2, mt: 1, mx: "auto" }} />
          </Typography>
        </FadeUpOnScroll>
        <Grid container spacing={6} justifyContent="center">
          {features.map((feature, index) => (
            <FadeUpOnScroll key={index} delay={index * 150}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: `2px solid ${green}`,
                    backdropFilter: "blur(8px)",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                    "&:hover": { transform: "translateY(-6px) scale(1.03)", boxShadow: 8, borderColor: greenDark },
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {feature.icon && React.cloneElement(feature.icon, { sx: { fontSize: 40, color: green } })}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </FadeUpOnScroll>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, backgroundColor: "rgba(245,245,245,0.8)" }}>
        <FadeUpOnScroll>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ textAlign: "center", mb: 6 }}>
            How It Works
            <Box sx={{ width: 60, height: 4, bgcolor: green, borderRadius: 2, mt: 1, mx: "auto" }} />
          </Typography>
        </FadeUpOnScroll>

        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, i) => (
            <FadeUpOnScroll key={i} delay={i * 150}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: `2px solid ${green}`,
                    textAlign: "center",
                    boxShadow: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                    "&:hover": { transform: "translateY(-4px) scale(1.02)", boxShadow: 7, borderColor: greenDark },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      mx: "auto",
                      mb: 2,
                      borderRadius: "50%",
                      border: `2px solid ${green}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: green,
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography variant="body1">{step.text}</Typography>
                </Card>
              </Grid>
            </FadeUpOnScroll>
          ))}
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Grid container spacing={6} justifyContent="center" sx={{ mt: 10 }}>
        {testimonials.map((testimonial, i) => (
          <FadeUpOnScroll key={i} delay={i * 150}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: `2px solid ${green}`,
                  textAlign: "center",
                  backdropFilter: "blur(6px)",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                  "&:hover": { transform: "translateY(-5px) scale(1.02)", boxShadow: 8, borderColor: greenDark },
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                    bgcolor: green,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    border: `2px solid ${greenDark}`,
                  }}
                >
                  {testimonial.name[0]}
                </Avatar>
                <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                  "{testimonial.feedback}"
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                  – {testimonial.name}
                </Typography>
              </Card>
            </Grid>
          </FadeUpOnScroll>
        ))}
      </Grid>

      {/* Call To Action */}
      <FadeUpOnScroll>
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to Get Started?
          </Typography>
          <Typography variant={isSm ? "body1" : "h6"} color="text.secondary" paragraph sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
            Join thousands of users who are already creating smarter questionnaires.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 3,
              boxShadow: 4,
              background: `linear-gradient(90deg, ${greenDark}, ${green})`,
              transition: "transform 0.3s, opacity 0.3s",
              "&:hover": { opacity: 0.9, transform: "scale(1.03)" },
            }}
          >
            Sign Up Now
          </Button>
        </Box>
      </FadeUpOnScroll>
    </Container>
  );
};

export default PublicHome;
