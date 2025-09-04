// src/pages/About.jsx
import React, { useRef, useEffect, useState } from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, useTheme, useMediaQuery } from "@mui/material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SecurityIcon from "@mui/icons-material/Security";

const teamMembers = [
  { name: "Assa Kahh", role: "Founder & CEO" },
  { name: "Nikko MP", role: "Lead Developer" },
  { name: "Nah Lee Phong Koh", role: "UI/UX Designer" },
];

const missionItems = [
  {
    icon: <EmojiObjectsIcon />,
    title: "Innovation",
    description: "We provide creative and effective tools to make surveys and questionnaires engaging and simple.",
  },
  {
    icon: <SecurityIcon />,
    title: "Security",
    description: "We prioritize data protection and privacy to ensure all responses are safe and confidential.",
  },
];

// Fade-up on scroll with optional delay
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
        transition: `opacity 0.8s ease-out, transform 0.8s ease-out`,
      }}
    >
      {children}
    </div>
  );
};

const About = () => {
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
            About My Questionnaire App
          </Typography>
          <Typography variant={isSm ? "body1" : "h6"} paragraph sx={{ maxWidth: 640, mx: "auto" }}>
            Our mission is to make surveys, quizzes, and feedback tools simple, interactive, and accessible for everyone.
            We combine modern technology with user-friendly design to help you gather insights effortlessly.
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* Mission Section */}
      <Box sx={{ py: 10, backgroundColor: "rgba(245,245,245,0.8)" }}>
        <FadeUpOnScroll>
          <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", mb: 6 }}>
            Our Mission
            <Box sx={{ width: 60, height: 4, bgcolor: green, borderRadius: 2, mt: 1, mx: "auto" }} />
          </Typography>
        </FadeUpOnScroll>
        <Grid container spacing={6} justifyContent="center">
          {missionItems.map((item, i) => (
            <FadeUpOnScroll key={i} delay={i * 150}>
              <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: `2px solid ${green}`,
                    backdropFilter: "blur(8px)",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                    "&:hover": { transform: "translateY(-6px) scale(1.03)", boxShadow: 8, borderColor: greenDark },
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 40, color: green, mb: 2 } })}
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">{item.title}</Typography>
                    <Typography color="text.secondary">{item.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </FadeUpOnScroll>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: 10 }}>
        <FadeUpOnScroll>
          <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", mb: 6 }}>
            Meet Our Team
            <Box sx={{ width: 60, height: 4, bgcolor: green, borderRadius: 2, mt: 1, mx: "auto" }} />
          </Typography>
        </FadeUpOnScroll>
        <Grid container spacing={6} justifyContent="center">
          {teamMembers.map((member, i) => (
            <FadeUpOnScroll key={i} delay={i * 150}>
              <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    border: `2px solid ${green}`,
                    backdropFilter: "blur(6px)",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                    "&:hover": { transform: "translateY(-5px) scale(1.02)", boxShadow: 8, borderColor: greenDark },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 3,
                      bgcolor: green,
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      border: `2px solid ${greenDark}`,
                    }}
                  >
                    {member.name[0]}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{member.role}</Typography>
                </Card>
              </Grid>
            </FadeUpOnScroll>
          ))}
        </Grid>
      </Box>

    </Container>
  );
};

export default About;
