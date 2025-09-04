// src/pages/Privacy.jsx
import React, { useRef, useEffect, useState } from "react";
import { Container, Typography, Box, useTheme, useMediaQuery } from "@mui/material";

const sections = [
  {
    title: "Information We Collect",
    content: `We collect personal information such as your name, email address, and account activity 
              when you register or use our services. We also collect non-personal information 
              like browser type, device information, and usage data to improve your experience.`
  },
  {
    title: "How We Use Your Information",
    content: `Your information is used to provide, maintain, and improve our services, 
              personalize content, and communicate with you about updates or offers. 
              We do not sell or rent your personal data to third parties.`
  },
  {
    title: "Data Protection",
    content: `We implement strict security measures to protect your data. 
              All sensitive information is encrypted, and access is limited to authorized personnel only.`
  },
  {
    title: "Cookies & Tracking",
    content: `We use cookies and similar technologies to enhance your experience, 
              analyze usage patterns, and deliver personalized content and ads. 
              You can manage cookie preferences in your browser settings.`
  },
  {
    title: "Your Rights",
    content: `You have the right to access, update, or delete your personal information. 
              You can also opt out of promotional communications at any time. 
              For requests, please contact our support team.`
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. 
              Changes will be posted on this page with the effective date. 
              We encourage you to review this policy periodically.`
  },
];

// FadeUpOnScroll wrapper
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

const Privacy = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 8, mb: 8 }}>
      
      {/* Hero Section */}
      <FadeUpOnScroll>
        <Box sx={{ mb: 10, textAlign: "center" }}>
          <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant={isSm ? "body1" : "h6"} color="text.secondary" sx={{ maxWidth: 640, mx: "auto" }}>
            Your privacy is important to us. This page explains how we collect, use, and protect your information when you use our services.
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* Sections */}
      {sections.map((section, i) => (
        <FadeUpOnScroll key={i} delay={i * 100}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              {section.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {section.content}
            </Typography>
          </Box>
        </FadeUpOnScroll>
      ))}

      {/* Contact */}
      <FadeUpOnScroll delay={600}>
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If you have questions about this Privacy Policy or your personal data, please contact our support team.
          </Typography>
        </Box>
      </FadeUpOnScroll>
    </Container>
  );
};

export default Privacy;
