// src/pages/Terms.jsx
import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Card, CardContent, useTheme, useMediaQuery, Button } from "@mui/material";

const sections = [
  { title: "Acceptance of Terms", content: `By using this app, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.` },
  { title: "User Accounts", content: `You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.` },
  { title: "Use of Services", content: `You agree to use the app only for lawful purposes. You must not use the service to harm, harass, or impersonate others, or for any activity that is illegal or prohibited.` },
  { title: "Intellectual Property", content: `All content, designs, and materials provided in the app are the intellectual property of the company. You may not reproduce, distribute, or create derivative works without permission.` },
  { title: "Limitations of Liability", content: `The app is provided "as is." We are not liable for any damages arising from your use of the service. We do not guarantee uninterrupted or error-free operation.` },
  { title: "Termination", content: `We reserve the right to suspend or terminate your account at our discretion, including for violations of these Terms or illegal activity.` },
  { title: "Changes to Terms", content: `We may update these Terms of Service from time to time. Changes will be posted on this page with the effective date. Continued use of the app constitutes acceptance of the updated terms.` },
];

// Fade-up animation component
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

const Terms = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const green = "#4CAF50";
  const greenDark = "#087f23";

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 10, mb: 10 }}>
      
      {/* Hero Section */}
      <FadeUpOnScroll>
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
            Terms of Service
          </Typography>
          <Box sx={{ width: 60, height: 4, bgcolor: green, borderRadius: 2, mx: "auto", mb: 2 }} />
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 640, mx: "auto" }}
          >
            Please read these terms carefully before using our app. By accessing our services, you agree to these terms.
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* Sections as Cards */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sections.map((section, i) => (
          <FadeUpOnScroll key={i} delay={i * 100}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(255,255,255,0.95)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "translateY(-4px) scale(1.01)", boxShadow: 8 },
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
                  {section.title}
                  <Box sx={{ width: 40, height: 3, bgcolor: green, borderRadius: 2, mt: 0.5 }} />
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {section.content}
                </Typography>
              </CardContent>
            </Card>
          </FadeUpOnScroll>
        ))}
      </Box>

      {/* Contact Section */}
      <FadeUpOnScroll delay={200}>
        <Box sx={{ mt: 12, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            If you have any questions about these Terms of Service, please contact our support team.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 3,
              color: "#fff",
              background: `linear-gradient(90deg, ${greenDark}, ${green})`,
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              fontWeight: "bold",
              transition: "transform 0.3s, opacity 0.3s",
              "&:hover": { transform: "scale(1.03)", opacity: 0.95, background: `linear-gradient(90deg, ${green}, ${greenDark})` },
            }}
          >
            Contact Support
          </Button>
        </Box>
      </FadeUpOnScroll>
    </Container>
  );
};

export default Terms;
