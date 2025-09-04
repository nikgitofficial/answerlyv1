// src/pages/Community.jsx
import React, { useRef, useEffect, useState } from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Button, useTheme, useMediaQuery } from "@mui/material";

const communityPosts = [
  { user: "Alice Johnson", avatar: "A", title: "Tips for creating engaging questionnaires", content: "Sharing some tips on making your surveys more interactive and getting better responses..." },
  { user: "Mark Smith", avatar: "M", title: "Analyzing responses efficiently", content: "I found a new way to visualize survey results faster using our analytics tools. Here’s how..." },
  { user: "Sophia Lee", avatar: "S", title: "Best practices for sharing surveys", content: "Let’s discuss the best platforms and techniques to distribute questionnaires for maximum participation." },
  { user: "John Doe", avatar: "J", title: "Customizing survey themes", content: "I’ve experimented with themes and branding in surveys. Here are some tips for a professional look." },
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

const Community = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const green = "#4CAF50";
  const greenDark = "#087f23";

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 8, mb: 10 }}>

      {/* Hero Section */}
      <FadeUpOnScroll>
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
            Community
          </Typography>
          <Typography variant={isSm ? "body1" : "h6"} color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
            Connect, share, and learn with fellow users. Explore discussions, post tips, and get insights from the community.
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* Community Cards */}
      <Grid container spacing={6} justifyContent="center">
        {communityPosts.map((post, i) => (
          <FadeUpOnScroll key={i} delay={i * 150}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: `2px solid ${green}`,
                  backdropFilter: "blur(6px)",
                  backgroundColor: "rgba(255,255,255,0.85)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                  "&:hover": { transform: "translateY(-5px) scale(1.03)", boxShadow: 8, borderColor: greenDark },
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: green,
                      width: 56,
                      height: 56,
                      mb: 2,
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      border: `2px solid ${greenDark}`,
                    }}
                  >
                    {post.avatar}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.user}
                  </Typography>
                </Box>
                <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {post.title}
                  </Typography>
                  <Typography color="text.secondary">{post.content}</Typography>
                </CardContent>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, borderRadius: 3, borderColor: green, color: green, "&:hover": { borderColor: greenDark, backgroundColor: "rgba(76,175,80,0.1)" } }}
                >
                  View Discussion
                </Button>
              </Card>
            </Grid>
          </FadeUpOnScroll>
        ))}
      </Grid>

      {/* CTA Section */}
      <FadeUpOnScroll delay={400}>
        <Box sx={{ textAlign: "center", mt: 12 }}>
          <Typography variant={isSm ? "h5" : "h4"} fontWeight="bold" gutterBottom>
            Join Our Community
          </Typography>
          <Typography variant={isSm ? "body1" : "h6"} color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
            Become part of our growing community, share your knowledge, and learn from others.
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
            Join Now
          </Button>
        </Box>
      </FadeUpOnScroll>

    </Container>
  );
};

export default Community;
