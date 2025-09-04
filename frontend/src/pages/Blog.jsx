// src/pages/Blog.jsx
import React, { useRef, useEffect, useState } from "react";
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, useTheme, useMediaQuery } from "@mui/material";

const blogPosts = [
  {
    title: "Boost Your Productivity with Smart Questionnaires",
    date: "August 15, 2025",
    summary: "Learn how our questionnaire platform can help you streamline data collection and decision-making.",
    image: "https://source.unsplash.com/random/600x400?productivity",
  },
  {
    title: "5 Tips to Create Engaging Surveys",
    date: "August 10, 2025",
    summary: "Discover the secrets to crafting surveys that your audience actually wants to complete.",
    image: "https://source.unsplash.com/random/600x400?survey",
  },
  {
    title: "Real-time Insights for Better Decisions",
    date: "August 5, 2025",
    summary: "Instant analytics and visualization tools to help you make data-driven decisions faster.",
    image: "https://source.unsplash.com/random/600x400?analytics",
  },
  {
    title: "Customizing Your Questionnaires Like a Pro",
    date: "August 1, 2025",
    summary: "Learn how to use themes, branding, and design tools to make your questionnaires stand out.",
    image: "https://source.unsplash.com/random/600x400?design",
  },
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

const Blog = () => {
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
            Our Blog
          </Typography>
          <Typography variant={isSm ? "body1" : "h6"} paragraph sx={{ maxWidth: 640, mx: "auto", mb: 4 }}>
            Stay up-to-date with the latest tips, insights, and updates on creating smarter questionnaires and enhancing productivity.
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
            Subscribe Now
          </Button>
        </Box>
      </FadeUpOnScroll>

      {/* Blog Posts */}
      <Box sx={{ py: 8 }}>
        <Grid container spacing={6} justifyContent="center">
          {blogPosts.map((post, index) => (
            <FadeUpOnScroll key={index} delay={index * 150}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    minHeight: 360,
                    boxShadow: 3,
                    backdropFilter: "blur(6px)",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    border: `2px solid rgba(76, 175, 80, 0.2)`,
                    transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.03)",
                      boxShadow: 8,
                      borderColor: green,
                    },
                  }}
                >
                  <CardMedia component="img" height="160" image={post.image} alt={post.title} />
                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle2" color={green} gutterBottom>
                      {post.date}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {post.summary}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 3,
                          background: `linear-gradient(90deg, ${greenDark}, ${green})`,
                          "&:hover": { opacity: 0.9 },
                        }}
                      >
                        Read More
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </FadeUpOnScroll>
          ))}
        </Grid>
      </Box>

      {/* Call To Action */}
      <FadeUpOnScroll>
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Stay Informed
          </Typography>
          <Typography variant={isSm ? "body1" : "h6"} color="text.secondary" paragraph sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
            Subscribe to our newsletter and never miss an update on new tips, insights, and features.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 3,
              boxShadow: 4,
              background: `linear-gradient(90deg, ${greenDark}, ${green})`,
              "&:hover": { opacity: 0.9, transform: "scale(1.03)" },
            }}
          >
            Subscribe Now
          </Button>
        </Box>
      </FadeUpOnScroll>

    </Container>
  );
};

export default Blog;
