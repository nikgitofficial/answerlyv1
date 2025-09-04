// src/pages/Accessibility.jsx
import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const accessibilityFeatures = [
  { title: "Keyboard Navigation", desc: "Navigate all sections of the app efficiently using only your keyboard." },
  { title: "Screen Reader Support", desc: "Fully compatible with screen readers for visually impaired users." },
  { title: "High Contrast Mode", desc: "Easily switch to high contrast mode to improve readability." },
  { title: "Resizable Text", desc: "Adjust text size dynamically without breaking layout or design." },
  { title: "Accessible Forms", desc: "All forms include labels, error messages, and hints for better usability." },
  { title: "Color Blind Friendly", desc: "UI colors and components designed for all types of color vision." },
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

const Accessibility = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const green = "#4CAF50";
  const greenDark = "#087f23";

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
      
      {/* Hero Section */}
      <FadeUpOnScroll>
        <Box sx={{ textAlign: "center", mb: 12 }}>
          <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
            Accessibility
          </Typography>
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Our platform is built with accessibility in mind, ensuring that everyone can use our features comfortably and effectively.
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* Features Section */}
      <Grid container spacing={8} justifyContent="center">
        {accessibilityFeatures.map((feature, index) => (
          <FadeUpOnScroll key={index} delay={index * 150}>
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: `2px solid ${green}`,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 8, borderColor: greenDark },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color={greenDark}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </FadeUpOnScroll>
        ))}
      </Grid>

      {/* Call to Action */}
      <FadeUpOnScroll>
        <Box sx={{ textAlign: "center", mt: 12 }}>
          <Typography variant={isSm ? "h5" : "h4"} fontWeight="bold" gutterBottom>
            Commitment to Accessibility
          </Typography>
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
          >
            We continuously improve our platform to meet accessibility standards and provide a seamless experience for all users.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${greenDark}, ${green})`,
              "&:hover": { opacity: 0.9, transform: "scale(1.03)" },
              transition: "transform 0.3s, opacity 0.3s",
            }}
          >
            Learn More
          </Button>
        </Box>
      </FadeUpOnScroll>

    </Container>
  );
};

export default Accessibility;
