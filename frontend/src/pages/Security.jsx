// src/pages/Security.jsx
import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, useTheme, useMediaQuery } from "@mui/material";

const securityFeatures = [
  {
    title: "Data Encryption",
    content:
      "All your data is encrypted using industry-standard AES-256 encryption, keeping your information safe and secure.",
  },
  {
    title: "Secure Authentication",
    content:
      "We use secure authentication protocols including two-factor authentication to protect your account.",
  },
  {
    title: "Regular Backups",
    content:
      "Your data is automatically backed up regularly, ensuring you never lose important information.",
  },
  {
    title: "Privacy Compliance",
    content:
      "We adhere to strict privacy laws and regulations to ensure your personal data is protected.",
  },
  {
    title: "Monitoring & Alerts",
    content:
      "Continuous system monitoring and real-time alerts help prevent and mitigate any security threats.",
  },
  {
    title: "User Control",
    content:
      "You have full control over your data, including export, deletion, and privacy settings.",
  },
];

// Fade-up-on-scroll wrapper
const FadeUpOnScroll = ({ children, delay = 0 }) => {
  const ref = React.useRef();
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

const Security = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 10, mb: 10 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: "center" }}>
        <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
          Security & Privacy
        </Typography>
        <Typography
          variant={isSm ? "body1" : "h6"}
          color="text.secondary"
          sx={{ maxWidth: 640, mx: "auto" }}
        >
          Your security is our top priority. We employ cutting-edge technologies and best practices to ensure your data remains private and protected.
        </Typography>
      </Box>

      {/* Security Features */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {securityFeatures.map((feature, i) => (
          <FadeUpOnScroll key={i} delay={i * 100}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(255,255,255,0.95)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {feature.content}
                </Typography>
              </CardContent>
            </Card>
          </FadeUpOnScroll>
        ))}
      </Box>

      {/* Contact Section */}
      <Box sx={{ mt: 12, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Need More Info?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Contact our support team if you have any questions about security measures or privacy practices.
        </Typography>
      </Box>
    </Container>
  );
};

export default Security;
