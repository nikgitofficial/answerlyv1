// src/pages/Careers.jsx
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const jobOpenings = [
  { title: "Frontend Developer", location: "Remote / Global", description: "Build stunning user interfaces with React and MUI for our next-gen platform." },
  { title: "Backend Engineer", location: "Remote / Global", description: "Develop scalable APIs, manage databases, and ensure seamless integration." },
  { title: "UI/UX Designer", location: "Remote / Global", description: "Design intuitive interfaces, modern layouts, and delightful user experiences." },
  { title: "Product Manager", location: "Remote / Global", description: "Lead product strategy, define roadmaps, and coordinate cross-functional teams." },
];

const steps = [
  { step: "1", text: "Browse current job openings." },
  { step: "2", text: "Select a role that fits your skills." },
  { step: "3", text: "Submit your application online." },
  { step: "4", text: "Join our team and innovate!" },
];

const testimonials = [
  { name: "Alice Johnson", feedback: "Working here has been a fantastic growth experience. The team is supportive and innovative." },
  { name: "Mark Smith", feedback: "Amazing culture and opportunities. I love collaborating with talented colleagues." },
  { name: "Sophia Lee", feedback: "Flexible, remote-friendly, and great projects. Highly recommended!" },
];

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

const Careers = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const green = "#4CAF50";
  const greenDark = "#087f23";

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 8, mb: 8 }}>

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
            Join Our Team
          </Typography>
          <Typography variant={isSm ? "body1" : "h6"} paragraph sx={{ maxWidth: 640, mx: "auto", mb: 4 }}>
            We're always looking for talented individuals to help shape the future of our platform. Explore current opportunities and apply to become part of our innovative team.
          </Typography>
          <Button
            component={Link}
            to="/submit-resume"
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
            Submit Resume
          </Button>
        </Box>
      </FadeUpOnScroll>

      {/* Job Openings Section */}
      <Box sx={{ py: 8 }}>
        <FadeUpOnScroll>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ textAlign: "center", mb: 6 }}>
            Current Openings
            <Box sx={{ width: 60, height: 4, bgcolor: green, borderRadius: 2, mt: 1, mx: "auto" }} />
          </Typography>
        </FadeUpOnScroll>

        <Grid container spacing={6} justifyContent="center">
          {jobOpenings.map((job, i) => (
            <FadeUpOnScroll key={i} delay={i * 150}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: `2px solid ${green}`,
                    backdropFilter: "blur(8px)",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                    "&:hover": { transform: "translateY(-6px) scale(1.03)", boxShadow: 8, borderColor: greenDark },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{job.title}</Typography>
                    <Typography variant="subtitle2" color={green} gutterBottom>{job.location}</Typography>
                    <Typography variant="body2" color="text.secondary">{job.description}</Typography>
                  </CardContent>
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="medium"
                      sx={{ px: 4, py: 1.2, borderRadius: 3 }}
                    >
                      Apply Now
                    </Button>
                  </Box>
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
            Application Process
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
            Ready to Join Us?
          </Typography>
          <Typography variant={isSm ? "body1" : "h6"} color="text.secondary" paragraph sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
            Submit your resume today and become part of our innovative and growing team.
          </Typography>
          <Button
            component={Link}
            to="/submit-resume"
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
            Submit Resume
          </Button>
        </Box>
      </FadeUpOnScroll>
    </Container>
  );
};

export default Careers;
